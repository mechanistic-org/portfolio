import assert from "node:assert/strict";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { resolveClaim } from "../../src/lib/project-claims.mjs";
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
// Pin the retained inventory so deleting an article cannot shrink its own test.
// The Pulse is the only route explicitly retired under #290.
const retainedSlugs = [
	"ar-viewer",
	"darkroom",
	"en-os",
	"living-style-guide",
	"missing-evidence",
	"physical-spec",
	"reversible-editorial-queue",
	"shipped-means-reachable",
	"the-institution",
	"work-survives-a-session",
];
assert.deepEqual(
	entries.map((entry) => entry.data.slug || entry.name.replace(/\.mdx$/, "")).sort(),
	retainedSlugs,
	"#290 preserves all ten retained article routes",
);
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
// #291 retired the verbal map, record band and Tour. The #423 packet remains
// authoritative for its four published stories, not for the superseded homepage.
assert.ok(!JSON.stringify(packet.stories.map((story) => story.copy)).includes("\u2014"));
console.log(
	"PASS: exact ratified copy, four stories, six unique applied sources, surfaces, explicit dates and provenance.",
);
if (process.argv.includes("--tour-only"))
	throw new Error("Tour was retired by #291; run the current contract without --tour-only.");
if (process.argv.includes("--data-only")) process.exit(0);

const claimBundle = JSON.parse(readFileSync("src/data/project-claims.json", "utf8"));
const claimUses = JSON.parse(readFileSync("src/data/claim-consumers.json", "utf8")).filter(
	(use) => use.surface === "colophon",
);
const expectedClaims = claimUses.map((use) => resolveClaim(claimBundle, use));
const credits = [
	"VS Code",
	"GitHub",
	"Cloudflare Workers",
	"Cloudflare R2",
	"Python",
	"Astro v5",
	"React",
	"Tailwind CSS v4",
	"Recharts",
];

const cacheDirectory = path.join(process.cwd(), "node_modules/.cache/colophon-423");
const artifacts = path.join(cacheDirectory, "artifacts");
mkdirSync(artifacts, { recursive: true });
const specs = [];
for (const viewport of VIEWPORTS) {
	specs.push([
		viewport.name + ": shipped homepage remains intact",
		async (page) => {
			await page.setCacheEnabled(false);
			await page.setViewport(viewport);
			await page.goto("about:blank");
			await page.goto(BASE_URL, { waitUntil: "networkidle0" });
			assert.equal(await page.$$eval("h1", (els) => els.length), 1);
			await page.waitForSelector('[data-hxo-hydrated="true"]');
			await page.waitForSelector('[data-swarm-ready="true"]');
			const overview = await page.$$eval("[data-career-overview] a, .career-undated a", (els) =>
				els.map((el) => el.dataset.project).sort(),
			);
			const targets = await page.$$eval(".node-group", (els) =>
				els.map((el) => el.dataset.id).sort(),
			);
			assert.ok(targets.length > 0);
			assert.deepEqual(overview, targets, "Every map target retains a native overview link");
			assert.equal(
				await page.$("#record-band, #verbal-map, [data-tour-control], [data-pin-control]"),
				null,
			);
			assert.ok(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
				"horizontal overflow",
			);
			await page.screenshot({ path: path.join(artifacts, viewport.name + "-homepage.png") });
		},
	]);
	specs.push([
		viewport.name + ": feature and Build Log streams",
		async (page) => {
			await page.setViewport(viewport);
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
				await page.$$eval("#colophon-features h3 a", (els) =>
					els.map((el) => el.getAttribute("href")),
				),
				["/colophon/en-os/", "/colophon/missing-evidence/", "/colophon/work-survives-a-session/"],
				"Only the three selected construction accounts are promoted",
			);
			assert.equal(await page.$(".supporting-grid, .supporting-heading"), null);
			for (const story of packet.stories) {
				const selector =
					story.surface === "Build Log" ? "#build-log li" : "#colophon-features article";
				const rendered = await page.$$eval(selector, (els) =>
					els.map((el) => el.querySelector("p").textContent.trim()),
				);
				assert.ok(rendered.includes(story.copy), story.id + " summary must remain complete");
			}
			const summaries = await page.$$eval(
				"#colophon-features article p, #engineering-record article p",
				(els) =>
					els.map((el) => ({
						clamp: getComputedStyle(el).webkitLineClamp,
						clipped: el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1,
					})),
			);
			assert.ok(
				summaries.every((el) => el.clamp === "none" && !el.clipped),
				"Qualifications must be visibly readable",
			);
			const renderedClaims = await page.$$eval("#engineering-record article", (els) =>
				els.map((el) => ({
					title: el.querySelector("h3").textContent.trim(),
					text: el.querySelectorAll("p")[1].textContent.trim(),
					href: el.querySelector("a").getAttribute("href"),
				})),
			);
			assert.equal(renderedClaims.length, expectedClaims.length);
			for (const claim of expectedClaims)
				assert.ok(
					renderedClaims.some(
						(actual) =>
							actual.title === claim.title &&
							actual.text === claim.text &&
							actual.href === claim.href,
					),
					claim.id,
				);
			assert.equal(await page.$$eval("#production-credits ul", (els) => els.length), 1);
			assert.deepEqual(
				await page.$$eval("#production-credits .reference-links a", (els) =>
					els.map((el) => ({ label: el.textContent.trim(), href: el.getAttribute("href") })),
				),
				[
					{ label: "Design system", href: "/design-system/" },
					{ label: "Technical documentation", href: "/docs/" },
				],
			);
			assert.deepEqual(
				await page.$$eval("#production-credits li", (els) =>
					els.map((el) => el.textContent.trim()),
				),
				credits,
			);
			assert.equal(
				await page.$('#colophon-features img[src*="placeholders"], #colophon-features svg'),
				null,
			);
			assert.equal(
				await page.$$eval(
					"#colophon-features a",
					(els) => els.filter((el) => el.querySelector("img")).length,
				),
				0,
			);
			assert.equal(await page.$('a[href="/colophon/the-pulse/"]'), null);
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
specs.push([
	"Scoped Colophon metadata and unchanged shared defaults",
	async (page) => {
		await page.goto(BASE_URL + "/colophon/", { waitUntil: "networkidle0" });
		const meta = async (property) =>
			page.$eval(`meta[property="${property}"], meta[name="${property}"]`, (el) => el.content);
		const title = "How this record is built | Colophon | Erik Norris";
		const description =
			"How Erik Norris's public engineering record is constructed: source material, human review, repeatable builds, software decisions, and production credits.";
		assert.equal(await page.title(), title);
		for (const property of ["og:title", "twitter:title"])
			assert.equal(await meta(property), title, property);
		for (const property of ["description", "og:description", "twitter:description"])
			assert.equal(await meta(property), description, property);
		assert.equal(await meta("og:image:type"), "image/png");
		assert.equal(await meta("og:image:alt"), "Erik Norris EN monogram");
		assert.equal(
			await page.$('meta[property="og:image:width"], meta[property="og:image:height"]'),
			null,
		);
		const image = await fetch(new URL(await meta("og:image")), { method: "HEAD" });
		assert.ok(image.ok);
		assert.equal(image.headers.get("content-type")?.split(";")[0], "image/png");
		for (const route of ["/", "/about/", "/colophon/en-os/", "/projects/c24/"]) {
			await page.goto(BASE_URL + route, { waitUntil: "networkidle0" });
			assert.equal(
				await meta("og:image:type"),
				"image/webp",
				route + " retains existing metadata defaults",
			);
			assert.equal(await meta("og:image:width"), "1200");
			assert.equal(await meta("og:image:height"), "800");
			assert.equal(await meta("og:image:alt"), await page.title());
		}
	},
]);
specs.push([
	"Native keyboard article link and return",
	async (page) => {
		await page.goto(BASE_URL + "/colophon/", { waitUntil: "networkidle0" });
		let found = false;
		for (let i = 0; i < 40; i++) {
			await page.keyboard.press("Tab");
			found = await page.evaluate(
				() => document.activeElement?.getAttribute("href") === "/colophon/en-os/",
			);
			if (found) break;
		}
		assert.ok(found, "EN-OS must be reachable through native tab order");
		assert.ok(
			await page.evaluate(() => {
				const el = document.activeElement;
				const rect = el.getBoundingClientRect();
				return (
					getComputedStyle(el).outlineStyle !== "none" &&
					rect.top >= 0 &&
					rect.bottom <= innerHeight
				);
			}),
			"Focused link is visible with an outline",
		);
		await page.keyboard.press("Enter");
		await page.waitForFunction(
			() =>
				location.pathname === "/colophon/en-os/" &&
				document.querySelector("h1")?.textContent.trim() === "EN-OS",
		);
		await page.goBack();
		await page.waitForFunction(
			() => location.pathname === "/colophon/" && document.querySelector("#production-credits"),
		);
	},
]);
specs.push([
	"Static content, reduced motion and smallest layout",
	async (page) => {
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
		await page.setViewport({ width: 320, height: 800 });
		try {
			await page.goto(BASE_URL + "/colophon/", { waitUntil: "networkidle0" });
			assert.equal(
				await page.$("main astro-island"),
				null,
				"Colophon needs no moving or hydrated components",
			);
			assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
			assert.equal(
				await page.evaluate(
					() =>
						document
							.getAnimations()
							.filter(
								(animation) =>
									animation.effect?.target?.closest("main") && animation.playState === "running",
							).length,
				),
				0,
			);
			await page.setJavaScriptEnabled(false);
			await page.reload({ waitUntil: "networkidle0" });
			assert.equal(await page.$$eval("#colophon-features article", (els) => els.length), 3);
			assert.equal(
				await page.$$eval("#engineering-record article", (els) => els.length),
				expectedClaims.length,
			);
			assert.equal(
				await page.$$eval("#production-credits li", (els) => els.length),
				credits.length,
			);
		} finally {
			await page.setJavaScriptEnabled(true);
			await page.emulateMediaFeatures([]);
		}
	},
]);
specs.push([
	"All ten retained article routes remain available",
	async (page) => {
		for (const slug of retainedSlugs) {
			const entry = entries.find(
				(entry) => (entry.data.slug || entry.name.replace(/\.mdx$/, "")) === slug,
			);
			const response = await page.goto(BASE_URL + "/colophon/" + slug + "/", {
				waitUntil: "networkidle0",
			});
			assert.equal(response.status(), 200, slug);
			assert.equal(await page.$eval("h1", (el) => el.textContent.trim()), entry.data.title);
		}
	},
]);
process.exit(
	(await runBrowserContract({
		assertionSpecs: specs,
		cacheDirectory,
		expectedAssertions: 14,
		title: "#290 Colophon and retained #423 publication contract",
	}))
		? 0
		: 1,
);
