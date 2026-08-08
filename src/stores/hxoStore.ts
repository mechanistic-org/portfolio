import { atom, computed } from "nanostores";

export type HxoMode = "explore" | "tour";
export type PreviewSource = "default" | "index-focus" | "index-hover" | "swarm";

export const mode = atom<HxoMode>("explore");
export const previewId = atom<string | null>(null);
export const pinnedId = atom<string | null>(null);
export const lastPreviewId = atom<string | null>(null);

export const focusId = computed(
	[previewId, pinnedId],
	(currentPreviewId, currentPinnedId) => currentPreviewId ?? currentPinnedId,
);

export const viewerId = computed(
	[previewId, pinnedId, lastPreviewId],
	(currentPreviewId, currentPinnedId, currentLastPreviewId) =>
		currentPreviewId ?? currentPinnedId ?? currentLastPreviewId,
);

const activePreviews = new Map<PreviewSource, { id: string; order: number }>();
let previewOrder = 0;

function syncPreview() {
	const nextPreview = [...activePreviews.values()].sort((a, b) => b.order - a.order)[0]?.id ?? null;
	if (previewId.get() === nextPreview) return;

	previewId.set(nextPreview);
	if (nextPreview) lastPreviewId.set(nextPreview);
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

export function pin(id: string) {
	pinnedId.set(id);
}

export function unpin() {
	pinnedId.set(null);
	lastPreviewId.set(null);
}

// Console Interaction Shield
export const isInsideConsole = atom<boolean>(false);

export function setConsoleHover(isInside: boolean) {
	isInsideConsole.set(isInside);
}
