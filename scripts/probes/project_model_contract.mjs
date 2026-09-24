import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import puppeteer from "puppeteer";
import { build } from "esbuild";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

// Default: verify C24 publishes no viewer. After an explicitly approved local
// opt-in (c24.models = ["3d_model"]), pass --interactive for the full viewer suite.
const interactive = process.argv.includes("--interactive");

// The historical #222/#223 all-article probe predates the authoring renderers.
// Exercise this ticket's actual presentation seam without changing their contracts.
async function load(file) {
	const result = await build({
		entryPoints: [file],
		bundle: true,
		write: false,
		platform: "node",
		format: "esm",
	});
	return import(
		`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`
	);
}
const { projectArticleTrial } = await load("src/config/projectArticleTrial.ts");
const { resolveProjectPresentation } = await load("src/utils/projectPresentation.ts");
for (const slug of ["c24", "d-command"]) {
	const { data, content } = matter(
		await readFile(`src/content/projects/${slug}/index.mdx`, "utf8"),
	);
	const slugger = new GithubSlugger();
	const headings = [...content.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((match) => ({
		depth: match[1].length,
		text: match[2],
		slug: slugger.slug(match[2]),
	}));
	const galleries = data.cyberspace.stickies.filter(
		(item) => item.type === "gallery" && item.data?.images?.length,
	);
	const current = projectArticleTrial[slug];
	assert.equal(
		resolveProjectPresentation(current, data, headings, galleries).models.length,
		slug === "c24" && interactive ? 1 : 0,
	);
	// Exercise the retained opt-in without enabling it in the published page.
	const config = structuredClone(current);
	if (slug === "c24") config.models = ["3d_model"];
	const resolved = resolveProjectPresentation(config, data, headings, galleries);
	assert.equal(resolved.models.length, slug === "c24" ? 1 : 0);
	for (const model of resolved.models) {
		const source = data.cyberspace.stickies.find((item) => item.id === model.id);
		assert.equal(model.src, source.data.modelSrc);
		assert.equal(model.title, source.title);
		assert.equal(model.caption, source.caption);
		assert.equal(model.beforeId, "iii-design-and-production");
		const invalid = structuredClone(config);
		invalid.modelPlacement[model.id].before = "missing-section";
		assert.throws(
			() => resolveProjectPresentation(invalid, data, headings, galleries),
			/Unresolved section/,
		);
		const missing = structuredClone(data);
		missing.cyberspace.stickies.find((item) => item.id === model.id).data.modelSrc = "";
		assert.throws(
			() => resolveProjectPresentation(config, missing, headings, galleries),
			/with a source/,
		);
	}
}
console.log(
	"PASS shared presentation: current selection verified; C24 opt-in preserves source/title/caption and placement; invalid references fail; D-Command has no model",
);

const base = process.env.BROWSER_CONTRACT_URL ?? "http://127.0.0.1:4336";
assert.equal(new URL(base).hostname, "127.0.0.1", "Only qualify a local candidate");
if (!interactive) {
	const browser = await puppeteer.launch({ headless: true });
	try {
		const page = await browser.newPage();
		const modelRequests = [];
		page.on("request", (request) => {
			if (/\.glb(?:\?|$)/i.test(request.url())) modelRequests.push(request.url());
		});
		for (const javascript of [true, false]) {
			await page.setJavaScriptEnabled(javascript);
			for (const slug of ["c24", "m500", "d-command", "cinema-one"]) {
				const response = await page.goto(`${base}/projects/${slug}/`, {
					waitUntil: "networkidle2",
				});
				assert.equal(response.status(), 200);
				assert.equal(
					await page.$('[data-project-model], model-viewer, a[href$=".glb"]'),
					null,
					`${slug}: no viewer or model file link (JavaScript ${javascript})`,
				);
				if (slug === "c24") {
					assert.match(
						await page.$eval(
							"#iii-design-and-production",
							(heading) => heading.previousElementSibling.textContent,
						),
						/geometry and assembly underneath/,
					);
				}
			}
		}
		assert.deepEqual(modelRequests, []);
		console.log(
			"PASS C24 removal: no viewer, file link or GLB request; article order intact with/without JavaScript; three other project controls unchanged",
		);
	} finally {
		await browser.close();
	}
	process.exit(0);
}
const output = new URL("../../node_modules/.cache/project-model/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({ headless: true });
const source = "/assets/r2/c24/3d/C24_shell.glb";
const modelRequest = (url) => new URL(url).pathname === source;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ready = (page) =>
	page.waitForFunction(
		() => {
			const viewer = document.querySelector("model-viewer");
			return viewer?.loaded && !document.querySelector("[data-model-controls]")?.hidden;
		},
		{ timeout: 45000 },
	);
const visit = async (page) => {
	assert.equal(
		(
			await page.goto(`${base}/projects/c24/`, { waitUntil: "domcontentloaded", timeout: 45000 })
		).status(),
		200,
	);
	await page.waitForFunction(
		() => document.querySelector("[data-model-disclosure]")?.dataset.bound,
	);
};
const open = async (page) => {
	await page.focus("[data-model-disclosure] summary");
	await page.keyboard.press("Enter");
	await ready(page);
	await page.$eval("[data-project-model]", (el) => el.scrollIntoView({ block: "center" }));
};
const orbit = (page) => page.$eval("model-viewer", (el) => ({ ...el.getCameraOrbit() }));
const placement = (page) =>
	page.$eval("[data-project-model]", (el) => ({
		parent: el.parentElement.className,
		next: el.nextElementSibling.id,
		previous: el.previousElementSibling.textContent,
	}));
try {
	let page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 1000 });
	const requests = [],
		errors = [];
	page.on("request", (r) => {
		if (modelRequest(r.url())) requests.push(r.url());
	});
	page.on("pageerror", (e) => errors.push(e.message));
	await visit(page);
	const location = await placement(page);
	assert.match(location.parent, /markdown-content/);
	assert.equal(location.next, "iii-design-and-production");
	assert.match(location.previous, /geometry and assembly underneath/);
	assert.equal(await page.$("model-viewer"), null);
	await page.$eval("[data-project-model]", (el) => el.scrollIntoView({ block: "center" }));
	await pause(250);
	assert.equal(requests.length, 0, "Closed disclosure must not download the model");
	console.log("PASS static placement and no model request before reader action");
	await open(page);
	assert.equal(requests.length, 1);
	assert.equal(
		await page.$eval(
			"model-viewer",
			(el) =>
				el.hasAttribute("auto-rotate") || el.hasAttribute("autoplay") || el.hasAttribute("ar"),
		),
		false,
	);
	assert.equal(
		await page.$eval("model-viewer", (el) => el.getAttribute("interaction-prompt")),
		"none",
	);
	const start = await orbit(page);
	await page.focus("[data-model-disclosure] summary");
	await page.keyboard.press("Tab");
	assert.equal(await page.evaluate(() => document.activeElement.tagName), "MODEL-VIEWER");
	await page.keyboard.press("ArrowRight");
	await page.waitForFunction(
		(theta) =>
			Math.abs(document.querySelector("model-viewer").getCameraOrbit().theta - theta) > 0.01,
		{},
		start.theta,
	);
	await page.click("[data-model-reset]");
	await page.waitForFunction(
		(theta) =>
			Math.abs(document.querySelector("model-viewer").getCameraOrbit().theta - theta) < 0.001,
		{},
		start.theta,
	);
	const bounds = await page.$eval("model-viewer", (el) => {
		const r = el.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	});
	await page.mouse.move(bounds.x, bounds.y);
	await page.mouse.down();
	await page.mouse.move(bounds.x + 90, bounds.y + 20, { steps: 8 });
	await page.mouse.up();
	assert.ok(Math.abs((await orbit(page)).theta - start.theta) > 0.01);
	await page.click("[data-model-reset]");
	await pause(150);
	const radius = (await orbit(page)).radius;
	const scrollY = await page.evaluate(() => window.scrollY);
	await page.mouse.move(bounds.x, bounds.y);
	await page.mouse.wheel({ deltaY: 220 });
	await page.waitForFunction((y) => scrollY > y + 50, {}, scrollY);
	assert.ok(
		Math.abs((await orbit(page)).radius - radius) < 0.001,
		"Wheel should scroll the article",
	);
	await page.$eval("[data-project-model]", (el) => el.scrollIntoView({ block: "center" }));
	await page.screenshot({ path: new URL("desktop.png", output).pathname.replace(/^\//, "") });
	await page.focus("[data-model-disclosure] summary");
	await page.keyboard.press("Tab");
	await page.keyboard.press("Tab");
	assert.equal(
		await page.evaluate(() => document.activeElement.hasAttribute("data-model-reset")),
		true,
		"Tab exits native canvas",
	);
	await page.keyboard.press("Escape");
	assert.equal(await page.$eval("[data-model-disclosure]", (el) => el.open), false);
	assert.equal(await page.evaluate(() => document.activeElement.tagName), "SUMMARY");
	await open(page);
	assert.equal(requests.length, 1, "Reopen reuses the existing model");
	console.log(
		"PASS visible model, keyboard/pointer camera controls, reset, wheel scrolling, exit and reopen",
	);
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	const still = await orbit(page);
	await pause(350);
	assert.deepEqual(await orbit(page), still, "No unsolicited camera motion");
	await page.close();
	page = await browser.newPage();
	page.on("pageerror", (e) => errors.push(e.message));
	await page.setViewport({ width: 768, height: 844, isMobile: true, hasTouch: true });
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	await visit(page);
	await open(page);
	for (const width of [768, 390, 320]) {
		await page.setViewport({ width, height: 844, isMobile: true, hasTouch: true });
		await page.$eval("[data-project-model]", (el) => el.scrollIntoView({ block: "center" }));
		assert.ok(
			await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
			`overflow at ${width}`,
		);
		assert.equal(
			await page.$eval("model-viewer", (el) => el.getAttribute("touch-action")),
			"pan-y",
		);
	}
	await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
	await page.$eval("[data-project-model]", (el) => el.scrollIntoView({ block: "center" }));
	const touch = await page.$eval("model-viewer", (el) => {
		const r = el.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	});
	const cdp = await page.createCDPSession();
	const beforeTouch = await orbit(page);
	await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [touch] });
	await cdp.send("Input.dispatchTouchEvent", {
		type: "touchMove",
		touchPoints: [{ x: touch.x + 65, y: touch.y }],
	});
	await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
	await pause(150);
	assert.ok(Math.abs((await orbit(page)).theta - beforeTouch.theta) > 0.01, "Touch drag rotates");
	const beforePinch = (await orbit(page)).radius;
	await cdp.send("Input.dispatchTouchEvent", {
		type: "touchStart",
		touchPoints: [
			{ x: touch.x - 30, y: touch.y, id: 1 },
			{ x: touch.x + 30, y: touch.y, id: 2 },
		],
	});
	for (let offset = 35; offset <= 70; offset += 7) {
		await cdp.send("Input.dispatchTouchEvent", {
			type: "touchMove",
			touchPoints: [
				{ x: touch.x - offset, y: touch.y, id: 1 },
				{ x: touch.x + offset, y: touch.y, id: 2 },
			],
		});
	}
	await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
	await pause(150);
	assert.ok(
		Math.abs((await orbit(page)).radius - beforePinch) > 0.01,
		"Pinch zoom changes camera distance",
	);
	const beforeScroll = await page.evaluate(() => scrollY);
	await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [touch] });
	for (let i = 1; i <= 5; i++)
		await cdp.send("Input.dispatchTouchEvent", {
			type: "touchMove",
			touchPoints: [{ x: touch.x, y: touch.y - i * 22 }],
		});
	await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
	await pause(200);
	assert.ok(
		await page.evaluate((y) => scrollY > y + 20, beforeScroll),
		"Vertical touch continues the article",
	);
	await page.click("[data-model-reset]");
	await page.$eval("[data-project-model]", (el) => el.scrollIntoView({ block: "center" }));
	await page.screenshot({ path: new URL("mobile.png", output).pathname.replace(/^\//, "") });
	await cdp.detach();
	assert.deepEqual(errors, []);
	console.log(
		"PASS narrow layout, reduced motion, touch orbit/pinch and vertical page scrolling (emulated device)",
	);
	await page.close();

	const failed = await browser.newPage();
	await failed.setViewport({ width: 1440, height: 1000 });
	await failed.setRequestInterception(true);
	let block = true;
	let failedRequests = 0;
	failed.on("request", (request) => {
		if (modelRequest(request.url()) && block) {
			failedRequests++;
			return request.abort();
		}
		return request.continue();
	});
	await visit(failed);
	await failed.focus("[data-model-disclosure] summary");
	await failed.keyboard.press("Enter");
	await failed.waitForFunction(() =>
		document.querySelector("[data-model-status]")?.textContent.includes("unavailable"),
	);
	assert.equal(failedRequests, 1);
	assert.equal(await failed.$eval("[data-model-frame]", (el) => el.hidden), true);
	assert.equal(
		await failed.$eval("[data-project-model] a", (el) => el.getAttribute("href")),
		source,
	);
	assert.equal(await failed.$eval("[data-model-retry]", (el) => el.hidden), false);
	block = false;
	await failed.click("[data-model-retry]");
	await ready(failed);
	assert.ok(
		await failed.$eval("model-viewer", (el) => el.getAttribute("src").includes("model-retry=")),
	);
	console.log("PASS failed model hides empty frame, preserves file link, and retries successfully");
	await failed.close();

	const moduleFailure = await browser.newPage();
	await moduleFailure.setRequestInterception(true);
	moduleFailure.on("request", (request) => {
		if (/(?:@google_model-viewer|\/model-viewer[.-]).*\.js/.test(request.url()))
			return request.abort();
		return request.continue();
	});
	await visit(moduleFailure);
	await moduleFailure.focus("[data-model-disclosure] summary");
	await moduleFailure.keyboard.press("Enter");
	await moduleFailure.waitForFunction(() =>
		document.querySelector("[data-model-status]")?.textContent.includes("unavailable"),
	);
	assert.equal(
		await moduleFailure.$eval("[data-model-retry]", (el) => el.textContent),
		"Reload page",
	);
	console.log("PASS failed component import offers explicit page reload and direct file access");
	await moduleFailure.close();

	const noJs = await browser.newPage();
	await noJs.setJavaScriptEnabled(false);
	await noJs.goto(`${base}/projects/c24/`, { waitUntil: "domcontentloaded" });
	assert.deepEqual(await placement(noJs), location);
	assert.equal(await noJs.$("model-viewer"), null);
	assert.equal(await noJs.$eval("[data-project-model] a", (el) => el.getAttribute("href")), source);
	const native = await fetch(`${base}${source}`);
	assert.equal(native.status, 200);
	assert.match(native.headers.get("content-type"), /model\/gltf-binary/);
	const modelBytes = Buffer.from(await native.arrayBuffer());
	assert.equal(modelBytes.toString("ascii", 0, 4), "glTF");
	assert.equal(modelBytes.readUInt32LE(4), 2);
	assert.equal(modelBytes.readUInt32LE(8), modelBytes.length);
	const local = await readFile("D:/GitHub/portfolio-assets/R2_MIRROR/c24/3d/C24_shell.glb");
	const hash = (b) => createHash("sha256").update(b).digest("hex");
	assert.equal(hash(modelBytes), hash(local));
	console.log(
		`PASS no-JS article/file access; actual GLB v2 ${modelBytes.length} bytes SHA256 ${hash(modelBytes)}`,
	);
	await noJs.close();
	const controls = await browser.newPage();
	for (const slug of ["m500", "d-command", "cinema-one"]) {
		assert.equal(
			(
				await controls.goto(`${base}/projects/${slug}/`, { waitUntil: "domcontentloaded" })
			).status(),
			200,
		);
		assert.equal(
			await controls.$("[data-project-model],model-viewer"),
			null,
			`${slug}: absent model stays absent`,
		);
	}
	console.log("PASS no empty/demo viewers on M500, D-Command or Cinema One");
	await controls.close();
} finally {
	await browser.close();
}
