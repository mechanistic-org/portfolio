import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
	const key = params.path?.replace(/^r2\//, "");
	if (!key) return new Response("Not Found", { status: 404 });
	if (!env.PROJECTS) return new Response("Missing R2 binding", { status: 500 });

	const object = await env.PROJECTS.get(key);
	if (!object) return new Response("Not Found", { status: 404 });

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set("etag", object.httpEtag);
	return new Response(object.body, { headers });
};
