import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import { assertPublicProjectionPrivacy } from "./public_projection_privacy.mjs";
import {
	addCalendarDays,
	collectReceiptIds,
	DAY_MS,
	isRecord,
	stableJson,
} from "./snapshot_history_mechanics.mjs";

const REQUIRED_ARGUMENTS = ["manifest", "output"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;
const SNAPSHOT_ID = /^[a-z0-9][a-z0-9-]{2,127}$/u;
const WITHDRAWAL_REASONS = new Set(["incorrect", "provenance-invalid"]);

function fail(message) {
	throw new Error(`[snapshot-history] ${message}`);
}

function requireExactKeys(value, keys, label) {
	if (!isRecord(value)) fail(`${label} must be an object`);
	const actual = Object.keys(value).sort();
	const expected = [...keys].sort();
	if (JSON.stringify(actual) !== JSON.stringify(expected)) {
		fail(`${label} fields must exactly match ${expected.join(", ")}`);
	}
}

function requireCalendarDate(value, label) {
	if (typeof value !== "string" || !ISO_DATE.test(value)) fail(`${label} must be YYYY-MM-DD`);
	const timestamp = Date.parse(`${value}T00:00:00Z`);
	if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
		fail(`${label} must be a real calendar date`);
	}
	return timestamp;
}

function requireText(value, label) {
	if (typeof value !== "string" || value.length === 0) fail(`${label} must be non-empty text`);
	return value;
}

function parseArguments(argv) {
	const parsed = {};
	for (let index = 0; index < argv.length; index += 2) {
		const flag = argv[index];
		const value = argv[index + 1];
		if (!flag?.startsWith("--") || !value) fail("Expected --name value arguments");
		parsed[flag.slice(2)] = path.resolve(value);
	}
	for (const argument of REQUIRED_ARGUMENTS) {
		if (!parsed[argument]) fail(`Missing required argument --${argument}`);
	}
	return parsed;
}

function readJson(filePath, label) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8"));
	} catch (error) {
		fail(`Cannot read ${label}: ${error.message}`);
	}
}

function resolvePackageDirectory(manifestDirectory, packageDirectory) {
	if (typeof packageDirectory !== "string" || packageDirectory.length === 0) {
		fail("snapshot.package_dir must be a non-empty path");
	}
	return path.resolve(manifestDirectory, packageDirectory);
}

function projectApprovedPackage(packageDirectory, workspace) {
	const outputPath = path.join(workspace, `${path.basename(packageDirectory)}.json`);
	const projectorPath = path.join(import.meta.dirname, "project_snapshot.mjs");
	const result = spawnSync(
		process.execPath,
		[
			projectorPath,
			"--definitions",
			path.join(packageDirectory, "canon", "definitions.json"),
			"--snapshot",
			path.join(packageDirectory, "canon", "snapshot.json"),
			"--approval",
			path.join(packageDirectory, "canon", "approval.json"),
			"--receipt-manifest",
			path.join(packageDirectory, "evidence", "manifest.json"),
			"--receipts-dir",
			path.join(packageDirectory, "evidence", "receipts"),
			"--output",
			outputPath,
		],
		{ encoding: "utf8" },
	);
	if (result.status !== 0) {
		fail(`approved snapshot package failed validation: ${result.stderr || result.stdout}`);
	}
	return {
		approval: readJson(path.join(packageDirectory, "canon", "approval.json"), "approval"),
		projection: readJson(outputPath, "projected snapshot"),
	};
}

function validateWithdrawal(withdrawal, projection, evaluatedOn) {
	requireExactKeys(
		withdrawal,
		["reason", "withdrawn_on", "replacement_snapshot_id", "correction_href"],
		`withdrawal for ${projection.snapshot_id}`,
	);
	if (!WITHDRAWAL_REASONS.has(withdrawal.reason)) {
		fail(`withdrawal for ${projection.snapshot_id} reason must be incorrect or provenance-invalid`);
	}
	const withdrawnOn = requireCalendarDate(
		withdrawal.withdrawn_on,
		`withdrawal for ${projection.snapshot_id}.withdrawn_on`,
	);
	const asOf = requireCalendarDate(projection.as_of, `snapshot ${projection.snapshot_id}.as_of`);
	const evaluation = requireCalendarDate(evaluatedOn, "manifest.evaluated_on");
	if (withdrawnOn < asOf || withdrawnOn > evaluation) {
		fail(
			`withdrawal for ${projection.snapshot_id} must occur on or after as_of and by evaluated_on`,
		);
	}
	if (!SNAPSHOT_ID.test(withdrawal.replacement_snapshot_id)) {
		fail(`withdrawal for ${projection.snapshot_id}.replacement_snapshot_id is invalid`);
	}
	const expectedHref = `/colophon/the-pulse/#pulse-snapshot-${withdrawal.replacement_snapshot_id}`;
	if (requireText(withdrawal.correction_href, "withdrawal.correction_href") !== expectedHref) {
		fail(`withdrawal for ${projection.snapshot_id} correction_href must be ${expectedHref}`);
	}
	return {
		state: "withdrawn",
		is_current: false,
		validity: "invalid",
		effective_on: withdrawal.withdrawn_on,
		correction: {
			reason: withdrawal.reason,
			replacement_snapshot_id: withdrawal.replacement_snapshot_id,
			href: withdrawal.correction_href,
		},
	};
}

function buildLifecycleRecord(
	{ approval, projection },
	withdrawal,
	evaluatedOn,
	currentSnapshotId,
) {
	if (!SNAPSHOT_ID.test(projection.snapshot_id)) {
		fail(`snapshot_id is invalid: ${projection.snapshot_id}`);
	}
	const ageDays =
		(requireCalendarDate(evaluatedOn, "manifest.evaluated_on") -
			requireCalendarDate(projection.as_of, "snapshot.as_of")) /
		DAY_MS;
	if (!Number.isInteger(ageDays) || ageDays < 0) {
		fail(`snapshot ${projection.snapshot_id} cannot be evaluated before its as_of date`);
	}
	const state = ageDays > 90 ? "archived" : "active";
	const isCurrent = state === "active" && projection.snapshot_id === currentSnapshotId;
	const lifecycle =
		withdrawal === null
			? {
					state,
					is_current: isCurrent,
					validity: "valid",
					effective_on:
						state === "archived" ? addCalendarDays(projection.as_of, 91) : approval.approved_on,
					correction: null,
				}
			: validateWithdrawal(withdrawal, projection, evaluatedOn);
	const { lifecycle_state: _approvalTimeState, ...historicalSnapshot } = projection;
	return {
		snapshot: historicalSnapshot,
		lifecycle,
		approval: {
			approved_by: approval.approved_by,
			approved_on: approval.approved_on,
			public_projection_sha256: approval.binding.public_projection_sha256,
		},
	};
}

function validateCorrections(records) {
	const recordsById = new Map(records.map((record) => [record.snapshot.snapshot_id, record]));
	if (recordsById.size !== records.length) fail("snapshot_id values must be unique in one history");

	for (const record of records) {
		if (record.lifecycle.state !== "withdrawn") continue;
		const replacementId = record.lifecycle.correction.replacement_snapshot_id;
		const replacement = recordsById.get(replacementId);
		if (!replacement) {
			fail(`withdrawn snapshot ${record.snapshot.snapshot_id} replacement is missing`);
		}
		if (replacement.approval.approved_on < record.lifecycle.effective_on) {
			fail(`replacement ${replacementId} must have a new approval on or after withdrawal`);
		}
		if (
			replacement.approval.public_projection_sha256 === record.approval.public_projection_sha256
		) {
			fail(`replacement ${replacementId} must have a distinct approval-bound projection`);
		}
		const withdrawnReceiptIds = collectReceiptIds(record);
		const replacementReceiptIds = collectReceiptIds(replacement);
		if ([...withdrawnReceiptIds].some((receiptId) => replacementReceiptIds.has(receiptId))) {
			fail(`replacement ${replacementId} must use new private receipts`);
		}

		const visited = new Set([record.snapshot.snapshot_id]);
		let correction = replacement;
		while (correction.lifecycle.state === "withdrawn") {
			if (visited.has(correction.snapshot.snapshot_id)) {
				fail(`withdrawn snapshot ${record.snapshot.snapshot_id} correction chain contains a cycle`);
			}
			visited.add(correction.snapshot.snapshot_id);
			correction = recordsById.get(correction.lifecycle.correction.replacement_snapshot_id);
			if (!correction) {
				fail(`withdrawn snapshot ${record.snapshot.snapshot_id} correction chain is unresolved`);
			}
		}
	}
}

function writeAtomically(outputPath, bytes) {
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	const temporaryPath = path.join(
		path.dirname(outputPath),
		`.${path.basename(outputPath)}.${process.pid}.tmp`,
	);
	try {
		fs.writeFileSync(temporaryPath, bytes, { flag: "wx" });
		fs.renameSync(temporaryPath, outputPath);
	} finally {
		if (fs.existsSync(temporaryPath)) fs.rmSync(temporaryPath, { force: true });
	}
}

function enforceAppendOnlyHistory(outputPath, nextHistory) {
	if (!fs.existsSync(outputPath)) return;
	const previousHistory = readJson(outputPath, "existing public history");
	if (!Array.isArray(previousHistory.snapshots)) {
		fail("existing public history is not a valid append-only snapshot collection");
	}
	const nextById = new Map(
		nextHistory.snapshots.map((record) => [record.snapshot.snapshot_id, record]),
	);
	const allowedTransitions = new Map([
		["active", new Set(["active", "archived", "withdrawn"])],
		["archived", new Set(["archived", "withdrawn"])],
		["withdrawn", new Set(["withdrawn"])],
	]);

	for (const previous of previousHistory.snapshots) {
		const snapshotId = previous?.snapshot?.snapshot_id;
		const next = nextById.get(snapshotId);
		if (!next) fail(`append-only history cannot remove snapshot ${snapshotId}`);
		if (
			stableJson(previous.snapshot) !== stableJson(next.snapshot) ||
			stableJson(previous.approval) !== stableJson(next.approval)
		) {
			fail(
				`append-only history rejects reused snapshot identity ${snapshotId} with altered evidence`,
			);
		}
		if (!allowedTransitions.get(previous.lifecycle.state)?.has(next.lifecycle.state)) {
			fail(
				`append-only history rejects lifecycle reversal ${previous.lifecycle.state} -> ${next.lifecycle.state} for ${snapshotId}`,
			);
		}
		if (
			previous.lifecycle.state === "withdrawn" &&
			stableJson(previous.lifecycle) !== stableJson(next.lifecycle)
		) {
			fail(`append-only history cannot rewrite withdrawal record ${snapshotId}`);
		}
	}
}

function main() {
	const argumentsByName = parseArguments(process.argv.slice(2));
	const manifest = readJson(argumentsByName.manifest, "lifecycle manifest");
	requireExactKeys(
		manifest,
		["schema_version", "evaluated_on", "current_snapshot_id", "snapshots"],
		"manifest",
	);
	if (manifest.schema_version !== 1) fail("manifest.schema_version must be 1");
	requireCalendarDate(manifest.evaluated_on, "manifest.evaluated_on");
	if (manifest.current_snapshot_id !== null && typeof manifest.current_snapshot_id !== "string") {
		fail("manifest.current_snapshot_id must be a string or null");
	}
	if (!Array.isArray(manifest.snapshots) || manifest.snapshots.length === 0) {
		fail("manifest.snapshots must be a non-empty array");
	}

	const manifestDirectory = path.dirname(argumentsByName.manifest);
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-history-"));
	try {
		const snapshots = manifest.snapshots.map((entry, index) => {
			requireExactKeys(entry, ["package_dir", "withdrawal"], `manifest.snapshots[${index}]`);
			const packageDirectory = resolvePackageDirectory(manifestDirectory, entry.package_dir);
			return buildLifecycleRecord(
				projectApprovedPackage(packageDirectory, workspace),
				entry.withdrawal,
				manifest.evaluated_on,
				manifest.current_snapshot_id,
			);
		});
		validateCorrections(snapshots);
		const current = snapshots.filter((entry) => entry.lifecycle.is_current);
		const active = snapshots.filter((entry) => entry.lifecycle.state === "active");
		if (manifest.current_snapshot_id === null && (current.length !== 0 || active.length !== 0)) {
			fail("a null current_snapshot_id requires every valid snapshot to be archived");
		}
		if (manifest.current_snapshot_id !== null && (current.length !== 1 || active.length !== 1)) {
			fail("current_snapshot_id must select exactly one non-archived snapshot");
		}

		const output = {
			schema_version: 1,
			evaluated_on: manifest.evaluated_on,
			current_snapshot_id: manifest.current_snapshot_id,
			snapshots,
		};
		assertPublicProjectionPrivacy(output, fail);
		enforceAppendOnlyHistory(argumentsByName.output, output);
		writeAtomically(argumentsByName.output, Buffer.from(stableJson(output), "utf8"));
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
}

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
