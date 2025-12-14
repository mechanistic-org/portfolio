
import { getCollection } from "astro:content";

export async function GET() {
    const projects = await getCollection(
        "projects",
        ({ data }) => !data.draft && data.statusLabel !== "NO_DATA",
    );

    const searchItems = projects.map((project) => ({
        id: `project-${project.slug}`,
        title: project.data.title,
        type: "Project",
        href: `/projects/${project.slug}/`,
        description: project.data.description || project.data.subtitle || "",
    }));

    // Add more collections here if needed (e.g., blog)

    return new Response(JSON.stringify(searchItems), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
