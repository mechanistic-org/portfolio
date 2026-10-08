import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import matter from "gray-matter";
import { projectApiRecord } from "../../src/lib/project-api.mjs";
import { synopsisText } from "../../src/lib/project-synopsis.mjs";

const project = () => ({
	id: "example",
	data: {
		title: "Example",
		description: "Compact card text.",
		date: "2015-01-01",
		forensic_summary: { result: "Legacy result.", objective: "Legacy objective." },
		forensic_metrics: [{ value: "20", label: "test units" }],
		synopsis: {
			version: 1,
			roleId: "role-one",
			paragraphs: [
				{ id: "product", text: "I owned mechanical production." },
				{ id: "work", text: "I evaluated 20 test units." },
			],
			outputs: { resume: ["work"] },
		},
	},
});
const serialize = (entry) =>
	JSON.parse(JSON.stringify(projectApiRecord(entry, "https://eriknorris.com")));

test("API uses the complete current synopsis without leaking career selection or reviving legacy summary", () => {
	const entry = project();
	const output = serialize(entry);
	assert.equal(output.summary, "I owned mechanical production.\n\nI evaluated 20 test units.");
	assert.equal(output.description, entry.data.description);
	assert.deepEqual(output.synopsis.paragraphs, entry.data.synopsis.paragraphs);
	assert.ok(!("forensic_summary" in output));
	assert.ok(!("roleId" in output.synopsis));
	assert.ok(!("outputs" in output.synopsis));
	assert.deepEqual(output.forensic_metrics, entry.data.forensic_metrics);
	assert.equal(output.url, "https://eriknorris.com/projects/example/");
	assert.equal(output.start, "2015-01-01");
});

test("legacy projects retain forensic fields and compact-description fallback", () => {
	const entry = project();
	delete entry.data.synopsis;
	assert.equal(serialize(entry).summary, "Legacy result.");
	assert.deepEqual(serialize(entry).forensic_summary, entry.data.forensic_summary);
	delete entry.data.forensic_summary.result;
	assert.equal(serialize(entry).summary, "Legacy objective.");
	entry.data.forensic_summary.result = "";
	assert.equal(serialize(entry).summary, "Legacy objective.");
	delete entry.data.forensic_summary;
	assert.equal(serialize(entry).summary, entry.data.description);
	assert.ok(!("synopsis" in serialize(entry)));
});

test("baseline Glyph API projection retains every synopsis paragraph without editing its record", () => {
	const entry = matter(
		fs.readFileSync(
			new URL("../../src/content/projects/avegant-glyph/index.mdx", import.meta.url),
			"utf8",
		),
	);
	const output = serialize({ id: "avegant-glyph", data: entry.data });
	assert.equal(output.summary, synopsisText(entry.data.synopsis));
	assert.deepEqual(output.synopsis.paragraphs, entry.data.synopsis.paragraphs);
	assert.ok(!("forensic_summary" in output));
});
