import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import matter from "gray-matter";
import { buildAuthoredProject } from "../../src/utils/authoredProject.mjs";
import { selectProjectOpening } from "../../src/utils/projectOpening.mjs";

const config = JSON.parse(
	fs.readFileSync(new URL("../../src/config/project-openings.json", import.meta.url)),
);
const selection = config["avegant-glyph"].selection;
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
const prose = (pieces) =>
	pieces
		.filter((piece) => piece.html)
		.map((piece) => piece.html)
		.join("");
const paragraph = [...prose(page.pieces).matchAll(/<p>([\s\S]*?)<\/p>/g)].find(
	(match) =>
		createHash("sha256").update(match[1].replace(/\s+/g, " ").trim()).digest("hex") ===
		selection.paragraphSha256,
)[0];

test("unselected accounts retain their exact pieces and no opening is inferred", () => {
	const pieces = [{ html: "<h2>Another account</h2><p>Keep this account.</p>" }];
	assert.deepEqual(selectProjectOpening(pieces), { opening: null, pieces });
	assert.equal(selectProjectOpening(pieces).pieces, pieces);
	assert.equal(config["cinema-one"], undefined);
	assert.equal(config.c24, undefined);
});

test("accepted public account moves the original paragraph and image once, retaining all other content", () => {
	const before = structuredClone(page);
	const result = selectProjectOpening(page.pieces, selection);
	assert.deepEqual(page, before);
	assert.equal(`<p>${result.opening.blocks.join(" ")}</p>`, paragraph);
	assert.deepEqual(
		result.opening.blocks.map((block) => (block.match(/\.(?: |$)/g) || []).length),
		[2, 1, 2],
	);
	assert.equal(prose(result.pieces), prose(page.pieces).replace(paragraph, ""));
	assert.equal(
		result.opening.group,
		page.pieces.find((piece) => piece.group?.id === "figure-1").group,
	);
	assert.deepEqual(
		result.pieces.filter((piece) => piece.group),
		page.pieces.filter((piece) => piece.group && piece.group.id !== "figure-1"),
	);
	assert.equal(page.imageCount, 74);
	assert.equal(page.videoCount, 2);
	assert.equal(page.headings.filter((heading) => heading.depth === 2).length, 8);
	assert.equal(result.pieces.filter((piece) => piece.group).length + 1, 26);
});

test("private weight source-note markup moves intact with sentence one", () => {
	const note =
		'<sup><a href="#note-weight" data-note="weight" aria-label="Source note: weight">↗</a></sup>';
	const pieces = page.pieces.map((piece) =>
		piece.html ? { html: piece.html.replace("headset. Lower", `headset.${note} Lower`) } : piece,
	);
	const result = selectProjectOpening(pieces, selection);
	assert.ok(result.opening.blocks[0].includes(`headset.${note} Lower`));
	assert.equal(
		result.opening.blocks.join(" "),
		paragraph.slice(3, -4).replace("headset. Lower", `headset.${note} Lower`),
	);
	assert.equal(prose(result.pieces).includes('data-note="weight"'), false);
});

test("changed or duplicated paragraphs fail instead of silently choosing new content", () => {
	assert.throws(
		() =>
			selectProjectOpening(
				page.pieces.map((piece) =>
					piece.html ? { html: piece.html.replace("434 g", "435 g") } : piece,
				),
				selection,
			),
		/approved paragraph, found 0/,
	);
	assert.throws(
		() => selectProjectOpening([...page.pieces, { html: paragraph }], selection),
		/approved paragraph, found 2/,
	);
});

test("missing, repeated or changed opening media fail without content loss", () => {
	const media = page.pieces.find((piece) => piece.group?.id === "figure-1");
	assert.throws(
		() =>
			selectProjectOpening(
				page.pieces.filter((piece) => piece !== media),
				selection,
			),
		/media group, found 0/,
	);
	assert.throws(
		() => selectProjectOpening([...page.pieces, media], selection),
		/media group, found 2/,
	);
	const changed = page.pieces.map((piece) =>
		piece === media ? { group: { ...media.group, items: [{ kind: "video" }] } } : piece,
	);
	assert.throws(() => selectProjectOpening(changed, selection), /requires one image/);
});

test("incorrect breaks and splits crossing inline markup fail closed", () => {
	assert.throws(
		() =>
			selectProjectOpening(page.pieces, {
				...selection,
				splitBefore: ["missing", selection.splitBefore[1]],
			}),
		/break is missing/,
	);
	assert.throws(
		() =>
			selectProjectOpening(page.pieces, {
				...selection,
				splitBefore: [...selection.splitBefore].reverse(),
			}),
		/out of order/,
	);
	const html = "First. <em>Second. Third.</em> Fourth.";
	const custom = {
		paragraphSha256: createHash("sha256").update(html).digest("hex"),
		splitBefore: ["Third.", "Fourth."],
		mediaGroupId: "test",
	};
	assert.throws(
		() =>
			selectProjectOpening(
				[{ html: `<p>${html}</p>` }, { group: { id: "test", items: [{ kind: "image" }] } }],
				custom,
			),
		/crosses inline markup/,
	);
});
