/**
 * ⚠️ CRITICAL ARCHITECTURE COMPONENT ⚠️
 *
 * This file replaces the "Manual Worker" strategy with a "Pages Function".
 * It handles the R2 Asset Proxy for the "Zero-Bloat" architecture.
 *
 * READ [docs/ARCHITECTURE.md] BEFORE MODIFYING.
 */

export async function onRequest(context) {
	const { request, env } = context;
	const url = new URL(request.url);

	// DEBUG: Deep Probe Health Check (LIST Operation)
	if (url.pathname === "/debug/health") {
		const prefix = "dreamjob/";
		let r2Status = "UNKNOWN";
		let errorDetails = "";
		let listedKeys = [];

		try {
			if (!env.PROJECTS) {
				return new Response("CRITICAL: env.PROJECTS is UNDEFINED. Check wrangler.toml binding.", {
					status: 500,
				});
			}

			// List the bucket contents to see what the worker sees
			const listResult = await env.PROJECTS.list({ prefix: prefix, limit: 10 });
			listedKeys = listResult.objects.map((o) => o.key);

			if (listedKeys.length > 0) {
				r2Status = `FOUND ${listedKeys.length} items. First: '${listedKeys[0]}'`;
			} else {
				r2Status = "EMPTY LIST (Bucket appears empty to Worker)";
			}
		} catch (e) {
			r2Status = "ERROR";
			errorDetails = e.message;
		}

		const report = `
STATUS: RUNNING (Functions Mode)
BINDING: env.PROJECTS is ${!!env.PROJECTS ? "DEFINED" : "MISSING"}
LIST PREFIX: '${prefix}'
RESULT: ${r2Status}
KEYS FOUND:
${listedKeys.join("\n")}
ERROR: ${errorDetails}
        `.trim();

		return new Response(report, { status: 200 });
	}

	// R2 Proxy Logic for /r2/* AND /assets/r2/*
	if (url.pathname.startsWith("/r2/") || url.pathname.startsWith("/assets/r2/")) {
		let key = "";
		if (url.pathname.startsWith("/r2/")) {
			key = url.pathname.replace("/r2/", "");
		} else {
			key = url.pathname.replace("/assets/r2/", "");
		}

		// Safety: Allow only GET/HEAD
		if (request.method !== "GET" && request.method !== "HEAD") {
			return new Response("Method Not Allowed", { status: 405 });
		}

		try {
			const object = await env.PROJECTS.get(key);

			if (!object) {
				return new Response(`R2 Object Not Found: ${key}`, {
					status: 404,
					headers: { "X-Debug-Key": key },
				});
			}

			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set("etag", object.httpEtag);
			// CRITICAL: Force revalidation to fix stale asset issues
			headers.set("Cache-Control", "no-cache");
			headers.set("X-Debug-Key", key);

			return new Response(object.body, {
				headers,
			});
		} catch (e) {
			return new Response("Error fetching asset", { status: 500 });
		}
	}

	// Fallback: Serve static assets (Astro build)
	return context.next();
}
