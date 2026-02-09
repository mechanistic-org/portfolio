import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";
import mime from "mime-types";

// STARTUP:
// Local (Server Mode): This file acts as a dynamic SSR proxy. getStaticPaths is ignored.
// Prod (Static Mode): getStaticPaths is REQUIRED. We return [] to generate NO pages.
//                     The traffic is handled by public/_redirects -> R2.
export async function getStaticPaths() {
	return [];
}

const R2_STAGING_ROOT = "D:/GitHub/eriknorris-assets/R2_STAGING";
// ----------------------------------------------------------------------------

export const GET: APIRoute = async ({ params, request }) => {
	// Strip 'r2/' prefix if present to match the actual R2_STAGING structure
	const assetPath = params?.path?.replace(/^r2\//, "") || "";

	if (!assetPath) {
		return new Response("Bad Request: No path provided", { status: 400 });
	}

	// Construct the absolute path to the file
	// normalize() helps with Windows backslashes
	const filePath = path.resolve(R2_STAGING_ROOT, assetPath);
	const normalizedRoot = path.resolve(R2_STAGING_ROOT);

	console.log(`[Asset Proxy] Request: ${assetPath}`);
	console.log(`[Asset Proxy] Resolved: ${filePath}`);
	console.log(`[Asset Proxy] Root:     ${normalizedRoot}`);

	// Security Check: Ensure we don't traverse outside the staging root
	if (!filePath.startsWith(normalizedRoot)) {
		console.error(
			`[Asset Proxy] 403 Forbidden: Resolved path '${filePath}' is outside root '${normalizedRoot}'`,
		);
		return new Response("Forbidden", { status: 403 });
	}

	// Check if file exists
	if (!fs.existsSync(filePath)) {
		return new Response(`Not Found: ${assetPath} (looked in ${R2_STAGING_ROOT})`, { status: 404 });
	}

	try {
		// Determine MIME type
		const contentType = mime.lookup(filePath) || "application/octet-stream";

		// Create a read stream and serve it
		// We use a stream to be memory efficient with large files (videos, etc.)
		const stream = fs.createReadStream(filePath);

		// @ts-ignore - ReadableStream type mismatch is common in Astro/Node adapter but works
		return new Response(stream, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=3600",
			},
		});
	} catch (e) {
		console.error(`Error serving asset ${assetPath}:`, e);
		return new Response("Internal Server Error", { status: 500 });
	}
};
