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

export const BIO_NODES: readonly BioNode[] = [
	// --- Domain 2: Motion & Fault -------------------------------------------
	{
		id: "bio/lund-marine",
		name: "Lund Marine Systems",
		domains: ["motion_fault"],
		startYear: 1975,
		endYear: 1982,
		value: 34,
		blurb:
			"Outboard motors, tugboat engines, bilge pumps, and cable suspension winches at the end of Highway 101, in service of a shellfish cooperative. Formal schooling arrived by correspondence. The real curriculum was physical, immediate, and graded by the ocean — unforgiving, consistent, honest about consequences.",
	},
	{
		id: "bio/first-motorcycle",
		name: "The Nineteen Cords",
		domains: ["motion_fault"],
		startYear: 1980,
		endYear: 1980,
		value: 20,
		blurb:
			"Told he could buy a motorcycle when he could pay for it, he felled, bucked, split, and loaded nineteen cords of wood at a hundred dollars a cord. Enough for the ferry, the bike, tires, tune-up parts, and a filter. Constraint identified, resources inventoried, solution designed, work executed — the operating system establishing its core parameters at twelve.",
	},
	{
		id: "bio/menlo-park-exxon",
		name: "Menlo Park Exxon",
		domains: ["motion_fault"],
		startYear: 1982,
		endYear: 1984,
		value: 18,
		blurb:
			"The service station learned the way everything else was learned: by touching the thing, understanding the system, and being present when it broke and staying until it worked again.",
	},
	{
		id: "bio/de-anza-automotive",
		name: "De Anza — Engine Performance",
		domains: ["motion_fault"],
		startYear: 1984,
		endYear: 1986,
		value: 22,
		blurb:
			"Associate's Degree in Automotive Engine Performance at twenty-two units a quarter, with the Outstanding Academic Achievement Certificate and an Elks National Foundation Vocational Grant. When the schedule required it, he slept in the library. The library was warm and had books.",
	},
	{
		id: "bio/alices-garage",
		name: "Alice's Garage",
		domains: ["motion_fault"],
		startYear: 1986,
		endYear: 1989,
		value: 26,
		blurb:
			"Computer-engine feedback systems and late-model driveability diagnostics, run concurrently with cardiac ablation hardware at EP Technologies. The same epistemology applied to combustion that was being applied to catheters. Not a career — a method under development.",
	},
	{
		id: "bio/red-automotive",
		name: "Red Automotive Repair",
		domains: ["motion_fault"],
		startYear: 1993,
		endYear: 1996,
		value: 30,
		blurb:
			"Owned and operated: general repair plus racing specialty — late-model driveability, fuel injection, electronic engine controls, forced induction, and class-legal setups for SCCA SOLO and the NASA Camaro/Mustang Challenge. Run simultaneously with the Mechanistic consultancy.",
	},
	{
		id: "bio/scca-solo",
		name: "SCCA SoloII — OSP",
		domains: ["motion_fault"],
		startYear: 1993,
		endYear: 2000,
		value: 16,
		blurb:
			"Competitive autocross in OSP class. Racing is the diagnostic method under a stopwatch: the car tells you what is wrong, and the only question is whether you can read it fast enough.",
	},
	{
		id: "bio/cycling",
		name: "Ten Thousand Miles a Year",
		domains: ["motion_fault"],
		startYear: 2010,
		value: 24,
		blurb:
			"Roughly ten thousand miles a year on the bike before the pandemic, including a heavily customised electric Xtracycle EdgeRunner 10E cargo setup. Both Achilles tendons snapped at different times, one while travelling for work. Repaired. Kept riding.",
	},

	// --- Domain 3: Data & AI --------------------------------------------------
	{
		id: "bio/intralink-windchill",
		name: "Pro/INTRALINK & Windchill",
		domains: ["data_ai", "matter_heat"],
		startYear: 2003,
		endYear: 2008,
		value: 22,
		blurb:
			"System administrator for the CAD dataservers holding a hardware company's revision history — already wrestling with persistent, auditable, durable professional data two decades before there was language for it. The origin of the Persistent Commit.",
	},
	{
		id: "bio/mootmoat",
		name: "MootMoat",
		domains: ["data_ai"],
		startYear: 2022,
		value: 30,
		blurb:
			"An open standard for agentic professional identity, built because automated hiring systems were designed by people who had never held a thermal resistance budget. Their ontologies had no vocabulary for forty years of constraint work. Not failing a screen — never screened at all. He called it Round Zero, and built the protocol to end it.",
	},
	{
		id: "bio/git-agent-memory",
		name: "Git as Agent Memory",
		domains: ["data_ai"],
		startYear: 2023,
		value: 28,
		blurb:
			"Durable memory for AI agents across sessions, restarts, and complete environment teardowns — solved by recognising that git already has every property required: durability, auditability, diffing, branching, multi-party write. Agents boot cold, read an issue, execute, comment, and die. The container burns. The commit survives.",
	},

	// --- Domain 4: Light, Sound & Perception ---------------------------------
	{
		id: "bio/photography",
		name: "Photography",
		domains: ["sensory"],
		startYear: 2010,
		value: 22,
		blurb:
			"Landscape, macro, portrait, studio, weddings, and a portable photobooth engineered from scratch. The same eye that tracked tolerance stacks and thermal budgets, turned toward light and time and the way a face holds its history.",
	},
] as const;
