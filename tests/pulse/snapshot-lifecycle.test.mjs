import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const projectorPath = path.join(repositoryRoot, "scripts", "pulse", "project_snapshot_history.mjs");
const publicHistoryValidatorPath = path.join(
	repositoryRoot,
	"scripts",
	"pulse",
	"validate_public_history.mjs",
);
const approvedPackage = path.join(repositoryRoot, "tests", "fixtures", "pulse", "happy-path");

function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stableValue(value) {
	if (Array.isArray(value)) return value.map(stableValue);
	if (!isRecord(value)) return value;
	return Object.fromEntries(
		Object.keys(value)
			.sort()
			.map((key) => [key, stableValue(value[key])]),
	);
}

function stableJson(value) {
	return `${JSON.stringify(stableValue(value), null, "\t")}\n`;
}

function sha256(value) {
	return createHash("sha256").update(value).digest("hex");
}

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
	fs.writeFileSync(filePath, stableJson(value));
}

function buildApprovedProjection(definitions, snapshot, narrative, manifest) {
	const receipts = new Map(
		manifest.receipts.map((receipt) => [receipt.id, { id: receipt.id, sha256: receipt.sha256 }]),
	);
	return {
		schema_version: 1,
		snapshot_id: snapshot.snapshot_id,
		as_of: snapshot.as_of,
		measurement_window: snapshot.measurement_window,
		lifecycle_state: snapshot.lifecycle_state,
		verification_state: snapshot.refresh_state,
		public_wording: narrative,
		groups: definitions.groups.map((group) => ({
			id: group.id,
			label: group.label,
			metrics: group.metrics.map((definition) => {
				const measuredValue = snapshot.values[definition.id];
				return {
					...definition,
					value: measuredValue.value,
					as_of: snapshot.as_of,
					measurement_window: snapshot.measurement_window,
					refresh_state: snapshot.refresh_state,
					receipt: receipts.get(measuredValue.receipt_ref),
				};
			}),
		})),
	};
}

function makeDistinctApprovedPackage(source, destination, options) {
	fs.cpSync(source, destination, { recursive: true });
	const snapshotPath = path.join(destination, "canon", "snapshot.json");
	const approvalPath = path.join(destination, "canon", "approval.json");
	const definitions = readJson(path.join(destination, "canon", "definitions.json"));
	const snapshot = readJson(snapshotPath);
	const narrative = readJson(path.join(destination, "canon", "narrative.json"));
	const approval = readJson(approvalPath);
	const manifestPath = path.join(destination, "evidence", "manifest.json");
	const manifest = readJson(manifestPath);
	const receiptsDirectory = path.join(destination, "evidence", "receipts");
	const receiptIdMap = new Map(
		manifest.receipts.map((receipt, index) => [receipt.id, options.receipt_ids[index]]),
	);

	for (const receipt of manifest.receipts) {
		const previousPath = path.join(receiptsDirectory, receipt.file);
		const privateReceipt = readJson(previousPath);
		const nextId = receiptIdMap.get(receipt.id);
		privateReceipt.receipt_id = nextId;
		const nextPath = path.join(receiptsDirectory, `${nextId}.json`);
		writeJson(nextPath, privateReceipt);
		fs.rmSync(previousPath);
		receipt.id = nextId;
		receipt.file = `${nextId}.json`;
		receipt.sha256 = sha256(fs.readFileSync(nextPath));
	}

	snapshot.snapshot_id = options.snapshot_id;
	for (const measuredValue of Object.values(snapshot.values)) {
		measuredValue.receipt_ref = receiptIdMap.get(measuredValue.receipt_ref);
	}
	approval.approved_on = options.approved_on;
	approval.binding.definitions_sha256 = sha256(stableJson(definitions));
	approval.binding.values_sha256 = sha256(stableJson(snapshot.values));
	approval.binding.public_wording_sha256 = sha256(stableJson(narrative));
	approval.binding.as_of = snapshot.as_of;
	approval.binding.public_projection_sha256 = sha256(
		stableJson(buildApprovedProjection(definitions, snapshot, narrative, manifest)),
	);
	writeJson(snapshotPath, snapshot);
	writeJson(manifestPath, manifest);
	writeJson(approvalPath, approval);
	return destination;
}

function projectHistory(workspace, manifest) {
	const manifestPath = path.join(workspace, "history-manifest.json");
	const outputPath = path.join(workspace, "public-history.json");
	fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, "\t")}\n`);
	const result = spawnSync(
		process.execPath,
		[projectorPath, "--manifest", manifestPath, "--output", outputPath],
		{ cwd: repositoryRoot, encoding: "utf8" },
	);
	return { result, outputPath };
}

function runPublicHistoryValidation(historyPath) {
	return spawnSync(process.execPath, [publicHistoryValidatorPath, historyPath], {
		cwd: repositoryRoot,
		encoding: "utf8",
	});
}

test("lifecycle receipt fixtures preserve their full-file hashes through Git checkout", () => {
	const fixtureDirectory = path.join(
		repositoryRoot,
		"tests",
		"fixtures",
		"pulse",
		"lifecycle-history",
	);
	const historyManifest = readJson(path.join(fixtureDirectory, "history-manifest.json"));
	const receiptEntries = historyManifest.snapshots.flatMap((snapshotEntry) => {
		const packageDirectory = path.resolve(fixtureDirectory, snapshotEntry.package_dir);
		const receiptManifest = readJson(path.join(packageDirectory, "evidence", "manifest.json"));
		return receiptManifest.receipts.map((receipt) => ({
			...receipt,
			path: path.join(packageDirectory, "evidence", "receipts", receipt.file),
		}));
	});
	const repositoryRelativePaths = receiptEntries.map((receipt) =>
		path.relative(repositoryRoot, receipt.path).split(path.sep).join("/"),
	);
	const attributes = spawnSync("git", ["check-attr", "eol", "--", ...repositoryRelativePaths], {
		cwd: repositoryRoot,
		encoding: "utf8",
	});
	assert.equal(attributes.status, 0, attributes.stderr);
	const attributeLines = attributes.stdout.trim().split(/\r?\n/u);
	assert.equal(attributeLines.length, receiptEntries.length);
	for (const line of attributeLines) {
		assert.match(line, /: eol: lf$/u, `receipt checkout bytes are not protected: ${line}`);
	}

	for (const receipt of receiptEntries) {
		const receiptBytes = fs.readFileSync(receipt.path);
		assert.equal(receiptBytes.includes(Buffer.from("\r\n")), false, receipt.path);
		assert.equal(sha256(receiptBytes), receipt.sha256, receipt.path);
	}
});

test("committed Pulse public projections preserve byte-bound LF checkout bytes", () => {
	const publicProjectionPaths = [
		path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json"),
		path.join(repositoryRoot, "src", "data", "pulse", "public-history.json"),
	];
	const repositoryRelativePaths = publicProjectionPaths.map((projectionPath) =>
		path.relative(repositoryRoot, projectionPath).split(path.sep).join("/"),
	);
	const attributes = spawnSync("git", ["check-attr", "eol", "--", ...repositoryRelativePaths], {
		cwd: repositoryRoot,
		encoding: "utf8",
	});
	assert.equal(attributes.status, 0, attributes.stderr);
	const attributeLines = attributes.stdout.trim().split(/\r?\n/u);
	assert.equal(attributeLines.length, publicProjectionPaths.length);
	for (const line of attributeLines) {
		assert.match(
			line,
			/: eol: lf$/u,
			`public projection checkout bytes are not protected: ${line}`,
		);
	}

	for (const projectionPath of publicProjectionPaths) {
		const projectionBytes = fs.readFileSync(projectionPath);
		assert.equal(projectionBytes.includes(Buffer.from("\r\n")), false, projectionPath);
	}
});

test("an approved snapshot archives only after 90 calendar days without changing its evidence", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-lifecycle-"));
	try {
		const commonManifest = {
			schema_version: 1,
			current_snapshot_id: "pulse-fixture-2026-08-24",
			snapshots: [{ package_dir: approvedPackage, withdrawal: null }],
		};
		const exactThreshold = projectHistory(workspace, {
			...commonManifest,
			evaluated_on: "2026-11-22",
		});
		assert.equal(
			exactThreshold.result.status,
			0,
			`${exactThreshold.result.stdout}\n${exactThreshold.result.stderr}`,
		);
		const active = JSON.parse(fs.readFileSync(exactThreshold.outputPath, "utf8"));
		assert.equal(active.snapshots[0].lifecycle.state, "active");
		assert.equal(active.snapshots[0].lifecycle.is_current, true);

		const afterThreshold = projectHistory(workspace, {
			...commonManifest,
			current_snapshot_id: null,
			evaluated_on: "2026-11-23",
		});
		assert.equal(
			afterThreshold.result.status,
			0,
			`${afterThreshold.result.stdout}\n${afterThreshold.result.stderr}`,
		);
		const archived = JSON.parse(fs.readFileSync(afterThreshold.outputPath, "utf8"));
		const record = archived.snapshots[0];
		assert.equal(record.lifecycle.state, "archived");
		assert.equal(record.lifecycle.is_current, false);
		assert.equal(record.lifecycle.validity, "valid");
		assert.equal(record.lifecycle.effective_on, "2026-11-23");
		assert.equal(record.snapshot.snapshot_id, "pulse-fixture-2026-08-24");
		assert.equal(record.snapshot.groups[0].metrics[0].value, 5);
		assert.equal(
			record.snapshot.groups[0].metrics[0].receipt.id,
			"rct_f97b4275c4644cb78ce8e40f5e608a1e",
		);
		assert.equal(record.approval.approved_by, "eriknorris");
		assert.equal(record.approval.approved_on, "2026-08-24");
		assert.match(record.approval.public_projection_sha256, /^[a-f0-9]{64}$/u);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("a withdrawn snapshot retains its values and links to a separately receipted approved correction", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-correction-"));
	try {
		const withdrawnId = "pulse-fixture-withdrawn-2026-08-24";
		const replacementId = "pulse-fixture-correction-2026-08-24";
		const withdrawnPackage = makeDistinctApprovedPackage(
			approvedPackage,
			path.join(workspace, "withdrawn"),
			{
				snapshot_id: withdrawnId,
				approved_on: "2026-08-24",
				receipt_ids: [
					"rct_10000000000000000000000000000001",
					"rct_10000000000000000000000000000002",
					"rct_10000000000000000000000000000003",
				],
			},
		);
		const replacementPackage = makeDistinctApprovedPackage(
			approvedPackage,
			path.join(workspace, "replacement"),
			{
				snapshot_id: replacementId,
				approved_on: "2026-08-25",
				receipt_ids: [
					"rct_20000000000000000000000000000001",
					"rct_20000000000000000000000000000002",
					"rct_20000000000000000000000000000003",
				],
			},
		);
		const correctionHref = `/colophon/the-pulse/#pulse-snapshot-${replacementId}`;
		const projection = projectHistory(workspace, {
			schema_version: 1,
			evaluated_on: "2026-08-25",
			current_snapshot_id: replacementId,
			snapshots: [
				{
					package_dir: withdrawnPackage,
					withdrawal: {
						reason: "provenance-invalid",
						withdrawn_on: "2026-08-24",
						replacement_snapshot_id: replacementId,
						correction_href: correctionHref,
					},
				},
				{ package_dir: replacementPackage, withdrawal: null },
			],
		});
		assert.equal(
			projection.result.status,
			0,
			`${projection.result.stdout}\n${projection.result.stderr}`,
		);
		const history = readJson(projection.outputPath);
		const withdrawn = history.snapshots.find(
			(record) => record.snapshot.snapshot_id === withdrawnId,
		);
		const replacement = history.snapshots.find(
			(record) => record.snapshot.snapshot_id === replacementId,
		);

		assert.equal(withdrawn.lifecycle.state, "withdrawn");
		assert.equal(withdrawn.lifecycle.validity, "invalid");
		assert.equal(withdrawn.lifecycle.is_current, false);
		assert.equal(withdrawn.lifecycle.effective_on, "2026-08-24");
		assert.deepEqual(withdrawn.lifecycle.correction, {
			reason: "provenance-invalid",
			replacement_snapshot_id: replacementId,
			href: correctionHref,
		});
		assert.equal(withdrawn.snapshot.groups[0].metrics[0].value, 5);
		assert.equal(replacement.lifecycle.state, "active");
		assert.equal(replacement.lifecycle.is_current, true);
		assert.notEqual(withdrawn.snapshot.snapshot_id, replacement.snapshot.snapshot_id);
		assert.notEqual(
			withdrawn.approval.public_projection_sha256,
			replacement.approval.public_projection_sha256,
		);
		assert.equal(replacement.approval.approved_on, "2026-08-25");

		const withdrawnReceipts = new Set(
			withdrawn.snapshot.groups.flatMap((group) =>
				group.metrics.map((metric) => metric.receipt.id),
			),
		);
		const replacementReceipts = new Set(
			replacement.snapshot.groups.flatMap((group) =>
				group.metrics.map((metric) => metric.receipt.id),
			),
		);
		assert.equal(
			[...withdrawnReceipts].some((receiptId) => replacementReceipts.has(receiptId)),
			false,
		);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("a correction link survives when its replacement is later withdrawn and corrected again", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-correction-chain-"));
	try {
		const ids = {
			first: "pulse-fixture-withdrawn-first",
			second: "pulse-fixture-withdrawn-second",
			current: "pulse-fixture-correction-current",
		};
		const packages = [
			makeDistinctApprovedPackage(approvedPackage, path.join(workspace, "first"), {
				snapshot_id: ids.first,
				approved_on: "2026-08-24",
				receipt_ids: [
					"rct_50000000000000000000000000000001",
					"rct_50000000000000000000000000000002",
					"rct_50000000000000000000000000000003",
				],
			}),
			makeDistinctApprovedPackage(approvedPackage, path.join(workspace, "second"), {
				snapshot_id: ids.second,
				approved_on: "2026-08-25",
				receipt_ids: [
					"rct_60000000000000000000000000000001",
					"rct_60000000000000000000000000000002",
					"rct_60000000000000000000000000000003",
				],
			}),
			makeDistinctApprovedPackage(approvedPackage, path.join(workspace, "current"), {
				snapshot_id: ids.current,
				approved_on: "2026-08-26",
				receipt_ids: [
					"rct_70000000000000000000000000000001",
					"rct_70000000000000000000000000000002",
					"rct_70000000000000000000000000000003",
				],
			}),
		];
		const projection = projectHistory(workspace, {
			schema_version: 1,
			evaluated_on: "2026-08-26",
			current_snapshot_id: ids.current,
			snapshots: [
				{
					package_dir: packages[0],
					withdrawal: {
						reason: "provenance-invalid",
						withdrawn_on: "2026-08-24",
						replacement_snapshot_id: ids.second,
						correction_href: `/colophon/the-pulse/#pulse-snapshot-${ids.second}`,
					},
				},
				{
					package_dir: packages[1],
					withdrawal: {
						reason: "incorrect",
						withdrawn_on: "2026-08-25",
						replacement_snapshot_id: ids.current,
						correction_href: `/colophon/the-pulse/#pulse-snapshot-${ids.current}`,
					},
				},
				{ package_dir: packages[2], withdrawal: null },
			],
		});
		assert.equal(
			projection.result.status,
			0,
			`${projection.result.stdout}\n${projection.result.stderr}`,
		);
		const history = readJson(projection.outputPath);
		assert.deepEqual(
			history.snapshots.map((record) => record.lifecycle.state),
			["withdrawn", "withdrawn", "active"],
		);
		assert.equal(history.snapshots[0].lifecycle.correction.replacement_snapshot_id, ids.second);
		assert.equal(history.snapshots[1].lifecycle.correction.replacement_snapshot_id, ids.current);

		const validation = runPublicHistoryValidation(projection.outputPath);
		assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("a correction link survives when its replacement later archives", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-archived-correction-"));
	try {
		const fixtureDirectory = path.join(
			repositoryRoot,
			"tests",
			"fixtures",
			"pulse",
			"lifecycle-history",
		);
		const manifest = readJson(path.join(fixtureDirectory, "history-manifest.json"));
		manifest.evaluated_on = "2026-11-23";
		manifest.current_snapshot_id = null;
		for (const entry of manifest.snapshots) {
			entry.package_dir = path.resolve(fixtureDirectory, entry.package_dir);
		}

		const projection = projectHistory(workspace, manifest);
		assert.equal(
			projection.result.status,
			0,
			`${projection.result.stdout}\n${projection.result.stderr}`,
		);
		const history = readJson(projection.outputPath);
		const withdrawn = history.snapshots.find((record) => record.lifecycle.state === "withdrawn");
		const replacement = history.snapshots.find(
			(record) =>
				record.snapshot.snapshot_id === withdrawn.lifecycle.correction.replacement_snapshot_id,
		);
		assert.equal(replacement.lifecycle.state, "archived");
		assert.equal(replacement.lifecycle.validity, "valid");
		const validation = runPublicHistoryValidation(projection.outputPath);
		assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("an existing public history cannot be overwritten under a reused snapshot identity", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-append-only-"));
	try {
		const baseline = projectHistory(workspace, {
			schema_version: 1,
			evaluated_on: "2026-08-24",
			current_snapshot_id: "pulse-fixture-2026-08-24",
			snapshots: [{ package_dir: approvedPackage, withdrawal: null }],
		});
		assert.equal(baseline.result.status, 0, `${baseline.result.stdout}\n${baseline.result.stderr}`);
		const previousBytes = fs.readFileSync(baseline.outputPath);

		const replacementPackage = makeDistinctApprovedPackage(
			approvedPackage,
			path.join(workspace, "reused-identity"),
			{
				snapshot_id: "pulse-fixture-2026-08-24",
				approved_on: "2026-08-25",
				receipt_ids: [
					"rct_80000000000000000000000000000001",
					"rct_80000000000000000000000000000002",
					"rct_80000000000000000000000000000003",
				],
			},
		);
		const overwrite = projectHistory(workspace, {
			schema_version: 1,
			evaluated_on: "2026-08-25",
			current_snapshot_id: "pulse-fixture-2026-08-24",
			snapshots: [{ package_dir: replacementPackage, withdrawal: null }],
		});
		assert.notEqual(overwrite.result.status, 0, "projector silently replaced prior evidence");
		assert.match(
			`${overwrite.result.stdout}\n${overwrite.result.stderr}`,
			/\[snapshot-history\].*(?:append-only|immutable|reused snapshot identity)/u,
		);
		assert.deepEqual(fs.readFileSync(baseline.outputPath), previousBytes);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("unchanged lifecycle inputs produce the committed public history byte for byte", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-history-repeat-"));
	try {
		const manifestPath = path.join(
			repositoryRoot,
			"tests",
			"fixtures",
			"pulse",
			"lifecycle-history",
			"history-manifest.json",
		);
		const outputPaths = [path.join(workspace, "first.json"), path.join(workspace, "second.json")];
		for (const outputPath of outputPaths) {
			const result = spawnSync(
				process.execPath,
				[projectorPath, "--manifest", manifestPath, "--output", outputPath],
				{ cwd: repositoryRoot, encoding: "utf8" },
			);
			assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
		}

		const first = fs.readFileSync(outputPaths[0]);
		const second = fs.readFileSync(outputPaths[1]);
		const committed = fs.readFileSync(
			path.join(repositoryRoot, "src", "data", "pulse", "public-history.json"),
		);
		assert.deepEqual(first, second);
		assert.deepEqual(first, committed);
		const publicText = committed.toString("utf8");
		for (const forbidden of [
			"package_dir",
			"exact_command",
			"raw_output",
			"private_source_identity",
			"local_path",
			'"lifecycle_state": "active"',
		]) {
			assert.equal(publicText.includes(forbidden), false, `public history leaked: ${forbidden}`);
		}
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});
