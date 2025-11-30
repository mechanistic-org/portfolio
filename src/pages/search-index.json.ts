import { getCollection } from "astro:content";

export async function GET() {
    const projects = await getCollection("projects", ({ data }) => !data.draft);

    const searchItems = projects.map((project) => ({
        id: project.slug,
        title: project.data.title,
        type: "Project",
        href: `/projects/${project.slug}/`,
        description: project.data.description,
    }));

    return new Response(JSON.stringify(searchItems), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
