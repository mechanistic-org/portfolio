import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeProjectBody, splitInlineArticle } from "../../src/utils/inlineArticle.ts";

test("the generated body title keeps its text and deep link without a second identity heading", () => {
	assert.equal(
		normalizeProjectBody('<h1 id="curtis">C|24 <em>(Curtis)</em></h1><h2 id="one">One</h2>'),
		'<p id="curtis" data-project-body-title>C|24 <em>(Curtis)</em></p><h2 id="one">One</h2>',
	);
});

test("inline media preserves the exact article while ordering placements by heading", () => {
	const html =
		'<h1>Record</h1><p>Lead</p><h2 id="one">One</h2><p>Body</p><h3 id="two">Two</h3><p>End</p>';
	const { pieces, tail } = splitInlineArticle(html, [{ beforeId: "two" }, { beforeId: "one" }]);
	assert.deepEqual(
		pieces.map((p) => p.insert.beforeId),
		["one", "two"],
	);
	assert.equal(pieces.map((p) => p.html).join("") + tail, html);
	assert.equal(pieces[0].html, "<h1>Record</h1><p>Lead</p>");
});

test("a changed article anchor fails instead of silently losing a gallery", () => {
	assert.throws(
		() => splitInlineArticle('<p id="one">No heading</p>', [{ beforeId: "one" }]),
		/heading one not found/,
	);
	assert.throws(
		() => splitInlineArticle('<h2 id="axb">Heading</h2>', [{ beforeId: "a.b" }]),
		/not found/,
	);
});
