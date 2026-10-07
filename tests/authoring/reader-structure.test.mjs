import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import matter from "gray-matter";
import { buildAuthoredProject } from "../../src/utils/authoredProject.mjs";
import { readerOutline } from "../../src/utils/readerStructure.mjs";
import { normalizeSpringStudy } from "../../src/utils/springStudy.mjs";
const source = matter(
	fs.readFileSync(
		new URL("../../src/content/projects/avegant-glyph/index.mdx", import.meta.url),
		"utf8",
	),
);
const build = (body = source.content, data = source.data) =>
	buildAuthoredProject({ id: "avegant-glyph", data, body });
test("investigations retain all selected media once and preserve narrative result outside the fold", async () => {
	const page = await build();
	const investigations = page.pieces.filter((p) => p.workbench).map((p) => p.workbench);
	assert.deepEqual(
		investigations.map((w) => w.id),
		[
			"workbench-optics",
			"workbench-headband",
			"workbench-fixtures",
			"workbench-fit",
			"workbench-earpads",
			"workbench-cables",
		],
	);
	const flatten = (pieces) =>
		pieces.flatMap((p) =>
			p.workbench ? flatten(p.workbench.pieces) : p.group ? [p.group.id] : [],
		);
	const ids = flatten(page.pieces);
	assert.equal(ids.length, page.groups.length);
	assert.equal(new Set(ids).size, ids.length);
	assert.equal(page.imageCount, 77);
	assert.equal(page.videoCount, 11);
	assert.ok(page.pieces.some((p) => p.html?.includes("Moving to a hot-runner setup")));
	const narrative = page.pieces
		.filter((p) => p.html)
		.map((p) => p.html)
		.join(" ");
	assert.match(narrative, /We chose the normal dotted surface/);
	assert.match(narrative, /mid-build/);
	assert.match(narrative, /950/);
	assert.match(narrative, /nineteen|19 assemblies/);
	assert.ok(
		investigations
			.find((w) => w.id === "workbench-fit")
			.pieces.some((p) => p.group?.id === "clamp-response"),
	);
	assert.ok(page.groups.every((g) => g.title.trim()));
	const optics = investigations[0].pieces.find((p) => p.group)?.group;
	assert.equal(optics.id, "optical-work");
	assert.match(optics.items[0].src, /img_2473/);
	const outline = readerOutline(page.pieces).filter((c) => c.id !== "development-timeline");
	assert.equal(outline.length, 9);
	assert.ok(outline[1].children.some((c) => c.id === "workbench-optics"));
	assert.ok(outline[2].children.some((c) => c.id === "workbench-headband"));
	assert.ok(page.groups.every((g) => g.headingDepth >= 3 && g.headingDepth <= 5));
});
test("malformed, nested and unbalanced investigations fail before render", async () => {
	await assert.rejects(build(source.content.replace("{/* /workbench */}", "")), /Nested|Unclosed/);
	await assert.rejects(build("<!-- /workbench -->\n" + source.content), /close without/);
	await assert.rejects(
		build(source.content.replace('"id":"workbench-headband"', '"id":"workbench-optics"')),
		/duplicate/,
	);
	await assert.rejects(
		build(
			source.content.replace(
				'"poster":"https://assets.eriknorris.com/avegant-glyph/page-annotations-2026-10-05/img_2473-1600.webp"',
				'"poster":"file:///private.jpg"',
			),
		),
		/public media|Public media/,
	);
});
test("spring response and coverage agree on specimens, widths, observations and means", async () => {
	const page = await build();
	const study = page.groups.find((g) => g.id === "clamp-response").study;
	assert.equal(study.assemblies, 19);
	assert.equal(study.measurements, 190);
	assert.deepEqual(
		study.groups.map((g) => g.n),
		[9, 6, 4],
	);
	assert.ok(Math.abs(study.groups[0].rows[5].mean - 11.655555555555555) < 1e-10);
	assert.ok(Math.abs(study.groups[1].rows[5].mean - 10.991666666666667) < 1e-10);
	assert.equal(study.groups[2].rows[5].mean, 9.6);
	const input = structuredClone(
		source.data.cyberspace.stickies.find((g) => g.id === "clamp-response").data.study,
	);
	input.rows[0].samples.pop();
	assert.throws(() => normalizeSpringStudy(input), /Invalid/);
});

test("headband sequence keeps every source piece once in order and retains all evidence groups", async () => {
	const { evidenceSteps } = await import("../../src/utils/evidenceSequence.mjs");
	const page = await build();
	const pieces = page.pieces.find((p) => p.workbench?.id === "workbench-headband").workbench.pieces;
	const steps = evidenceSteps(pieces);
	assert.equal(steps.length, 5);
	assert.deepEqual(
		steps.flatMap((s) => [...s.prose, { group: s.group }, ...(s.after || [])]),
		pieces,
	);
	assert.deepEqual(
		steps.map((s) => s.group.id),
		["headband-mold-flow", "knit-line-cracks", "figure-4", "figure-5", "figure-7"],
	);
});
