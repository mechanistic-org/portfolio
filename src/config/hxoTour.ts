import type { HxoLens } from "../stores/hxoStore";

export interface HxoTourStep {
	id: string;
	projectId: string;
	lens: HxoLens;
	title: string;
	narration: string;
}

export const HXO_TOUR_STEPS = [
	{
		id: "field",
		projectId: "c24",
		lens: "time",
		title: "Read the field",
		narration:
			"The default view is a career timeline. Position carries time; color stays tied to employer.",
	},
	{
		id: "cohorts",
		projectId: "sc48",
		lens: "employer",
		title: "See repeated systems work",
		narration:
			"Employer reframes the same project record into cohorts without changing its semantic color.",
	},
	{
		id: "intervention",
		projectId: "m700",
		lens: "employer",
		title: "Keep the intervention reachable",
		narration:
			"A pin keeps this dossier reachable while you move between the map, index, and controls.",
	},
	{
		id: "problems",
		projectId: "avegant-glyph",
		lens: "category",
		title: "Reframe by problem",
		narration:
			"Category gathers related product problems while the index and swarm remain synchronized.",
	},
	{
		id: "continue",
		projectId: "xbox",
		lens: "time",
		title: "Continue from here",
		narration:
			"The tour ends with this dossier pinned. Open it, change lenses, or resume scanning from here.",
	},
] as const satisfies readonly HxoTourStep[];

export type HxoTourStepId = (typeof HXO_TOUR_STEPS)[number]["id"];

export function getHxoTourStep(id: string | null | undefined) {
	return HXO_TOUR_STEPS.find((step) => step.id === id) ?? null;
}

export function getHxoTourStepByProject(projectId: string | null | undefined) {
	return HXO_TOUR_STEPS.find((step) => step.projectId === projectId) ?? null;
}
