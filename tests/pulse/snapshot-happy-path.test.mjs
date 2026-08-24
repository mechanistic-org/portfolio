import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const fixtureRoot = path.join(repositoryRoot, "tests", "fixtures", "pulse", "happy-path");
const projectorPath = path.join(repositoryRoot, "scripts", "pulse", "project_snapshot.mjs");
const temporaryDirectories = [];

after(() => {
	for (const directory of temporaryDirectories) {
		fs.rmSync(directory, { force: true, recursive: true });
	}
});

function projectFixture() {
	const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-snapshot-"));
	temporaryDirectories.push(outputDirectory);

	const outputPath = path.join(outputDirectory, "public-snapshot.json");
	execFileSync(
		process.execPath,
		[
			projectorPath,
			"--definitions",
			path.join(fixtureRoot, "canon", "definitions.json"),
			"--snapshot",
			path.join(fixtureRoot, "canon", "snapshot.json"),
			"--approval",
			path.join(fixtureRoot, "canon", "approval.json"),
			"--receipt-manifest",
			path.join(fixtureRoot, "evidence", "manifest.json"),
			"--receipts-dir",
			path.join(fixtureRoot, "evidence", "receipts"),
			"--output",
			outputPath,
		],
		{ cwd: repositoryRoot, stdio: "pipe" },
	);

	return fs.readFileSync(outputPath);
}

test("an approved snapshot projects deterministically without crossing the custody boundary", () => {
	const firstProjection = projectFixture();
	const secondProjection = projectFixture();

	assert.deepEqual(firstProjection, secondProjection);
	assert.equal(
		createHash("sha256").update(firstProjection).digest("hex"),
		"706197db8232e93af108b65ab517431db0bb1f10f3b2a4ef23b250811fc30a2a",
	);

	const publicSnapshot = JSON.parse(firstProjection.toString("utf8"));
	assert.deepEqual(
		publicSnapshot.groups.map((group) => group.id),
		["issue-flow", "change-traceability", "durable-record-coverage"],
	);
	assert.deepEqual(
		publicSnapshot.groups.map((group) => group.metrics.map((metric) => metric.id)),
		[
			[
				"issue-flow.created-count",
				"issue-flow.cohort-closure-percentage",
				"issue-flow.median-close-time",
				"issue-flow.net-backlog-change",
			],
			[
				"change-traceability.trunk-commits",
				"change-traceability.scheduled-maintenance-commits",
				"change-traceability.issue-reference-coverage",
				"change-traceability.distinct-issues",
			],
			["durable-record-coverage.session-coverage-percentage"],
		],
	);
	for (const group of publicSnapshot.groups) {
		for (const metric of group.metrics) {
			assert.deepEqual(metric.measurement_window, {
				days: 90,
				end: "2026-08-24",
				start: "2026-05-27",
			});
			assert.equal(metric.as_of, "2026-08-24");
			assert.equal(metric.refresh_state, "independently-reproduced");
			assert.match(metric.receipt.id, /^rct_[a-f0-9]{32}$/u);
			assert.match(metric.receipt.sha256, /^[a-f0-9]{64}$/u);
		}
	}

	const publicText = firstProjection.toString("utf8");
	for (const privateMarker of [
		"exact_command",
		"raw_output",
		"private_source_identity",
		"local_path",
		"reproduced_by",
		"mechanistic-org/private-source",
		"private issue cohort query",
		"private trunk traceability query",
		"private scoped-session coverage query",
		"D:\\\\private\\\\receipts",
	]) {
		assert.equal(publicText.includes(privateMarker), false);
	}
});
