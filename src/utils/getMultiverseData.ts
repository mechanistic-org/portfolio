import { getCollection } from "astro:content";
import type { MultiverseNode } from "@/types/MultiverseTypes";
import { getEntityColor } from "@/config/color_registry";

/**
 * Returns the Multiverse Graph Data derived dynamically from the 'projects' collection.
 * This replaces the legacy static 'src/data/timeline/multiverse.json'.
 */
export async function getMultiverseData() {
	// 1. Fetch all published projects
	const projects = await getCollection("projects", ({ data }) => {
		return data.draft !== true && data.listed !== false;
	});

	// 2. Map to MultiverseNode schema
	const nodes: MultiverseNode[] = projects.map((p) => {
		const startDate = p.data.date ? new Date(p.data.date) : new Date("2025-01-01");
		const endDate = p.data.endDate ? new Date(p.data.endDate) : new Date();

		// Calculate Mass/Value based on duration density or defaulting
		const durationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
		const value = Math.max(10, Math.sqrt(durationDays));

		return {
			id: p.id,
			name: p.data.title,
			group: p.data.employer || "Independent",
			color: getEntityColor(p.data.employer || "Other", "EMPLOYER"),
			value: value,
			year: startDate.getFullYear(),
			start_date: startDate.toISOString(),
			end_date: endDate.toISOString(),
			category: p.data.category || "Engineering",
			industry: p.data.industry || "Other",
			skills: p.data.tools.concat(p.data.tags),
			img: p.data.heroImage || "",
			tier: p.data.tier,
		};
	});

	// 3. Return the exact shape expected by components: { nodes: [...] }
	return {
		nodes,
		links: [], // Legacy compat
	};
}
