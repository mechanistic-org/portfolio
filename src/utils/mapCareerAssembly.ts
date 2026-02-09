import { getCollection } from "astro:content";

/**
 * ----------------------------------------------------------------------
 *  ASSEMBLY UTILITY (Mission a1730e9)
 * ----------------------------------------------------------------------
 *  Generates a physics-ready "Exploded View" assembly of the career.
 *
 *  - NODES: Projects (Solid Bodies)
 *  - LINKS: Skills (Fasteners)
 *  - PAYLOAD: Intelligence Bolus (NotebookLM Data)
 * ----------------------------------------------------------------------
 */

export interface AssemblyNode extends d3.SimulationNodeDatum {
	id: string; // Slug
	type: "project" | "skill" | "employer";
	data: any; // Raw Frontmatter
	intelligence?: string; // The Bolus (Markdown content from _intelligence.md)
	hasIntelligence?: boolean; // Lightweight flag for Visuals (Glow)
	radius?: number; // Visual Mass
	color?: string; // Hex Token
}

export interface AssemblyLink extends d3.SimulationLinkDatum<AssemblyNode> {
	source: string | AssemblyNode;
	target: string | AssemblyNode;
	value: number; // TBD: Strength
	type: "fastener" | "parent";
}

export interface CareerAssembly {
	nodes: AssemblyNode[];
	links: AssemblyLink[];
}

// 1. FORENSIC SCAN: Glob all Intelligence Boluses
// Note: We use ?raw import to get the content string directly.
const intelligenceGlobs = import.meta.glob("../content/projects/**/_intelligence.md", {
	query: "?raw",
	import: "default",
});

export async function getCareerAssembly(
	options: { includeIntelligence?: boolean } = { includeIntelligence: false },
): Promise<CareerAssembly> {
	// A. FETCH RAW MATERIALS
	const projects = await getCollection("projects", ({ data }) => {
		return data.draft !== true;
	});

	const nodes: AssemblyNode[] = [];
	const links: AssemblyLink[] = [];
	const skillMap = new Set<string>();

	// B. FABRICATE PROJECT BODIES (NODES)
	for (const project of projects) {
		// 1. Determine Intelligence Path
		// Logic: Check if _intelligence.md exists in the project's folder.
		// Since projects are flat (c24.mdx) or Folders (c24/index.mdx), we need to resolve the path.
		// Assuming Folder Structure for "Deep" projects OR Flat structure.
		// "Intelligence Bolus" implies a dedicated folder structure for those deep projects.
		// We will fuzzy match the slug to the glob path.

		let intelligenceContent: string | undefined = undefined;
		// Search keys for the slug (e.g., /src/content/projects/c24/_intelligence.md)
		// Glob keys return: "../content/projects/c24/_intelligence.md"
		const bolusKey = Object.keys(intelligenceGlobs).find(
			(k) =>
				k.includes(`/${project.id}/_intelligence.md`) ||
				k.includes(`/${project.id.split("/")[0]}/_intelligence.md`),
		);

		const hasIntelligence = !!bolusKey;

		// OPTIMIZATION: Only load heavy text content if explicitly requested.
		// Defaults to FALSE to save memory during SSG Build (OOM Fix).
		if (bolusKey && options.includeIntelligence) {
			try {
				// Determine if glob returns a string or a promise depending on Vite setup.
				// With { eager: false } (default), it's a function returning a promise.
				// import.meta.glob types can be tricky.
				const loader = intelligenceGlobs[bolusKey] as () => Promise<string>;
				intelligenceContent = await loader();
			} catch (e) {
				console.warn(`[Assembly] Failed to load intelligence for ${project.id}`, e);
			}
		}

		// 2. Create Project Node
		nodes.push({
			id: project.id,
			type: "project",
			data: project.data,
			intelligence: intelligenceContent,
			hasIntelligence, // Lightweight flag for UI
			radius: 20, // Base mass
		});

		// C. FABRICATE FASTENERS (SKILLS)
		// Extract from 'skillData' (Typed) and 'tags' (Loose)

		const skills = new Set<string>();

		// From SkillData (High Fidelity)
		project.data.skillData?.forEach((s) => skills.add(s.name));

		// From Tags (Low Fidelity)
		project.data.tags?.forEach((t) => skills.add(t));

		// Create Links
		skills.forEach((skillName) => {
			const skillId = `skill-${skillName}`;

			// Register Skill Node if new
			if (!skillMap.has(skillId)) {
				nodes.push({
					id: skillId,
					type: "skill",
					data: { name: skillName },
					radius: 5, // Fastener size
				});
				skillMap.add(skillId);
			}

			// Bind Fastener (Link)
			links.push({
				source: project.id,
				target: skillId,
				value: 1,
				type: "fastener",
			});
		});
	}

	// D. RETURN ASSEMBLY
	return { nodes, links, debugGlobs: Object.keys(intelligenceGlobs) } as any;
}
