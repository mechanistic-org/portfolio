import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const PRODUCTION_READERS = [
	"src/content.config.ts",
	"scripts/project_pipeline.py",
	"scripts/audits/career_kb_inventory.py",
	"scripts/diagnostics/diagnose_content.ts",
	"src/layouts/themes/Hyperspace.astro",
	"src/layouts/themes/ProjectArticle.astro",
	"src/components/Projects/ProjectManifestHUD.astro",
	"src/components/DataViz/ResVizSwarm.tsx",
	"src/pages/api/projects.json.ts",
	"src/pages/index.astro",
	"src/types/MultiverseTypes.ts",
	"src/utils/getMultiverseData.ts",
];

test("tier and theme are the only production classification and renderer authorities", () => {
	for (const relativePath of PRODUCTION_READERS) {
		const source = fs.readFileSync(path.resolve(relativePath), "utf8");
		assert.equal(
			source.includes("presentation_mode"),
			false,
			`${relativePath} still reads the retired presentation field`,
		);
	}
	const schema = fs.readFileSync(path.resolve("src/content.config.ts"), "utf8");
	assert.match(schema, /theme: z\.string\(\)\.default\("hyperspace"\)/);
	assert.match(schema, /tier: z\.enum\(\["deep_dive", "lite"\]\)\.default\("lite"\)/);
});

test("the accidental tier gate and strict quota commands are retired", () => {
	assert.equal(fs.existsSync(path.resolve("scripts/audits/validate_tier_gate.mjs")), false);
	const packageJson = fs.readFileSync(path.resolve("package.json"), "utf8");
	assert.equal(packageJson.includes("audit:tier"), false);
	assert.equal(packageJson.includes("validate_tier_gate"), false);
});
