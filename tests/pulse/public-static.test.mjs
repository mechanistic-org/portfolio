import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import {
	loadPulseRenderModel,
	PUBLIC_HISTORY_PATH_ENV,
	PUBLIC_PROPOSAL_PATH_ENV,
} from "../../scripts/pulse/public_history_source.mjs";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const pulseHtmlPath = path.join(repositoryRoot, "dist", "colophon", "the-pulse", "index.html");

function productionBuildEnvironment(environment = {}) {
	const inherited = { ...process.env };
	delete inherited[PUBLIC_HISTORY_PATH_ENV];
	delete inherited[PUBLIC_PROPOSAL_PATH_ENV];
	return { ...inherited, ...environment, ASTRO_TELEMETRY_DISABLED: "1" };
}

function runProductionBuild(environment = {}) {
	return spawnSync("npm run build", {
		cwd: repositoryRoot,
		encoding: "utf8",
		env: productionBuildEnvironment(environment),
		shell: true,
	});
}

function runProductionBuildWithHistory(history) {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-static-history-"));
	const historyPath = path.join(workspace, "public-history.json");
	try {
		fs.writeFileSync(historyPath, `${JSON.stringify(history, null, "\t")}\n`);
		return runProductionBuild({ [PUBLIC_HISTORY_PATH_ENV]: historyPath });
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
}

function runProductionBuildWithProposal(projection) {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-static-proposal-"));
	const proposalPath = path.join(workspace, "proposal.json");
	try {
		fs.writeFileSync(proposalPath, `${JSON.stringify(projection, null, "\t")}\n`);
		return runProductionBuild({
			CI: "false",
			CF_PAGES: "false",
			[PUBLIC_PROPOSAL_PATH_ENV]: proposalPath,
		});
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
}

function occurrences(haystack, needle) {
	return haystack.split(needle).length - 1;
}

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

test("default static builds ignore an ambient alternate history path", () => {
	const previous = process.env[PUBLIC_HISTORY_PATH_ENV];
	try {
		process.env[PUBLIC_HISTORY_PATH_ENV] = path.join(os.tmpdir(), "ambient-public-history.json");
		assert.equal(Object.hasOwn(productionBuildEnvironment(), PUBLIC_HISTORY_PATH_ENV), false);
		assert.equal(
			productionBuildEnvironment({ [PUBLIC_HISTORY_PATH_ENV]: "explicit-history.json" })[
				PUBLIC_HISTORY_PATH_ENV
			],
			"explicit-history.json",
		);
	} finally {
		if (previous === undefined) delete process.env[PUBLIC_HISTORY_PATH_ENV];
		else process.env[PUBLIC_HISTORY_PATH_ENV] = previous;
	}
});

test("deployment builds fail closed when an unapproved proposal path is present", () => {
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

test("the Pulse component consumes the semantic design tokens without local palette copies", () => {
	const component = fs.readFileSync(
		path.join(repositoryRoot, "src", "components", "Pulse", "PulseSnapshot.astro"),
		"utf8",
	);

	for (const token of [
		"var(--background)",
		"var(--foreground)",
		"var(--card)",
		"var(--border)",
		"var(--primary)",
		"var(--info)",
		"var(--warning)",
		"var(--muted-foreground)",
	]) {
		assert.ok(component.includes(token), `Pulse component does not consume ${token}`);
	}
	assert.equal(
		/#[0-9a-f]{3,8}\b/iu.test(component),
		false,
		"Pulse component copies palette hex values",
	);
});

test("the approved controlled projection is complete in static HTML without client JavaScript", () => {
	const build = runProductionBuild();
	assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);

	const html = fs.readFileSync(pulseHtmlPath, "utf8");
	const projection = JSON.parse(
		fs.readFileSync(
			path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json"),
			"utf8",
		),
	);

	assert.equal(occurrences(html, "data-pulse-proof-group"), 3);
	assert.equal(occurrences(html, "data-pulse-metric"), 9);
	assert.equal(occurrences(html, "data-pulse-definition"), 9);
	assert.equal(occurrences(html, "data-pulse-method"), 9);
	assert.equal(occurrences(html, "data-pulse-inventory-item"), 4);
	for (const group of projection.groups) {
		const approvedPurpose = group.metrics.map((metric) => metric.definition).join(" ");
		assert.ok(
			html.includes(approvedPurpose),
			`${group.id} explanation is not derived from approval-bound projection definitions`,
		);
	}

	for (const requiredText of [
		"Controlled example projection - not production evidence.",
		"Issue flow",
		"Change traceability",
		"Durable record coverage",
		"May 27, 2026",
		"August 24, 2026",
		"90 days",
		"active",
		"independently reproduced",
		"Created cohort",
		"Cohort closure",
		"Median close time",
		"Net backlog change",
		"Trunk commits",
		"Scheduled maintenance",
		"Issue-reference coverage",
		"Distinct issues represented",
		"Session coverage",
		"Versioned scripts",
		"Executable checks",
		"Registered skills",
		"Supervised services",
	]) {
		assert.ok(html.includes(requiredText), `static Pulse HTML is missing: ${requiredText}`);
	}

	for (const excludedText of [
		"Tokens through the stack",
		"Generated tokens, by month",
		"Local models",
		"raw_output",
		"exact_command",
		"private_source_identity",
		"local_path",
	]) {
		assert.equal(html.includes(excludedText), false, `static Pulse HTML leaked: ${excludedText}`);
	}
});

test("an unavailable proposal renders three honest static groups without a durable number", () => {
	const publishedSnapshotPath = path.join(
		repositoryRoot,
		"src",
		"data",
		"pulse",
		"public-snapshot.json",
	);
	const publishedHistoryPath = path.join(
		repositoryRoot,
		"src",
		"data",
		"pulse",
		"public-history.json",
	);
	const publishedBefore = [
		fs.readFileSync(publishedSnapshotPath),
		fs.readFileSync(publishedHistoryPath),
	];
	const proposal = unavailableProposalProjection(JSON.parse(publishedBefore[0].toString("utf8")));
	const durableGroup = proposal.groups[2];

	const build = runProductionBuildWithProposal(proposal);
	assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);
	const html = fs.readFileSync(pulseHtmlPath, "utf8");

	assert.equal(occurrences(html, "data-pulse-proof-group"), 3);
	assert.ok(html.includes("Unapproved snapshot proposal"));
	assert.ok(html.includes('data-pulse-proof-group="durable-record-coverage"'));
	assert.ok(html.includes('data-pulse-unavailable="not_measurable"'));
	assert.ok(html.includes("Not measurable"));
	assert.ok(html.includes(durableGroup.reason));
	assert.ok(html.includes("Evidence starts August 22, 2026"));
	assert.ok(html.includes(durableGroup.eligibility_rule));
	const durableGroupStart = html.indexOf('data-pulse-proof-group="durable-record-coverage"');
	const durableGroupHtml = html.slice(
		durableGroupStart,
		html.indexOf("</section>", durableGroupStart),
	);
	assert.equal(durableGroupHtml.includes("<strong>"), false);
	assert.equal(html.includes("Approved static projection"), false);
	assert.deepEqual(fs.readFileSync(publishedSnapshotPath), publishedBefore[0]);
	assert.deepEqual(fs.readFileSync(publishedHistoryPath), publishedBefore[1]);
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

test("archived and withdrawn snapshots remain distinct, static, and linked to the correction", () => {
	const build = runProductionBuild();
	assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);

	const html = fs.readFileSync(pulseHtmlPath, "utf8");
	assert.ok(html.includes("Snapshot history"));
	assert.ok(html.includes('data-pulse-history-state="archived"'));
	assert.ok(html.includes('data-pulse-history-state="withdrawn"'));
	assert.equal(occurrences(html, "data-pulse-history-metric"), 27);
	assert.ok(html.includes("Archived because this approved snapshot is more than 90 days old."));
	assert.ok(html.includes("It remains valid historical evidence and is not current or live."));
	assert.ok(html.includes("Withdrawn because its provenance became invalid."));
	assert.ok(html.includes("It is inactive and cannot serve as the current snapshot."));
	assert.ok(html.includes("View the approved correction"));
	assert.ok(html.includes('href="/colophon/the-pulse/#pulse-snapshot-pulse-fixture-2026-08-24"'));
	assert.ok(html.includes('href="/colophon/the-pulse/#pulse-snapshot-pulse-2026-08-24-03"'));
	assert.ok(html.includes('id="pulse-snapshot-pulse-fixture-2026-08-24"'));
	assert.ok(html.includes('id="pulse-snapshot-pulse-2026-08-24-03"'));

	for (const privateText of [
		"package_dir",
		"exact_command",
		"raw_output",
		"private_source_identity",
		"local_path",
	]) {
		assert.equal(html.includes(privateText), false, `static history leaked: ${privateText}`);
	}
});

test("the production gate rejects lifecycle history that revives an archived snapshot", () => {
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

		const buildCommand = JSON.parse(
			fs.readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
		).scripts.build;
		const historyValidatorIndex = buildCommand.indexOf("scripts/pulse/validate_public_history.mjs");
		const astroIndex = buildCommand.indexOf("astro build");
		assert.notEqual(historyValidatorIndex, -1, "the build must validate public snapshot history");
		assert.ok(historyValidatorIndex < astroIndex, "history validation must run before Astro");
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

test("an archived-only history validates and renders without implying a current snapshot", () => {
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

		const build = runProductionBuildWithHistory(archivedOnly);
		assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);
		assert.equal(
			fs.statSync(committedHistoryPath, { bigint: true }).mtimeNs,
			committedHistoryMtime,
			"an alternate static render must not mutate the committed public history source",
		);
		const html = fs.readFileSync(pulseHtmlPath, "utf8");
		assert.ok(html.includes("No current approved snapshot"));
		assert.ok(html.includes("No evidence is presented as current or live."));
		assert.ok(html.includes('data-pulse-history-state="archived"'));
		assert.equal(html.includes("data-pulse-snapshot"), false);
	} finally {
		fs.rmSync(workspace, { force: true, recursive: true });
	}
});

test("an invalid public projection fails the release validator wired before Astro", () => {
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

		const buildCommand = JSON.parse(
			fs.readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
		).scripts.build;
		const validatorIndex = buildCommand.indexOf("scripts/pulse/validate_public_projection.mjs");
		const astroIndex = buildCommand.indexOf("astro build");
		assert.notEqual(validatorIndex, -1, "the production build must invoke the validator");
		assert.notEqual(astroIndex, -1, "the production build must invoke Astro");
		assert.ok(
			validatorIndex < astroIndex,
			"the public projection validator must run before Astro in the production build",
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
