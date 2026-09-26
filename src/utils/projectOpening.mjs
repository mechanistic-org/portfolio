import { createHash } from "node:crypto";

// Private source notes do not change the selected public paragraph's identity.
// Keep their original nodes in the rendered blocks; omit them only from the digest.
const SOURCE_NOTE = /<sup><a\b[^>]*\bdata-note="[^"]+"[^>]*>[\s\S]*?<\/a><\/sup>/g;
const digest = (html) =>
	createHash("sha256")
		.update(html.replace(SOURCE_NOTE, "").replace(/\s+/g, " ").trim())
		.digest("hex");

function assertBalancedInlineHtml(html) {
	const stack = [];
	for (const tag of html.matchAll(/<(\/?)([a-z][a-z0-9]*)\b[^>]*>/gi)) {
		const name = tag[2].toLowerCase();
		if (["br", "wbr", "img"].includes(name) || tag[0].endsWith("/>")) continue;
		if (tag[1]) {
			if (stack.pop() !== name) throw new Error("[project opening] split crosses inline markup");
		} else stack.push(name);
	}
	if (stack.length) throw new Error("[project opening] split crosses inline markup");
}

/** Move one explicitly reviewed paragraph and image group without rewriting either.
 * Missing or changed selections fail the build rather than silently duplicating or dropping content.
 * The digest covers normalized rendered HTML, excluding private source-note nodes only.
 */
export function selectProjectOpening(pieces, selection) {
	if (!selection) return { opening: null, pieces };
	const fail = (message) => {
		throw new Error(`[project opening ${selection.mediaGroupId}] ${message}`);
	};
	const matches = [];
	for (const [index, piece] of pieces.entries()) {
		if (!piece.html) continue;
		for (const paragraph of piece.html.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
			if (digest(paragraph[1]) === selection.paragraphSha256) matches.push({ index, paragraph });
		}
	}
	if (matches.length !== 1) fail(`expected one approved paragraph, found ${matches.length}`);
	const media = pieces.filter((piece) => piece.group?.id === selection.mediaGroupId);
	if (media.length !== 1) fail(`expected one opening media group, found ${media.length}`);
	const group = media[0].group;
	if (group.items.length !== 1 || group.items[0].kind !== "image")
		fail("opening requires one image");
	if (!Array.isArray(selection.splitBefore) || selection.splitBefore.length !== 2) {
		fail("opening requires two paragraph breaks");
	}
	const { index, paragraph } = matches[0];
	const html = paragraph[1];
	const boundaries = [0];
	for (const marker of selection.splitBefore) {
		const offset = html.indexOf(marker);
		if (!marker || offset <= boundaries.at(-1) || html.indexOf(marker, offset + 1) !== -1) {
			fail("paragraph break is missing, repeated or out of order");
		}
		if (!/\s/.test(html[offset - 1])) fail("paragraph break must start after whitespace");
		boundaries.push(offset);
	}
	boundaries.push(html.length);
	const blocks = boundaries.slice(0, -1).map((start, i) => {
		const block = html.slice(start, boundaries[i + 1]).trim();
		assertBalancedInlineHtml(block);
		return block;
	});
	const remaining = pieces.flatMap((piece, i) => {
		if (piece === media[0]) return [];
		if (i !== index) return [piece];
		return [
			{
				...piece,
				html:
					piece.html.slice(0, paragraph.index) +
					piece.html.slice(paragraph.index + paragraph[0].length),
			},
		];
	});
	return { opening: { blocks, group }, pieces: remaining };
}
