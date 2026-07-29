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

	// ── Added 2026-07-29 on the consistency ruling: the résumé, the LinkedIn
	//    experience section and these pages carry the same basic facts. These five
	//    are résumé competencies that had no node, because the first pass was built
	//    bottom-up from citable stories instead of top-down from the claim set.
	{
		id: "haptics",
		name: "Haptic & kinematic tuning",
		domains: ["sensory", "motion_fault"],
		value: 7,
		blurb:
			"Preserved the premium 'scrub' feel of a $10,000 console on commodity parts — a Bourns EM14 jog wheel with six exposed 0.42 mm leads got a pre-terminated harness spec and a custom surround (ECO 13082) rather than a cost-up.",
		evidence: "c24",
		href: "/projects/c24/",
		practice: "design",
	},
	{
		id: "dfa",
		name: "DFM / DFA for automated assembly",
		domains: ["matter_heat", "motion_fault"],
		value: 8,
		blurb:
			"The C|24 top panel (P/N 9420-55105) packed welded standoffs so densely that the vendor's automated CNC welding heads physically could not reach them — a design decision that stopped a production line. Read the process before drawing the part.",
		evidence: "c24",
		href: "/projects/c24/",
		practice: "production",
	},
	{
		id: "life-test",
		name: "Accelerated life & destruction testing",
		domains: ["motion_fault", "matter_heat"],
		value: 8,
		blurb:
			"Glyph's eyepiece arms carried a 3,000-cycle requirement and got worse as tooling matured: 10% seizure at T1 (500 cycles), then 40% — two of five units — failing at just 250 cycles in T6, on the eve of ramp. Root cause was internal cable wear, found because the test ran every tool revision.",
		evidence: "avegant-glyph",
		href: "/projects/avegant-glyph/",
		practice: "diagnosis",
	},
	{
		id: "fea",
		name: "FEA-correlated validation",
		domains: ["matter_heat", "data_ai"],
		value: 7,
		blurb:
			"Optimized the Glyph headband through a Central Composite Design FEA study and correlated it against ANSYS stress-life binders and physical spring-rate characterization — simulation used to bound a real part, not to decorate a review.",
		evidence: "avegant-glyph",
		href: "/projects/avegant-glyph/",
		practice: "diagnosis",
	},
	{
		id: "anthropometry",
		name: "Human-engineering standards & anthropometric fit",
		domains: ["sensory", "matter_heat"],
		value: 8,
		blurb:
			"Sized the Glyph headband, IPD range and nosepiece against military human-engineering criteria (MIL-STD-1472F, MIL-STD-1787C) and aircrew anthropometry — Bitragion-Coronal Arc, Nasal Root to Wall, Menton Projection. The forensic audit also records what that cost: 1960s US aviator surveys assume a long, narrow Western head profile, so short-and-wide profiles fit poorly. Uneven weight distribution and nosepiece discomfort across a large share of the global market, traceable to the data source rather than to the geometry.",
		evidence: "avegant-glyph",
		href: "/projects/avegant-glyph/",
		practice: "design",
	},
	{
		id: "regulatory",
		name: "Regulatory & compliance (UL · FCC · EMI)",
		domains: ["sensory", "data_ai"],
		value: 7,
		blurb:
			"Glyph failed Class B EMI months before ramp; the radiating path was traced to HDMI and remediated through to FCC / IC / CMIIT certification. On the C|24 a PSU certification block was bridged by hand-packing 100 units so the ship date held.",
		evidence: "avegant-glyph",
		href: "/projects/avegant-glyph/",
		practice: "governance",
	},
] as const;

/**
 * Reconciliation against `resumeMaster.competencies` — the identity source of truth.
 *
 * Operator ruling 2026-07-29: the résumé, the LinkedIn experience section and
 * these pages must carry the same basic facts. The first pass violated that by
 * accident — it was assembled BOTTOM-UP from stories the corpus could cite,
 * rather than TOP-DOWN from the claim set. The omissions therefore clustered
 * exactly where the *curated corpus* is thin, not where the career is thin.
 *
 * This map exists so that gap is visible instead of silent. Every competency
 * resolves to a node, to a node that already covers it, or to an explicit
 * `null` with a reason. A competency with no entry is drift, and the tier gate
 * fails the build on it (scripts/audits/validate_tier_gate.mjs).
 */
export const COMPETENCY_COVERAGE: Record<string, string | null> = {
	// engineering
	"Robotic Mechanism & Actuator Design": "mechanism-actuation",
	"Tolerance / Alignment / Load Paths": "tolerance-integration",
	"Wear & Failure-Mode Analysis (RCA)": "root-cause",
	"GD&T · Stack-Ups (WC / RSS)": "tolerance-integration",
	"DOE Test-Method Design": "doe",
	"FEA-Correlated Validation (ANSYS)": "fea",
	"Haptic & Kinematic Tuning": "haptics",
	// manufacturing
	"DFM / DFA for Automated Assembly": "dfa",
	"High-Volume NPI (Tool Start → MP)": "tooling",
	"Injection Molding · Die Casting · Sheet Metal": "process-forensics",
	"Accelerated Life / Destruction Testing": "life-test",
	"Yield Recovery & CAPA": "yield-recovery",
	"CM Management (Suzhou · Guadalajara · Taipei)": "supply-chain",
	// tools & regulatory
	"Onshape, Creo, Solidworks": null, // a toolchain, not a capability — résumé only
	"PLM Architecture (Agile / Arena / Windchill)": "change-control",
	"Thermal Simulation (CFD)": "thermal-architecture",
	"UL 1472 / UL 20 / FCC": "regulatory",
	// Evidence located 2026-07-29 (operator). NOTE the revision letter: the Glyph
	// project documentation references MIL-STD-1472**F** (plus MIL-STD-1787C),
	// not G. This key still reads "G" because it must match resume_master.ts
	// verbatim or the drift check fires — the résumé's own G/F attribution is an
	// open question, since resume_master.ts:102 and linkedin_master.ts:68 both
	// attribute 1472G to NOON, a different program whose documentation has not
	// been checked. Do not blanket-replace G with F.
	"MIL-STD-1472G": "anthropometry",
	"Class III Medical Standards": null, // cardiac-ablation work (1985) is on /about; no project page cites it
	"Class-A Surfacing": "human-factors",
};

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
