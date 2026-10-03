import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import matter from "gray-matter";
import { buildAuthoredProject } from "../../src/utils/authoredProject.mjs";
import { selectProjectOpening } from "../../src/utils/projectOpening.mjs";
import { synopsisOpening } from "../../src/lib/project-synopsis.mjs";
const source = matter(
	fs.readFileSync(
		new URL("../../src/content/projects/avegant-glyph/index.mdx", import.meta.url),
		"utf8",
	),
);
const page = await buildAuthoredProject({
	id: "avegant-glyph",
	data: source.data,
	body: source.content,
});
test("Glyph opening uses canon synopsis and independent hero; all article evidence remains available", () => {
	const before = structuredClone(page);
	const opening = synopsisOpening(page);
	assert.deepEqual(page, before);
	assert.equal(opening.blocks.length, 3);
	assert.equal(opening.image, page.image);
	assert.equal(opening.pieces, page.pieces);
	assert.equal(page.imageCount, 83);
	assert.equal(page.videoCount, 8);
	assert.equal(
		page.groups.some((g) => g.id === "figure-1"),
		false,
	);
	assert.equal(
		page.headings.filter((h) => h.depth === 2 && h.slug !== "development-timeline").length,
		9,
	);
});
test("unmigrated records preserve their existing pieces and explicit legacy selection", () => {
	const html = "First sentence. Second sentence.";
	const pieces = [
		{ html: `<p>${html}</p>` },
		{ group: { id: "hero", items: [{ kind: "image" }] } },
	];
	assert.deepEqual(selectProjectOpening(pieces), { opening: null, pieces });
	const selection = {
		paragraphSha256: createHash("sha256").update(html).digest("hex"),
		splitBefore: ["Second sentence."],
		mediaGroupId: "hero",
	};
	const result = selectProjectOpening(pieces, selection);
	assert.equal(result.opening.blocks.length, 2);
	assert.throws(
		() => selectProjectOpening([...pieces, pieces[0]], selection),
		/expected one approved paragraph/,
	);
	assert.throws(() => selectProjectOpening([pieces[0]], selection), /media group/);
});
