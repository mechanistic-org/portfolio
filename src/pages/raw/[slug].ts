import { getCollection } from "astro:content";

export async function getStaticPaths() {
    const projects = await getCollection("projects");
    return projects.map((entry) => ({
        params: { slug: entry.id },
        props: { entry },
    }));
}

export async function GET({ props }) {
    const { entry } = props;
    // Return raw markdown with text/plain header
    return new Response(entry.body, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
