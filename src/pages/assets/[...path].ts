import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";
import mime from "mime-types";

// HYBRID ASSET ROUTER
// ----------------------------------------------------------------------------
// Local (Dev): Serves directly from D:/.../R2_STAGING (Bypassing VS Code Watcher)
// Prod (Cloudflare): Proxies request to https://assets.eriknorris.com (R2 Bucket)
// ----------------------------------------------------------------------------

export const prerender = false;

const R2_STAGING_ROOT = "D:/GitHub/eriknorris-assets/R2_STAGING";
const R2_BUCKET_URL = "https://assets.eriknorris.com";

export const GET: APIRoute = async ({ params, request }) => {
	// 1. Normalize Path
	// Strip 'r2/' prefix if present to match the actual structure
	// e.g. /assets/r2/c24/image.jpg -> c24/image.jpg
	const assetPath = params?.path?.replace(/^r2\//, "") || "";

	if (!assetPath) {
		return new Response("Bad Request: No path provided", { status: 400 });
	}

	// 2. PRODUCTION STRATEGY (Worker Proxy)
	if (import.meta.env.PROD) {
		try {
			const targetUrl = `${R2_BUCKET_URL}/${assetPath}`;
			// Fetch from R2 (The "Mooted" Direct Access, proxied via App)
			const response = await fetch(targetUrl);

			// Pass through the response (Streams automatically in Workers)
			return new Response(response.body, {
				status: response.status,
				headers: {
					"Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
					"Cache-Control": "public, max-age=31536000, immutable", // Long cache for immutable assets
					"Access-Control-Allow-Origin": "*",
				},
			});
		} catch (e) {
			console.error(`[Prod Proxy] Failed to fetch ${assetPath}`, e);
			return new Response("Upstream Error", { status: 502 });
		}
	}

	// 3. LOCAL STRATEGY (Disk Read)
	// This runs in Node.js during 'npm run dev' or 'npm run build' (SSG)
	const filePath = path.resolve(R2_STAGING_ROOT, assetPath);
	const normalizedRoot = path.resolve(R2_STAGING_ROOT);

	// Security Check
	if (!filePath.startsWith(normalizedRoot)) {
		return new Response("Forbidden", { status: 403 });
	}

	if (!fs.existsSync(filePath)) {
		return new Response(`Not Found: ${assetPath}`, { status: 404 });
	}

	try {
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
