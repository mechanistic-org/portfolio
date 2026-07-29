/**
 * CONSTRAINT DOMAIN REGISTRY
 *
 * The four-domain constraint model ruled in global_agent#91 ("The Constraint-Based
 * Venn Diagram: A Forensic Synthesis"), rendered as the navigation substrate for
 * the /about biographical front door (global_agent#90).
 *
 * The claim the model makes: these are not four careers. They are one operating
 * system applied to different physics. The overlaps carry the argument; the nodes
 * that sit in them carry the navigation.
 *
 * Layout note — domain centroids are normalised [0,1] in both axes so the
 * component can scale them to any viewport. Warm hues are the physical domains,
 * cool hues the informational/perceptual ones. That split is the encoding, not
 * decoration.
 */

export type DomainId = "matter_heat" | "motion_fault" | "data_ai" | "sensory";

export interface ConstraintDomain {
	id: DomainId;
	/** Short label used on the field and in the mobile list. */
	label: string;
	/** The physics the domain governs — the parenthetical in #91. */
	subtitle: string;
	/** One sentence stating what the domain actually is. */
	blurb: string;
	color: string;
	/** Normalised centroid the force simulation pulls members toward. */
	cx: number;
	cy: number;
}

export const DOMAINS: readonly ConstraintDomain[] = [
	{
		id: "matter_heat",
		label: "Matter & Heat",
		subtitle: "High-Stakes Physical Architecture",
		blurb:
			"The governance of matter behaving at boundary conditions — thermal budgets, tolerance stacks, and structures that fail visibly when the physics is not respected.",
		color: "#F6BE15",
		cx: 0.32,
		cy: 0.3,
	},
	{
		id: "motion_fault",
		label: "Motion & Fault",
		subtitle: "Kinetic Diagnostics & Combustion Logic",
		blurb:
			"The machine as a legible system: input, process, output, failure mode, root cause. Learned on outboards and tugboats, matured on engines under load.",
		color: "#E5484D",
		cx: 0.68,
		cy: 0.3,
	},
	{
		id: "data_ai",
		label: "Data & AI",
		subtitle: "Systemic Sovereignty & Code Logic",
		blurb:
			"The architecture of persistent state and identity — durable, auditable, operator-owned, and designed to survive the container it runs in.",
		color: "#2E5CFF",
		cx: 0.32,
		cy: 0.7,
	},
	{
		id: "sensory",
		label: "Light, Sound & Perception",
		subtitle: "Sensory Architecture & Waveform Physics",
		blurb:
			"Engineering at the boundary between the physical world and human perception — audio waveforms, projected light, captured time.",
		color: "#00C2FF",
		cx: 0.68,
		cy: 0.7,
	},
] as const;

export const DOMAIN_BY_ID: Record<DomainId, ConstraintDomain> = Object.fromEntries(
	DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, ConstraintDomain>;

/**
 * The intersections. Ruled in #91 as Nodes A-D, including the post-review edit
 * that re-seated Node B as a three-domain overlap (1 ∩ 2 ∩ 4) rather than a pair.
 *
 * These are labelled REGIONS of the field layer, never bubbles. They do the
 * arguing; project and biography nodes do the routing.
 */
export interface IntersectionNode {
	id: "A" | "B" | "C" | "D";
	label: string;
	domains: DomainId[];
	blurb: string;
}

export const INTERSECTIONS: readonly IntersectionNode[] = [
	{
		id: "A",
		label: "The Diagnostic Method",
		domains: ["matter_heat", "motion_fault"],
		blurb:
			"The logic that isolates a computer-engine feedback fault is the logic that isolates a thermal failure in a workstation. The machine has knowable properties and discoverable rules.",
	},
	{
		id: "B",
		label: "The Zero-Tolerance Threshold",
		domains: ["matter_heat", "motion_fault", "sensory"],
		blurb:
			"Environments that do not forgive mistakes: cardiac catheters, high-speed kinetic systems, and optics projecting directly onto a retina. Failure here is immediate and physical.",
	},
	{
		id: "C",
		label: "The Persistent Commit",
		domains: ["matter_heat", "data_ai"],
		blurb:
			"Hardware rigor translated to digital infrastructure. A manufactured object survives its tooling; an agent's context must survive its container. The container burns, the commit survives.",
	},
	{
		id: "D",
		label: "Total System Parallelism",
		domains: ["matter_heat", "motion_fault", "data_ai", "sensory"],
		blurb:
			"A consultancy, a repair shop, a race season, and a product schedule running at once. The parallel processing was never a strategy. It was constitutional.",
	},
] as const;

/** Mean centroid of an intersection's member domains — where its label sits. */
export function intersectionCentroid(node: IntersectionNode): { cx: number; cy: number } {
	const members = node.domains.map((id) => DOMAIN_BY_ID[id]);
	return {
		cx: members.reduce((s, d) => s + d.cx, 0) / members.length,
		cy: members.reduce((s, d) => s + d.cy, 0) / members.length,
	};
}

// ---------------------------------------------------------------------------
// DERIVATION
// ---------------------------------------------------------------------------
//
// Domain membership is DERIVED, not authored. The v2 project contract is frozen
// (portfolio#120) and site MDX is a read-only render target written only by
// project_pipeline.py — so adding a `domains:` frontmatter field would mean a
// canon-vault change plus a 120-file regen. This table is the cheaper, reversible
// alternative and it lives in one file the operator can edit.
//
// Signal quality, measured across the live collection (2026-07-28):
//   employer  — 9 values, real spread. Strongest signal.
//   category  — 12 values, real spread. Good secondary.
//   tags      — free-form; a few carry genuine domain information.
//   industry  — DEGENERATE (108/120 = consumer_electronics). Deliberately unused.

const EMPLOYER_DOMAINS: Record<string, DomainId[]> = {
	ep_technologies: ["matter_heat"],
	silicon_graphics: ["matter_heat"],
	hyphen: ["matter_heat"],
	frogdesign: ["matter_heat"],
	noon: ["matter_heat", "data_ai"],
	digidesign: ["sensory", "matter_heat"],
	kaleidescape: ["sensory", "matter_heat"],
	avegant: ["sensory", "matter_heat"],
	// `mechanistic` is deliberately absent: the consultancy spans every domain,
	// so its projects fall through to the category table where the actual
	// artifact decides.
};

const CATEGORY_DOMAINS: Record<string, DomainId[]> = {
	home_entertainment: ["sensory"],
	control_surface: ["sensory"],
	wearable_ar: ["sensory", "matter_heat"],
	medical_device: ["matter_heat"],
	enterprise_hardware: ["matter_heat"],
	module_subsystem: ["matter_heat"],
	appliance: ["matter_heat"],
	input_device: ["matter_heat"],
	consumer_electronics: ["matter_heat"],
	computing: ["matter_heat", "data_ai"],
	mobile_device: ["matter_heat", "data_ai"],
	smart_home: ["matter_heat", "data_ai"],
};

// Tags that pull a project toward an overlap it would not otherwise reach.
// Forensics / Root Cause Analysis are the Node A signature: the diagnostic
// method arriving in a domain that is not combustion.
const TAG_DOMAINS: Record<string, DomainId[]> = {
	forensics: ["motion_fault"],
	"root cause analysis": ["motion_fault"],
	thermal: ["matter_heat"],
	mechanism: ["matter_heat"],
};

// Per-slug overrides, checked first. This is the deliberate escape hatch for
// entries the taxonomy genuinely cannot place — a project carrying the spanning
// `mechanistic` employer and no category has no signal to derive from, and
// guessing a default would quietly gut the fail-loud contract below.
// Keep this list short: a growing table means the taxonomy needs the fix, not this.
const SLUG_DOMAINS: Record<string, DomainId[]> = {
	// WebTV Zeus server / Pluto node — rapid-prototyped enterprise hardware,
	// no category authored in the source MDX.
	zeus: ["matter_heat"],
};

export interface DerivableProject {
	slug: string;
	employer?: string;
	category?: string;
	tags?: string[];
}

/**
 * Resolve a project's domain membership.
 *
 * Fails loud: a project that resolves to zero domains throws with its slug named,
 * so a taxonomy value added without a mapping breaks the build instead of
 * silently dropping the node out of the visualisation.
 */
export function deriveDomains(project: DerivableProject): DomainId[] {
	const found = new Set<DomainId>();

	if (SLUG_DOMAINS[project.slug]) {
		return [...SLUG_DOMAINS[project.slug]];
	}

	if (project.employer && EMPLOYER_DOMAINS[project.employer]) {
		EMPLOYER_DOMAINS[project.employer].forEach((d) => found.add(d));
	}
	if (project.category && CATEGORY_DOMAINS[project.category]) {
		CATEGORY_DOMAINS[project.category].forEach((d) => found.add(d));
	}
	for (const tag of project.tags ?? []) {
		const mapped = TAG_DOMAINS[tag.toLowerCase().trim()];
		if (mapped) mapped.forEach((d) => found.add(d));
	}

	if (found.size === 0) {
		throw new Error(
			`[domains] "${project.slug}" resolved to zero constraint domains ` +
				`(employer=${project.employer ?? "none"}, category=${project.category ?? "none"}). ` +
				`Add a mapping in src/config/domains.ts — do not let the node vanish silently.`,
		);
	}

	return [...found];
}

/** Where a node with these memberships wants to sit, before collision. */
export function domainCentroid(domains: DomainId[]): { cx: number; cy: number } {
	const members = domains.map((id) => DOMAIN_BY_ID[id]).filter(Boolean);
	if (members.length === 0) return { cx: 0.5, cy: 0.5 };
	return {
		cx: members.reduce((s, d) => s + d.cx, 0) / members.length,
		cy: members.reduce((s, d) => s + d.cy, 0) / members.length,
	};
}

/** Blend member domain colors so a node reads as its overlap, not one ring. */
export function blendDomainColors(domains: DomainId[]): string {
	const members = domains.map((id) => DOMAIN_BY_ID[id]).filter(Boolean);
	if (members.length === 0) return "#4B5563";
	if (members.length === 1) return members[0].color;

	const parse = (hex: string) => [
		parseInt(hex.slice(1, 3), 16),
		parseInt(hex.slice(3, 5), 16),
		parseInt(hex.slice(5, 7), 16),
	];
	const mixed = members
		.map((d) => parse(d.color))
		.reduce((acc, rgb) => acc.map((v, i) => v + rgb[i]), [0, 0, 0])
		.map((v) => Math.round(v / members.length));

	return `#${mixed.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
