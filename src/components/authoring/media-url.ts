export interface AuthoringMediaItem {
	kind: "image" | "video";
	src: string;
	thumbnailSrc?: string;
	displaySrc?: string;
	zoomSrc?: string;
	originalSrc?: string;
	alt: string;
}

/** Published variants are explicit. Only the private preview needs width queries. */
export function mediaUrl(
	item: AuthoringMediaItem,
	variant: "thumbnail" | "display" | "zoom" | "original",
	width?: number,
): string {
	const explicit = item[`${variant}Src`];
	if (explicit) return explicit;
	if (item.kind === "video") return item.src;
	const separator = item.src.includes("?") ? "&" : "?";
	if (variant === "original") return `${item.src}${separator}original=1`;
	const defaultWidth = { thumbnail: 240, display: 1600, zoom: 3000 }[variant];
	return `${item.src}${separator}w=${width ?? defaultWidth}`;
}
