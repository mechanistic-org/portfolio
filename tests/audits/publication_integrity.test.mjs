import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { auditPublicationIntegrity } from "../../scripts/audits/validate_publication_integrity.mjs";

function fixture() {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-integrity-"));
	const projectsRoot = path.join(root, "src", "content", "projects");
	const canonRoot = path.join(root, "canon");
	const evidenceRoot = path.join(root, "evidence");
	fs.mkdirSync(projectsRoot, { recursive: true });
	return { root, projectsRoot, canonRoot, evidenceRoot };
}

function writeProject(projectsRoot, slug, source) {
	const dir = path.join(projectsRoot, slug);
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(path.join(dir, "index.mdx"), source);
}

function audit(paths) {
	return auditPublicationIntegrity({
		repoRoot: paths.root,
		projectsRoot: paths.projectsRoot,
		canonRoot: paths.canonRoot,
		evidenceRoot: paths.evidenceRoot,
		evidenceRegistry: path.join(paths.evidenceRoot, "registry", "evidence.jsonl"),
		checkCompetency: false,
	});
}

test("thin or instrument-free pages are not readiness-gated", (t) => {
	const paths = fixture();
	t.after(() => fs.rmSync(paths.root, { recursive: true, force: true }));
	writeProject(
		paths.projectsRoot,
		"honest-lite",
		"---\ntitle: Honest lite\ntier: lite\n---\nShort and honest.\n",
	);
	assert.deepEqual(audit(paths).errors, []);
});

test("demonstrably invalid public state is build-blocking", (t) => {
	const paths = fixture();
	t.after(() => fs.rmSync(paths.root, { recursive: true, force: true }));
	writeProject(
		paths.projectsRoot,
		"broken",
		"---\ntitle: Broken\nduration: Active\nteamSize: Unknown\n---\n::: leaked\nNeilArmstrong.glb\nTBD\n",
	);
	const reasons = audit(paths).errors.map((error) => error.why);
	assert(reasons.some((reason) => reason.includes("false claim")));
	assert(reasons.some((reason) => reason.includes("not a team size")));
	assert(reasons.some((reason) => reason.includes("directive fence")));
	assert(reasons.some((reason) => reason.includes("demo spacesuit")));
	assert(reasons.some((reason) => reason.includes("placeholder text")));
});

test("unparseable project frontmatter is build-blocking", (t) => {
	const paths = fixture();
	t.after(() => fs.rmSync(paths.root, { recursive: true, force: true }));
	writeProject(paths.projectsRoot, "bad-yaml", "---\ntitle: [\n---\nbody\n");
	assert(audit(paths).errors.some((error) => error.why.startsWith("unparseable frontmatter")));
});

test("evidence IDs and SHA-256 are integrity plumbing for every canon tier", (t) => {
	const paths = fixture();
	t.after(() => fs.rmSync(paths.root, { recursive: true, force: true }));
	writeProject(paths.projectsRoot, "lite-with-source", "---\ntitle: Lite\ntier: lite\n---\nBody\n");
	const evidenceFile = path.join(paths.evidenceRoot, "docs", "source.txt");
	fs.mkdirSync(path.dirname(evidenceFile), { recursive: true });
	fs.writeFileSync(evidenceFile, "verified bytes");
	const sha256 = crypto.createHash("sha256").update(fs.readFileSync(evidenceFile)).digest("hex");
	const registry = path.join(paths.evidenceRoot, "registry", "evidence.jsonl");
	fs.mkdirSync(path.dirname(registry), { recursive: true });
	fs.writeFileSync(
		registry,
		JSON.stringify({ id: "source-1", path: "docs/source.txt", sha256 }) + "\n",
	);
	const canonDir = path.join(paths.canonRoot, "entities", "projects", "lite-with-source");
	fs.mkdirSync(canonDir, { recursive: true });
	fs.writeFileSync(
		path.join(canonDir, "lite-with-source.md"),
		"---\ntitle: Lite\ntier: lite\nsources:\n  - evidence:source-1\n---\nBody\n",
	);
	assert.deepEqual(audit(paths).errors, []);

	fs.writeFileSync(evidenceFile, "drifted bytes");
	assert(audit(paths).errors.some((error) => error.why.includes("evidence hash mismatch")));
});
