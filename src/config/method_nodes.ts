import type { DomainId } from "./domains";

/**
 * Capability nodes for /how-i-work.
 *
 * The organising idea: a competencies list is a set of unverifiable assertions.
 * Every node here instead carries ONE concrete instance from the corpus and a
 * link to the page that documents it. The claim and its evidence ship together
 * or the node does not exist.
 *
 * Domain membership reuses the same four-domain model as /about
 * (src/config/domains.ts), so the two pages are the same instrument asking
 * different questions: /about clusters WORK by physics, this clusters METHOD by
 * physics.
 *
 * SOURCING RULE (operator hard limit): every number below is transcribed from a
 * page in this repo, not inferred. `evidence` names the source slug. Anything
 * that cannot be pinned to a page does not get a number.
 */
export interface MethodNode {
	id: string;
	/** The capability, stated as a practice rather than a tool. */
	name: string;
	domains: DomainId[];
	/** Relative weight — drives node radius in the field. */
	value: number;
	/** The instance. One sentence, specific, with the number where one exists. */
	blurb: string;
	/** Slug of the project page that documents the instance. */
	evidence: string;
	href: string;
	/** Grouping for the prose sections below the field. */
	practice: "design" | "diagnosis" | "production" | "governance";
}

export const METHOD_NODES: readonly MethodNode[] = [
	// ── Design ────────────────────────────────────────────────────────────────
	{
		id: "thermal-architecture",
		name: "Thermal & EMI architecture",
		domains: ["matter_heat", "sensory"],
		value: 9,
		blurb:
			"Validated active-cooling fallbacks on the C|24, then removed the heat source instead — re-architected 4U to 3U and moved the PSU to an external brick, shipping a silent fanless console that held its 10–35 °C window.",
		evidence: "c24",
		href: "/projects/c24/",
		practice: "design",
	},
	{
		id: "tolerance-integration",
		name: "Tolerance, stack-up & mechanical integration",
		domains: ["matter_heat"],
		value: 10,
		blurb:
			"Authored the Data Control Drawing protocol on the C|24: 50+ binding geometric contracts overlaid against the 3D master and rejected on 0.5 mm variance. 100% mechanical fit on the first physical build of 19 PCB assemblies.",
		evidence: "c24",
		href: "/projects/c24/",
		practice: "design",
	},
	{
		id: "mechanism-actuation",
		name: "Mechanism & actuated-system design",
		domains: ["motion_fault", "matter_heat"],
		value: 9,
		blurb:
			"Lead mechanical architect on a cobotic food-assembly makeline coordinating 70+ actuators at ±2% portion precision and 350 meals per hour.",
		evidence: "makeline",
		href: "/projects/makeline/",
		practice: "design",
	},
	{
		id: "human-factors",
		name: "Human factors & class-A surfacing",
		domains: ["sensory", "matter_heat"],
		value: 7,
		blurb:
			"Characterised the Glyph headband against a documented trilemma of retention, acoustic seal and pain — settling at 7.5 N clamp force on 0.8 mm hard-rolled stainless, then compensating the acoustic leak electronically rather than pretending the compromise away.",
		evidence: "avegant-glyph",
		href: "/projects/avegant-glyph/",
		practice: "design",
	},

	// ── Diagnosis ─────────────────────────────────────────────────────────────
	{
		id: "root-cause",
		name: "Failure-mode analysis & root cause",
		domains: ["motion_fault", "data_ai"],
		value: 10,
		blurb:
			"Traced a 100% field-failure mode in a disc-changer mechanism through 3,000,000+ logged cycle events to a friction-coefficient drift.",
		evidence: "m700",
		href: "/projects/m700/",
		practice: "diagnosis",
	},
	{
		id: "process-forensics",
		name: "Process forensics",
		domains: ["matter_heat", "motion_fault"],
		value: 8,
		blurb:
			"Traced 2.50 mm of ABS 'banana' warp to heat-facilitated creep in a paint-cure cycle — parts baked flat on wire racks, below glass transition, sagging under their own weight. Not a material problem. A fixturing problem.",
		evidence: "c24",
		href: "/projects/c24/",
		practice: "diagnosis",
	},
	{
		id: "doe",
		name: "DOE & test-method design",
		domains: ["motion_fault", "data_ai"],
		value: 8,
		blurb:
			"Rejected the vendor's proposed fix and ran a comparative cure study instead — Method A vs B vs C — then codified the winner as a permanent manufacturing spec rather than a one-off rescue.",
		evidence: "c24",
		href: "/projects/c24/",
		practice: "diagnosis",
	},

	// ── Production ────────────────────────────────────────────────────────────
	{
		id: "yield-recovery",
		name: "Yield recovery & CAPA",
		domains: ["matter_heat", "motion_fault"],
		value: 10,
		blurb:
			"Drove Glyph cleanroom optical yield from 35.40% to 77.87% under particle contamination, scrapping 712 optical units on dead-pixel evidence rather than shipping them.",
		evidence: "avegant-glyph",
		href: "/projects/avegant-glyph/",
		practice: "production",
	},
	{
		id: "supply-chain",
		name: "Supply chain & CM management",
		domains: ["matter_heat", "data_ai"],
		value: 9,
		blurb:
			"When the overseas CM no-bid the C|24's most complex panel mid-schedule, ran a dual-source bridge — domestic manual offset-welding to hold the line while the overseas automated process qualified — and protected the ship date.",
		evidence: "c24",
		href: "/projects/c24/",
		practice: "production",
	},
	{
		id: "serviceability",
		name: "Serviceability & field support",
		domains: ["matter_heat", "sensory"],
		value: 6,
		blurb:
			"Cut headphone-jack mean-time-to-repair on the C|24 from over two hours to under ten minutes, against a measured field failure rate.",
		evidence: "c24",
		href: "/projects/c24/",
		practice: "production",
	},
	{
		id: "tooling",
		name: "Tooling strategy & NRE recovery",
		domains: ["matter_heat"],
		value: 7,
		blurb:
			"Directed $59,500–$76,500 of tooling-recovery intervention across a three-continent vendor ecosystem — core-side slides, insert work, draft reversals, gate relocations — and bridged with documented, bounded deviations where steel was too slow.",
		evidence: "avegant-glyph",
		href: "/projects/avegant-glyph/",
		practice: "production",
	},

	// ── Governance ────────────────────────────────────────────────────────────
	{
		id: "change-control",
		name: "Change control & PLM discipline",
		domains: ["data_ai", "matter_heat"],
		value: 8,
		blurb:
			"13 major ECOs in six months on the C|24, with 50+ Data Control Drawing releases enforced — the fixes written into the record as specifications, not remembered as heroics.",
		evidence: "c24",
		href: "/projects/c24/",
		practice: "governance",
	},
	{
		id: "evidence",
		name: "Evidence discipline",
		domains: ["data_ai"],
		value: 9,
		blurb:
			"Every claim on this site is pinned to an artifact — an ECO number, a DCD revision, an inspection report with a measurement on it. Where it is not, the page says so out loud and downgrades the claim.",
		evidence: "c24",
		href: "/projects/c24/#vi-the-epistemic-boundary",
		practice: "governance",
	},
	{
		id: "instrumentation",
		name: "Instrumented engineering operations",
		domains: ["data_ai", "motion_fault"],
		value: 7,
		blurb:
			"Built and operate a local agent infrastructure that compiles thirty years of raw program files into a single sourced record — the same constraint method applied to software: fence the failure modes before assembly.",
		evidence: "colophon",
		href: "/colophon/",
		practice: "governance",
	},
] as const;

export const PRACTICES = [
	{
		id: "design" as const,
		label: "Design",
		line: "Fence the failure modes before anyone cuts steel.",
	},
	{
		id: "diagnosis" as const,
		label: "Diagnosis",
		line: "Find the constraint. Not the symptom, and not the person.",
	},
	{
		id: "production" as const,
		label: "Production",
		line: "The design is not finished until the line can build it at yield.",
	},
	{
		id: "governance" as const,
		label: "Governance",
		line: "If it is not in the record, it did not happen and it will happen again.",
	},
];
