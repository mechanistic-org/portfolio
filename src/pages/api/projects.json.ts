import { getCollection } from "astro:content";
import { currentSite, SITE_CONFIG } from "@config/site_config";
import siteData from "@config/siteData.json";
import { projectApiRecord } from "../../lib/project-api.mjs";

// Headless portfolio index for LLM answer engines (issue #31).
// Static endpoint: compiled at build time from Zod-validated frontmatter.
export const prerender = true;

export async function GET() {
	let domain = SITE_CONFIG[currentSite].domain;
	if (!domain.startsWith("http")) domain = `https://${domain}`;

	const all = await getCollection("projects");
	const projects = all
		.filter(({ data }) => {
			const targets = data.targets || ["main"];
			return targets.includes(currentSite) && !data.draft;
		})
		.sort((a, b) => new Date(b.data.date || 0).getTime() - new Date(a.data.date || 0).getTime())
		.map((p) => projectApiRecord(p, domain));

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
