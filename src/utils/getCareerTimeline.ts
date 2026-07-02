import { getCollection } from "astro:content";
import type { TimelineItem } from "./timelineParser";

export async function getCareerTimeline(): Promise<TimelineItem[]> {
	// 1. Fetch all non-draft projects
	const projects = await getCollection("projects", ({ data }) => {
		return data.draft !== true && data.listed !== false;
	});

	// 2. Map Projects to Timeline Items
	// Strategy: We want to show individual significant projects on the timeline?
	// OR do we want to group them by Employer like the Resume Corpus did?
	// The "Universal History" implies a granule of "Project" or "Role".
	// Let's map 1:1 for now, as that's what the "Exploded View" philosophy supports.
	// However, for the *Resume* PDF, we often want "Job" blocks.

	// Let's create a hybrid view:
	// We will generate items for distinct Roles/Tenures based on the frontmatter.

	const items: TimelineItem[] = projects.map((p) => {
		// Better Date Logic:
		const sDate = p.data.date ? new Date(p.data.date) : new Date();
		const eDate = p.data.endDate ? new Date(p.data.endDate) : null;

		const dateRange = `${sDate.getFullYear()} - ${eDate ? eDate.getFullYear() : "Present"}`;

		return {
			title: dateRange,
			cardTitle: p.data.title, // e.g. "C24 Console"
			cardSubtitle: `${p.data.job_title || p.data.category || "Engineer"} @ ${p.data.employer || "Independent"}`,
			cardDetailedText: p.data.description || "",
			responsibilities: [], // We could try to extract these from body if we wanted to get fancy later
			keyProjects: [],
			techStack: p.data.tools.concat(p.data.tags),
		};
	});

	// 3. Sort by Date
	return items.sort((a, b) => {
		const getYear = (str: string) => {
			const y = str.split("-")[0].trim();
			return parseInt(y) || 9999;
		};
		// If "Present", treat as future (handled by high year default?)
		// Actually let's assume strict year parsing
		return getYear(b.title) - getYear(a.title);
	});
}
