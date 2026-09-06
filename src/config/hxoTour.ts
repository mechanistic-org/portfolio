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
		title: "Make geometry a contract",
		narration:
			"C|24 had to fit 19 PCB assemblies inside a low-profile console. I authored more than 50 Data Control Drawings to hold the interfaces steady while electrical and mechanical design evolved. The first physical build achieved full mechanical fit.",
	},
	{
		id: "cohorts",
		projectId: "sc48",
		lens: "employer",
		title: "Test the whole architecture",
		narration:
			"For SC48, I had to solve thermal, packaging, and cost constraints together. We tested 17 configurations, moved the enclosure from 3U to 4U, and used a folded-steel spine to meet the no-extrusion constraint.",
	},
	{
		id: "intervention",
		projectId: "m700",
		lens: "employer",
		title: "Follow the next constraint",
		narration:
			"On M700, dirty rollers caused disc slippage. Increasing spring force improved tolerance to contamination, then exposed shaft deflection. A reliability fix had to account for both contact force and the structure carrying it.",
	},
	{
		id: "problems",
		projectId: "avegant-glyph",
		lens: "category",
		title: "Make fit measurable",
		narration:
			"For Glyph, comfort depended on interacting parts and different head sizes. We measured clamp force across head widths, telescope positions, spring thicknesses, and liner materials, turning fit into variables we could compare.",
	},
	{
		id: "continue",
		projectId: "xbox",
		lens: "time",
		title: "Improve what is already shipping",
		narration:
			"Xbox was already in high-volume manufacture when Mechanistic joined. We explored redesigns within the existing architecture, and selected mechanical and EMI fixes moved into production. The task was to improve a working product within the constraints already committed.",
	},
] as const satisfies readonly HxoTourStep[];

export type HxoTourStepId = (typeof HXO_TOUR_STEPS)[number]["id"];

export function getHxoTourStep(id: string | null | undefined) {
	return HXO_TOUR_STEPS.find((step) => step.id === id) ?? null;
}

export function getHxoTourStepByProject(projectId: string | null | undefined) {
	return HXO_TOUR_STEPS.find((step) => step.projectId === projectId) ?? null;
}
