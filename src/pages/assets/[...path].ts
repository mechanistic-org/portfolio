import type { APIRoute } from "astro";

export const prerender = false;

// R2 Logic configuration
// [VIRTUAL BRIDGE]: Point directly to external drive to avoid Watcher/Vite memory leaks
const R2_MIRROR_ROOT =
	import.meta.env.PROD || process.env.NODE_ENV === "production"
		? "" // Prod (Worker) uses root relative to binding (e.g. "branding/logo.png")
		: "D:/GitHub/portfolio-assets/R2_MIRROR"; // Local Dev Code

const DEBUG_MODE = true;

// Singleton cache for Node APIs to prevent blocking the event loop on 50+ concurrent image loads
let devFs: any = null;
let devPath: any = null;
let devMime: any = null;

// Some content (notably the c24 canon record) addresses assets as
// `/assets/r2/<slug>/…`, but `sync_r2.py` mirrors R2_MIRROR verbatim, so the
// bucket has no `r2/` top-level key. This normalization used to exist only in
// the DEV branch below, which is why those images resolved locally and 404'd in
// production. Normalize once, up front, for every environment.
const stripR2Prefix = (p: string) => p.replace(/^\/?r2\//, "");

export const GET: APIRoute = async ({ params, locals }) => {
	const assetPath = params.path && stripR2Prefix(params.path);

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
			// R2_MIRROR_ROOT is "" in Prod, so we just use the assetPath directly.
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
			// DYNAMIC IMPORTS: Cache them at module level if possible, or await once.
			// Re-evaluating these on every one of 50 simultaneous image requests blocks
			// the Node.js event loop causing ERR_CONNECTION_REFUSED.
			if (!devFs) devFs = await import("node:fs");
			if (!devPath) devPath = await import("node:path");
			if (!devMime) devMime = await import("mime-types");

			const fs = devFs.default || devFs;
			const path = devPath.default || devPath;
			const mime = devMime.default || devMime;
			const { Readable } = await import("node:stream");

			// DECODE: Handle spaces and special chars
			let decodedPath = decodeURIComponent(assetPath);

			// NORMALIZE SLASHES: Ensure consistent forward slashes for checking
			// (the 'r2/' prefix is already stripped for every environment above)
			decodedPath = decodedPath.replace(/\\/g, "/");

			// RESOLVE ROOT: Ensure OS-correct slashes for the root
			const stagingRoot = path.resolve("D:/GitHub/portfolio-assets/R2_MIRROR");

			// JOIN: Use path.join to correctly handle slashes on Windows
			const filePath = path.join(stagingRoot, decodedPath);

			if (!fs.existsSync(filePath)) {
				console.warn(`[Asset Proxy] 404 - File Not Found at: ${filePath}`);
				return new Response(`Not Found Local: ${filePath}`, { status: 404 });
			}

			const contentType = mime.lookup(filePath) || "application/octet-stream";
			const nodeStream = fs.createReadStream(filePath);
			// Convert Node stream to Web Stream to prevent Vite pipelining crashes
			const webStream = Readable.toWeb(nodeStream);

			return new Response(webStream as unknown as ReadableStream, {
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
