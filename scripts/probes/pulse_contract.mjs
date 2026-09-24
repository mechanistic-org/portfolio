import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { BASE_URL, VIEWPORTS, runBrowserContract } from "./browser_contract_harness.mjs";

// #290: public retirement replaces the former dashboard/proposal UI contract.
// Snapshot history, approval, privacy and projection tests remain in tests/pulse.
const legacyPaths = ["/colophon/the-pulse", "/colophon/the-pulse/"];
const destination = "/colophon/";
const cacheDirectory = path.join(process.cwd(), "node_modules/.cache/pulse-retirement");

if (process.argv.includes("--built-only")) {
	const redirects = readFileSync("dist/_redirects", "utf8");
	for (const route of legacyPaths) assert.ok(redirects.includes(`${route} ${destination} 301`));
	const fallbackPath = "dist/colophon/the-pulse/index.html";
	if (existsSync(fallbackPath)) {
		const fallback = readFileSync(fallbackPath, "utf8");
		assert.match(fallback, /http-equiv="refresh"/i);
		assert.match(fallback, /url=\/colophon\//);
		assert.doesNotMatch(fallback, /data-pulse-|Operating discipline|snapshot history/i);
	}
	for (const route of ["colophon", "how-i-work"]) {
		const html = readFileSync(`dist/${route}/index.html`, "utf8");
		assert.doesNotMatch(html, /data-pulse-|href=["'][^"']*\/colophon\/the-pulse\/?["']/);
	}
	assert.doesNotMatch(readFileSync("dist/sitemap-0.xml", "utf8"), /\/colophon\/the-pulse\/?/);
	console.log(
		"PASS: Pulse HTTP redirect rules, static fallback, promotion removal and sitemap exclusion in the built site.",
	);
	process.exit(0);
}

const specs = [];
for (const viewport of VIEWPORTS) {
	specs.push([
		`${viewport.name}: retired Pulse links lead to Colophon without a dashboard`,
		async (page) => {
			await page.setCacheEnabled(false);
			await page.setViewport(viewport);
			await page.setJavaScriptEnabled(false);
			try {
				for (const route of legacyPaths) {
					await page.goto(BASE_URL + route, { waitUntil: "networkidle0" });
					await page.waitForFunction(() => location.pathname === "/colophon/");
					assert.equal(await page.$("[data-pulse-history-root], [data-pulse-proof-group]"), null);
					assert.ok(await page.$("#colophon-features"));
				}
			} finally {
				await page.setJavaScriptEnabled(true);
			}
		},
	]);
}
specs.push([
	"Colophon and How I Work no longer promote The Pulse",
	async (page) => {
		for (const route of ["/colophon/", "/how-i-work/"]) {
			const response = await page.goto(BASE_URL + route, { waitUntil: "networkidle0" });
			assert.equal(response.status(), 200);
			assert.equal(
				await page.$(
					'[data-pulse-entry], a[href="/colophon/the-pulse/"], a[href="/colophon/the-pulse"]',
				),
				null,
			);
			assert.equal(await page.$$eval("h1", (els) => els.length), 1);
		}
	},
]);
process.exit(
	(await runBrowserContract({
		assertionSpecs: specs,
		expectedAssertions: 4,
		cacheDirectory,
		title: "#290 public Pulse retirement",
	}))
		? 0
		: 1,
);
