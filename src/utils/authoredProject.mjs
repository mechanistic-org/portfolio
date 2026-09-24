import { Marked } from "marked";

const GROUP_ID = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
const GROUP_MARKER = /<div\s+data-authoring-group=(["'])([a-zA-Z][a-zA-Z0-9_-]*)\1\s*>\s*<\/div>/g;
const EVIDENCE_COMMENT = /\{\/\*\s*\^\[evidence:(?:EV-[a-f0-9]{12}|LK-[a-f0-9]+)\]\s*\*\/\}/gi;
const IMAGE_FIELDS = ["src", "thumbnailSrc", "displaySrc", "zoomSrc", "originalSrc"];

const escapeAttribute = (value) =>
	value.replace(
		/[&<>"']/g,
		(character) =>
			({
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#39;",
			})[character],
	);

function headingText(html) {
	return html.replace(/<[^>]*>/g, "").replace(
		/&(?:amp|lt|gt|quot|#39);/g,
		(entity) =>
			({
				"&amp;": "&",
				"&lt;": "<",
				"&gt;": ">",
				"&quot;": '"',
				"&#39;": "'",
			})[entity],
	);
}

/** Build the public reader exclusively from the validated Astro entry. No local evidence IO. */
export async function buildAuthoredProject(entry) {
	const project = entry?.id;
	const fail = (message) => {
		throw new Error(`[authored project ${project || "unknown"}] ${message}`);
	};
	if (typeof project !== "string" || !project.trim()) fail("Missing project ID");
	if (entry?.data?.cyberspace?.layout !== "authored") fail("Expected cyberspace.layout authored");
	if (typeof entry.body !== "string" || !entry.body.trim()) fail("Missing authored Markdown body");
	const data = entry.data;
	if (typeof data.title !== "string" || !data.title.trim()) fail("Missing project title");
	if (typeof data.description !== "string" || !data.description.trim())
		fail("Missing project description");
	const stickies = data.cyberspace.stickies;
	if (!Array.isArray(stickies) || !stickies.length) fail("Expected nonempty gallery stickies");

	function publicAsset(value, label, kind = "image") {
		if (typeof value !== "string" || !value || value !== value.trim() || /[\\\s]/.test(value)) {
			fail(`Invalid public media URL: ${label}`);
		}
		let url;
		try {
			url = new URL(value);
		} catch {
			fail(`Invalid public media URL: ${label}`);
		}
		if (
			url.protocol !== "https:" ||
			url.hostname !== "assets.eriknorris.com" ||
			url.port ||
			url.username ||
			url.password ||
			url.search ||
			url.hash ||
			url.pathname.includes("/_authoring-media/")
		) {
			fail(
				`Public media must use assets.eriknorris.com without credentials, query, or fragment: ${label}`,
			);
		}
		const extension = kind === "video" ? /\.mp4$/i : /\.(?:webp|jpe?g|png|avif|gif|svg)$/i;
		if (!extension.test(url.pathname)) fail(`Invalid ${kind} asset extension: ${label}`);
		return value;
	}

	const groupIds = new Set();
	const uniqueMedia = new Map();
	const groups = stickies.map((sticky, groupIndex) => {
		if (!sticky || typeof sticky !== "object") fail(`Invalid gallery at index ${groupIndex}`);
		const { id, title, type } = sticky;
		if (typeof id !== "string" || !GROUP_ID.test(id))
			fail(`Invalid gallery ID at index ${groupIndex}`);
		if (groupIds.has(id)) fail(`Duplicate gallery ID: ${id}`);
		groupIds.add(id);
		if (type !== "gallery") fail(`Expected gallery type: ${id}`);
		if (typeof title !== "string") fail(`Invalid gallery title: ${id}`);
		const definition = sticky.data;
		if (!definition || !Array.isArray(definition.items) || !definition.items.length) {
			fail(`Gallery must contain media: ${id}`);
		}
		if (definition.mode !== undefined && typeof definition.mode !== "string")
			fail(`Invalid gallery mode: ${id}`);
		if (definition.summary !== undefined && typeof definition.summary !== "string")
			fail(`Invalid gallery summary: ${id}`);
		const items = definition.items.map((item, itemIndex) => {
			const label = `${id}[${itemIndex}]`;
			if (!item || !["image", "video"].includes(item.kind)) fail(`Invalid media kind: ${label}`);
			if (typeof item.alt !== "string" || !item.alt.trim())
				fail(`Missing media alt text: ${label}`);
			if (typeof item.caption !== "string") fail(`Invalid media caption: ${label}`);
			const result = {
				kind: item.kind,
				src: publicAsset(item.src, `${label}.src`, item.kind),
				alt: item.alt,
				caption: item.caption,
			};
			if (item.kind === "image") {
				for (const field of IMAGE_FIELDS.slice(1))
					result[field] = publicAsset(item[field], `${label}.${field}`);
			}
			if (uniqueMedia.has(result.src) && uniqueMedia.get(result.src) !== result.kind) {
				fail(`Conflicting media kinds for ${result.src}`);
			}
			uniqueMedia.set(result.src, result.kind);
			return result;
		});
		if (items.some((item) => item.kind !== items[0].kind))
			fail(`Gallery mixes image and video media: ${id}`);
		const compare = definition.compare ?? [0, items.length > 1 ? 1 : 0];
		if (
			!Array.isArray(compare) ||
			compare.length !== 2 ||
			compare.some((index) => !Number.isInteger(index) || index < 0 || index >= items.length)
		) {
			fail(`Invalid comparison indices: ${id}`);
		}
		return {
			id,
			title,
			mode: definition.mode || "gallery",
			summary: definition.summary || "",
			compare: [...compare],
			items,
		};
	});
	const image = publicAsset(data.heroImage, "heroImage");
	const body = entry.body.replace(EVIDENCE_COMMENT, "");
	const markerCounts = new Map();
	for (const match of body.matchAll(GROUP_MARKER)) {
		const id = match[2];
		if (!groupIds.has(id)) fail(`Unknown gallery marker: ${id}`);
		markerCounts.set(id, (markerCounts.get(id) || 0) + 1);
	}
	for (const id of groupIds) {
		if (markerCounts.get(id) !== 1)
			fail(`Expected exactly one gallery marker for ${id}; found ${markerCounts.get(id) || 0}`);
	}
	if (body.replace(GROUP_MARKER, "").includes("data-authoring-group"))
		fail("Malformed gallery marker");

	const headings = [];
	const anchorIds = new Set(groups.map((group) => `media-${group.id}`));
	const parser = new Marked();
	parser.use({
		renderer: {
			heading({ tokens, depth }) {
				const html = this.parser.parseInline(tokens);
				const text = headingText(html);
				const base =
					text
						.toLowerCase()
						.normalize("NFKD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/[^a-z0-9\s-]/g, "")
						.trim()
						.replace(/\s+/g, "-") || "section";
				let slug = base;
				for (let suffix = 2; anchorIds.has(slug); suffix += 1) slug = `${base}-${suffix}`;
				anchorIds.add(slug);
				headings.push({ depth, slug, text });
				return `<h${depth} id="${escapeAttribute(slug)}">${html}</h${depth}>\n`;
			},
		},
	});
	const html = await parser.parse(body);
	const byId = new Map(groups.map((group) => [group.id, group]));
	const pieces = [];
	const renderedIds = new Set();
	let cursor = 0;
	for (const match of html.matchAll(GROUP_MARKER)) {
		if (match.index > cursor) pieces.push({ html: html.slice(cursor, match.index) });
		const id = match[2];
		if (renderedIds.has(id) || !byId.has(id)) fail(`Invalid rendered gallery marker: ${id}`);
		renderedIds.add(id);
		pieces.push({ group: byId.get(id) });
		cursor = match.index + match[0].length;
	}
	if (cursor < html.length) pieces.push({ html: html.slice(cursor) });
	if (renderedIds.size !== groups.length)
		fail("Gallery markers must be standalone HTML outside code blocks");
	const kinds = [...uniqueMedia.values()];
	return {
		public: true,
		project,
		title: data.title,
		description: data.description,
		image,
		frontmatter: data,
		pieces,
		headings,
		groups,
		footnotes: [],
		imageCount: kinds.filter((kind) => kind === "image").length,
		videoCount: kinds.filter((kind) => kind === "video").length,
		galleryCount: groups.length,
	};
}
