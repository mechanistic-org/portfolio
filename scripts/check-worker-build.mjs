import { access, readdir, readFile } from "node:fs/promises";

const requiredFiles = [
	"dist/_worker.js/index.js",
	"dist/_routes.json",
	"dist/.assetsignore",
	"dist/_headers",
	"dist/_redirects",
	"dist/index.html",
	"dist/404.html",
];

await Promise.all(requiredFiles.map((file) => access(file)));

const routes = JSON.parse(await readFile("dist/_routes.json", "utf8"));
const entrypoint = await readFile("dist/_worker.js/index.js", "utf8");
const workerChunkNames = (await readdir("dist/_worker.js/chunks", { withFileTypes: true }))
	.filter((entry) => entry.isFile())
	.map((entry) => entry.name);
const workerChunks = await Promise.all(
	workerChunkNames.map((name) => readFile(`dist/_worker.js/chunks/${name}`, "utf8")),
);
const headers = await readFile("dist/_headers", "utf8");
const redirects = await readFile("dist/_redirects", "utf8");
const routeFreeConfig = JSON.parse(await readFile("wrangler.jsonc", "utf8"));
const productionConfig = JSON.parse(await readFile("wrangler.production.jsonc", "utf8"));

const expectedRuntimeRoutes = ["/_server-islands/*", "/_image", "/assets/*"];
const expectedStaticExclusions = [
	"/",
	"/_astro/*",
	"/#",
	"/projects/*",
	"/.assetsignore",
	"/apple-touch-icon.png",
	"/favicon-96x96.png",
	"/favicon.ico",
	"/favicon.svg",
	"/llms.txt",
	"/robots.txt",
	"/site.webmanifest",
	"/web-app-manifest-192x192.png",
	"/web-app-manifest-512x512.png",
	"/diligence/index.html",
	"/yes-shape/index.html",
	"/manual/index.html",
	"/api/*",
	"/resume.json",
	"/404",
	"/about",
	"/assembly",
	"/colophon/*",
	"/contact",
	"/design-system",
	"/docs/*",
	"/how-i-work",
	"/kitchen-sink",
	"/meta/*",
	"/resume/*",
];

if (
	JSON.stringify(routes.include) !== JSON.stringify(expectedRuntimeRoutes) ||
	JSON.stringify([...routes.exclude].sort()) !== JSON.stringify([...expectedStaticExclusions].sort())
) {
	throw new Error(`Generated Astro route precedence changed: ${JSON.stringify(routes)}`);
}

for (const generatedModule of ["pages/_image.astro.mjs", "pages/assets/_---path_.astro.mjs"]) {
	if (!entrypoint.includes(generatedModule)) {
		throw new Error(`Generated Astro entrypoint is missing: ${generatedModule}`);
	}
}

if (!entrypoint.includes("serverIslandMap = new Map()")) {
	throw new Error("Generated server-island disposition changed; inspect before deployment.");
}

if (entrypoint.includes("debug/health") || entrypoint.includes("functions/")) {
	throw new Error("A stale root Pages Function entered the generated Worker.");
}

if (
	workerChunks.some(
		(chunk) =>
			chunk.includes("requireReactDomServer_browser_production") ||
			chunk.includes("MessageChannel"),
	)
) {
	throw new Error(
		"The Worker contains the browser React server bundle rejected by Cloudflare; rebuild with CF_PAGES=1.",
	);
}

if (!headers.includes("X-Robots-Tag: noindex, nofollow")) {
	throw new Error("The Pages-equivalent X-Robots-Tag rules are missing.");
}

if (!/^\/projects\/zeus\s+\/projects\/webtv-elmer\s+301$/m.test(redirects)) {
	throw new Error("The Pages-equivalent project redirect is missing.");
}

if ("routes" in routeFreeConfig) {
	throw new Error("The direct-verification Worker config must not declare production routes.");
}

for (const config of [routeFreeConfig, productionConfig]) {
	if (config.main !== "./scripts/worker-entry.mjs") {
		throw new Error("Wrangler must enter through the generated Astro runtime parity wrapper.");
	}
	if (JSON.stringify(config.assets.run_worker_first) !== JSON.stringify(expectedRuntimeRoutes)) {
		throw new Error("Wrangler run_worker_first must match the complete generated runtime surface.");
	}
	if (
		JSON.stringify(config.r2_buckets) !==
		JSON.stringify([{ binding: "PROJECTS", bucket_name: "assets-eriknorris-com" }])
	) {
		throw new Error("The property-owned PROJECTS R2 binding changed.");
	}
}

const expectedProductionRoutes = [
	{ pattern: "eriknorris.com/*", zone_name: "eriknorris.com" },
	{ pattern: "www.eriknorris.com/*", zone_name: "eriknorris.com" },
];

if (JSON.stringify(productionConfig.routes) !== JSON.stringify(expectedProductionRoutes)) {
	throw new Error("The production config must contain only the approved apex and www routes.");
}

const { fetchLocalPassthroughImage } = await import("./worker-image-passthrough.mjs");
const imageBytes = new Uint8Array([137, 80, 78, 71]);
let requestedAssetPath;
const imageResponse = await fetchLocalPassthroughImage(
	new Request("https://eriknorris.example/_image?href=%2Ffavicon.png&w=128&f=webp"),
	{
		ASSETS: {
			async fetch(request) {
				requestedAssetPath = new URL(request.url).pathname;
				return new Response(imageBytes, {
					headers: {
						"Content-Type": "image/png",
						"Cache-Control": "public, must-revalidate, max-age=0",
					},
				});
			},
		},
	},
);

if (
	requestedAssetPath !== "/favicon.png" ||
	imageResponse.status !== 200 ||
	imageResponse.headers.get("Content-Type") !== "image/png" ||
	imageResponse.headers.get("Cache-Control") !== "public, must-revalidate, max-age=0" ||
	new Uint8Array(await imageResponse.arrayBuffer()).toString() !== imageBytes.toString()
) {
	throw new Error("The Workers Static Assets image passthrough adapter failed.");
}

console.log(
	"Verified static Astro output, complete generated route precedence, headers, redirects, exact Worker routes, and PROJECTS R2 binding.",
);
