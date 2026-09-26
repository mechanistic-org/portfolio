import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { archivePresentation, compareArchive } from "../../src/utils/archivePresentation.ts";
import { BASE_URL, runBrowserContract } from "./browser_contract_harness.mjs";

const cacheDirectory = path.join(process.cwd(), "node_modules/.cache/archive-contract");
await mkdir(cacheDirectory, { recursive: true });
const fixture = (id, data) => archivePresentation({ id, data: { title: id, ...data } });
const glyph = fixture("avegant-glyph", { industry: "consumer_electronics" });
assert.equal(glyph.period, "2015–2016");
assert.equal(glyph.basis, "documented-work");
assert.equal(glyph.status, "Status not recorded");
assert.equal(glyph.industry, "Consumer Electronics");
assert.equal(fixture("utc-fixture", { date: "2016-01-01T00:00:00Z" }).period, "2016");
assert.equal(fixture("unknown-fixture", { date: "bad-date" }).period, "Date unresolved");
assert.equal(fixture("status-fixture", { production: "prototype" }).status, "Prototype (Build)");
const samples = [
	fixture("unresolved", {}),
	fixture("zulu", { date: "2015-01-01" }),
	fixture("alpha", { date: "2015-01-01" }),
	fixture("later", { date: "2016-01-01" }),
].map((p) => p.sort);
assert.deepEqual(
	[...samples].sort((a, b) => compareArchive(a, b, "year", "ascending")).map((p) => p.slug),
	["alpha", "zulu", "later", "unresolved"],
);
assert.deepEqual(
	[...samples].sort((a, b) => compareArchive(a, b, "year", "descending")).map((p) => p.slug),
	["later", "alpha", "zulu", "unresolved"],
);

const specs = [];
const navPaths = ["/projects/", "/about/", "/how-i-work/", "/resume/", "/contact/"];
async function navigate(page) {
	const response = await page.goto(BASE_URL + "/projects/", { waitUntil: "networkidle0" });
	assert.equal(response.status(), 200);
	await page.waitForSelector('#projects-table-body[data-initialized="true"]');
	await page.addStyleTag({ content: "html, body, * {scroll-behavior:auto!important}" });
}
const rows = (page) =>
	page.$$eval(".project-row", (nodes) =>
		nodes.map((node) => ({
			id: node.dataset.projectId,
			values: JSON.parse(node.dataset.sort),
			cells: [...node.cells].map((cell) => cell.innerText.trim()),
			href: node.querySelector("a").getAttribute("href"),
		})),
	);

for (const [name, width, height] of [
	["desktop", 1440, 1000],
	["phone", 390, 844],
]) {
	specs.push([
		`${name}: archive labels, destinations, navigation and five view controls`,
		async (page) => {
			await page.setViewport({ width, height });
			await navigate(page);
			const initial = await rows(page);
			assert(initial.length > 0);
			const item = initial.find((row) => row.id === "avegant-glyph");
			assert.deepEqual(item.cells.slice(3), [
				"Consumer Electronics",
				"2015–2016",
				"Status not recorded",
			]);
			assert.equal(item.href, "/projects/avegant-glyph/");
			assert.equal(item.values.year, 2015);
			const metadata = await page.$eval(
				'.project-row[data-project-id="avegant-glyph"]',
				(node) => ({
					basis: node.dataset.periodBasis,
					industry: node.dataset.industry,
					status: node.dataset.status,
				}),
			);
			assert.equal(metadata.basis, "documented-work");
			assert.equal(metadata.industry, "consumer_electronics");
			assert(!metadata.status);
			assert(initial.every((row) => row.cells[4] && row.cells[5] && !row.cells.includes("NaN")));
			let unknown = false,
				previous = Infinity;
			for (const row of initial) {
				const year = row.values.year;
				if (year === null) unknown = true;
				else {
					assert(!unknown);
					assert(year <= previous);
					previous = year;
				}
			}
			assert.equal(
				await page.$eval('#universal-hud a[href="/"]', (el) => el.innerText.trim()),
				"Home",
			);
			if (name === "phone") {
				await page.focus("#mobile-nav__burger");
				await page.keyboard.press("Enter");
				await page.waitForSelector('#mobile-nav__burger[aria-expanded="true"]');
				await page.waitForFunction(() => {
					const rect = document.querySelector("#mobile-nav__content").getBoundingClientRect();
					return rect.left >= 0 && rect.right <= innerWidth;
				});
			}
			const nav = name === "phone" ? "#mobile-nav__content" : "#nav-capsule";
			for (const href of navPaths)
				assert(
					await page.$eval(`${nav} a[href="${href}"]`, (el) => el.getClientRects().length > 0),
				);
			if (name === "phone") {
				await page.click("#mobile-nav__close");
				await page.waitForFunction(() =>
					document.querySelector("#mobile-nav__content").classList.contains("hidden"),
				);
			}
			for (const view of ["grid", "multiverse", "timeline", "radial", "list"]) {
				const button = `.view-toggle[data-view="${view}"]`;
				await page.focus(button);
				await page.keyboard.press("Enter");
				assert.equal(await page.$eval(button, (el) => el.getAttribute("aria-pressed")), "true");
				assert(await page.$eval(`#view-${view}`, (el) => !el.classList.contains("hidden")));
			}
			const grid = await page.$$eval("#view-grid .project-item", (nodes) =>
				nodes.map((el) => ({
					id: el.dataset.projectId,
					href: el.querySelector("a").getAttribute("href"),
					text: el.innerText,
					sort: JSON.parse(el.dataset.sort),
				})),
			);
			assert.deepEqual(
				grid.map((p) => [p.id, p.href]),
				initial.map((p) => [p.id, p.href]),
			);
			const gridGlyph = grid.find((p) => p.id === "avegant-glyph");
			assert.equal(gridGlyph.sort.year, 2015);
			// Hidden grid innerText can differ by browser; inspect rendered text content explicitly.
			const gridText = await page.$eval(
				'#view-grid [data-project-id="avegant-glyph"]',
				(el) => el.textContent,
			);
			for (const text of ["2015–2016", "Consumer Electronics", "Status not recorded"])
				assert(gridText.includes(text));
			assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
			await page.waitForFunction(
				() => getComputedStyle(document.querySelector("#view-list")).opacity === "1",
			);
			await page.screenshot({ path: path.join(cacheDirectory, `archive-${name}.png`) });
			if (name === "desktop") {
				const glyphRow = await page.$('.project-row[data-project-id="avegant-glyph"]');
				await glyphRow.evaluate((el) => el.scrollIntoView({ block: "center" }));
				await glyphRow.screenshot({ path: path.join(cacheDirectory, "glyph-row.png") });
			}
			await writeFile(
				path.join(cacheDirectory, `rows-${name}.json`),
				JSON.stringify(initial, null, 2),
			);
			return `${initial.length} table/grid destinations retained; graph date semantics explicitly outside this contract`;
		},
	]);
	specs.push([
		`${name}: all five sort controls toggle with click, Enter and Space`,
		async (page) => {
			await page.setViewport({ width, height });
			await navigate(page);
			const initial = await rows(page);
			const identifiers = initial.map((r) => r.id).sort();
			for (const column of ["project", "client", "industry", "year", "status"]) {
				const button = `.sort-header[data-col="${column}"]`;
				await page.focus(button);
				await page.keyboard.press("Enter");
				for (const direction of ["ascending", "descending"]) {
					assert.equal(
						await page.$eval(button, (el) => el.closest("th").getAttribute("aria-sort")),
						direction,
					);
					const ordered = await rows(page);
					assert.deepEqual(ordered.map((r) => r.id).sort(), identifiers);
					const resolved = ordered.filter((row) => row.values[column] !== null);
					const firstMissing = ordered.findIndex((row) => row.values[column] === null);
					assert(
						firstMissing < 0 || firstMissing === resolved.length,
						`${column}: missing values last`,
					);
					for (let i = 1; i < resolved.length; i++) {
						const a = resolved[i - 1].values[column],
							b = resolved[i].values[column];
						const comparison =
							typeof a === "number"
								? a - b
								: String(a).localeCompare(String(b), "en", { numeric: true, sensitivity: "base" });
						assert(
							direction === "ascending" ? comparison <= 0 : comparison >= 0,
							`${column}: ${direction}`,
						);
					}
					if (direction === "ascending") await page.keyboard.press("Space");
				}
				await page.click(button);
				assert.equal(
					await page.$eval(button, (el) => el.closest("th").getAttribute("aria-sort")),
					"ascending",
				);
			}
		},
	]);
}
specs.push([
	"No-JS phone: ordinary navigation and project links remain visible",
	async (page) => {
		await page.setViewport({ width: 390, height: 844 });
		await page.setJavaScriptEnabled(false);
		try {
			await page.goto(BASE_URL + "/projects/", { waitUntil: "networkidle0" });
			for (const href of ["/", ...navPaths])
				assert(
					await page.$eval(
						`noscript nav a[href="${href}"]`,
						(el) => el.getClientRects().length > 0,
					),
				);
			assert(
				await page.$eval(
					'.project-row a[href="/projects/avegant-glyph/"]',
					(el) => el.getClientRects().length > 0,
				),
			);
		} finally {
			await page.setJavaScriptEnabled(true);
		}
	},
]);
// Verify the emitted candidate too; the contract's URL must serve this build in release review.
const built = await readFile("dist/projects/index.html", "utf8");
assert(!built.includes('data-date="NaN"'));
assert(built.includes("Status not recorded"));
process.exit(
	(await runBrowserContract({
		assertionSpecs: specs,
		expectedAssertions: specs.length,
		cacheDirectory,
		title: "#341 archive contract",
	}))
		? 0
		: 1,
);
