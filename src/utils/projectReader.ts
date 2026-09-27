import { normalizeProjectBody, splitInlineArticle } from "./inlineArticle.ts";
import {
	resolveProjectPresentation,
	type Gallery,
	type ProjectPresentation,
} from "./projectPresentation.ts";

type Heading = { depth: number; slug: string; text: string };
type Piece = { html?: string; group?: ReturnType<typeof readerGroup>; model?: any };

/** Adapt existing gallery data without choosing new assets or manufacturing derivatives. */
function readerGroup(gallery: Gallery) {
	return {
		id: gallery.id,
		title: gallery.title,
		summary: gallery.caption,
		items: gallery.data.images!.map((image) => ({
			...image,
			kind: "image",
			alt: image.alt || gallery.title || "Project photograph",
			thumbnailSrc: image.src,
			displaySrc: image.src,
			zoomSrc: image.src,
			originalSrc: image.src,
		})),
	};
}

/** Legacy MDX and authored accounts feed the same reader; content remains canon-owned. */
export function buildProjectReader(
	entry: { id: string; data: Record<string, any> },
	html: string,
	headings: Heading[],
	presentation?: ProjectPresentation,
) {
	const d = entry.data;
	const galleries: Gallery[] = (d.cyberspace?.stickies ?? []).filter(
		(s: any) => s?.type === "gallery" && s.data?.images?.length,
	);
	if (new Set(galleries.map((g) => g.id)).size !== galleries.length)
		throw new Error("Reader gallery IDs must be unique");
	const resolved = presentation
		? resolveProjectPresentation(presentation, { ...d, title: d.title }, headings, galleries)
		: undefined;
	const groups = (resolved?.galleries ?? galleries).map(readerGroup);
	const placements = presentation?.inlineGalleries;
	if (
		placements &&
		(new Set(placements.map((p) => p.galleryId)).size !== placements.length ||
			groups.some((g) => !placements.some((p) => p.galleryId === g.id)) ||
			placements.some((p) => !groups.some((g) => g.id === p.galleryId)))
	)
		throw new Error("Inline media must place every gallery exactly once");

	const inserts: { beforeId: string; piece: Piece }[] = [];
	const trailing: Piece[] = [];
	for (const group of groups) {
		const explicit = placements?.find((p) => p.galleryId === group.id);
		// An existing rail association becomes an inline figure after that section.
		// Unassociated galleries stay at the end; do not invent a story relationship.
		const scene = presentation?.scenes.find((s) =>
			s.media.some((key) => presentation.media[key]?.galleryId === group.id),
		);
		const sceneId = scene && presentation?.sections[scene.key];
		const index = headings.findIndex((h) => h.slug === sceneId);
		const following =
			index >= 0
				? headings.slice(index + 1).find((h) => h.depth <= headings[index].depth)
				: undefined;
		const beforeId = explicit ? presentation!.sections[explicit.before] : following?.slug;
		if (explicit && !beforeId) throw new Error(`Missing inline section ${explicit.before}`);
		if (beforeId) inserts.push({ beforeId, piece: { group } });
		else trailing.push({ group });
	}
	for (const model of resolved?.models ?? []) {
		if (model.beforeId) inserts.push({ beforeId: model.beforeId, piece: { model } });
		else trailing.push({ model });
	}
	const split = splitInlineArticle(normalizeProjectBody(html), inserts);
	const pieces: Piece[] = split.pieces.flatMap(({ html, insert }) => [{ html }, insert.piece]);
	pieces.push({ html: split.tail }, ...trailing);
	return {
		public: true,
		project: entry.id,
		title: d.title,
		description: d.description,
		image: d.heroImage,
		frontmatter: { title: d.title, description: d.description, tags: d.tags },
		pieces,
		headings,
		groups,
		imageCount: groups.reduce((count, g) => count + g.items.length, 0),
		footnotes: [],
	};
}
