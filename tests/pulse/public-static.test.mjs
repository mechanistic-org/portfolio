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

function occurrences(haystack, needle) {
	return haystack.split(needle).length - 1;
}

test("the approved controlled projection is complete in static HTML without client JavaScript", () => {
	const build = runProductionBuild();
	assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);

	const html = fs.readFileSync(pulseHtmlPath, "utf8");

	assert.equal(occurrences(html, "data-pulse-proof-group"), 3);
	assert.equal(occurrences(html, "data-pulse-metric"), 9);
	assert.equal(occurrences(html, "data-pulse-definition"), 9);
	assert.equal(occurrences(html, "data-pulse-method"), 9);
	assert.equal(occurrences(html, "data-pulse-inventory-item"), 4);

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

test("an invalid public projection fails the release validator wired before Astro", () => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-public-gate-"));
	try {
		const sourcePath = path.join(repositoryRoot, "src", "data", "pulse", "public-snapshot.json");
		const invalidPath = path.join(workspace, "invalid-public-snapshot.json");
		const invalidProjection = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
		invalidProjection.groups.pop();
		fs.writeFileSync(invalidPath, `${JSON.stringify(invalidProjection, null, "\t")}\n`);

		const validation = spawnSync(
			process.execPath,
			[
				path.join(repositoryRoot, "scripts", "pulse", "validate_public_projection.mjs"),
				invalidPath,
			],
			{ cwd: repositoryRoot, encoding: "utf8" },
		);
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
