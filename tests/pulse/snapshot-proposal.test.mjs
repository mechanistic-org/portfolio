import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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

function proposalApproval(overrides = {}) {
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

function runProposal(approval) {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-proposal-"));
	const approvalPath = path.join(workspace, "approval.json");
	const outputPath = path.join(workspace, "candidate.json");
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

test("an unapproved proposal validates and writes only deterministic candidate bytes", () => {
	const first = runProposal(proposalApproval());
	const second = runProposal(proposalApproval());
	try {
		assert.equal(first.result.status, 0, `${first.result.stdout}\n${first.result.stderr}`);
		assert.equal(second.result.status, 0, `${second.result.stdout}\n${second.result.stderr}`);
		assert.match(first.result.stdout, /effective_state=proposal/u);
		assert.deepEqual(fs.readFileSync(first.outputPath), fs.readFileSync(second.outputPath));
		assert.equal(
			fs.readFileSync(first.outputPath).equals(
				fs.readFileSync(path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json")),
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
				...proposalApproval().privacy_review,
				reviewed_by: "eriknorris",
			},
		},
	]) {
		const attempt = runProposal(proposalApproval(invalidAuthority));
		try {
			assert.notEqual(attempt.result.status, 0, "proposal accepted an approval authority field");
			assert.match(`${attempt.result.stdout}\n${attempt.result.stderr}`, /effective_state=proposal/u);
			assert.equal(fs.existsSync(attempt.outputPath), false);
		} finally {
			attempt.cleanup();
		}
	}
});

test("a proposal fails closed when its candidate binding no longer matches", () => {
	const invalid = proposalApproval();
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
