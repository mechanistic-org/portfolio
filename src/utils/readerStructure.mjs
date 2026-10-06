/** Structure is authored in canon. Closed investigations retain their complete HTML. */
export function collectWorkbenchPieces(pieces, { fail, publicAsset }) {
	const result = [];
	let active = null;
	const ids = new Set(
		pieces.flatMap((p) =>
			p.group
				? [`media-${p.group.id}`]
				: [...(p.html || "").matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]),
		),
	);
	const append = (piece) => (active ? active.pieces : result).push(piece);
	for (const piece of pieces) {
		if (!piece.html) {
			append(piece);
			continue;
		}
		const marker = /<!--\s*(workbench\s+(\{[^\n]*\})|\/workbench)\s*-->/g;
		let cursor = 0;
		for (const match of piece.html.matchAll(marker)) {
			if (match.index > cursor) append({ html: piece.html.slice(cursor, match.index) });
			if (match[1] === "/workbench") {
				if (!active) fail("Workbench close without an opening");
				if (!active.pieces.some((p) => p.group || p.html?.trim())) fail("Empty workbench");
				active = null;
			} else {
				if (active) fail("Nested workbenches are not supported");
				let definition;
				try {
					definition = JSON.parse(match[2]);
				} catch {
					fail("Invalid workbench JSON");
				}
				const { id, title, summary, poster, alt } = definition;
				if (!/^workbench-[a-z0-9-]+$/.test(id) || ids.has(id))
					fail("Invalid or duplicate workbench ID");
				if ([title, summary, alt].some((v) => typeof v !== "string" || !v.trim()))
					fail("Incomplete workbench");
				ids.add(id);
				active = {
					id,
					title,
					summary,
					alt,
					poster: publicAsset(poster, `${id}.poster`),
					pieces: [],
				};
				result.push({ workbench: active });
			}
			cursor = match.index + match[0].length;
		}
		if (cursor < piece.html.length) append({ html: piece.html.slice(cursor) });
	}
	if (active) fail("Unclosed workbench");
	if (
		JSON.stringify(result).includes("<!-- workbench") ||
		JSON.stringify(result).includes("<!-- /workbench")
	)
		fail("Malformed workbench marker");
	return result;
}

/** Chapter, subsection and workbench anchors in reading order, including hidden bodies. */
export function readerOutline(pieces) {
	const chapters = [];
	let chapter;
	let depth = 2;
	const plain = (value) => value.replace(/<[^>]*>/g, "").replaceAll("&amp;", "&");
	const add = (id, text, level, workbench = "") => {
		if (level === 2) {
			chapter = { id, text, children: [] };
			chapters.push(chapter);
		} else if (chapter) chapter.children.push({ id, text, depth: level, workbench });
	};
	const visit = (list, parent = "") => {
		for (const piece of list) {
			if (piece.html)
				for (const match of piece.html.matchAll(/<h([234]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)) {
					depth = Number(match[1]);
					add(match[2], plain(match[3]), depth, parent);
				}
			if (piece.workbench) {
				const w = piece.workbench;
				const oldDepth = depth;
				w.headingDepth = Math.min(4, depth + 1);
				add(w.id, w.title, w.headingDepth, w.id);
				depth = w.headingDepth;
				visit(w.pieces, w.id);
				depth = oldDepth;
			}
			if (piece.group?.title) {
				const g = piece.group;
				g.headingDepth = Math.min(5, depth + 1);
				// Internal galleries belong to their investigation, not a second outline tree.
				if (!parent) add(`media-${g.id}`, g.title, g.headingDepth);
			}
		}
	};
	visit(pieces);
	return chapters;
}
