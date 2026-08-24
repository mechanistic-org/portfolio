import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const happyFixtureRoot = path.join(repositoryRoot, "tests", "fixtures", "pulse", "happy-path");
const projectorPath = path.join(repositoryRoot, "scripts", "pulse", "project_snapshot.mjs");
const temporaryDirectories = [];
const definitionFields = [
	"id",
	"label",
	"unit",
	"definition",
	"numerator",
	"denominator",
	"method_summary",
	"source_class",
];
const issueFlowDefinitionFields = [...definitionFields, "inclusions", "exclusions"];

after(() => {
	for (const directory of temporaryDirectories) {
		fs.rmSync(directory, { force: true, recursive: true });
	}
});

function stableValue(value) {
	if (Array.isArray(value)) return value.map(stableValue);
	if (value === null || typeof value !== "object") return value;

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

function canonicalHash(value) {
	return sha256(stableJson(value));
}

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
	fs.writeFileSync(filePath, stableJson(value), "utf8");
}

function projectorArguments(fixtureRoot, outputPath) {
	return [
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
	];
}

function runProjector(fixtureRoot, outputPath) {
	return spawnSync(process.execPath, projectorArguments(fixtureRoot, outputPath), {
		cwd: repositoryRoot,
		encoding: "utf8",
	});
}

function createCandidateWorkspace() {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-fail-closed-"));
	temporaryDirectories.push(workspace);
	const fixtureRoot = path.join(workspace, "candidate");
	fs.cpSync(happyFixtureRoot, fixtureRoot, { recursive: true });

	const outputPath = path.join(workspace, "public-snapshot.json");
	const baseline = runProjector(happyFixtureRoot, outputPath);
	assert.equal(baseline.status, 0, baseline.stderr);

	return { fixtureRoot, outputPath };
}

function collectPublicNarrative(definitions, snapshot) {
	return [
		snapshot.public_wording.title,
		snapshot.public_wording.summary,
		...definitions.groups.flatMap((group) => [
			group.label,
			...group.metrics.flatMap((metric) =>
				(group.id === "issue-flow" ? issueFlowDefinitionFields : definitionFields).map(
					(field) => metric[field],
				),
			),
		]),
	];
}

function collectPublicSourceUrls(publicNarrative) {
	return [
		...new Set(
			publicNarrative.flatMap((text) =>
				[...(text.match(/\bhttps:\/\/[^\s<>"']+/giu) ?? [])].map((url) =>
					url.replace(/[),.;!?]+$/u, ""),
				),
			),
		),
	].sort();
}

function rebindPrivacyReview(fixtureRoot) {
	const definitionsPath = path.join(fixtureRoot, "canon", "definitions.json");
	const snapshotPath = path.join(fixtureRoot, "canon", "snapshot.json");
	const approvalPath = path.join(fixtureRoot, "canon", "approval.json");
	const definitions = readJson(definitionsPath);
	const snapshot = readJson(snapshotPath);
	const approval = readJson(approvalPath);
	const publicNarrative = collectPublicNarrative(definitions, snapshot);

	approval.privacy_review.public_narrative_sha256 = canonicalHash(publicNarrative);
	approval.privacy_review.approved_public_source_urls = collectPublicSourceUrls(publicNarrative);
	writeJson(approvalPath, approval);
}

function rebindPublicWording(fixtureRoot, baselineProjection) {
	rebindPrivacyReview(fixtureRoot);
	const snapshotPath = path.join(fixtureRoot, "canon", "snapshot.json");
	const approvalPath = path.join(fixtureRoot, "canon", "approval.json");
	const snapshot = readJson(snapshotPath);
	const approval = readJson(approvalPath);
	const candidateProjection = {
		...baselineProjection,
		public_wording: snapshot.public_wording,
	};
	const publicBytes = Buffer.from(stableJson(candidateProjection), "utf8");

	approval.binding.public_wording_sha256 = canonicalHash(snapshot.public_wording);
	approval.binding.public_projection_sha256 = sha256(publicBytes);
	writeJson(approvalPath, approval);
}

function mutateFixtureJson(fixtureRoot, relativePath, mutate) {
	const filePath = path.join(fixtureRoot, relativePath);
	const value = readJson(filePath);
	mutate(value);
	writeJson(filePath, value);
}

function replaceMeasuredValue(fixtureRoot, metricId, nextValue) {
	const snapshotPath = path.join(fixtureRoot, "canon", "snapshot.json");
	const manifestPath = path.join(fixtureRoot, "evidence", "manifest.json");
	const snapshot = readJson(snapshotPath);
	const receiptId = snapshot.values[metricId].receipt_ref;
	snapshot.values[metricId].value = nextValue;
	writeJson(snapshotPath, snapshot);

	const receiptPath = path.join(fixtureRoot, "evidence", "receipts", `${receiptId}.json`);
	const receipt = readJson(receiptPath);
	receipt.primary.raw_output[metricId] = nextValue;
	receipt.independent_reproduction.raw_output[metricId] = nextValue;
	writeJson(receiptPath, receipt);

	const manifest = readJson(manifestPath);
	const manifestEntry = manifest.receipts.find((entry) => entry.id === receiptId);
	manifestEntry.sha256 = sha256(fs.readFileSync(receiptPath));
	manifestEntry.independent_reproduction.result_sha256 = canonicalHash(receipt.primary.raw_output);
	writeJson(manifestPath, manifest);
}

test("a bound session identifier leak fails closed without replacing the approved projection", () => {
	const { fixtureRoot, outputPath } = createCandidateWorkspace();
	const approvedBytes = fs.readFileSync(outputPath);
	const baselineProjection = JSON.parse(approvedBytes.toString("utf8"));
	const snapshotPath = path.join(fixtureRoot, "canon", "snapshot.json");
	const snapshot = readJson(snapshotPath);
	snapshot.public_wording.summary =
		"Scoped session portfolio#170 produced three proof groups in one private run.";
	writeJson(snapshotPath, snapshot);
	rebindPublicWording(fixtureRoot, baselineProjection);

	const result = runProjector(fixtureRoot, outputPath);

	assert.notEqual(result.status, 0);
	assert.match(result.stderr, /session identifier/u);
	assert.deepEqual(fs.readFileSync(outputPath), approvedBytes);
});

for (const privacyCase of [
	{
		name: "transcript material",
		summary: "Transcript excerpt: the private measurement run produced three proof groups.",
		error: /transcript material/u,
	},
	{
		name: "prompt material",
		summary: "Prompt: calculate operating evidence from the private source corpus.",
		error: /prompt material/u,
	},
	{
		name: "embedded local path",
		summary: "Receipt evidence is stored at D:\\private\\pulse\\receipt.json.",
		error: /local drive path/u,
	},
	{
		name: "UUID session identifier",
		summary: "Run ID: 62e2a82c-5ecd-443c-8dc6-bfa304b77351 produced the aggregate.",
		error: /session identifier/u,
	},
	{
		name: "UUIDv7 session identifier",
		summary: "Run ID: 019524c4-6b7e-7a10-8d4a-a8b4c1769910 produced the aggregate.",
		error: /session identifier/u,
	},
	{
		name: "private issue content",
		summary: "Private issue: the source ticket describes the underlying customer work.",
		error: /private issue content/u,
	},
	{
		name: "private repository identity",
		summary: "Source: https://github.com/mechanistic-org/private-source/issues/12",
		error: /private repository identity/u,
	},
	{
		name: "customer attribution",
		summary: "Customer: Example Robotics contributed to the measured operating window.",
		error: /customer attribution/u,
	},
	{
		name: "implicit customer attribution",
		summary: "Built for Example Robotics during the measured operating window.",
		error: /customer attribution/u,
	},
	{
		name: "confidential-work signal",
		summary: "Confidential work contributed to this aggregate result.",
		error: /confidential-work signal/u,
	},
	{
		name: "person-level daily activity",
		summary: "Erik closed five issues on 2026-08-24 during the measured window.",
		error: /person-level or daily activity/u,
	},
	{
		name: "punctuated person-level daily activity",
		summary: "Erik completed five issues, 2026-08-24.",
		error: /person-level or daily activity/u,
	},
]) {
	test(`bound ${privacyCase.name} fails closed without replacing the approved projection`, () => {
		const { fixtureRoot, outputPath } = createCandidateWorkspace();
		const approvedBytes = fs.readFileSync(outputPath);
		const baselineProjection = JSON.parse(approvedBytes.toString("utf8"));
		const snapshotPath = path.join(fixtureRoot, "canon", "snapshot.json");
		const snapshot = readJson(snapshotPath);
		snapshot.public_wording.summary = privacyCase.summary;
		writeJson(snapshotPath, snapshot);
		rebindPublicWording(fixtureRoot, baselineProjection);

		const result = runProjector(fixtureRoot, outputPath);

		assert.notEqual(result.status, 0);
		assert.match(result.stderr, privacyCase.error);
		assert.deepEqual(fs.readFileSync(outputPath), approvedBytes);
	});
}

test("a manually approved public GitHub primary source remains publishable", () => {
	const { fixtureRoot, outputPath } = createCandidateWorkspace();
	const baselineProjection = JSON.parse(fs.readFileSync(outputPath, "utf8"));
	const snapshotPath = path.join(fixtureRoot, "canon", "snapshot.json");
	const snapshot = readJson(snapshotPath);
	snapshot.public_wording.summary =
		"Public method source: https://github.com/nodejs/node/blob/main/doc/api/crypto.md";
	writeJson(snapshotPath, snapshot);
	rebindPublicWording(fixtureRoot, baselineProjection);

	const result = runProjector(fixtureRoot, outputPath);

	assert.equal(result.status, 0, result.stderr);
	assert.match(fs.readFileSync(outputPath, "utf8"), /github\.com\/nodejs\/node/u);
});

for (const failureCase of [
	{
		name: "a missing receipt",
		error: /receipt reference .* is unresolved/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "evidence/manifest.json", (manifest) => {
				manifest.receipts.shift();
			});
		},
	},
	{
		name: "an unresolved receipt reference",
		error: /receipt reference .* is unresolved/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/snapshot.json", (snapshot) => {
				snapshot.values["issue-flow.created-count"].receipt_ref =
					"rct_00000000000000000000000000000000";
			});
		},
	},
	{
		name: "a changed receipt file hash",
		error: /full-file hash does not match/u,
		mutate(fixtureRoot) {
			const manifest = readJson(path.join(fixtureRoot, "evidence", "manifest.json"));
			const receiptPath = path.join(fixtureRoot, "evidence", "receipts", manifest.receipts[0].file);
			fs.appendFileSync(receiptPath, "\n", "utf8");
		},
	},
	{
		name: "mixed measurement dates",
		error: /snapshot\.as_of must match the measurement window end date/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/snapshot.json", (snapshot) => {
				snapshot.as_of = "2026-08-23";
			});
		},
	},
	{
		name: "a missing headline group",
		error: /headline groups must be exactly/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/definitions.json", (definitions) => {
				definitions.groups.pop();
			});
		},
	},
	{
		name: "a partial proposal",
		error: /snapshot values must match every defined metric exactly/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/snapshot.json", (snapshot) => {
				delete snapshot.values["durable-record-coverage.session-coverage-percentage"];
			});
		},
	},
	{
		name: "an altered approved definition",
		error: /effective_state=proposal; approval binding definitions_sha256 does not match/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/definitions.json", (definitions) => {
				definitions.groups[0].metrics[0].definition =
					"Issues created during a changed measurement contract.";
			});
			rebindPrivacyReview(fixtureRoot);
		},
	},
	{
		name: "an altered approved value with a reproduced receipt",
		error: /effective_state=proposal; approval binding values_sha256 does not match/u,
		mutate(fixtureRoot) {
			replaceMeasuredValue(fixtureRoot, "change-traceability.trunk-commits", 133);
		},
	},
	{
		name: "altered approved public wording",
		error: /effective_state=proposal; approval binding public_wording_sha256 does not match/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/snapshot.json", (snapshot) => {
				snapshot.public_wording.summary =
					"Three proof groups now use different approved public wording.";
			});
			rebindPrivacyReview(fixtureRoot);
		},
	},
	{
		name: "an altered approved as_of date",
		error: /effective_state=proposal; approval binding as_of does not match/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/approval.json", (approval) => {
				approval.binding.as_of = "2026-08-25";
			});
		},
	},
	{
		name: "an altered approved projection hash",
		error: /effective_state=proposal; approval binding public_projection_sha256 does not match/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/approval.json", (approval) => {
				approval.binding.public_projection_sha256 = "0".repeat(64);
			});
		},
	},
	{
		name: "invalid approval authority",
		error: /approval\.approved_by must be eriknorris/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/approval.json", (approval) => {
				approval.approved_by = "automation";
			});
		},
	},
	{
		name: "machine-generated approval status",
		error: /approval\.status must be approved/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/approval.json", (approval) => {
				approval.status = "machine-approved";
			});
		},
	},
	{
		name: "a withdrawn snapshot",
		error: /happy-path snapshot lifecycle_state must be active/u,
		mutate(fixtureRoot) {
			mutateFixtureJson(fixtureRoot, "canon/snapshot.json", (snapshot) => {
				snapshot.lifecycle_state = "withdrawn";
			});
		},
	},
]) {
	test(`${failureCase.name} fails closed without replacing the approved projection`, () => {
		const { fixtureRoot, outputPath } = createCandidateWorkspace();
		const approvedBytes = fs.readFileSync(outputPath);
		failureCase.mutate(fixtureRoot);

		const result = runProjector(fixtureRoot, outputPath);

		assert.notEqual(result.status, 0);
		assert.match(result.stderr, failureCase.error);
		assert.deepEqual(fs.readFileSync(outputPath), approvedBytes);
	});
}
