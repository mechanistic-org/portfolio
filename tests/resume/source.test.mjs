import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
	sourceIdentity,
	assertPortAvailable,
	verifySource,
	startResumeSource,
} from "../../scripts/resume_source.mjs";
import { generatePDF } from "../../scripts/generate_resume_pdf.cjs";
const root = process.cwd(),
	revision = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
test("source identity records the exact checkout/revision/input hashes and rejects wrong revision", () => {
	const identity = sourceIdentity(root, revision, true);
	assert.equal(identity.root, fs.realpathSync(root));
	assert.equal(identity.revision, revision);
	assert.ok(identity.inputs["src/pages/resume/index.astro"]);
	assert.throws(() => sourceIdentity(root, "0".repeat(40), true), /revision mismatch/);
});
test("occupied or mismatched local endpoint fails and writes no PDF candidate", async () => {
	const server = http.createServer((req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ root, revision, inputsSha256: "wrong", nonce: "wrong" }));
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const port = server.address().port,
		dir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-pdf-test-")),
		output = path.join(dir, "candidate.pdf");
	try {
		await assert.rejects(assertPortAvailable(port), /occupied/);
		await assert.rejects(
			verifySource(`http://127.0.0.1:${port}`, {
				root,
				revision,
				inputsSha256: "correct",
				nonce: "correct",
			}),
			/Mismatched/,
		);
		await assert.rejects(startResumeSource({ root, revision, port, allowDirty: true }), /occupied/);
		await assert.rejects(
			generatePDF({ root, revision, port, output, allowDirty: true }),
			/occupied/,
		);
		assert.equal(fs.readdirSync(dir).length, 0);
	} finally {
		await new Promise((resolve) => server.close(resolve));
		fs.rmSync(dir, { recursive: true, force: true });
	}
});
test("PDF preparation requires explicit locations and revision", async () => {
	await assert.rejects(generatePDF({}), /Explicit/);
});
