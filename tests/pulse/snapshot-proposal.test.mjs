import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const fixtureRoot = path.join(repositoryRoot, "tests", "fixtures", "pulse", "happy-path");
const projectorPath = path.join(repositoryRoot, "scripts", "pulse", "project_snapshot.mjs");
const publishedPaths = [
	path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json"),
	path.join(repositoryRoot, "src", "data", "pulse", "public-history.json"),
];

function stableJson(value) {
	return `${JSON.stringify(value, null, "\t")}\n`;
}

function stableValue(value) {
	if (Array.isArray(value)) return value.map(stableValue);
	if (value === null || typeof value !== "object") return value;
	return Object.fromEntries(
		Object.keys(value)
			.sort()
			.map((key) => [key, stableValue(value[key])]),
	);
}

function canonicalHash(value) {
	return createHash("sha256")
		.update(`${JSON.stringify(stableValue(value), null, "\t")}\n`)
		.digest("hex");
}

function fileHash(bytes) {
	return createHash("sha256").update(bytes).digest("hex");
}

function proposalApprovalRecord(overrides = {}) {
	const approved = JSON.parse(
		fs.readFileSync(path.join(fixtureRoot, "canon", "approval.json"), "utf8"),
	);
	return {
		...approved,
		status: "proposal",
		approved_by: null,
		approved_on: null,
		privacy_review: {
			...approved.privacy_review,
			status: "proposal",
			reviewed_by: null,
			reviewed_on: null,
		},
		...overrides,
	};
}

function runProposal(approval, requestedOutputPath = null) {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-proposal-"));
	const approvalPath = path.join(workspace, "approval.json");
	const outputPath = requestedOutputPath ?? path.join(workspace, "candidate.json");
	fs.writeFileSync(approvalPath, stableJson(approval));
	const publishedBefore = publishedPaths.map((publishedPath) => fs.readFileSync(publishedPath));

	const result = spawnSync(
		process.execPath,
		[
			projectorPath,
			"--definitions",
			path.join(fixtureRoot, "canon", "definitions.json"),
			"--snapshot",
			path.join(fixtureRoot, "canon", "snapshot.json"),
			"--approval",
			approvalPath,
			"--receipt-manifest",
			path.join(fixtureRoot, "evidence", "manifest.json"),
			"--receipts-dir",
			path.join(fixtureRoot, "evidence", "receipts"),
			"--output",
			outputPath,
		],
		{ cwd: repositoryRoot, encoding: "utf8" },
	);

	return {
		cleanup: () => fs.rmSync(workspace, { force: true, recursive: true }),
		outputPath,
		publishedBefore,
		result,
	};
}

function runUnavailableProposal() {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-unavailable-"));
	const receiptsDirectory = path.join(workspace, "receipts");
	fs.mkdirSync(receiptsDirectory);

	const definitions = JSON.parse(
		fs.readFileSync(path.join(fixtureRoot, "canon", "definitions.json"), "utf8"),
	);
	const snapshot = JSON.parse(
		fs.readFileSync(path.join(fixtureRoot, "canon", "snapshot.json"), "utf8"),
	);
	const approvedProjection = JSON.parse(
		fs.readFileSync(
			path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json"),
			"utf8",
		),
	);
	const manifest = JSON.parse(
		fs.readFileSync(path.join(fixtureRoot, "evidence", "manifest.json"), "utf8"),
	);

	const receiptId = "rct_11111111111111111111111111111111";
	const unavailable = {
		value: null,
		verification_state: "not_measurable",
		reason:
			"A native scoped-session denominator cannot be reproduced for the complete 90-day window.",
		evidence_start: "2026-08-22",
		eligibility_rule:
			"Numeric coverage becomes eligible after both the native scoped-session denominator and its durable decision/finding joins are reproducible for every day in a complete 90-day window.",
		receipt_ref: receiptId,
	};
	const readinessResult = {
		kind: "durable-record-readiness-v1",
		measurement_window: {
			start: snapshot.measurement_window.start,
			end: snapshot.measurement_window.end,
		},
		verification_state: unavailable.verification_state,
		reason: unavailable.reason,
		evidence_start: unavailable.evidence_start,
		eligibility_rule: unavailable.eligibility_rule,
		denominator_checks: [
			{
				source: "typed-session-lifecycle",
				evidence_start: "2026-08-22",
				complete_window: false,
				stable_session_identity: true,
				observations: {
					row_count: 8,
					unique_session_ids: 8,
					first_event_at: "2026-08-22T04:19:41.621Z",
					last_event_at: "2026-08-24T14:57:00.576Z",
				},
			},
			{
				source: "durable-decision-finding-records",
				evidence_start: "2026-07-04",
				complete_window: false,
				stable_session_identity: false,
				observations: {
					complete_identity_sessions: 29,
					complete_with_capture_document: 0,
					complete_with_produced_touch: 0,
					surrogate_sessions: 207,
					surrogate_with_capture_document: 207,
				},
			},
		],
	};
	const readinessReceipt = {
		receipt_id: receiptId,
		primary: {
			exact_command: "primary-readiness-audit --window 2026-05-27..2026-08-24",
			raw_output: readinessResult,
			private_source_identity: "private readiness sources",
			local_path: "C:\\private\\pulse-readiness",
		},
		independent_reproduction: {
			exact_command: "independent-readiness-audit --window 2026-05-27..2026-08-24",
			raw_output: readinessResult,
			reproduced_by: "independent-test-worker",
		},
	};
	const readinessBytes = Buffer.from(stableJson(readinessReceipt));

	for (const receipt of manifest.receipts.slice(0, 2)) {
		fs.copyFileSync(
			path.join(fixtureRoot, "evidence", "receipts", receipt.file),
			path.join(receiptsDirectory, receipt.file),
		);
	}
	fs.writeFileSync(path.join(receiptsDirectory, `${receiptId}.json`), readinessBytes);
	manifest.receipts = [
		...manifest.receipts.slice(0, 2),
		{
			id: receiptId,
			file: `${receiptId}.json`,
			sha256: fileHash(readinessBytes),
			independent_reproduction: {
				status: "matched",
				result_sha256: canonicalHash(readinessResult),
			},
		},
	];
	snapshot.values["durable-record-coverage.session-coverage-percentage"] = unavailable;

	const expectedProjection = structuredClone(approvedProjection);
	const durableGroup = expectedProjection.groups[2];
	Object.assign(durableGroup, {
		verification_state: unavailable.verification_state,
		value: null,
		reason: unavailable.reason,
		evidence_start: unavailable.evidence_start,
		eligibility_rule: unavailable.eligibility_rule,
		receipt: {
			id: receiptId,
			sha256: fileHash(readinessBytes),
		},
	});
	Object.assign(durableGroup.metrics[0], {
		value: null,
		refresh_state: unavailable.verification_state,
		receipt: durableGroup.receipt,
	});

	const approval = proposalApprovalRecord({
		binding: {
			definitions_sha256: canonicalHash(definitions),
			values_sha256: canonicalHash(snapshot.values),
			public_wording_sha256: canonicalHash(snapshot.public_wording),
			as_of: snapshot.as_of,
			public_projection_sha256: fileHash(Buffer.from(stableJson(stableValue(expectedProjection)))),
		},
	});

	const paths = {
		approval: path.join(workspace, "approval.json"),
		definitions: path.join(workspace, "definitions.json"),
		manifest: path.join(workspace, "manifest.json"),
		output: path.join(workspace, "candidate.json"),
		snapshot: path.join(workspace, "snapshot.json"),
	};
	fs.writeFileSync(paths.approval, stableJson(approval));
	fs.writeFileSync(paths.definitions, stableJson(definitions));
	fs.writeFileSync(paths.manifest, stableJson(manifest));
	fs.writeFileSync(paths.snapshot, stableJson(snapshot));

	const result = spawnSync(
		process.execPath,
		[
			projectorPath,
			"--definitions",
			paths.definitions,
			"--snapshot",
			paths.snapshot,
			"--approval",
			paths.approval,
			"--receipt-manifest",
			paths.manifest,
			"--receipts-dir",
			receiptsDirectory,
			"--output",
			paths.output,
		],
		{ cwd: repositoryRoot, encoding: "utf8" },
	);

	return {
		cleanup: () => fs.rmSync(workspace, { force: true, recursive: true }),
		expectedProjection,
		outputPath: paths.output,
		result,
	};
}

test("an unavailable durable group remains explicit without publishing a numeric shortcut", () => {
	const attempt = runUnavailableProposal();
	try {
		assert.equal(attempt.result.status, 0, `${attempt.result.stdout}\n${attempt.result.stderr}`);
		const candidate = JSON.parse(fs.readFileSync(attempt.outputPath, "utf8"));
		assert.deepEqual(candidate, attempt.expectedProjection);
		assert.equal(candidate.groups.length, 3);
		const durableGroup = candidate.groups[2];
		assert.equal(durableGroup.id, "durable-record-coverage");
		assert.equal(durableGroup.verification_state, "not_measurable");
		assert.equal(durableGroup.value, null);
		assert.equal(durableGroup.metrics[0].value, null);
		assert.equal(
			durableGroup.metrics.some((metric) => typeof metric.value === "number"),
			false,
		);
		assert.equal(durableGroup.evidence_start, "2026-08-22");
		assert.match(durableGroup.eligibility_rule, /native scoped-session denominator/u);
		assert.match(durableGroup.eligibility_rule, /durable decision\/finding joins/u);
		assert.match(durableGroup.eligibility_rule, /complete 90-day window/u);
	} finally {
		attempt.cleanup();
	}
});

test("an unapproved proposal validates and writes only deterministic candidate bytes", () => {
	const first = runProposal(proposalApprovalRecord());
	const second = runProposal(proposalApprovalRecord());
	try {
		assert.equal(first.result.status, 0, `${first.result.stdout}\n${first.result.stderr}`);
		assert.equal(second.result.status, 0, `${second.result.stdout}\n${second.result.stderr}`);
		assert.match(first.result.stdout, /effective_state=proposal/u);
		assert.deepEqual(fs.readFileSync(first.outputPath), fs.readFileSync(second.outputPath));
		assert.equal(
			fs
				.readFileSync(first.outputPath)
				.equals(
					fs.readFileSync(
						path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json"),
					),
				),
			true,
			"the reviewed proposal candidate must be the exact projection later eligible for approval",
		);
		for (const [index, publishedPath] of publishedPaths.entries()) {
			assert.deepEqual(
				fs.readFileSync(publishedPath),
				first.publishedBefore[index],
				`proposal execution changed published bytes: ${publishedPath}`,
			);
		}
	} finally {
		first.cleanup();
		second.cleanup();
	}
});

test("a proposal fails closed when approval authority is present", () => {
	for (const invalidAuthority of [
		{ approved_by: "eriknorris" },
		{ approved_on: "2026-08-24" },
		{
			privacy_review: {
				...proposalApprovalRecord().privacy_review,
				reviewed_by: "eriknorris",
			},
		},
	]) {
		const attempt = runProposal(proposalApprovalRecord(invalidAuthority));
		try {
			assert.notEqual(attempt.result.status, 0, "proposal accepted an approval authority field");
			assert.match(
				`${attempt.result.stdout}\n${attempt.result.stderr}`,
				/effective_state=proposal/u,
			);
			assert.equal(fs.existsSync(attempt.outputPath), false);
		} finally {
			attempt.cleanup();
		}
	}
});

test("a proposal fails closed when its candidate binding no longer matches", () => {
	const invalid = proposalApprovalRecord();
	invalid.binding.public_projection_sha256 = "0".repeat(64);
	const attempt = runProposal(invalid);
	try {
		assert.notEqual(attempt.result.status, 0, "proposal accepted a stale candidate hash");
		assert.match(
			`${attempt.result.stdout}\n${attempt.result.stderr}`,
			/effective_state=proposal; approval binding public_projection_sha256/u,
		);
		assert.equal(fs.existsSync(attempt.outputPath), false);
	} finally {
		attempt.cleanup();
	}
});

test("a proposal cannot target the repository's published Pulse data", () => {
	for (const publishedPath of publishedPaths) {
		const publishedBefore = fs.readFileSync(publishedPath);
		const attempt = runProposal(proposalApprovalRecord(), publishedPath);
		try {
			assert.notEqual(attempt.result.status, 0, "proposal accepted a publication destination");
			assert.match(
				`${attempt.result.stdout}\n${attempt.result.stderr}`,
				/effective_state=proposal; output must not target the public Pulse data directory/u,
			);
			assert.deepEqual(fs.readFileSync(publishedPath), publishedBefore);
		} finally {
			attempt.cleanup();
		}
	}
});
