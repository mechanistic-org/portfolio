import type { APIRoute } from "astro";

export const prerender = false;

// R2 Logic configuration
// [VIRTUAL BRIDGE]: Point directly to external drive to avoid Watcher/Vite memory leaks
const R2_STAGING_ROOT =
	import.meta.env.PROD || process.env.NODE_ENV === "production"
		? "" // Prod (Worker) uses root relative to binding (e.g. "branding/logo.png")
		: "D:/GitHub/eriknorris-assets/R2_STAGING"; // Local Dev Code

const DEBUG_MODE = true;

export const GET: APIRoute = async ({ params, locals }) => {
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

	// 2. FALLBACK STRATEGY (Local Disk)
	// Runs in:
	// - 'npm run dev' (DEV mode)
	// - 'npm run preview' (PROD mode but no Cloudflare bindings)
	try {
		// DYNAMIC IMPORTS: Explicitly prevent bundling these into the Worker
		const fs = (await import("node:fs")).default;
		const path = (await import("node:path")).default;
		const mime = (await import("mime-types")).default;

		// DECODE: Handle spaces and special chars (e.g. "Briefing%20Effect.m4a")
		const decodedPath = decodeURIComponent(assetPath);

		// JOIN: Use path.join to correctly handle slashes on Windows
		const filePath = path.join(R2_STAGING_ROOT, decodedPath);
		// Security check could go here if needed

		console.log(`[Asset Proxy] Requesting: ${assetPath}`);
		console.log(`[Asset Proxy] Resolved to: ${filePath}`);
		console.log(`[Asset Proxy] Exists? ${fs.existsSync(filePath)}`);

		if (!fs.existsSync(filePath)) {
			console.error(`[Asset Proxy] File Not Found: ${filePath}`);
			return new Response(`Not Found Local: ${filePath}`, { status: 404 });
		}

		const contentType = mime.lookup(filePath) || "application/octet-stream";
		const stream = fs.createReadStream(filePath);

		// @ts-ignore
		return new Response(stream, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "no-cache",
			},
		});
	} catch (e) {
		console.error(`[Local Proxy] Error serving ${assetPath}:`, e);
		// Only return 500 if we are definitely trying to serve locally.
		// If imports failed because we are in a Worker environment that doesn't support 'node:fs', it might be different.
		// But since we checked for bindings first, we assume we are in a Node-capable env (Dev or Preview).
		return new Response(`Internal Server Error: ${e}`, { status: 500 });
	}
};
