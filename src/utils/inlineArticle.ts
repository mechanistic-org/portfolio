/** Split rendered, trusted article HTML at explicit heading anchors. Never rewrite prose. */
export function splitInlineArticle<T extends { beforeId: string }>(html: string, inserts: T[]) {
	const ordered = inserts
		.map((insert) => {
			const id = insert.beforeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			const heading = new RegExp(`<h[23]\\b[^>]*\\bid="${id}"[^>]*>`).exec(html);
			if (!heading) throw new Error(`Inline media: heading ${insert.beforeId} not found`);
			return { insert, offset: heading.index };
		})
		.sort((a, b) => a.offset - b.offset);
	let cursor = 0;
	const pieces = ordered.map(({ insert, offset }) => {
		const piece = { html: html.slice(cursor, offset), insert };
		cursor = offset;
		return piece;
	});
	return { pieces, tail: html.slice(cursor) };
}
