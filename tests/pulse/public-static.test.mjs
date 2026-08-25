import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const pulseHtmlPath = path.join(repositoryRoot, "dist", "colophon", "the-pulse", "index.html");

function runProductionBuild() {
	return spawnSync("npm run build", {
		cwd: repositoryRoot,
		encoding: "utf8",
		env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
		shell: true,
	});
}

function runProductionBuildWithHistory(history) {
	const historyPath = path.join(repositoryRoot, "src", "data", "pulse", "public-history.json");
	const original = fs.readFileSync(historyPath);
	try {
		fs.writeFileSync(historyPath, `${JSON.stringify(history, null, "\t")}\n`);
		return runProductionBuild();
	} finally {
		fs.writeFileSync(historyPath, original);
	}
}

function occurrences(haystack, needle) {
	return haystack.split(needle).length - 1;
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

test("archived and withdrawn snapshots remain distinct, static, and linked to the correction", () => {
	const build = runProductionBuild();
	assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);

	const html = fs.readFileSync(pulseHtmlPath, "utf8");
	assert.ok(html.includes("Snapshot history"));
	assert.ok(html.includes('data-pulse-history-state="archived"'));
	assert.ok(html.includes('data-pulse-history-state="withdrawn"'));
	assert.equal(occurrences(html, "data-pulse-history-metric"), 18);
	assert.ok(html.includes("Archived because this approved snapshot is more than 90 days old."));
	assert.ok(html.includes("It remains valid historical evidence and is not current or live."));
	assert.ok(html.includes("Withdrawn because its provenance became invalid."));
	assert.ok(html.includes("It is inactive and cannot serve as the current snapshot."));
	assert.ok(html.includes("View the approved correction"));
	assert.ok(html.includes('href="/colophon/the-pulse/#pulse-snapshot-pulse-fixture-2026-08-24"'));
	assert.ok(html.includes('id="pulse-snapshot-pulse-fixture-2026-08-24"'));

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
	const history = JSON.parse(
		fs.readFileSync(
			path.join(repositoryRoot, "src", "data", "pulse", "public-history.json"),
			"utf8",
		),
	);
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
