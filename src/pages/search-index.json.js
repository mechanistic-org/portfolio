import { getCollection } from "astro:content";

export const prerender = true;

export async function GET() {
	const projects = await getCollection(
		"projects",
		({ data }) => !data.draft && data.statusLabel !== "NO_DATA",
	);

	const projectItems = projects.map((project) => ({
		id: `project-${project.id}`, // Use ID for stability
		title: project.data.title,
		type: "Project",
		// Fallback to ID if slug is missing
		href: `/projects/${project.slug || project.id}/`,
		description: project.data.description || project.data.subtitle || "",
		keywords: (project.data.tags || []).join(" ") + " " + (project.body || "").substring(0, 500),
	}));

	const docs = await getCollection("docs");
	// Docs: Flatten structure to match [...slug].astro logic
	const docItems = docs.map((doc) => {
		const docId = doc.data.slug || doc.id.split("/").pop().toLowerCase();
		return {
			id: `doc-${docId}`,
			title: doc.data.title,
			type: "System",
			href: `/docs/${docId}/`,
			description: doc.data.description || "",
			keywords: (doc.body || "").substring(0, 1000), // Index body for deep search
		};
	});

	const searchItems = [...projectItems, ...docItems];

	// Add more collections here if needed (e.g., blog)

	return new Response(JSON.stringify(searchItems), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
