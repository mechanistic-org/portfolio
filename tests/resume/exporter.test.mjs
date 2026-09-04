import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resumeMaster } from "../../src/config/resume_master.ts";
import { linkedinMaster } from "../../src/config/linkedin_master.ts";
import { buildPacket, exportPacket, normalize, sha256 } from "../../scripts/export_linkedin.mjs";
test("exact packet repeats across writes and newline forms; receipt hashes bytes", () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-export-test-"));
	const originalFetch = globalThis.fetch;
	globalThis.fetch = () => {
		throw new Error("Exporter must not access network");
	};
	try {
		const first = exportPacket({ output: dir }),
			bytes = fs.readFileSync(path.join(dir, "linkedin.txt"));
		const second = exportPacket({ output: dir });
		assert.deepEqual(fs.readFileSync(path.join(dir, "linkedin.txt")), bytes);
		assert.deepEqual(second, first);
		assert.equal(first.packetSha256, sha256(bytes));
		assert.equal(first.entries, 12);
		assert.match(first.sourceRevision, /^[0-9a-f]{40}$/);
		assert.ok(first.inputs["scripts/export_linkedin.mjs"]);
		const text = bytes.toString("utf8");
		assert.ok(!text.includes("\r"));
		assert.ok(!text.includes("\u2014"));
		assert.ok(text.endsWith("\n") && !text.endsWith("\n\n"));
		assert.equal(text.normalize("NFC"), text);
		for (const entry of linkedinMaster.experience) assert.ok(text.includes(normalize(entry.blurb)));
		const windows = structuredClone(linkedinMaster);
		windows.about = windows.about.replace(/\n/g, "\r\n");
		windows.experience.forEach((e) => (e.blurb = e.blurb.replace(/\n/g, "\r\n")));
		assert.deepEqual(buildPacket(resumeMaster, windows), bytes);
	} finally {
		globalThis.fetch = originalFetch;
		fs.rmSync(dir, { recursive: true, force: true });
	}
});
for (const [name, mutate, pattern] of [
	["missing ID", (a, p) => (p.experience[0].roleId = ""), /Missing/],
	["duplicate ID", (a, p) => (p.experience[1].roleId = p.experience[0].roleId), /duplicate/],
	["unmapped ID", (a, p) => (p.experience[0].roleId = "ghost"), /Unmapped/],
	["missing canonical role", (a) => a.career.pop(), /Unmapped/],
	["missing grouped resume mapping", (a) => a.experience[7].roleIds.pop(), /Unmapped/],
	["position join", (a, p) => p.experience.reverse(), /order/],
	["independent title", (a, p) => (p.experience[0].role = "Invented"), /Channel facts/],
	["title drift", (a) => (a.career[0].channels.linkedinTitle = "VP"), /drift/],
	["date drift", (a) => (a.career[0].period.start = "2023"), /drift/],
	["invented precision", (a) => (a.career[0].period.start = "2022-01-01"), /precision/],
	[
		"arbitrary new unsupported claim",
		(a, p) => (p.about += " I shipped a moon rocket."),
		/prose drift/,
	],
	["em dash", (a, p) => (p.about += "\u2014"), /em dash/],
	...[
		"The Challenge",
		"Key Achievements",
		"The Reality",
		"TIR",
		"Foundation Robotics",
		"walking humanoid",
		"actuator design",
		"direct reports",
		"hiring authority",
		"people management",
		"engineering degree",
	].map((text) => [text, (a, p) => (p.experience[0].blurb += text), /Forbidden/]),
])
	test(`export fails on ${name}`, () => {
		const a = structuredClone(resumeMaster),
			p = structuredClone(linkedinMaster);
		mutate(a, p);
		assert.throws(() => buildPacket(a, p), pattern);
	});

test("receipt cannot label module A data with checkout B inputs", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "resume-other-checkout-"));
	try {
		assert.throws(() => exportPacket({ root }), /checkout mismatch/);
		assert.deepEqual(fs.readdirSync(root), []);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});

test("receipt rejects disk inputs changed after module data was loaded", () => {
	const input = path.resolve("src/config/linkedin_master.ts"),
		bytes = fs.readFileSync(input);
	try {
		fs.appendFileSync(input, "\n// changed after module load\n");
		assert.throws(() => exportPacket(), /changed since module load/);
	} finally {
		fs.writeFileSync(input, bytes);
	}
});
