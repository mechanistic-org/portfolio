import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
    const { path } = params;

    // Access the R2 binding from the Cloudflare runtime
    // @ts-ignore - Types for locals.runtime are dynamically generated
    const bucket = locals.runtime?.env?.PROJECTS;

    if (!bucket) {
        // If running locally without wrangler, or binding fails
        return new Response("R2 Bucket Binding Missing. Ensure wrangler dev or binding is set.", {
            status: 500,
        });
    }

    if (!path) {
        return new Response("Path required", { status: 400 });
    }

    try {
        // Normalize path (remove leading slash if present, though Astro params usually clean it)
        const cleanPath = path.startsWith("/") ? path.slice(1) : path;
        const object = await bucket.get(cleanPath);

        if (!object) {
            return new Response(`Asset not found in R2: ${cleanPath}`, { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        // Ensure cache control for performance
        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        return new Response(object.body, {
            headers,
        });
    } catch (error) {
        console.error("R2 Proxy Error:", error);
        return new Response("Internal Server Error retrieving asset", { status: 500 });
    }
};
