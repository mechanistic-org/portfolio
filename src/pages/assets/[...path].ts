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
	if (import.meta.env.PROD) {
		// @ts-ignore
		const R2 = locals?.runtime?.env?.PROJECTS;

		if (!R2) {
			console.error("[R2 Proxy] Critical: 'PROJECTS' binding missing in Prod!");
			return new Response("Configuration Error: Missing R2 Binding", { status: 500 });
		}

		try {
			// FIX: Do not use path.join in Cloudflare Worker (Node API missing)
			// R2_STAGING_ROOT is "" in Prod, so we just use the assetPath directly.
			const object = await R2.get(assetPath);

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
	if (import.meta.env.DEV) {
		try {
			// DYNAMIC IMPORTS: Explicitly prevent bundling these into the Worker
			const fs = (await import("node:fs")).default;
			const path = (await import("node:path")).default;
			const mime = (await import("mime-types")).default;

			// DECODE: Handle spaces and special chars
			let decodedPath = decodeURIComponent(assetPath);

			// NORMALIZE SLASHES: Ensure consistent forward slashes for checking
			let checkPath = decodedPath.replace(/\\/g, "/");

			// [DEV FIX] Strip 'r2/' prefix if present
			if (checkPath.startsWith("r2/")) {
				decodedPath = checkPath.substring(3);
			} else if (checkPath.startsWith("/r2/")) {
				// Handle potential leading slash
				decodedPath = checkPath.substring(4);
			}

			// RESOLVE ROOT: Ensure OS-correct slashes for the root
			const stagingRoot = path.resolve("D:/GitHub/eriknorris-assets/R2_STAGING");

			// JOIN: Use path.join to correctly handle slashes on Windows
			const filePath = path.join(stagingRoot, decodedPath);

			if (!fs.existsSync(filePath)) {
				console.warn(`[Asset Proxy] 404 - File Not Found at: ${filePath}`);
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
			return new Response(`Internal Server Error: ${e}`, { status: 500 });
		}
	}

	return new Response("Not Found", { status: 404 });
};
