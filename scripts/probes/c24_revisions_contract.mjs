import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
	BASE_URL,
	PAGE_TIMEOUT_MS,
	runBrowserContract,
	assertNoPageProblems,
} from "./browser_contract_harness.mjs";

const sidecarPath = "src/content/projects/c24/_revisions.json";
const sidecarBytes = await readFile(sidecarPath);
const revisions = JSON.parse(sidecarBytes);
const marks = revisions.parts.flatMap((part) => part.revs);

assert.equal(revisions.schema_version, "1.0");
assert.equal(revisions.project, "c24");
assert.equal(revisions.parts.length, 2);
assert.equal(marks.length, 14);
assert.deepEqual(
	revisions.parts.map((part) => [part.part, part.revs.length]),
	[
		["9150-55200-00", 12],
		["9420-56156-00", 2],
	],
);
assert.ok(marks.every((mark) => mark.source_ids.length > 0));
assert.match(revisions.context, /not ECO approval dates or manufacturing-release dates/u);
assert.match(revisions.context, /not an exhaustive history/u);
assert.ok(!sidecarBytes.toString("utf8").match(/[A-Z]:[\\/]|portfolio_working|raw[\\/]/u));
assert.equal(marks.filter((mark) => mark.scar_anchor).length, 1);
assert.equal(marks.find((mark) => mark.rev === "B").scar_anchor, "7-component--geometry-battles");

if (process.env.CANON_ROOT) {
	const canonBytes = await readFile(
		path.join(process.env.CANON_ROOT, "entities/projects/c24/_revisions.json"),
	);
	assert.deepEqual(sidecarBytes, canonBytes);
}

if (process.argv.includes("--data-only")) {
	console.log("PASS C24 revisions data: 2 parts, 14 marks, exact canon bytes");
	process.exit(0);
}

const specs = [
	[
		"C24 revision matrix is visible, auditable, linked, and contained",
		async (page, problems) => {
			await page.setViewport({ width: 1440, height: 1000 });
			const response = await page.goto(`${BASE_URL}/projects/c24`, {
				waitUntil: "networkidle0",
				timeout: PAGE_TIMEOUT_MS,
			});
			assert.equal(response.status(), 200);
			await page.waitForSelector("[data-revision-matrix='2'][data-revision-marks='14']");
			await page.waitForFunction(() => Boolean(customElements.get("rev-matrix")));
			assert.equal(await page.$$eval("[data-revision-mark]", (nodes) => nodes.length), 14);
			assert.equal(await page.$$eval("[data-revision-table-mark]", (nodes) => nodes.length), 14);
			assert.equal(await page.$$eval("[data-revision-part]", (nodes) => nodes.length), 2);
			assert.equal(await page.$$eval("[data-entropy] + rev-matrix", (nodes) => nodes.length), 1);
			assert.equal(
				await page.$$eval(
					'[data-revision-mark="9150-55200-00:1"][data-scar]',
					(nodes) => nodes.length,
				),
				0,
			);
			assert.equal(
				await page.$eval('[data-revision-mark="9420-56156-00:B"]', (node) =>
					node.closest("a")?.getAttribute("data-scar"),
				),
				"7-component--geometry-battles",
			);
			await page.focus("rev-matrix");
			await page.keyboard.press("Tab");
			assert.equal(
				await page.evaluate(() => document.activeElement?.getAttribute("href")),
				"#5-integration-crisis-the-geometric-firewall",
			);
			await page.hover('[data-revision-part="9150-55200-00"] .part-link');
			assert.ok(
				await page.$eval('[id="5-integration-crisis-the-geometric-firewall"]', (node) =>
					node.classList.contains("scar-cross-hot"),
				),
			);
			await page.mouse.move(1, 1);
			assert.ok(
				await page.$eval('[id="5-integration-crisis-the-geometric-firewall"]', (node) =>
					node.classList.contains("scar-cross-hot"),
				),
			);
			await page.focus("rev-matrix");
			assert.equal(
				await page.$eval('[id="5-integration-crisis-the-geometric-firewall"]', (node) =>
					node.classList.contains("scar-cross-hot"),
				),
				false,
			);
			await page.hover('[data-revision-part="9150-55200-00"] .part-link');
			await page.$eval('[data-revision-mark="9150-55200-00:1"]', (node) => node.focus());
			assert.ok(
				await page.$eval('[id="5-integration-crisis-the-geometric-firewall"]', (node) =>
					node.classList.contains("scar-cross-hot"),
				),
			);
			await page.mouse.move(1, 1);
			assert.equal(
				await page.$eval('[id="5-integration-crisis-the-geometric-firewall"]', (node) =>
					node.classList.contains("scar-cross-hot"),
				),
				false,
			);
			await page.focus("rev-matrix");
			await page.keyboard.press("Tab");
			await page.keyboard.press("Enter");
			assert.equal(
				await page.evaluate(() => location.hash),
				"#5-integration-crisis-the-geometric-firewall",
			);
			assert.equal(
				await page.$eval('[data-revision-mark="9420-56156-00:B"]', (node) =>
					node.closest("a")?.getAttribute("href"),
				),
				"#7-component--geometry-battles",
			);
			for (const width of [1440, 768, 390, 320]) {
				await page.setViewport({ width, height: 1000 });
				const hitSize = await page.$eval(
					'[data-revision-mark="9420-56156-00:B"] .hit-target',
					(node) => {
						const box = node.getBoundingClientRect();
						return Math.round(Math.min(box.width, box.height));
					},
				);
				assert.ok(hitSize >= 20, `focus target was ${hitSize}px at ${width}px`);
				assert.ok(
					await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
					`overflow at ${width}`,
				);
			}
			const deepLinkResponse = await page.goto(
				`${BASE_URL}/projects/c24?deep-link=1#revision-matrix-heading`,
				{ waitUntil: "networkidle0", timeout: PAGE_TIMEOUT_MS },
			);
			assert.equal(deepLinkResponse.status(), 200);
			const deepLinkGeometry = await page.evaluate(() => {
				const heading = document.getElementById("revision-matrix-heading");
				const fixedNav = [...document.querySelectorAll("nav")].find(
					(node) => getComputedStyle(node).position === "fixed",
				);
				return {
					headingTop: heading?.getBoundingClientRect().top ?? -1,
					navBottom: fixedNav?.getBoundingClientRect().bottom ?? 0,
				};
			});
			assert.ok(
				deepLinkGeometry.headingTop > deepLinkGeometry.navBottom,
				`deep-link heading ${deepLinkGeometry.headingTop}px overlapped nav ${deepLinkGeometry.navBottom}px`,
			);
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			assert.equal(
				await page.$eval("rev-matrix", (node) => node.getAnimations({ subtree: true }).length),
				0,
			);
			assertNoPageProblems(problems);
			return "2 parts, 14 SVG/table marks, scar focus and native anchors, four widths, reduced motion";
		},
	],
	[
		"C24 revision records remain visible without JavaScript",
		async (page, problems) => {
			await page.setJavaScriptEnabled(false);
			await page.setViewport({ width: 320, height: 1000 });
			const response = await page.goto(`${BASE_URL}/projects/c24`, {
				waitUntil: "networkidle0",
				timeout: PAGE_TIMEOUT_MS,
			});
			assert.equal(response.status(), 200);
			assert.equal(await page.$$eval("[data-revision-mark]", (nodes) => nodes.length), 14);
			assert.equal(await page.$$eval("[data-revision-table-mark]", (nodes) => nodes.length), 14);
			await page.focus("rev-matrix");
			await page.keyboard.press("Tab");
			assert.equal(
				await page.evaluate(() => document.activeElement?.getAttribute("href")),
				"#5-integration-crisis-the-geometric-firewall",
			);
			assert.ok(
				await page.$eval('[data-revision-part="9150-55200-00"] .part-link', (node) => {
					const box = node.getBoundingClientRect();
					return box.width > 0 && box.height > 0;
				}),
			);
			await page.keyboard.press("Enter");
			assert.equal(
				await page.evaluate(() => location.hash),
				"#5-integration-crisis-the-geometric-firewall",
			);
			assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
			assertNoPageProblems(problems);
			return "SVG and 14-row audit table visible at 320px with JavaScript disabled";
		},
	],
];

process.exitCode = (await runBrowserContract({
	assertionSpecs: specs,
	cacheDirectory: path.join(process.cwd(), ".wrangler/c24-revisions-browser"),
	disableAdapter: true,
	expectedAssertions: 2,
	title: "C24 revision matrix (#139)",
}))
	? 0
	: 1;
