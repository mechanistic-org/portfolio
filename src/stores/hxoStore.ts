import { atom, computed } from "nanostores";

// Retained for the historical tour configuration; the homepage uses chronology.
export type HxoLens = "time" | "employer" | "category";
export type PreviewSource = "default" | "swarm";

export const previewId = atom<string | null>(null);
export const readingId = atom<string | null>(null);

export const focusId = computed([readingId], (currentReadingId) => currentReadingId);

export const viewerId = computed([readingId], (currentReadingId) => currentReadingId);

const activePreviews = new Map<PreviewSource, { id: string; order: number }>();
let previewOrder = 0;
let acquisitionTimer: ReturnType<typeof setTimeout> | undefined;

// Fast scans identify targets; a brief pause acquires a stable reading frame.
// Leaving the map cancels an unfinished acquisition, never the held frame.
export function acquire(id: string | null) {
	if (acquisitionTimer) clearTimeout(acquisitionTimer);
	readingId.set(id);
}

function syncPreview() {
	const nextPreview = [...activePreviews.values()].sort((a, b) => b.order - a.order)[0]?.id ?? null;
	if (previewId.get() === nextPreview) return;

	previewId.set(nextPreview);
	if (acquisitionTimer) clearTimeout(acquisitionTimer);
	if (nextPreview) acquisitionTimer = setTimeout(() => acquire(nextPreview), 160);
}

export function setPreview(id: string | null, source?: PreviewSource) {
	if (!source) {
		activePreviews.clear();
		if (id) activePreviews.set("default", { id, order: ++previewOrder });
	} else if (id) {
		activePreviews.set(source, { id, order: ++previewOrder });
	} else {
		activePreviews.delete(source);
	}

	syncPreview();
}

export function clearReading() {
	setPreview(null);
	readingId.set(null);
}

// Console Interaction Shield
export const isInsideConsole = atom<boolean>(false);

export function setConsoleHover(isInside: boolean) {
	isInsideConsole.set(isInside);
}
