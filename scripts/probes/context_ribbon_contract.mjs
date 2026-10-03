import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildContextRibbon } from "../../src/utils/contextRibbon.ts";
import { careerRecords, routeEligibleProjects } from "../../src/utils/projectRoster.ts";
import { createServer } from "vite";
import { globSync } from "glob";
import matter from "gray-matter";
import { BASE_URL, PAGE_TIMEOUT_MS, runBrowserContract } from "./browser_contract_harness.mjs";

const cacheDirectory = path.join(
	process.cwd(),
	"node_modules",
	".cache",
	"context-ribbon-contract",
);
// Vite resolves the application's extensionless TypeScript imports as Astro does.
const sourceLoader = await createServer({
	configFile: false,
	optimizeDeps: { noDiscovery: true, include: [] },
	server: { middlewareMode: true },
	appType: "custom",
});
let careerIdentityAliases;
try {
	({ careerIdentityAliases } = await sourceLoader.ssrLoadModule(
		"/src/config/projectArticleTrial.ts",
	));
} finally {
	await sourceLoader.close();
}
// The same generated project records consumed by getCareerAssembly(). The debug
// endpoint intentionally exposes only samples, so it cannot prove source parity.
const generatedNodes = await Promise.all(
	globSync("src/content/projects/**/*.mdx", { posix: true }).map(async (file) => ({
		id: file.replace("src/content/projects/", "").replace(/(?:\/index)?\.mdx$/u, ""),
		type: "project",
		data: matter(await readFile(file, "utf8")).data,
	})),
);
const expectedModel = buildContextRibbon(
	careerRecords(routeEligibleProjects(generatedNodes, "main"), careerIdentityAliases),
	"c24",
);
const node = (id, date, endDate) => ({ id, type: "project", data: { title: id, date, endDate } });
const fixtures = [
	node("current", "2005-06-02T00:00:00Z", "2007-11-20T00:00:00Z"),
	node("point", "2005-06-01T00:00:00Z"),
	node("reversed", "2005-06-03T00:00:00Z", "2000-01-01T00:00:00Z"),
	node("missing", undefined),
	node("invalid", "not-a-date"),
	node("distant", "2020-01-01T00:00:00Z"),
	...Array.from({ length: 12 }, (_, i) =>
		node(`neighbor-${i}`, `2005-07-${String(i + 1).padStart(2, "0")}T00:00:00Z`),
	),
];
const projected = buildContextRibbon(fixtures, "current");
assert.deepEqual(projected, buildContextRibbon([...fixtures].reverse(), "current"));
assert.equal(projected.projects.length, 7);
assert.deepEqual([projected.startYear, projected.endYear], [2003, 2009]);
assert.equal(projected.projects.find((p) => p.slug === "point").end, null);
assert.equal(projected.projects.find((p) => p.slug === "reversed").end, null);
assert.equal(
	projected.projects.some((p) => ["missing", "invalid", "distant"].includes(p.slug)),
	false,
);
assert.equal(buildContextRibbon(fixtures, "missing"), null);
assert.equal(buildContextRibbon([], "current"), null);
assert.deepEqual(
	projected,
	buildContextRibbon(
		fixtures.map((n) =>
			n.id === "current"
				? {
						...n,
						data: { ...n.data, date: new Date(n.data.date), endDate: new Date(n.data.endDate) },
					}
				: n,
		),
		"current",
	),
);
for (const item of projected.projects) assert.ok(item.x >= 24 && item.x + item.width <= 936);
console.log(
	"PASS adapter: stable ordering, bounded selection, UTC dates, missing/reversed ends, missing current",
);

async function c24(page, problems, expand = true) {
	problems.length = 0;
	const response = await page.goto(`${BASE_URL}/projects/c24/`, {
		waitUntil: "networkidle0",
		timeout: PAGE_TIMEOUT_MS,
	});
	if (response) assert.equal(response.status(), 200);
	assert.equal(new URL(page.url()).pathname, "/projects/c24/");
	await page.waitForSelector("[data-context-ribbon]");
	if (expand) await page.click(".career-neighborhood:not([open]) > summary");
}

async function geometry(page) {
	return page.$eval("[data-context-ribbon] svg", (svg) => svg.outerHTML);
}

async function destination(page, href) {
	// ClientRouter can emit a same-document navigation before its destination
	// swap. Assert the user-visible destination, not the first navigation event.
	await page.waitForFunction(
		(expected) => location.pathname === expected,
		{ timeout: PAGE_TIMEOUT_MS },
		href,
	);
	await page.waitForSelector(
		`[data-context-ribbon][data-current="${href.split("/").filter(Boolean).at(-1)}"]`,
		{
			timeout: PAGE_TIMEOUT_MS,
		},
	);
}

const specs = [
	[
		"Homepage shares the period disclosure and keeps selection in the console",
		async (page, problems) => {
			problems.length = 0;
			await page.setViewport({ width: 1440, height: 1000 });
			await page.goto(BASE_URL + "/#project=sc48", {
				waitUntil: "networkidle0",
				timeout: PAGE_TIMEOUT_MS,
			});
			await page.waitForSelector('[data-context-ribbon][data-current="sc48"]');
			assert.equal(await page.$eval(".career-neighborhood", (el) => el.open), true);
			const marks = await page.$eval("[data-career-overview] a", (els) => els.length);
			await page.focus(".career-neighborhood > summary");
			await page.keyboard.press("Enter");
			await page.waitForFunction(() => !document.querySelector(".career-neighborhood").open);
			assert.equal(await page.$eval(".career-neighborhood", (el) => el.open), false);
			await page.evaluate(() => new Promise(requestAnimationFrame));
			await page.keyboard.press("Enter");
			await page.waitForFunction(() => document.querySelector(".career-neighborhood").open);
			assert.equal(await page.$eval(".career-neighborhood", (el) => el.open), true);
			const link = ".career-tracks a:not([aria-current])";
			const selected = await page.$eval(link, (el) => el.dataset.project);
			await page.click(link);
			await page.waitForSelector('[data-context-ribbon][data-current="' + selected + '"]');
			assert.equal(new URL(page.url()).pathname, "/");
			assert.equal(await page.$eval("[data-career-overview] a", (els) => els.length), marks);
			return "same native disclosure; selected period expands by default; neighboring work updates the homepage console";
		},
	],
	[
		"Period control stays anchored and separate from navigation",
		async (page, problems) => {
			for (const width of [1440, 768, 390, 320]) {
				await page.setViewport({ width, height: 1000 });
				await c24(page, problems, false);
				// Exercise both ends of the career and a long title without changing chronology.
				for (const center of [2, 50, 98]) {
					await page.$eval(
						"[data-context-ribbon]",
						(el, percent) => {
							el.style.setProperty("--window-center", percent + "%");
							el.querySelector(".career-current").firstChild.textContent =
								"A longer project title for a narrow career navigator ";
						},
						center,
					);
					const measure = () =>
						page.$eval("[data-context-ribbon]", (el) => {
							const box = (node) => {
								const r = node.getBoundingClientRect();
								return {
									left: r.left,
									right: r.right,
									top: r.top,
									bottom: r.bottom,
									height: r.height,
								};
							};
							return {
								summary: box(el.querySelector(".career-neighborhood > summary")),
								overview: box(el.querySelector(".career-overview")),
								utility: box(el.querySelector(".career-utility")),
								marks: el.querySelectorAll("[data-career-overview] a").length,
							};
						});
					const closed = await measure();
					assert.ok(closed.summary.left >= closed.overview.left - 1);
					assert.ok(closed.summary.right <= closed.overview.right + 1);
					assert.ok(closed.summary.height >= 44);
					assert.ok(closed.summary.bottom <= closed.utility.top + 1);
					await page.focus(".career-neighborhood > summary");
					await page.keyboard.press("Enter");
					assert.equal(await page.$eval(".career-neighborhood", (el) => el.open), true);
					const opened = await measure();
					assert.deepEqual(
						opened.summary,
						closed.summary,
						"opening must not move the period control",
					);
					assert.equal(
						opened.marks,
						closed.marks,
						"period expansion retains the full career overview",
					);
					assert.ok(opened.summary.bottom <= opened.utility.top + 1);
					await page.keyboard.press("Enter");
				}
			}
			return "320–1440px; both career edges; long title; keyboard disclosure; stable control and separate utility row";
		},
	],
	[
		"C24 source projection and static links",
		async (page, problems) => {
			await c24(page, problems);
			const expected = expectedModel;
			assert.ok(expected, "live route-eligible generated records must resolve C24");
			const actual = await page.$$eval(".career-tracks a", (links) =>
				links.map((a) => ({
					slug: a.dataset.project,
					href: a.getAttribute("href"),
					label: a.querySelector(".career-track-label").childNodes[0].textContent.trim(),
					period: a.querySelector(".career-track-label small").textContent,
					current: a.getAttribute("aria-current"),
				})),
			);
			assert.deepEqual(
				actual,
				expected.projects.map((p) => ({
					slug: p.slug,
					href: `/projects/${p.slug}/`,
					label: p.title,
					period: p.period,
					current: p.current ? "true" : null,
				})),
			);
			assert.equal(
				await page.$$eval(
					"[data-context-ribbon] astro-island, [data-context-ribbon] script",
					(nodes) => nodes.length,
				),
				0,
			);
			assert.ok(
				await page.$("[data-project-article], [data-authoring-project]"),
				"canonical article remains mounted",
			);
			return `${actual.length} links match route-eligible generated records; no island or script`;
		},
	],
	[
		"Deterministic chart across reloads",
		async (page, problems) => {
			await c24(page, problems);
			const before = await geometry(page);
			await page.reload({ waitUntil: "networkidle0", timeout: PAGE_TIMEOUT_MS });
			assert.equal(await geometry(page), before);
			return "byte-identical SVG across page reload";
		},
	],
	[
		"Keyboard label, focus and neighbor navigation",
		async (page, problems) => {
			await c24(page, problems);
			const link = await page.$(".career-tracks a:not([aria-current])");
			await page.keyboard.press("Tab");
			await link.focus();
			assert.equal(
				await page.evaluate(() => document.activeElement.matches(".career-tracks a")),
				true,
			);
			const href = await link.evaluate((a) => a.getAttribute("href"));
			assert.ok(await link.evaluate((a) => a.innerText.trim().length > 2));
			const outline = await link.evaluate((a) => getComputedStyle(a).outlineStyle);
			assert.notEqual(outline, "none");
			await Promise.all([
				page.waitForNavigation({ waitUntil: "networkidle0", timeout: PAGE_TIMEOUT_MS }),
				page.keyboard.press("Enter"),
			]);
			await destination(page, href);
			assert.equal(new URL(page.url()).pathname, href);
			assert.equal(
				await page.$eval("[data-context-ribbon]", (el) => el.dataset.current),
				href.split("/").filter(Boolean).at(-1),
				"trial neighbor must highlight its own canonical route ID",
			);
			return `keyboard Enter navigates to ${href}; neighbor highlights itself`;
		},
	],
	[
		"Light and dark theme tokens",
		async (page, problems) => {
			await c24(page, problems);
			await page.setViewport({ width: 1440, height: 1000 });
			const palettes = [];
			for (const theme of ["light", "dark"]) {
				await page.evaluate(
					(name) => document.documentElement.classList.toggle("dark", name === "dark"),
					theme,
				);
				assert.equal(
					await page.evaluate(() => document.documentElement.classList.contains("dark")),
					theme === "dark",
				);
				palettes.push(
					await page.$eval("[data-context-ribbon]", (el) => ({
						color: getComputedStyle(el).color,
						background: getComputedStyle(el).backgroundColor,
					})),
				);
				await (
					await page.$("[data-context-ribbon]")
				).screenshot({ path: path.join(cacheDirectory, `${theme}-desktop.png`) });
			}
			assert.notDeepEqual(palettes[0], palettes[1]);
			for (const palette of palettes) assert.notEqual(palette.color, palette.background);
			return "light/dark root theme tokens switch ribbon colors; both screenshots captured";
		},
	],
	[
		"Mobile and desktop bounds and tap targets",
		async (page, problems) => {
			await c24(page, problems);
			for (const width of [1440, 768, 390, 320]) {
				await page.setViewport({ width, height: 1000 });
				const bounds = await page.$eval("[data-context-ribbon]", (el) => ({
					x: el.getBoundingClientRect().x,
					right: el.getBoundingClientRect().right,
					viewport: innerWidth,
					pageWidth: document.documentElement.scrollWidth,
					targets: [...el.querySelectorAll(".career-tracks a")].map((a) => ({
						height: a.getBoundingClientRect().height,
						right: a.getBoundingClientRect().right,
					})),
				}));
				assert.ok(bounds.x >= 0 && bounds.right <= width + 1, `ribbon overflow at ${width}`);
				assert.ok(
					bounds.pageWidth <= bounds.viewport + 1,
					`page overflow at ${width}: ${bounds.pageWidth}`,
				);
				for (const target of bounds.targets)
					assert.ok(target.height >= 24 && target.right <= width + 1);
				if (width === 390)
					await (
						await page.$("[data-context-ribbon]")
					).screenshot({ path: path.join(cacheDirectory, "dark-mobile.png") });
			}
			return "1440 / 768 / 390 / 320 px: no overflow, links at least 24px high";
		},
	],
	[
		"Pointer chart links and hover labels",
		async (page, problems) => {
			await page.setViewport({ width: 1440, height: 1000 });
			await c24(page, problems);
			const mark = await page.$("[data-career-overview] a:not([aria-current])");
			assert.ok(await mark.$("title"), "SVG mark has no hover label");
			await mark.hover();
			assert.equal(await mark.$eval("rect", (el) => getComputedStyle(el).strokeWidth), "3px");
			const href = await mark.evaluate((a) => a.getAttribute("href"));
			await Promise.all([
				page.waitForNavigation({ waitUntil: "networkidle0", timeout: PAGE_TIMEOUT_MS }),
				mark.click(),
			]);
			await destination(page, href);
			assert.equal(new URL(page.url()).pathname, href);
			return `labeled SVG mark opens ${href}`;
		},
	],
	[
		"Reduced motion remains static",
		async (page, problems) => {
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			await c24(page, problems);
			assert.equal(
				await page.$eval(
					"[data-context-ribbon]",
					(el) => el.getAnimations({ subtree: true }).length,
				),
				0,
			);
			await page.emulateMediaFeatures([]);
			return "no animation under reduced motion";
		},
	],
	[
		"No-JavaScript navigation and readable mobile fallback",
		async (page, problems) => {
			await page.setJavaScriptEnabled(false);
			await page.setViewport({ width: 390, height: 844 });
			await c24(page, problems);
			assert.equal(
				await page.$$eval(".career-tracks a", (links) =>
					links.every(
						(a) => a.getBoundingClientRect().height >= 24 && a.textContent.trim().length > 2,
					),
				),
				true,
			);
			await (
				await page.$("[data-context-ribbon]")
			).screenshot({ path: path.join(cacheDirectory, "no-js-mobile.png") });
			const link = await page.$(".career-tracks a:not([aria-current])");
			const href = await link.evaluate((a) => a.getAttribute("href"));
			await Promise.all([
				page.waitForNavigation({ waitUntil: "networkidle0", timeout: PAGE_TIMEOUT_MS }),
				link.click(),
			]);
			assert.equal(new URL(page.url()).pathname, href);
			await page.setJavaScriptEnabled(true);
			return "all labels and ordinary links work with JavaScript disabled";
		},
	],
];

const selectedSpecs = process.env.CONTEXT_RIBBON_CONTRACT_FILTER
	? specs.filter(([name]) => name.includes(process.env.CONTEXT_RIBBON_CONTRACT_FILTER))
	: specs;
if (!selectedSpecs.length) throw new Error("No matching context ribbon assertions");
process.exitCode = (await runBrowserContract({
	assertionSpecs: selectedSpecs,
	cacheDirectory,
	expectedAssertions: selectedSpecs.length,
	title: "Context ribbon regression (#137 / #222)",
}))
	? 0
	: 1;
