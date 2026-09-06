import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import matter from "gray-matter";
import { globSync } from "glob";
import GithubSlugger from "github-slugger";
import {
	BASE_URL,
	PAGE_TIMEOUT_MS,
	runBrowserContract,
	assertNoPageProblems,
	createPageProblemCollector,
} from "./browser_contract_harness.mjs";

async function load(file) {
	const code = ts.transpileModule(await readFile(file, "utf8"), {
		compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
	}).outputText;
	return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}
const { projectArticleTrial, trialSlugs, careerIdentityAliases } = await load(
	"src/config/projectArticleTrial.ts",
);
const { resolveProjectPresentation } = await load("src/utils/projectPresentation.ts");
const { routeEligibleProjects, careerRecords } = await load("src/utils/projectRoster.ts");
const { buildContextRibbon } = await load("src/utils/contextRibbon.ts");
const records = await Promise.all(
	globSync("src/content/projects/**/*.mdx", { posix: true }).map(async (file) => {
		const { data, content } = matter(await readFile(file, "utf8"));
		const slugger = new GithubSlugger();
		const headings = [...content.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((match) => ({
			depth: match[1].length,
			text: match[2],
			slug: slugger.slug(match[2]),
		}));
		return {
			id: file.replace("src/content/projects/", "").replace(/(?:\/index)?\.mdx$/u, ""),
			data,
			headings,
		};
	}),
);
const roster = routeEligibleProjects(records, "main");
const career = careerRecords(roster, careerIdentityAliases);
assert.ok(!career.some((p) => ["zeus", "switches"].includes(p.id)));
const byId = new Map(records.map((record) => [record.id, record]));
const galleries = (data) =>
	(data.cyberspace?.stickies ?? []).filter((g) => g.type === "gallery" && g.data?.images?.length);
assert.deepEqual([...trialSlugs].sort(), [
	"backsplash",
	"bazooka",
	"c24",
	"d-command",
	"d-control",
	"ksystem-120",
	"room-director",
	"sc48",
	"sundance",
	"wall-plates",
	"webtv-cortez",
	"webtv-elmer",
	"webtv-galaxy",
]);
const models = new Map();
for (const record of roster) {
	const model = buildContextRibbon(career, record.id);
	assert.deepEqual(model, buildContextRibbon([...career].reverse(), record.id));
	if (model) {
		assert.ok(model.projects.length <= 7);
		assert.equal(model.projects.filter((p) => p.current).length, 1);
		for (const item of model.projects) {
			assert.ok(
				roster.some((r) => r.id === item.slug),
				`unbuilt destination ${item.slug}`,
			);
			assert.ok(item.x >= 24 && item.x + item.width <= 936);
		}
	}
	models.set(record.id, model);
}
for (const slug of trialSlugs) {
	const record = byId.get(slug);
	assert.equal(record.data.tier, "deep_dive");
	const config = projectArticleTrial[slug];
	const resolved = resolveProjectPresentation(
		config,
		record.data,
		record.headings,
		galleries(record.data),
	);
	for (const id of config.galleryCaptionsFromDeck ?? []) {
		const source = galleries(record.data).find((g) => g.id === id);
		const caption =
			source.caption ||
			source.deck
				.map((card) => card.body)
				.filter(Boolean)
				.join("\n\n");
		assert.equal(resolved.galleries.find((g) => g.id === id).caption, caption);
		for (const scene of resolved.scenes)
			for (const image of scene.media.filter((image) =>
				source.data.images.some((i) => i.src === image.src),
			))
				assert.equal(image.galleryCaption, caption);
	}
	if (!config.galleryCaptionsFromDeck) assert.deepEqual(resolved.galleries, galleries(record.data));
	const relabeled = structuredClone(galleries(record.data));
	for (const gallery of relabeled)
		for (const image of gallery.data.images) image.alt = "Revised accessible copy";
	resolveProjectPresentation(config, record.data, record.headings, relabeled);
	const invalid = structuredClone(config);
	invalid.sections.summary = "nonexistent-heading";
	assert.throws(
		() => resolveProjectPresentation(invalid, record.data, record.headings, galleries(record.data)),
		/Unresolved section/,
	);
	if (Object.keys(config.media).length) {
		const brokenMedia = structuredClone(config);
		Object.values(brokenMedia.media)[0].src = "/assets/missing.jpg";
		assert.throws(
			() =>
				resolveProjectPresentation(
					brokenMedia,
					record.data,
					record.headings,
					galleries(record.data),
				),
			/Media key/,
		);
	}
	if (config.galleryCaptionsFromDeck) {
		const invalidCaption = structuredClone(config);
		invalidCaption.galleryCaptionsFromDeck.push("missing-gallery");
		assert.throws(
			() =>
				resolveProjectPresentation(
					invalidCaption,
					record.data,
					record.headings,
					galleries(record.data),
				),
			/Gallery caption source/,
		);
	}
	if (config.models) {
		for (const model of resolved.models) {
			const source = record.data.cyberspace.stickies.find((item) => item.id === model.id);
			assert.equal(model.src, source.data.modelSrc);
			assert.equal(model.caption, source.caption);
		}
		const invalidModel = structuredClone(config);
		invalidModel.models.push("missing-model");
		assert.throws(
			() =>
				resolveProjectPresentation(
					invalidModel,
					record.data,
					record.headings,
					galleries(record.data),
				),
			/Model key/,
		);
	}
}
const fixture = [
	{ id: "default", data: {} },
	{ id: "draft", data: { draft: true } },
	{ id: "other-site", data: { targets: ["mech"] } },
	{ id: "alias", data: { targets: [] } },
];
assert.deepEqual(
	routeEligibleProjects(fixture, "main").map((p) => p.id),
	["default"],
);
assert.deepEqual(
	routeEligibleProjects(fixture, "main", true).map((p) => p.id),
	["default", "draft"],
);
assert.equal(models.get("ept-1000"), null, "isolated project suppresses unhelpful ribbon");
assert.equal(models.get("d-command").projects.find((p) => p.current).end, null);
console.log(
	`PASS data/configuration: ${roster.length} route-eligible records; ${trialSlugs.length} project configurations; broken references fail; alt edits preserve identity; gallery context preserved`,
);
if (process.argv.includes("--built")) {
	const emitted = [];
	for (const file of globSync("dist/projects/*/index.html", { posix: true })) {
		const html = await readFile(file, "utf8");
		const slug = file.split("/").at(-2);
		const hasRibbon = /<nav\b[^>]*\bdata-context-ribbon(?:\s|=|>)/u.test(html);
		const hasTrial = /<article\b[^>]*\bdata-trial(?:\s|=|>)/u.test(html);
		assert.equal(hasRibbon, hasTrial, `${slug}: partial trial output`);
		if (hasTrial) emitted.push(slug);
	}
	assert.deepEqual(emitted.sort(), [...trialSlugs].sort());
	console.log("PASS static output: exactly thirteen approved articles and career ribbons");
	process.exit(0);
}
if (process.argv.includes("--data-only")) process.exit(0);

const cacheDirectory = path.join(process.cwd(), "node_modules/.cache/project-article-trial");
async function visit(page, slug) {
	const response = await page.goto(`${BASE_URL}/projects/${slug}`, {
		waitUntil: "networkidle0",
		timeout: PAGE_TIMEOUT_MS,
	});
	assert.equal(response.status(), 200, slug);
	await page.waitForSelector(`[data-project-article="${slug}"][data-trial]`);
}
const specs = trialSlugs.map((slug) => [
	`${slug}: article, references, themes, responsive rails and no-JS`,
	async (page, problems) => {
		problems.length = 0;
		await page.setViewport({ width: 1440, height: 1000 });
		await visit(page, slug);
		assert.equal(await page.$eval("[data-context-ribbon]", (el) => el.dataset.current), slug);
		const actualLinks = await page.$$eval(".ribbon-projects a", (links) =>
			links.map((a) => a.getAttribute("href")),
		);
		assert.deepEqual(
			actualLinks,
			models.get(slug).projects.map((p) => `/projects/${p.slug}`),
		);
		const config = projectArticleTrial[slug];
		const domHeadings = await page.$$eval(
			".markdown-content h2[id], .markdown-content h3[id]",
			(nodes) =>
				nodes.map((n) => ({ slug: n.id, depth: Number(n.tagName[1]), text: n.textContent })),
		);
		const record = byId.get(slug);
		const resolved = resolveProjectPresentation(
			config,
			record.data,
			domHeadings,
			galleries(record.data),
		);
		for (const id of config.galleryCaptionsFromDeck ?? []) {
			const caption = resolved.galleries.find((g) => g.id === id).caption;
			assert.ok(
				await page.$eval("#visual-evidence", (el, text) => el.textContent.includes(text), caption),
				`${slug}: omitted gallery context`,
			);
		}
		const references = await page.$$eval(
			"project-rail-coordinator a[href^='#'], .evidence-composition a[href^='#']",
			(links) => links.map((a) => a.getAttribute("href").slice(1)),
		);
		for (const ref of references)
			assert.ok(
				await page.evaluate((id) => !!document.getElementById(id), ref),
				`${slug}: dangling #${ref}`,
			);
		const nonempty = await page.$$eval(".project-rail--right [data-project-rail-scene]", (panels) =>
			panels.every((p) => p.querySelector("img, .rail__source-links a")),
		);
		assert.ok(nonempty, "empty media panel");
		if (!["c24", "d-command", "sundance", "room-director", "webtv-elmer"].includes(slug)) {
			// Browser load state covers broken sources without forcing full-resolution
			// decode() buffers for archival drawings that render at thumbnail size.
			await page.$$eval(".project-rail--right img", (images) =>
				images.forEach((image) => {
					image.loading = "eager";
				}),
			);
			await page.waitForFunction(() =>
				[...document.querySelectorAll(".project-rail--right img")].every((image) => image.complete),
			);
			const mediaResults = await page.$$eval(".project-rail--right img", (images) =>
				images.map((image) => ({ src: image.getAttribute("src"), loaded: image.naturalWidth > 0 })),
			);
			assert.ok(
				mediaResults.every((image) => image.loaded),
				`${slug}: failed selected media ${JSON.stringify(mediaResults.filter((image) => !image.loaded))}`,
			);
		}
		if (!galleries(record.data).length) assert.equal(await page.$("#visual-evidence"), null);
		const palettes = [];
		for (const theme of ["light", "dark"]) {
			await page.click(`[data-theme-set="${theme}"]`);
			palettes.push(
				await page.$eval("[data-context-ribbon]", (el) => getComputedStyle(el).backgroundColor),
			);
			await page.screenshot({ path: path.join(cacheDirectory, `${slug}-${theme}-desktop.png`) });
		}
		assert.notEqual(palettes[0], palettes[1]);
		for (const width of [1440, 768, 390, 320]) {
			await page.setViewport({ width, height: 1000 });
			assert.ok(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
				`${slug}: overflow at ${width}`,
			);
			assert.ok(
				await page.$$eval(".ribbon-projects a", (links) =>
					links.every((a) => a.getBoundingClientRect().height >= 44),
				),
			);
		}
		await page.screenshot({ path: path.join(cacheDirectory, `${slug}-mobile.png`) });
		await page.setViewport({ width: 1440, height: 1000 });
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
		await page.waitForSelector("[data-project-enhanced]");
		const sceneKey = config.scenes.find((s) => s.left.kind === "scar")?.key ?? "impact";
		const sceneId = config.sections[sceneKey];
		await page.evaluate((id) => {
			const top = document.getElementById(id).getBoundingClientRect().top;
			window.scrollBy(0, top - innerHeight * 0.28 + 1);
			window.dispatchEvent(new Event("scroll"));
		}, sceneId);
		await page.waitForFunction(
			(id) => !!document.querySelector(`[data-project-rail-scene="${id}"][data-active]`),
			{},
			sceneId,
		);
		assert.equal(
			await page.$eval(
				"project-rail-coordinator",
				(el) => el.getAnimations({ subtree: true }).length,
			),
			0,
		);
		await page.screenshot({ path: path.join(cacheDirectory, `${slug}-active-rails.png`) });
		assert.equal(
			await page.$$eval("[data-project-model]", (nodes) => nodes.length),
			resolved.models.length,
		);
		for (const model of resolved.models) {
			assert.ok(
				await page.$eval(
					"[data-project-model]",
					(el, text) => el.textContent.includes(text),
					model.caption,
				),
			);
			assert.equal(await page.$eval("[data-model-frame]", (el) => el.hidden), true);
			await page.click("[data-model-disclosure] summary");
			await page.waitForFunction(() => document.querySelector("model-viewer")?.loaded, {
				timeout: PAGE_TIMEOUT_MS,
			});
			assert.equal(await page.$eval("model-viewer", (el) => el.hasAttribute("auto-rotate")), false);
			assert.equal(await page.$eval("model-viewer", (el) => el.getAttribute("src")), model.src);
			await page.setViewport({ width: 320, height: 844 });
			assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
			await page.$eval("[data-project-model]", (el) => el.scrollIntoView({ block: "start" }));
			await page.screenshot({ path: path.join(cacheDirectory, `${slug}-model-mobile.png`) });
			await page.click("[data-model-disclosure] summary");
			await page.setViewport({ width: 1440, height: 1000 });
		}
		const link = await page.$(".ribbon-projects a:not([aria-current])");
		await page.keyboard.press("Tab");
		await link.focus();
		assert.notEqual(await link.evaluate((a) => getComputedStyle(a).outlineStyle), "none");
		const href = await link.evaluate((a) => a.getAttribute("href"));
		await Promise.all([
			page.waitForNavigation({ waitUntil: "networkidle0" }),
			page.keyboard.press("Enter"),
		]);
		await page.waitForFunction(
			(expected) => location.pathname.replace(/\/$/, "") === expected,
			{},
			href,
		);
		await page.emulateMediaFeatures([]);
		// Disable scripts before the first navigation in a separate page; toggling a
		// live Astro document can cancel deferred imports and create false page errors.
		const noJsPage = await page.browser().newPage();
		const noJsProblems = createPageProblemCollector(noJsPage);
		try {
			await noJsPage.setJavaScriptEnabled(false);
			await noJsPage.setViewport({ width: 390, height: 844 });
			await visit(noJsPage, slug);
			assert.equal(await noJsPage.$("[data-project-enhanced]"), null);
			assert.equal(
				await noJsPage.$$eval("[data-project-rail-scene][inert]", (panels) => panels.length),
				0,
			);
			assert.ok(await noJsPage.$(".markdown-content"));
			for (const model of resolved.models) {
				assert.equal(
					await noJsPage.$eval("[data-project-model] a", (el) => el.getAttribute("href")),
					model.src,
				);
				assert.equal(await noJsPage.$eval("[data-model-frame]", (el) => el.hidden), true);
			}
			const nativeLink = await noJsPage.$(".ribbon-projects a:not([aria-current])");
			const nativeHref = await nativeLink.evaluate((a) => a.getAttribute("href"));
			await Promise.all([
				noJsPage.waitForNavigation({ waitUntil: "networkidle0" }),
				nativeLink.click(),
			]);
			assert.equal(new URL(noJsPage.url()).pathname.replace(/\/$/, ""), nativeHref);
			assertNoPageProblems(noJsProblems);
		} finally {
			await noJsPage.close();
		}
		assertNoPageProblems(problems);
		return "source parity, resolved references, theme contrast, four widths, active rails, keyboard and no-JS navigation";
	},
]);
specs.push([
	"Trial boundaries and client navigation lifecycle",
	async (page) => {
		for (const slug of ["avegant-glyph", "kplayer-6000", "m500"]) {
			const response = await page.goto(`${BASE_URL}/projects/${slug}`, {
				waitUntil: "networkidle0",
			});
			assert.equal(response.status(), 200);
			assert.equal(await page.$("[data-context-ribbon], [data-trial]"), null);
		}
		await page.setViewport({ width: 1440, height: 1000 });
		await visit(page, "c24");
		const first = await page.$eval("[data-context-ribbon] svg", (el) => el.outerHTML);
		await page.reload({ waitUntil: "networkidle0" });
		assert.equal(await page.$eval("[data-context-ribbon] svg", (el) => el.outerHTML), first);
		await page.click('.ribbon-projects a[href="/projects/d-command"]');
		await page.waitForSelector('[data-project-article="d-command"] [data-project-enhanced]');
		await page.goBack({ waitUntil: "networkidle0" });
		await page.waitForSelector('[data-project-article="c24"] [data-project-enhanced]');
		assert.equal(await page.$$eval("project-rail-coordinator", (nodes) => nodes.length), 1);
		return "three non-rollout controls unchanged; deterministic C24; approved-page and back navigation reconnect rails";
	},
]);
process.exitCode = (await runBrowserContract({
	assertionSpecs: specs,
	cacheDirectory,
	expectedAssertions: specs.length,
	title: "Thirteen reviewed deep dives (#222 / #223)",
}))
	? 0
	: 1;
