import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { globSync } from "glob";
import matter from "gray-matter";
import { BASE_URL, PAGE_TIMEOUT_MS, runBrowserContract } from "./browser_contract_harness.mjs";

const cacheDirectory = path.join(
	process.cwd(),
	"node_modules",
	".cache",
	"context-ribbon-contract",
);
const source = await readFile("src/utils/contextRibbon.ts", "utf8");
const compiled = ts.transpileModule(source, {
	compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { buildContextRibbon } = await import(
	`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
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
	generatedNodes.filter((n) => n.data.draft !== true),
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

async function c24(page, problems) {
	problems.length = 0;
	const response = await page.goto(`${BASE_URL}/projects/c24`, {
		waitUntil: "networkidle0",
		timeout: PAGE_TIMEOUT_MS,
	});
	assert.equal(response.status(), 200);
	await page.waitForSelector("[data-context-ribbon]");
}

async function geometry(page) {
	return page.$eval("[data-context-ribbon] svg", (svg) => svg.outerHTML);
}

async function destination(page, href) {
	// ClientRouter can emit a same-document navigation before its destination
	// swap. Assert the user-visible destination, not the first navigation event.
	await page.waitForFunction(
		(expected) => location.pathname.replace(/\/$/u, "") === expected,
		{ timeout: PAGE_TIMEOUT_MS },
		href,
	);
	await page.waitForSelector("[data-context-ribbon]", { hidden: true, timeout: PAGE_TIMEOUT_MS });
}

const specs = [
	[
		"C24 source projection and static links",
		async (page, problems) => {
			await c24(page, problems);
			const expected = expectedModel;
			assert.ok(expected, "live generated assembly must resolve C24");
			const actual = await page.$$eval(".ribbon-projects a", (links) =>
				links.map((a) => ({
					slug: a.dataset.project,
					href: a.getAttribute("href"),
					label: a.querySelector(".project-label").childNodes[0].textContent.trim(),
					period: a.querySelector(".project-period").textContent,
					current: a.getAttribute("aria-current"),
				})),
			);
			assert.deepEqual(
				actual,
				expected.projects.map((p) => ({
					slug: p.slug,
					href: `/projects/${p.slug}`,
					label: p.title,
					period: p.period,
					current: p.current ? "page" : null,
				})),
			);
			assert.equal(
				await page.$$eval(
					"[data-context-ribbon] astro-island, [data-context-ribbon] script",
					(nodes) => nodes.length,
				),
				0,
			);
			assert.ok(await page.$("article main"), "canonical article remains mounted");
			return `${actual.length} links match generated assembly; no island or script`;
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
			const link = await page.$(".ribbon-projects a:not([aria-current])");
			await link.focus();
			assert.equal(
				await page.evaluate(() => document.activeElement.matches(".ribbon-projects a")),
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
			assert.equal(new URL(page.url()).pathname.replace(/\/$/u, ""), href);
			assert.equal(
				await page.$("[data-context-ribbon]"),
				null,
				"non-C24 pages must not render the prototype",
			);
			return `keyboard Enter navigates to ${href}; no ribbon on neighbor`;
		},
	],
	[
		"Light and dark theme tokens",
		async (page, problems) => {
			await c24(page, problems);
			await page.setViewport({ width: 1440, height: 1000 });
			const palettes = [];
			for (const theme of ["light", "dark"]) {
				await page.click(`[data-theme-set="${theme}"]`);
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
			return "live theme controls switch ribbon colors; both screenshots captured";
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
					targets: [...el.querySelectorAll(".ribbon-projects a")].map((a) => ({
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
					assert.ok(target.height >= 44 && target.right <= width + 1);
				if (width === 390)
					await (
						await page.$("[data-context-ribbon]")
					).screenshot({ path: path.join(cacheDirectory, "dark-mobile.png") });
			}
			return "1440 / 768 / 390 / 320 px: no overflow, links at least 44px high";
		},
	],
	[
		"Pointer chart links and hover labels",
		async (page, problems) => {
			await page.setViewport({ width: 1440, height: 1000 });
			await c24(page, problems);
			const mark = await page.$(".chart-project:not(.is-current)");
			assert.ok(await mark.$("title"), "SVG mark has no hover label");
			await mark.hover();
			assert.equal(
				await mark.$eval(".project-mark", (el) => getComputedStyle(el).strokeWidth),
				"2px",
			);
			const href = await mark.evaluate((a) => a.getAttribute("href"));
			await Promise.all([
				page.waitForNavigation({ waitUntil: "networkidle0", timeout: PAGE_TIMEOUT_MS }),
				mark.click(),
			]);
			await destination(page, href);
			assert.equal(new URL(page.url()).pathname.replace(/\/$/u, ""), href);
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
				await page.$$eval(".ribbon-projects a", (links) =>
					links.every(
						(a) => a.getBoundingClientRect().height >= 44 && a.textContent.trim().length > 2,
					),
				),
				true,
			);
			await (
				await page.$("[data-context-ribbon]")
			).screenshot({ path: path.join(cacheDirectory, "no-js-mobile.png") });
			const link = await page.$(".ribbon-projects a:not([aria-current])");
			const href = await link.evaluate((a) => a.getAttribute("href"));
			await Promise.all([
				page.waitForNavigation({ waitUntil: "networkidle0", timeout: PAGE_TIMEOUT_MS }),
				link.click(),
			]);
			assert.equal(new URL(page.url()).pathname.replace(/\/$/u, ""), href);
			await page.setJavaScriptEnabled(true);
			return "all labels and ordinary links work with JavaScript disabled";
		},
	],
];

process.exitCode = (await runBrowserContract({
	assertionSpecs: specs,
	cacheDirectory,
	expectedAssertions: specs.length,
	title: "Context ribbon contract (#137)",
}))
	? 0
	: 1;
