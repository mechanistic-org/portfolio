import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProjectReader } from "../../src/utils/projectReader.ts";

const html =
	'<h1 id="alias">Product</h1><p>Lead &amp; role.</p><h2 id="one">One</h2><p>Design.</p><h2 id="two">Two</h2><p>Unknown outcome.</p>';
const headings = [
	{ depth: 2, slug: "one", text: "One" },
	{ depth: 2, slug: "two", text: "Two" },
];
const gallery = (id) => ({
	id,
	type: "gallery",
	title: id,
	caption: `${id} summary`,
	data: { images: [{ src: `/assets/${id}.webp`, alt: `${id} alt`, caption: `${id} caption` }] },
});
const entry = {
	id: "example",
	data: { title: "Product", cyberspace: { stickies: [gallery("a"), gallery("b")] } },
};
const config = {
	sections: { design: "one", result: "two" },
	media: { image: { galleryId: "a", src: "/assets/a.webp" } },
	scenes: [{ key: "design", eyebrow: "Design", left: { kind: "none" }, media: ["image"] }],
};

test("the shared reader conserves exact prose, anchors, assets, captions and unmatched galleries", () => {
	const original = structuredClone(entry);
	const page = buildProjectReader(entry, html, headings, config);
	assert.deepEqual(entry, original);
	assert.equal(
		page.pieces.map((p) => p.html ?? "").join(""),
		html
			.replace('<h1 id="alias">', '<p id="alias" data-project-body-title>')
			.replace("</h1>", "</p>"),
	);
	assert.deepEqual(
		page.pieces.filter((p) => p.group).map((p) => p.group.id),
		["a", "b"],
	);
	assert.equal(page.pieces[0].html.endsWith("<p>Design.</p>"), true);
	assert.equal(page.pieces.at(-1).group.id, "b");
	assert.equal(page.imageCount, 2);
	assert.equal(page.groups[0].items[0].caption, "a caption");
	assert.equal(page.groups[0].items[0].zoomSrc, "/assets/a.webp");
});

test("explicit gallery placements prevail and drift fails closed", () => {
	const explicit = {
		...config,
		inlineGalleries: [
			{ galleryId: "b", before: "design" },
			{ galleryId: "a", before: "result" },
		],
	};
	const page = buildProjectReader(entry, html, headings, explicit);
	assert.deepEqual(
		page.pieces.filter((p) => p.group).map((p) => p.group.id),
		["b", "a"],
	);
	assert.throws(
		() =>
			buildProjectReader(entry, html, headings, {
				...explicit,
				inlineGalleries: explicit.inlineGalleries.slice(0, 1),
			}),
		/every gallery exactly once/,
	);
	assert.throws(
		() => buildProjectReader(entry, html.replace('id="two"', 'id="changed"'), headings, explicit),
		/heading two not found/,
	);
});

test("no presentation means all existing media remain available without invented placement", () => {
	const page = buildProjectReader(entry, html, headings);
	assert.equal(page.pieces[0].html.includes("Unknown outcome."), true);
	assert.deepEqual(
		page.pieces.slice(1).map((p) => p.group.id),
		["a", "b"],
	);
	assert.equal(page.chronology, undefined);
});

test("explicitly disabled models stay disabled, enabled models retain placement and camera", () => {
	const withModel = structuredClone(entry);
	withModel.data.cyberspace.stickies.push({
		id: "model",
		type: "model",
		data: { modelSrc: "/assets/model.glb" },
	});
	assert.equal(
		buildProjectReader(withModel, html, headings, { ...config, models: [] }).pieces.some(
			(p) => p.model,
		),
		false,
	);
	const page = buildProjectReader(withModel, html, headings, {
		...config,
		models: ["model"],
		modelPlacement: { model: { before: "result", cameraOrbit: "30deg 60deg 100%" } },
	});
	assert.equal(page.pieces.find((p) => p.model).model.cameraOrbit, "30deg 60deg 100%");
	assert.equal(page.pieces.filter((p) => p.model).length, 1);
});
