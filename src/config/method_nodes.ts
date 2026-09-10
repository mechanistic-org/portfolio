import { claimFor } from "./claim-presentations";
import type { DomainId } from "./domains";

/** Capability examples resolve from canon-owned assertions. Layout and career coverage stay here. */
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
		blurb: claimFor("method:thermal-architecture").text,
		evidence: claimFor("method:thermal-architecture").project,
		href: claimFor("method:thermal-architecture").href,
		practice: "design",
	},
	{
		id: "tolerance-integration",
		name: "Tolerance, stack-up & mechanical integration",
		domains: ["matter_heat"],
		value: 10,
		blurb: claimFor("method:tolerance-integration").text,
		evidence: claimFor("method:tolerance-integration").project,
		href: claimFor("method:tolerance-integration").href,
		practice: "design",
	},
	{
		id: "mechanism-actuation",
		name: "Mechanism & actuated-system design",
		domains: ["motion_fault", "matter_heat"],
		value: 9,
		blurb: claimFor("method:mechanism-actuation").text,
		evidence: claimFor("method:mechanism-actuation").project,
		href: claimFor("method:mechanism-actuation").href,
		practice: "design",
	},
	{
		id: "human-factors",
		name: "Human factors & class-A surfacing",
		domains: ["sensory", "matter_heat"],
		value: 7,
		blurb: claimFor("method:human-factors").text,
		evidence: claimFor("method:human-factors").project,
		href: claimFor("method:human-factors").href,
		practice: "design",
	},

	// ── Diagnosis ─────────────────────────────────────────────────────────────
	{
		id: "process-forensics",
		name: "Failure analysis & process forensics",
		domains: ["matter_heat", "motion_fault"],
		value: 8,
		blurb: claimFor("method:process-forensics").text,
		evidence: claimFor("method:process-forensics").project,
		href: claimFor("method:process-forensics").href,
		practice: "diagnosis",
	},
	{
		id: "doe",
		name: "DOE & test-method design",
		domains: ["motion_fault", "data_ai"],
		value: 8,
		blurb: claimFor("method:doe").text,
		evidence: claimFor("method:doe").project,
		href: claimFor("method:doe").href,
		practice: "diagnosis",
	},

	// ── Production ────────────────────────────────────────────────────────────
	{
		id: "serviceability",
		name: "Serviceability & field support",
		domains: ["matter_heat", "sensory"],
		value: 6,
		blurb: claimFor("method:serviceability").text,
		evidence: claimFor("method:serviceability").project,
		href: claimFor("method:serviceability").href,
		practice: "production",
	},

	// ── Governance ────────────────────────────────────────────────────────────
	{
		id: "evidence",
		name: "Production acceptance & evidence",
		domains: ["data_ai"],
		value: 9,
		blurb: claimFor("method:evidence").text,
		evidence: claimFor("method:evidence").project,
		href: claimFor("method:evidence").href,
		practice: "governance",
	},
	{
		id: "instrumentation",
		name: "Instrumented engineering operations",
		domains: ["data_ai", "motion_fault"],
		value: 7,
		blurb:
			"Built and operate a local agent infrastructure that compiles thirty years of raw program files into a single sourced record - the same constraint method applied to software: fence the failure modes before assembly.",
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
		name: "Control integration & kinematics",
		domains: ["sensory", "motion_fault"],
		value: 7,
		blurb: claimFor("method:haptics").text,
		evidence: claimFor("method:haptics").project,
		href: claimFor("method:haptics").href,
		practice: "design",
	},
	{
		id: "dfa",
		name: "DFM / DFA for automated assembly",
		domains: ["matter_heat", "motion_fault"],
		value: 8,
		blurb: claimFor("method:dfa").text,
		evidence: claimFor("method:dfa").project,
		href: claimFor("method:dfa").href,
		practice: "production",
	},
	{
		id: "life-test",
		name: "Accelerated life & destruction testing",
		domains: ["motion_fault", "matter_heat"],
		value: 8,
		blurb: claimFor("method:life-test").text,
		evidence: claimFor("method:life-test").project,
		href: claimFor("method:life-test").href,
		practice: "diagnosis",
	},
	{
		id: "regulatory",
		name: "Regulatory & compliance (UL · FCC · EMI)",
		domains: ["sensory", "data_ai"],
		value: 7,
		blurb: claimFor("method:regulatory").text,
		evidence: claimFor("method:regulatory").project,
		href: claimFor("method:regulatory").href,
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
 * fails the build on it (scripts/audits/validate_publication_integrity.mjs).
 */
export const COMPETENCY_COVERAGE: Record<string, string | null> = {
	// engineering
	"Robotic Mechanism & Actuator Design": "mechanism-actuation",
	"Tolerance / Alignment / Load Paths": "tolerance-integration",
	"Wear & Failure-Mode Analysis (RCA)": "process-forensics",
	"GD&T · Stack-Ups (WC / RSS)": "tolerance-integration",
	"DOE Test-Method Design": "doe",
	"FEA-Correlated Validation (ANSYS)": null, // Career competency retained; Glyph example awaits support.
	"Haptic & Kinematic Tuning": "haptics",
	// manufacturing
	"DFM / DFA for Automated Assembly": "dfa",
	"High-Volume NPI (Tool Start → MP)": "evidence",
	"Injection Molding · Die Casting · Sheet Metal": "process-forensics",
	"Accelerated Life / Destruction Testing": "life-test",
	"Yield Recovery & CAPA": null, // Career competency retained; optical-yield example awaits reconciliation.
	"CM Management (Suzhou · Guadalajara · Taipei)": "dfa",
	// tools & regulatory
	"Onshape, Creo, Solidworks": null, // a toolchain, not a capability — résumé only
	"PLM Architecture (Agile / Arena / Windchill)": "tolerance-integration",
	"Thermal Simulation (CFD)": "thermal-architecture",
	"UL 1472 / UL 20 / FCC": "regulatory",
	// Evidence located 2026-07-29 (operator). NOTE the revision letter: the Glyph
	// project documentation references MIL-STD-1472**F** (plus MIL-STD-1787C),
	// not G. This key still reads "G" because it must match resume_master.ts
	// verbatim or the drift check fires — the résumé's own G/F attribution is an
	// open question, since resume_master.ts:102 and linkedin_master.ts:68 both
	// attribute 1472G to NOON, a different program whose documentation has not
	// been checked. Do not blanket-replace G with F.
	"MIL-STD-1472G": null, // NOON attribution retained in career authority; do not substitute Glyph F.
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
		line: "Make the next engineering decision easier to trace.",
	},
];
