import { atom } from "nanostores";
import type { AssemblyNode } from "../utils/mapCareerAssembly";

// The currently selected project ID (slug)
export const selectedProject = atom<string | null>(null);

// The currently hovered project ID (slug) - for preview/ghosting
export const hoveredProject = atom<string | null>(null);

// Optional: Store the full node data if we want to avoid re-lookup
export const activeNodeData = atom<AssemblyNode | null>(null);

/**
 * ACTIONS
 */
export function selectProject(id: string) {
	selectedProject.set(id);
}

export function clearSelection() {
	selectedProject.set(null);
}

export function setHover(id: string | null) {
	hoveredProject.set(id);
}
