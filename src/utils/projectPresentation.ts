/** Presentation references are independent of prose, alt text, and content custody. */
export interface Heading {
	depth: number;
	slug: string;
	text: string;
}
export interface GalleryImage {
	src: string;
	alt?: string;
	caption?: string;
}
export interface Gallery {
	id: string;
	title?: string;
	caption?: string;
	deck?: { body?: string }[];
	data: { images?: GalleryImage[]; columns?: number };
}
export type MetricKey = "financial" | "process" | "governance";
export type RailContent =
	| { kind: "metrics"; keys: MetricKey[] }
	| { kind: "product" | "scar-index" | "context" | "sources" | "none" }
	| { kind: "scar"; section?: string; unanchored?: true };
export interface SceneSpec {
	key: string;
	parent?: string;
	eyebrow: string;
	title?: string;
	left: RailContent;
	media: string[];
	mediaLabel?: string;
	portalStudy?: boolean;
}
export interface ProjectPresentation {
	sections: Record<string, string>;
	media: Record<string, { galleryId: string; src: string }>;
	/** Reuse reviewed gallery-card copy where the older record has no caption. */
	galleryCaptionsFromDeck?: string[];
	/** Existing model sticky IDs to preserve when changing the article renderer. */
	models?: string[];
	scenes: SceneSpec[];
	featured?: {
		media?: string;
		hero?: true;
		section: string;
		label: string;
		detail: string;
		layout: "system" | "intervention" | "record";
	}[];
	breakout?: { eyebrow: string; description: string };
}
export interface ResolvedScene extends Omit<SceneSpec, "left" | "media"> {
	id: string;
	parentId: string;
	title: string;
	left: RailContent & { anchor?: string };
	media: (GalleryImage & { galleryTitle?: string; galleryCaption?: string })[];
	showLeft: boolean;
	showRight: boolean;
}
export interface PresentationData {
	title: string;
	heroImage?: string;
	scars?: { anchor?: string }[];
	forensic_metrics?: Partial<Record<MetricKey, string>>;
	bom?: unknown[];
	teamSize?: unknown;
	production?: unknown;
	productionScale?: unknown;
	audio_url?: string;
	nlm_url?: string;
	notebook_url?: string;
	cyberspace?: {
		stickies?: {
			id: string;
			type?: string;
			title?: string;
			caption?: string;
			data?: { modelSrc?: string; cameraOrbit?: string; fieldOfView?: string };
		}[];
	};
}

export function resolveProjectPresentation(
	config: ProjectPresentation,
	data: PresentationData,
	headings: Heading[],
	galleries: Gallery[],
) {
	const fail = (message: string): never => {
		throw new Error(`[ProjectPresentation: ${data.title}] ${message}`);
	};
	const headingById = new Map(headings.map((h) => [h.slug, h]));
	const anchor = (key: string): string => {
		const value = config.sections[key];
		if (!value || !headingById.has(value))
			return fail(`Unresolved section key ${key}: ${value ?? "missing"}`);
		return value;
	};
	Object.keys(config.sections).forEach(anchor);
	const captionIds = new Set(config.galleryCaptionsFromDeck ?? []);
	for (const id of captionIds) {
		const gallery = galleries.find((g) => g.id === id);
		if (!gallery?.deck?.some((card) => card.body?.trim()))
			fail(`Gallery caption source ${id} has no card body`);
	}
	const presentationGalleries = galleries.map((gallery) =>
		captionIds.has(gallery.id)
			? {
					...gallery,
					caption:
						gallery.caption ||
						gallery
							.deck!.map((card) => card.body)
							.filter(Boolean)
							.join("\n\n"),
				}
			: gallery,
	);
	const media = new Map(
		Object.entries(config.media).map(([key, ref]) => {
			const gallery = presentationGalleries.find((g) => g.id === ref.galleryId);
			const matches = gallery?.data.images?.filter((image) => image.src === ref.src) ?? [];
			if (matches.length !== 1)
				return fail(`Media key ${key} must resolve exactly once in ${ref.galleryId}: ${ref.src}`);
			return [
				key,
				{ ...matches[0], galleryTitle: gallery?.title, galleryCaption: gallery?.caption },
			] as const;
		}),
	);
	const image = (key: string) => media.get(key) ?? fail(`Unknown media key ${key}`);
	const scars = data.scars ?? [];
	const references = [data.audio_url, data.nlm_url, data.notebook_url].filter(Boolean);
	const seen = new Set<string>();
	const scenes: ResolvedScene[] = config.scenes.map((scene) => {
		if (seen.has(scene.key)) return fail(`Duplicate scene key ${scene.key}`);
		seen.add(scene.key);
		const id = anchor(scene.key);
		const parentId = anchor(scene.parent ?? scene.key);
		const left = {
			...scene.left,
			anchor:
				scene.left.kind === "scar" && scene.left.section ? anchor(scene.left.section) : undefined,
		};
		const showLeft =
			left.kind === "metrics"
				? left.keys.some((key) => data.forensic_metrics?.[key])
				: left.kind === "scar"
					? scars.some((s) => (left.unanchored ? !s.anchor : s.anchor === left.anchor))
					: left.kind === "scar-index"
						? scars.length > 0
						: left.kind === "product"
							? !!data.bom?.length || scars.some((s) => !s.anchor)
							: left.kind === "context"
								? !!(data.teamSize || data.production || data.productionScale)
								: left.kind === "sources"
									? galleries.length > 0 || references.length > 0
									: false;
		return {
			...scene,
			id,
			parentId,
			title: scene.title ?? headingById.get(id)!.text,
			left,
			media: scene.media.map(image),
			showLeft,
			showRight: scene.media.length > 0 || (left.kind === "sources" && references.length > 0),
		};
	});
	const featured = (config.featured ?? []).map((item) => ({
		...item,
		href: `#${anchor(item.section)}`,
		className: `evidence-composition__${item.layout}`,
		image: item.hero
			? data.heroImage
				? { src: data.heroImage, alt: data.title }
				: fail("Configured hero image is missing")
			: image(item.media ?? ""),
	}));
	const models = (config.models ?? []).map((id) => {
		const matches =
			data.cyberspace?.stickies?.filter((item) => item.id === id && item.type === "model") ?? [];
		const model = matches[0];
		if (matches.length !== 1 || !model?.data?.modelSrc)
			return fail(`Model key ${id} must resolve exactly once with a source`);
		return {
			id,
			title: model.title || "Interactive model",
			caption: model.caption,
			src: model.data.modelSrc,
			cameraOrbit: model.data.cameraOrbit,
			fieldOfView: model.data.fieldOfView,
		};
	});
	return {
		scenes,
		featured,
		anchors: scenes.map((s) => s.id),
		breakout: config.breakout,
		galleries: presentationGalleries,
		models,
	};
}
