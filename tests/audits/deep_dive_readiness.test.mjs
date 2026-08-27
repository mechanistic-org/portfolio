import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	READINESS_DIMENSIONS,
	auditReadiness,
} from "../../scripts/audits/report_deep_dive_readiness.mjs";

const SOP = `# Deep-dive curation SOP

## Maturity model

1. \`unmined\`
2. \`mined\`
3. \`reconciled\`
4. \`composed\`
5. \`reviewed\`

Readiness instruments are independently marked \`complete\`, \`pending\`, or
\`not_applicable\`.
`;

function manifest(state = "pending") {
	const readinessHeaders = ["Slug", ...READINESS_DIMENSIONS, "Next action"];
	return `# Dashboard

## Identity and custody

| Slug | Maturity |
|---|---|
| \`c24\` | reviewed |
| \`sc48\` | unmined |

## Readiness by governed dimension

| ${readinessHeaders.join(" | ")} |
| ${readinessHeaders.map(() => "---").join(" | ")} |
| \`c24\` | ${READINESS_DIMENSIONS.map(() => "complete - accepted").join(" | ")} | closed |
| \`sc48\` | ${READINESS_DIMENSIONS.map(() => `${state} - calibration required`).join(" | ")} | #196 |
`;
}

function fixture(readinessState) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-readiness-"));
	const sopPath = path.join(root, "DEEP_DIVE_SOP.md");
	const manifestPath = path.join(root, "deep_dive_manifest.md");
	fs.writeFileSync(sopPath, SOP);
	fs.writeFileSync(manifestPath, manifest(readinessState));
	return { root, sopPath, manifestPath };
}

test("reports every governed dimension without treating pending as failure", (t) => {
	const paths = fixture("pending");
	t.after(() => fs.rmSync(paths.root, { recursive: true, force: true }));
	const result = auditReadiness(paths);
	assert.equal(result.available, true);
	assert.deepEqual(result.errors, []);
	assert.equal(result.rows, 2);
	assert.deepEqual(result.maturity, { reviewed: 1, unmined: 1 });
	for (const dimension of READINESS_DIMENSIONS) {
		assert.deepEqual(result.dimensions[dimension], {
			complete: 1,
			pending: 1,
			not_applicable: 0,
		});
	}
});

test("malformed readiness remains a report warning, not a publication verdict", (t) => {
	const paths = fixture("unknown");
	t.after(() => fs.rmSync(paths.root, { recursive: true, force: true }));
	const result = auditReadiness(paths);
	assert.equal(result.available, true);
	assert(result.errors.some((error) => error.includes("invalid Archive / vault state")));
});
