import { synopsisText } from "./project-synopsis.mjs";

/** Public reader data only: career selectors and private source receipts stay out. */
export function projectApiRecord(project, domain) {
	const { id, data } = project;
	const synopsis = data.synopsis;
	const record = {
		id,
		url: `${domain}/projects/${id}/`,
		title: data.title,
		// Keep the compact card description; summary is the current reader account.
		description: data.description,
		summary: synopsis
			? synopsisText(synopsis)
			: data.forensic_summary?.result || data.forensic_summary?.objective || data.description,
		synopsis: synopsis
			? {
					version: synopsis.version,
					title: synopsis.title,
					subtitle: synopsis.subtitle,
					paragraphs: synopsis.paragraphs,
				}
			: undefined,
		employer: data.employer,
		clients: data.client,
		industry: data.industry,
		category: data.category,
		production_status: data.production,
		production_scale: data.productionScale,
		start: data.date ? new Date(data.date).toISOString().slice(0, 10) : undefined,
		end: data.endDate ? new Date(data.endDate).toISOString().slice(0, 10) : undefined,
		duration: data.duration,
		tools: data.tools,
		tags: data.tags,
		team_size: data.teamSize,
		tier: data.tier,
		theme: data.theme,
		// Match the homepage reader: a synopsis supersedes the legacy summary.
		forensic_summary: synopsis ? undefined : data.forensic_summary,
		forensic_metrics: data.forensic_metrics,
	};
	return Object.fromEntries(
		Object.entries(record).filter(
			([, value]) =>
				value !== null &&
				value !== undefined &&
				!(typeof value === "string" && !value.trim()) &&
				!(Array.isArray(value) && !value.length),
		),
	);
}
