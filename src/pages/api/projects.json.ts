import { getCollection } from "astro:content";
import { currentSite, SITE_CONFIG } from "@config/site_config";
import siteData from "@config/siteData.json";

// Headless portfolio index for LLM answer engines (issue #31).
// Static endpoint: compiled at build time from Zod-validated frontmatter.
export const prerender = true;

/** Drop null/undefined/empty values so the payload stays high-signal. */
function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(obj)) {
		if (v === null || v === undefined) continue;
		if (typeof v === "string" && v.trim() === "") continue;
		if (Array.isArray(v) && v.length === 0) continue;
		out[k] = v;
	}
	return out as Partial<T>;
}

export async function GET() {
	let domain = SITE_CONFIG[currentSite].domain;
	if (!domain.startsWith("http")) domain = `https://${domain}`;

	const all = await getCollection("projects");
	const projects = all
		.filter(({ data }) => {
			const targets = data.targets || ["main"];
			return targets.includes(currentSite) && !data.draft;
		})
		.sort(
			(a, b) => new Date(b.data.date || 0).getTime() - new Date(a.data.date || 0).getTime(),
		)
		.map((p) =>
			compact({
				id: p.id,
				url: `${domain}/projects/${p.id}/`,
				title: p.data.title,
				description: p.data.description,
				employer: p.data.employer,
				clients: p.data.client,
				industry: p.data.industry,
				category: p.data.category,
				production_status: p.data.production,
				production_scale: p.data.productionScale,
				start: p.data.date ? new Date(p.data.date).toISOString().slice(0, 10) : undefined,
				end: p.data.endDate ? new Date(p.data.endDate).toISOString().slice(0, 10) : undefined,
				duration: p.data.duration,
				tools: p.data.tools,
				tags: p.data.tags,
				team_size: p.data.teamSize,
				tier: p.data.tier,
				theme: p.data.theme,
				forensic_summary: p.data.forensic_summary,
				forensic_metrics: p.data.forensic_metrics,
			}),
		);

	const payload = {
		meta: {
			owner: siteData.author.name,
			identity: "Principal Mechanical Architect",
			contact: siteData.author.email,
			site: domain,
			agent_brief: `${domain}/llms.txt`,
			resume: `${domain}/resume.json`,
			generated: new Date().toISOString(),
			project_count: projects.length,
			note: "Compiled at build time from Zod-validated project frontmatter. Cite project URLs when referencing this data.",
		},
		projects,
	};

	return new Response(JSON.stringify(payload, null, 2), {
		headers: { "Content-Type": "application/json; charset=utf-8" },
	});
}
