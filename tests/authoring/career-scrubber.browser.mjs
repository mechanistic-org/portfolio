import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const base = process.env.BROWSER_CONTRACT_URL ?? "http://127.0.0.1:4382";
assert.equal(new URL(base).hostname, "127.0.0.1");
const out = process.env.SCRUBBER_PROOF_DIR ?? "node_modules/.cache/scrubber-proof";
await mkdir(out, { recursive: true });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const results = [];
const slider = ".career-scrubber:not(:disabled)";
const state = () =>
	page.evaluate(() => {
		const nav = document.querySelector("[data-context-ribbon]");
		const svg = nav.querySelector("svg");
		const leader = nav.querySelector(".career-project-leader");
		const pip = svg.querySelector(`[data-project="${nav.dataset.preview}"] rect`);
		const box = nav.getBoundingClientRect();
		const matrix = leader ? new DOMMatrix(getComputedStyle(leader).transform) : null;
		return {
			home: nav.dataset.current,
			preview: nav.dataset.preview,
			phase: nav.dataset.scrubPhase,
			url: location.href,
			viewer: document.querySelector("[data-viewer-id]")?.dataset.viewerId,
			years: nav.querySelector(".career-overview-years").textContent,
			label: nav.querySelector(".career-scrubber")?.getAttribute("aria-valuetext"),
			pipLabel: pip?.parentElement.getAttribute("aria-label"),
			x: matrix?.e,
			pipX: pip ? +pip.getAttribute("x") + 3 : null,
			y: leader?.getAttribute("y2"),
			pipY: pip?.getAttribute("y"),
			plotHeight: svg.getBoundingClientRect().height,
			panelHeight: box.height,
			background: getComputedStyle(nav).backgroundColor,
			overflow: document.documentElement.scrollWidth > innerWidth,
			pips: [...svg.querySelectorAll("a[data-project]")].map((a) => ({
				id: a.dataset.project,
				x: +a.querySelector("rect").getAttribute("x") + 3,
			})),
		};
	});
function aligned(s) {
	assert.ok(Math.abs(s.x - s.pipX) < 0.02, JSON.stringify(s));
	assert.equal(s.y, s.pipY);
	assert.ok(s.pipLabel.startsWith(s.label));
}
async function load(url = "/projects/avegant-glyph/") {
	await page.goto(base + url, { waitUntil: "domcontentloaded" });
	await page.waitForSelector(slider);
	await page.$eval(slider, (el) => el.scrollIntoView({ block: "center" }));
	await page.evaluate(() => document.fonts.ready);
	await pause(150);
}
async function drag(direction = -1) {
	const b = await page.$eval(slider, (el) => {
		const r = el.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + 8 };
	});
	const width = await page.$eval(
		"[data-career-overview]",
		(el) => el.getBoundingClientRect().width,
	);
	await page.mouse.move(b.x, b.y);
	await page.mouse.down();
	await page.mouse.move(b.x + width * 0.25 * direction, b.y, { steps: 8 });
}
async function check(name, fn) {
	try {
		const details = await fn();
		results.push({ name, passed: true, details });
		console.log("PASS", name, details ?? "");
	} catch (error) {
		results.push({ name, passed: false, error: error.stack });
		console.error("FAIL", name, error.message);
	}
}
try {
	await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
	await check(
		"Glyph desktop drag, pip attachment, fixed scale, return timing and URL",
		async () => {
			await load();
			const before = await state();
			aligned(before);
			assert.equal(before.plotHeight, 64);
			assert.ok(Math.abs(before.panelHeight - 113) < 3, `height ${before.panelHeight}`);
			assert.equal(await page.$(".career-window, .career-adjacent, .career-utility"), null);
			await page.screenshot({ path: path.join(out, "glyph-desktop-home.png") });
			await drag();
			const during = await state();
			aligned(during);
			assert.notEqual(during.preview, before.home);
			assert.equal(during.home, before.home);
			assert.equal(during.url, before.url);
			assert.equal(during.years, before.years);
			assert.deepEqual(during.pips, before.pips);
			await page.screenshot({ path: path.join(out, "glyph-desktop-preview.png") });
			await page.mouse.up();
			await pause(420);
			assert.equal((await state()).preview, during.preview);
			await page.waitForFunction(
				() => document.querySelector("[data-context-ribbon]").dataset.scrubPhase === "returning",
				{ timeout: 1000, polling: "raf" },
			);
			const moving = await state();
			assert.equal(moving.preview, before.home);
			await pause(240);
			const after = await state();
			aligned(after);
			assert.equal(after.phase, "home");
			assert.equal(after.url, before.url);
			return {
				years: before.years,
				panelHeight: before.panelHeight,
				background: before.background,
			};
		},
	);
	await check(
		"Escape, capture loss, pointer cancellation, blur and interrupted return",
		async () => {
			await load();
			for (const cancel of ["escape", "pointercancel", "lostpointercapture", "blur"]) {
				await drag();
				assert.notEqual((await state()).preview, "avegant-glyph");
				if (cancel === "escape") await page.keyboard.press("Escape");
				else
					await page.evaluate((type) => {
						if (type === "blur") window.dispatchEvent(new Event("blur"));
						else
							document
								.querySelector(".career-scrubber")
								.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 1 }));
					}, cancel);
				await page.mouse.up();
				assert.equal((await state()).preview, "avegant-glyph");
				await pause(850);
				assert.equal((await state()).phase, "home");
			}
			await drag();
			await page.mouse.up();
			await pause(300);
			await drag(1);
			const next = await state();
			await pause(600);
			assert.equal((await state()).preview, next.preview);
			await page.mouse.up();
			await pause(900);
			aligned(await state());
		},
	);
	await check("Keyboard visits coincident dates, edges and Home without URL mutation", async () => {
		await load();
		await page.focus(slider);
		const initial = await state();
		const pips = initial.pips;
		const home = pips.findIndex((p) => p.id === initial.home);
		const visited = new Set([initial.home]);
		for (let i = home - 1; i >= 0; i--) {
			await page.keyboard.down("ArrowLeft");
			const s = await state();
			assert.equal(s.preview, pips[i].id);
			aligned(s);
			visited.add(s.preview);
		}
		await page.keyboard.up("ArrowLeft");
		await page.keyboard.press("Home");
		assert.equal((await state()).preview, initial.home);
		for (let i = home + 1; i < pips.length; i++) {
			await page.keyboard.down("ArrowRight");
			const s = await state();
			assert.equal(s.preview, pips[i].id);
			aligned(s);
			visited.add(s.preview);
		}
		await page.keyboard.up("ArrowRight");
		await page.keyboard.press("End");
		aligned(await state());
		await page.keyboard.press("Escape");
		assert.equal((await state()).preview, initial.home);
		assert.equal((await state()).url, initial.url);
		assert.equal(visited.size, pips.length);
		return { visited: visited.size, coincident: pips.length - new Set(pips.map((p) => p.x)).size };
	});
	await check("Reduced motion returns directly home with no animation", async () => {
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
		await load();
		await page.focus(slider);
		await page.keyboard.press("ArrowLeft");
		await pause(660);
		const s = await state();
		assert.equal(s.phase, "home");
		aligned(s);
		assert.equal(
			await page.$eval(".career-project-leader", (el) => getComputedStyle(el).transitionDuration),
			"0s",
		);
		await page.emulateMediaFeatures([]);
	});
	await check(
		"Homepage neutral overview, explicit selection and held state during scrubbing",
		async () => {
			await page.goto(base + "/", { waitUntil: "domcontentloaded" });
			await page.waitForSelector('[data-hxo-hydrated="true"]');
			assert.equal(await page.$(slider), null);
			assert.equal((await state()).home, "");
			await page.$eval('[data-career-overview] a[data-project="avegant-glyph"]', (el) =>
				el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
			);
			await page.waitForSelector(slider);
			await page.$eval(slider, (el) => el.scrollIntoView({ block: "center" }));
			const before = await state();
			assert.equal(before.viewer, "avegant-glyph");
			assert.ok(before.url.endsWith("#project=avegant-glyph"));
			const neighborhood = await page.$eval(".career-neighborhood", (el) => el.outerHTML);
			await drag();
			await pause(220);
			const during = await state();
			aligned(during);
			assert.notEqual(during.preview, before.home);
			assert.equal(during.viewer, before.viewer);
			assert.equal(during.url, before.url);
			assert.deepEqual(during.pips, before.pips);
			assert.equal(during.years, before.years);
			assert.equal(await page.$eval(".career-neighborhood", (el) => el.outerHTML), neighborhood);
			await page.screenshot({ path: path.join(out, "homepage-desktop-preview.png") });
			await page.keyboard.press("Escape");
			await page.mouse.up();
			assert.equal((await state()).viewer, before.viewer);
			assert.equal((await state()).url, before.url);
			await page.focus(slider);
			await page.keyboard.press("ArrowLeft");
			await pause(900);
			aligned(await state());
			assert.equal((await state()).viewer, before.viewer);
			// Modified clicks retain native behavior, ordinary clicks acquire a new home.
			const modified = await page.$eval('[data-career-overview] a[data-project="c24"]', (el) => {
				const event = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true });
				let wasPrevented;
				document.addEventListener(
					"click",
					(e) => {
						wasPrevented = e.defaultPrevented;
						e.preventDefault();
					},
					{ once: true },
				);
				el.dispatchEvent(event);
				return wasPrevented;
			});
			assert.equal(modified, false);
			assert.equal((await state()).viewer, before.viewer);
			await page.focus(slider);
			await page.keyboard.press("ArrowLeft");
			await page.$eval('[data-career-overview] a[data-project="c24"]', (el) =>
				el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
			);
			await pause(900);
			assert.equal((await state()).home, "c24");
			assert.equal((await state()).viewer, "c24");
			return { years: before.years, pips: before.pips.length };
		},
	);
	await check("Route unmount during a pending return leaves native navigation intact", async () => {
		await load();
		await page.focus(slider);
		await page.keyboard.press("ArrowLeft");
		const selector = '[data-career-overview] a[data-project]:not([data-project="avegant-glyph"])';
		const destination = await page.$eval(
			selector,
			(el) => new URL(el.href.baseVal, location.href).pathname,
		);
		await page.click(selector);
		await page.waitForFunction(
			(expected) =>
				location.pathname === expected &&
				document.querySelector("[data-context-ribbon]")?.dataset.current === expected.split("/")[2],
			{},
			destination,
		);
		await pause(900);
		assert.equal(new URL(page.url()).pathname, destination);
		assert.equal(await page.$(slider), null);
	});
	await check("Phone touch drag and vertical scrolling", async () => {
		await page.setViewport({
			width: 390,
			height: 844,
			deviceScaleFactor: 1,
			isMobile: true,
			hasTouch: true,
		});
		await load();
		const before = await state();
		assert.equal(before.overflow, false);
		aligned(before);
		await page.screenshot({ path: path.join(out, "glyph-phone-home.png") });
		const cdp = await page.createCDPSession();
		const box = await page.$eval(slider, (el) => {
			const r = el.getBoundingClientRect();
			return { x: r.x + r.width / 2, y: r.y + 8 };
		});
		await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [box] });
		for (let i = 1; i <= 5; i++)
			await cdp.send("Input.dispatchTouchEvent", {
				type: "touchMove",
				touchPoints: [{ x: box.x - 20 * i, y: box.y }],
			});
		const during = await state();
		assert.notEqual(during.preview, before.home);
		aligned(during);
		await page.screenshot({ path: path.join(out, "glyph-phone-preview.png") });
		await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
		await pause(900);
		aligned(await state());
		assert.equal((await state()).url, before.url);
		const scrollBefore = await page.evaluate(() => scrollY);
		await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [box] });
		for (let i = 1; i <= 5; i++) {
			await cdp.send("Input.dispatchTouchEvent", {
				type: "touchMove",
				touchPoints: [{ x: box.x, y: box.y - 25 * i }],
			});
			await pause(30);
		}
		await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
		await pause(250);
		assert.notEqual(await page.evaluate(() => scrollY), scrollBefore);
		assert.equal((await state()).preview, before.home);
		await cdp.detach();
	});
	await check("Unhydrated native links and unchanged non-pilot render mode", async () => {
		const fallback = await browser.newPage();
		await fallback.setJavaScriptEnabled(false);
		await fallback.goto(base + "/projects/avegant-glyph/", { waitUntil: "domcontentloaded" });
		assert.ok(await fallback.$(".career-scrubber[disabled]"));
		const link = await fallback.$eval(
			'[data-career-overview] a[data-project]:not([data-project="avegant-glyph"])',
			(el) => new URL(el.getAttribute("href"), location.href).href,
		);
		assert.ok(new URL(link).pathname.startsWith("/projects/"));
		await fallback.$eval(
			'[data-career-overview] a[data-project]:not([data-project="avegant-glyph"])',
			(el) => el.scrollIntoView({ block: "center", behavior: "instant" }),
		);
		await Promise.all([
			fallback.waitForNavigation({ waitUntil: "domcontentloaded" }),
			fallback.click('[data-career-overview] a[data-project]:not([data-project="avegant-glyph"])'),
		]);
		assert.equal(new URL(fallback.url()).pathname, new URL(link).pathname);
		assert.equal(await fallback.$(".career-scrubber"), null);
		assert.ok(await fallback.$(".career-neighborhood"));
		await fallback.close();
	});
} finally {
	await writeFile(
		path.join(out, "browser-results.json"),
		JSON.stringify({ url: base, results, pageErrors: errors }, null, 2),
	);
	await browser.close();
}
if (results.some((r) => !r.passed) || errors.length) process.exitCode = 1;
