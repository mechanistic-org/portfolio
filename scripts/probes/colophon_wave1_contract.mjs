import assert from "node:assert/strict";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BASE_URL, VIEWPORTS, runBrowserContract } from "./browser_contract_harness.mjs";

const packet = JSON.parse(readFileSync("docs/colophon_423_publication.json", "utf8"));
const squash = (value) => value.replace(/\s+/g, " ").trim();
const expectedIds = ["W1", "W2", "W3", "W4"];
assert.deepEqual(
	packet.stories.map((story) => story.id),
	expectedIds,
);
assert.equal(
	packet.approved_manifest_sha256,
	"2d432c196109280fb8d0c859ce62e63b999136c227ee50307a013190558faaf9",
);
const entries = readdirSync("src/content/colophon")
	.filter((name) => name.endsWith(".mdx"))
	.map((name) => ({
		name,
		...matter(readFileSync(path.join("src/content/colophon", name), "utf8")),
	}));
const wave = entries.filter((entry) => entry.data.wave === "423");
assert.equal(wave.length, 4, "Only the four approved Wave 1 pages may be published");
const ids = [];
for (const story of packet.stories) {
	const entry = wave.find((entry) => entry.data.storyId === story.id);
	assert.ok(entry, story.id);
	assert.equal(entry.data.title, story.title);
	assert.equal(entry.data.slug, story.slug);
	assert.equal(entry.data.pubDate, "2026-09-05");
	assert.equal(entry.data.summary, story.copy);
	assert.equal(entry.data.entryType, story.surface === "Build Log" ? "build-log" : "feature");
	assert.deepEqual(entry.data.sourceRecordIds, story.record_ids);
	assert.equal(
		squash(entry.content.split("## Sources")[0]),
		story.copy,
		"Published prose must equal the ratified candidate",
	);
	for (const url of story.sources) assert.ok(entry.content.includes(url));
	ids.push(...story.record_ids);
}
assert.equal(ids.length, 6);
assert.equal(new Set(ids).size, 6, "No source appears twice");
assert.deepEqual(
	[...ids].sort(),
	packet.source_verification.map((source) => source.record_id).sort(),
);
assert.deepEqual(
	JSON.parse(readFileSync("src/data/homepage-verbal-map.json", "utf8")),
	packet.homepage,
);
assert.ok(!JSON.stringify(packet.stories.map((story) => story.copy)).includes("\u2014"));
console.log(
	"PASS: exact ratified copy, four stories, six unique applied sources, surfaces, explicit dates, provenance and homepage parity.",
);
if (process.argv.includes("--data-only")) process.exit(0);

const cacheDirectory = path.join(process.cwd(), "node_modules/.cache/colophon-423");
const artifacts = path.join(cacheDirectory, "artifacts");
mkdirSync(artifacts, { recursive: true });
const specs = [];
for (const viewport of VIEWPORTS) {
	specs.push([
		viewport.name + ": homepage map and discovery",
		async (page) => {
			await page.setViewport(viewport);
			await page.goto(BASE_URL, { waitUntil: "networkidle0" });
			const blocks = await page.$$eval("#verbal-map > div", (els) =>
				els.map((el) => ({
					title: el.querySelector("h3").textContent.trim(),
					copy: el.querySelector("p").textContent.trim(),
				})),
			);
			assert.deepEqual(blocks, packet.homepage);
			assert.equal(await page.$$eval("h1", (els) => els.length), 1);
			assert.ok(await page.$('[data-hxo-hydrated="true"]'));
			assert.ok(await page.$('#record-band a[href="/how-i-work/"]'));
			assert.ok(await page.$('#record-band a[href="/colophon/#build-log"]'));
			assert.ok(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
				"horizontal overflow",
			);
			await page.$eval("#record-band", (el) => el.scrollIntoView());
			await (
				await page.$("#record-band")
			).screenshot({ path: path.join(artifacts, viewport.name + "-homepage-map.png") });
		},
	]);
	specs.push([
		viewport.name + ": feature and Build Log streams",
		async (page) => {
			await page.goto(BASE_URL + "/colophon/", { waitUntil: "networkidle0" });
			for (const story of packet.stories) {
				const selector = story.surface === "Build Log" ? "#build-log" : "#colophon-features";
				const link = selector + ' a[href="/colophon/' + story.slug + '/"]';
				// Existing feature cards use slashless article links; resolve both to the same route.
				const alternate = selector + ' a[href="/colophon/' + story.slug + '"]';
				assert.ok(
					(await page.$(link)) || (await page.$(alternate)),
					story.title + " missing from its approved stream",
				);
				const other = story.surface === "Build Log" ? "#colophon-features" : "#build-log";
				assert.equal(await page.$(other + ' a[href="/colophon/' + story.slug + '/"]'), null);
				assert.equal(await page.$(other + ' a[href="/colophon/' + story.slug + '"]'), null);
			}
			assert.equal(await page.$$eval("#build-log li", (els) => els.length), 2);
			assert.deepEqual(
				await page.$$eval("#build-log time", (els) => els.map((el) => el.getAttribute("datetime"))),
				["2026-09-05", "2026-09-05"],
			);
			assert.ok(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
				"horizontal overflow",
			);
			await (
				await page.$("#build-log")
			).screenshot({ path: path.join(artifacts, viewport.name + "-build-log.png") });
			await (
				await page.$("#colophon-features")
			).screenshot({ path: path.join(artifacts, viewport.name + "-features.png") });
		},
	]);
}
specs.push([
	"Approved Tour link enters the existing guided tour",
	async (page) => {
		await page.goto(BASE_URL, { waitUntil: "networkidle0" });
		await page.click('nav[aria-label="Explore the record"] a');
		await page.waitForFunction(() => document.querySelector('[data-current-mode="tour"]'), {
			timeout: 5000,
		});
	},
]);
for (const story of packet.stories) {
	specs.push([
		story.id + ": exact published article and sources",
		async (page) => {
			await page.setViewport(VIEWPORTS[0]);
			const response = await page.goto(BASE_URL + "/colophon/" + story.slug + "/", {
				waitUntil: "networkidle0",
			});
			assert.equal(response.status(), 200);
			assert.equal(await page.$eval("h1", (el) => el.textContent.trim()), story.title);
			assert.equal(
				squash(await page.$eval(".markdown-content > p", (el) => el.textContent)),
				story.copy,
			);
			assert.equal(
				await page.$eval("article time", (el) => el.textContent.trim()),
				"September 5, 2026",
			);
			for (const source of story.sources)
				assert.ok(await page.$('.markdown-content a[href="' + source + '"]'));
			await page.screenshot({
				path: path.join(artifacts, story.id + "-article.png"),
				fullPage: true,
			});
		},
	]);
}
process.exit(
	(await runBrowserContract({
		assertionSpecs: process.argv.includes("--tour-only")
			? specs.filter(([name]) => name.startsWith("Approved Tour"))
			: specs,
		cacheDirectory,
		expectedAssertions: process.argv.includes("--tour-only") ? 1 : 11,
		title: "#423 approved publication contract",
	}))
		? 0
		: 1,
);
