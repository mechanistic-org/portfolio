// #290 retired the public dashboard. Preserve record-integrity and privacy
// checks here; browser/static-output retirement checks live in pulse_contract.mjs.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
	loadPulseRenderModel,
	PUBLIC_PROPOSAL_PATH_ENV,
} from "../../scripts/pulse/public_history_source.mjs";
const repositoryRoot = path.resolve(import.meta.dirname, "../..");

function unavailableProposalProjection(sourceProjection) {
	const proposal = structuredClone(sourceProjection);
	const durableGroup = proposal.groups[2];
	Object.assign(durableGroup, {
		verification_state: "not_measurable",
		value: null,
		reason:
			"A native scoped-session denominator cannot be reproduced for the complete 90-day window.",
		evidence_start: "2026-08-22",
		eligibility_rule:
			"Numeric coverage becomes eligible after both the native scoped-session denominator and its durable decision/finding joins are reproducible for every day in a complete 90-day window.",
		receipt: {
			id: "rct_11111111111111111111111111111111",
			sha256: "1".repeat(64),
		},
	});
	Object.assign(durableGroup.metrics[0], {
		value: null,
		refresh_state: "not_measurable",
		receipt: durableGroup.receipt,
	});
	return proposal;
}

function runProjectionValidation(projectionPath) {
	return spawnSync(
		process.execPath,
		[
			path.join(repositoryRoot, "scripts", "pulse", "validate_public_projection.mjs"),
			projectionPath,
		],
		{ cwd: repositoryRoot, encoding: "utf8" },
	);
}

function runHistoryValidation(historyPath) {
	return spawnSync(
		process.execPath,
		[path.join(repositoryRoot, "scripts", "pulse", "validate_public_history.mjs"), historyPath],
		{ cwd: repositoryRoot, encoding: "utf8" },
	);
}

test("the retained loader rejects unapproved proposals in deployment environments", () => {
	for (const deploymentEnvironment of [{ CI: "true" }, { CF_PAGES: "1" }]) {
		assert.throws(
			() =>
				loadPulseRenderModel(
					{ current_snapshot_id: null, snapshots: [] },
					{
						...deploymentEnvironment,
						[PUBLIC_PROPOSAL_PATH_ENV]: path.join(os.tmpdir(), "unapproved-proposal.json"),
					},
				),
			/deployment build cannot render PULSE_PROPOSAL_PATH/u,
		);
	}
});

test("the release validator accepts only the complete unavailable-group public contract", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-unavailable-gate-"));
	try {
		const sourceProjection = JSON.parse(
			fs.readFileSync(
				path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json"),
				"utf8",
			),
		);
		const unavailableProjection = unavailableProposalProjection(sourceProjection);
		const projectionPath = path.join(workspace, "unavailable-proposal.json");
		fs.writeFileSync(projectionPath, `${JSON.stringify(unavailableProjection, null, "\t")}\n`);

		const validation = runProjectionValidation(projectionPath);
		assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);

		for (const invalid of [
			{ mutate: (group) => delete group.reason, label: "missing reason" },
			{ mutate: (group) => delete group.eligibility_rule, label: "missing eligibility rule" },
			{ mutate: (group) => (group.value = 1), label: "numeric shortcut" },
		]) {
			const candidate = unavailableProposalProjection(sourceProjection);
			invalid.mutate(candidate.groups[2]);
			fs.writeFileSync(projectionPath, `${JSON.stringify(candidate, null, "\t")}\n`);
			const rejected = runProjectionValidation(projectionPath);
			assert.notEqual(rejected.status, 0, `validator accepted ${invalid.label}`);
		}
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("the retained history validator rejects lifecycle history that revives an archived snapshot", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-history-gate-"));
	try {
		const history = JSON.parse(
			fs.readFileSync(
				path.join(repositoryRoot, "src", "data", "pulse", "public-history.json"),
				"utf8",
			),
		);
		history.snapshots[0].lifecycle.state = "active";
		history.snapshots[0].lifecycle.is_current = true;
		const invalidPath = path.join(workspace, "revived-history.json");
		fs.writeFileSync(invalidPath, `${JSON.stringify(history, null, "\t")}\n`);

		const validation = runHistoryValidation(invalidPath);
		assert.notEqual(validation.status, 0, "history validator revived archived evidence");
		assert.match(
			`${validation.stdout}\n${validation.stderr}`,
			/\[public-history\].*(?:current|archived|90 days)/u,
		);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("the history gate rejects an approval-time active marker inside an archived record", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-stale-active-"));
	try {
		const history = JSON.parse(
			fs.readFileSync(
				path.join(repositoryRoot, "src", "data", "pulse", "public-history.json"),
				"utf8",
			),
		);
		history.snapshots[0].snapshot.lifecycle_state = "active";
		const invalidPath = path.join(workspace, "stale-active.json");
		fs.writeFileSync(invalidPath, `${JSON.stringify(history, null, "\t")}\n`);

		const validation = runHistoryValidation(invalidPath);
		assert.notEqual(validation.status, 0, "history validator exposed a stale active marker");
		assert.match(
			`${validation.stdout}\n${validation.stderr}`,
			/\[public-history\].*(?:active marker|current implication)/u,
		);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("an archived-only history validates without mutating the retained record", () => {
	const committedHistoryPath = path.join(
		repositoryRoot,
		"src",
		"data",
		"pulse",
		"public-history.json",
	);
	const committedHistoryMtime = fs.statSync(committedHistoryPath, { bigint: true }).mtimeNs;
	const history = JSON.parse(fs.readFileSync(committedHistoryPath, "utf8"));
	const archivedOnly = {
		...history,
		current_snapshot_id: null,
		snapshots: history.snapshots.filter((record) => record.lifecycle.state === "archived"),
	};
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-archived-only-"));
	try {
		const historyPath = path.join(workspace, "archived-only.json");
		fs.writeFileSync(historyPath, `${JSON.stringify(archivedOnly, null, "\t")}\n`);
		const validation = runHistoryValidation(historyPath);
		assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);

		assert.equal(
			fs.statSync(committedHistoryPath, { bigint: true }).mtimeNs,
			committedHistoryMtime,
			"record validation must not mutate retained history",
		);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("an invalid retained projection still fails integrity validation", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-public-gate-"));
	try {
		const sourcePath = path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json");
		const invalidPath = path.join(workspace, "invalid-public-snapshot.json");
		const invalidProjection = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
		invalidProjection.groups.pop();
		fs.writeFileSync(invalidPath, `${JSON.stringify(invalidProjection, null, "\t")}\n`);

		const validation = runProjectionValidation(invalidPath);
		assert.notEqual(
			validation.status,
			0,
			"the release validator accepted an incomplete projection",
		);
		assert.match(
			`${validation.stdout}\n${validation.stderr}`,
			/\[public-projection\] groups must exactly match the three headline proof groups/u,
		);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("the release validator rejects the projector's private source markers", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-public-privacy-"));
	try {
		const sourcePath = path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json");
		const sourceProjection = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
		const privateMarkers = [
			"Session portfolio#174 supplied this value.",
			"Session 019cf111-7abc-7def-8abc-0123456789ab supplied this value.",
			"See https://github.com/mechanistic-org/internal-ops/issues/5.",
			"customer: Acme",
			"Contains confidential-work attribution.",
			"A person created the record on 2026-08-24.",
		];

		for (const [index, marker] of privateMarkers.entries()) {
			const invalidProjection = structuredClone(sourceProjection);
			invalidProjection.public_wording.summary = marker;
			const invalidPath = path.join(workspace, `private-${index}.json`);
			fs.writeFileSync(invalidPath, `${JSON.stringify(invalidProjection, null, "\t")}\n`);

			const validation = runProjectionValidation(invalidPath);
			assert.notEqual(validation.status, 0, `release validator accepted: ${marker}`);
			assert.match(`${validation.stdout}\n${validation.stderr}`, /\[public-projection\]/u);
		}
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("the release validator rejects extra fields inside a metric measurement window", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-public-window-"));
	try {
		const sourcePath = path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json");
		const invalidProjection = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
		invalidProjection.groups[0].metrics[0].measurement_window.unapproved = true;
		const invalidPath = path.join(workspace, "extra-window-field.json");
		fs.writeFileSync(invalidPath, `${JSON.stringify(invalidProjection, null, "\t")}\n`);

		const validation = runProjectionValidation(invalidPath);
		assert.notEqual(validation.status, 0, "release validator accepted an extra window field");
		assert.match(
			`${validation.stdout}\n${validation.stderr}`,
			/measurement_window fields must exactly match the public schema/u,
		);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("retired Pulse records remain explicitly checkable without blocking the site build", () => {
	const scripts = JSON.parse(
		fs.readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
	).scripts;
	assert.doesNotMatch(scripts.build, /scripts\/pulse\//);
	assert.match(scripts["check:pulse-history"], /validate_public_projection/);
	assert.match(scripts["check:pulse-history"], /validate_public_history/);
	assert.equal(scripts["test:pulse-proposal-browser"], undefined);
	assert.equal(
		fs.existsSync(path.join(repositoryRoot, "src/content/colophon/the-pulse.mdx")),
		false,
	);
	assert.equal(
		fs.existsSync(path.join(repositoryRoot, "src/components/Pulse/PulseSnapshot.astro")),
		false,
	);
});
