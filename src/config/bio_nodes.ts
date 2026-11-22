/**
 * BIOGRAPHICAL NODES
 *
 * Nodes that belong on the constraint field but are not projects.
 *
 * Why this file exists: the projects collection is 120 entries of professional
 * product-design work, which means Domain 2 (Motion & Fault) — a full quarter of
 * the #91 model, and the domain the whole method was learned in — renders EMPTY
 * from the collection alone. These entries fill it, plus the pre-product and
 * post-product corners of Data & AI and Light/Sound/Perception.
 *
 * Source: registry/global_agent/intelligence/2026-03-28_biography_master.md
 * (global_agent, private registry). This file is the public projection of that
 * text: engineering content only. Family names, addresses, dates of birth,
 * relationships, and medical history stay in the private registry and are
 * deliberately not carried across.
 *
 * These nodes ARE the wiring between the visualisation and the biography core
 * text called for by global_agent#90 DoD item 4.
 */

import metadata from "../data/biography-metadata.json";
import type { DomainId } from "./domains";

export interface BioNode {
	id: string;
	name: string;
	domains: DomainId[];
	startYear: number;
	/** Omit for ongoing. */
	endYear?: number;
	/** Relative mass. Projects size off duration; these are hand-weighted. */
	value: number;
	blurb: string;
	/**
	 * Optional destination. Most biographical nodes have no page yet — the
	 * component opens the detail panel instead of navigating, so a node without
	 * an href reads as informative rather than broken.
	 */
	href?: string;
}

const BIO_NODE_LAYOUT: readonly BioNode[] = [
	// --- Domain 2: Motion & Fault -------------------------------------------
	{
		id: "bio/lund-marine",
		name: "Lund Marine Systems",
		domains: ["motion_fault"],
		startYear: 1975,
		endYear: 1982,
		value: 34,
		blurb: "",
	},
	{
		id: "bio/first-motorcycle",
		name: "The Nineteen Cords",
		domains: ["motion_fault"],
		startYear: 1980,
		endYear: 1980,
		value: 20,
		blurb: "",
	},
	{
		id: "bio/menlo-park-exxon",
		name: "Menlo Park Exxon",
		domains: ["motion_fault"],
		startYear: 1982,
		endYear: 1984,
		value: 18,
		blurb: "",
	},
	{
		id: "bio/de-anza-automotive",
		name: "De Anza — Engine Performance",
		domains: ["motion_fault"],
		startYear: 1984,
		endYear: 1986,
		value: 22,
		blurb: "",
	},
	{
		id: "bio/alices-garage",
		name: "Alice's Garage",
		domains: ["motion_fault"],
		startYear: 1986,
		endYear: 1989,
		value: 26,
		blurb: "",
	},
	{
		id: "bio/red-automotive",
		name: "Red Automotive Repair",
		domains: ["motion_fault"],
		startYear: 1993,
		endYear: 1996,
		value: 30,
		blurb: "",
	},
	{
		id: "bio/scca-solo",
		name: "SCCA SoloII — OSP",
		domains: ["motion_fault"],
		startYear: 1993,
		endYear: 2000,
		value: 16,
		blurb: "",
	},
	{
		id: "bio/cycling",
		name: "Ten Thousand Miles a Year",
		domains: ["motion_fault"],
		startYear: 2010,
		value: 24,
		blurb: "",
	},

	// --- Domain 3: Data & AI --------------------------------------------------
	{
		id: "bio/intralink-windchill",
		name: "Pro/INTRALINK & Windchill",
		domains: ["data_ai", "matter_heat"],
		startYear: 2003,
		endYear: 2008,
		value: 22,
		blurb: "",
	},
	{
		id: "bio/mootmoat",
		name: "MootMoat",
		href: "https://mootmoat.com/",
		domains: ["data_ai"],
		startYear: 2022,
		value: 30,
		blurb: "",
	},
	{
		id: "bio/git-agent-memory",
		name: "Git as Agent Memory",
		domains: ["data_ai"],
		startYear: 2023,
		value: 28,
		blurb: "",
	},

	// --- Domain 4: Light, Sound & Perception ---------------------------------
	{
		id: "bio/photography",
		name: "Photography",
		domains: ["sensory"],
		startYear: 2010,
		value: 22,
		blurb: "",
	},
] as const;

// Wording follows the selected biography projection; dates stay with this existing layout.
export const BIO_NODES: readonly BioNode[] = BIO_NODE_LAYOUT.map((node) => {
	const copy = metadata.bioNodes[node.id as keyof typeof metadata.bioNodes];
	if (!copy) throw new Error(`Missing selected biography node: ${node.id}`);
	return { ...node, name: copy.name, blurb: copy.blurb, href: copy.href || undefined };
});
