import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const text = (file) => readFile(file, "utf8");
const json = async (file) => JSON.parse(await text(file));
const workerDir = ".astro/worker";
const generated = await json(workerDir + "/wrangler.json");
const routeFreeConfig = await json("wrangler.jsonc");
const productionConfig = await json("wrangler.production.jsonc");
const entrypoint = await text(path.join(workerDir, generated.main));
const headers = await text("dist/_headers");
const redirects = await text("dist/_redirects");
const expectedRuntimeRoutes = ["/_server-islands/*", "/_image", "/assets/*"];

assert.equal(routeFreeConfig.main, "./scripts/worker-entry.mjs");
assert.equal(path.resolve(productionConfig.main), path.resolve(workerDir, generated.main));
assert.equal(path.resolve(workerDir, generated.assets.directory), path.resolve("dist"));
assert.equal(path.resolve(productionConfig.assets.directory), path.resolve("dist"));
for (const field of [
	"name",
	"compatibility_date",
	"compatibility_flags",
	"workers_dev",
	"preview_urls",
	"r2_buckets",
]) {
	assert.deepEqual(generated[field], routeFreeConfig[field], field);
	assert.deepEqual(productionConfig[field], routeFreeConfig[field], field);
}
assert.equal(generated.kv_namespaces?.length ?? 0, 0);
assert.ok(!generated.images && !generated.routes?.length);
assert.ok(entrypoint.includes("fetchLocalPassthroughImage"), "Worker wrapper missing from bundle");

// Astro 7 embeds the resolved route manifest in the Worker bundle.
const serialized = entrypoint.match(/deserializeManifest\((\{[^\n]+\})\);/);
assert.ok(serialized, "Cannot verify the generated Astro route manifest");
const manifest = JSON.parse(serialized[1]);
const dynamic = manifest.routes
	.map(({ routeData }) => routeData)
	.filter((route) => !route.prerender);
assert.deepEqual(dynamic.map(({ route }) => route).sort(), [
	"/_image",
	"/_server-islands/[name]",
	"/assets/[...path]",
]);
const islandChunk = manifest.entryModules["\0virtual:astro:server-island-manifest"];
assert.match(await text(path.join(workerDir, islandChunk)), /serverIslandMap\s*=.*new Map\(\[\]\)/);
const workerFiles = await readdir(workerDir, { recursive: true });
for (const file of workerFiles.filter((file) => file.endsWith(".mjs"))) {
	const code = await text(path.join(workerDir, file));
	assert.doesNotMatch(code, /requireReactDomServer_browser_production|MessageChannel/);
}

await Promise.all(
	[
		"index.html",
		"404.html",
		"projects/index.html",
		"about/index.html",
		"resume/index.html",
		"resume.json",
		"api/projects.json",
		"sitemap-index.xml",
		"colophon/chasing-en/index.html",
		"diligence/index.html",
		"yes-shape/index.html",
		"manual/index.html",
	].map((file) => access(path.join("dist", file))),
);

if (!headers.includes("X-Robots-Tag: noindex, nofollow")) {
	throw new Error("The Pages-equivalent X-Robots-Tag rules are missing.");
}

if (!/^\/projects\/zeus\s+\/projects\/webtv-elmer\s+301$/m.test(redirects)) {
	throw new Error("The Pages-equivalent project redirect is missing.");
}

if ("routes" in routeFreeConfig) {
	throw new Error("The direct-verification Worker config must not declare production routes.");
}

for (const config of [routeFreeConfig, generated, productionConfig]) {
	assert.equal(config.assets.binding, "ASSETS");
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
