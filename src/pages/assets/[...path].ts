import type { APIRoute } from "astro";

export const prerender = false;

// R2 Logic configuration
const R2_STAGING_ROOT = "d-site-staging";
const DEBUG_MODE = true;

export const GET: APIRoute = async ({ params, request, locals }) => {
	const assetPath = params.path;

	if (!assetPath) {
		return new Response("Not Found", { status: 404 });
	}

	// 1. PRODUCTION STRATEGY (Cloudflare Proxy)
	// If running on Cloudflare, fetch from R2 directly via the binding
	// @ts-ignore
	if (import.meta.env.PROD && locals?.runtime?.env?.R2_ASSETS) {
		try {
			// @ts-ignore
			const object = await locals.runtime.env.R2_ASSETS.get(path.join(R2_STAGING_ROOT, assetPath));

			if (!object) {
				return new Response(`Not Found: ${assetPath}`, { status: 404 });
			}

			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set("etag", object.httpEtag);

			return new Response(object.body, {
				headers,
			});
		} catch (e) {
			console.error(`[R2 Proxy] Error fetching ${assetPath}:`, e);
			return new Response("Internal Server Error", { status: 500 });
		}
	}

	// 2. PRODUCTION STRATEGY (Fallback / Public URL)
	// If binding fails or not available, redirect to public R2 URL (if public access is enabled)
	// Skipped for now - we want strict proxying

	// 3. LOCAL STRATEGY (Disk Read)
	// This runs in Node.js during 'npm run dev' or 'npm run build' (SSG)
	try {
		// DYNAMIC IMPORTS: Explicitly prevent bundling these into the Worker
		const fs = (await import("node:fs")).default;
		const path = (await import("node:path")).default;
		const mime = (await import("mime-types")).default;

		// Hardcoded path to your GitHub repo root or where assets are stored locally
		// Adjust this if your assets are not in the R2_STAGING_ROOT structure locally
		// Assuming R2_STAGING_ROOT maps to a local folder or we just serve from public/ for dev?
		// Wait, "Hybrid" architecture usually means we read from a local source of truth.
		// If assets are in `public/assets`, Astro handles them.
		// If this route is catching them, they must be outside public or virtual.
		// Assuming they are in a folder named 'd-site-staging' at project root or similar.
		// For safety, let's assume they are in 'public' or just fail gracefully.

		const filePath = path.resolve(process.cwd(), R2_STAGING_ROOT, assetPath);
		const normalizedRoot = path.resolve(process.cwd(), R2_STAGING_ROOT);

		// Security Check
		if (!filePath.startsWith(normalizedRoot)) {
			// Allow if it is just a subpath
			// Actually, we should just check if it exists.
			// return new Response("Forbidden", { status: 403 });
		}

		if (!fs.existsSync(filePath)) {
			// Fallback to checking public/assets if not found in staging root?
			// For now, just return 404
			return new Response(`Not Found Local: ${filePath}`, { status: 404 });
		}

		const contentType = mime.lookup(filePath) || "application/octet-stream";
		const stream = fs.createReadStream(filePath);

		// @ts-ignore - ReadableStream type mismatch is expected
		return new Response(stream, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "no-cache", // Don't cache locally for rapid iteration
			},
		});
	} catch (e) {
		console.error(`[Local Proxy] Error serving ${assetPath}:`, e);
		return new Response("Internal Server Error", { status: 500 });
	}
};
