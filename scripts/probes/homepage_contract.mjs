import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import {
	assertNoPageProblems,
	BASE_URL,
	runBrowserContract,
	VIEWPORTS,
} from "./browser_contract_harness.mjs";

const cacheDirectory = path.join(process.cwd(), "node_modules/.cache/hxo-contract");
const artifacts = path.join(cacheDirectory, "artifacts");
await mkdir(artifacts, { recursive: true });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const node = (id) => `.node-group[data-id="${id}"]`;
const desktop = VIEWPORTS[0];

async function navigate(page, suffix = "/") {
	await page.goto("about:blank");
	await page.mouse.move(1, 1);
	const response = await page.goto(`${BASE_URL}${suffix}`, {
		waitUntil: "networkidle0",
		timeout: 45000,
	});
	assert.equal(response.status(), 200);
	await page.waitForSelector('[data-hxo-hydrated="true"]');
	await page.waitForSelector('[data-swarm-ready="true"]');
	await page.evaluate(() => document.fonts.ready);
}
async function focusNode(page, id) {
	await page.$eval(node(id), (el) => el.focus());
}
async function selected(page, id) {
	await page.waitForFunction(
		(expected) =>
			document.querySelector("[data-viewer-id]")?.dataset.viewerId === expected &&
			document.querySelector("[data-context-ribbon]")?.dataset.current === expected &&
			location.hash === `#project=${expected}` &&
			document
				.querySelector(`.node-group[data-id="${expected}"] .focus-ring`)
				?.getAttribute("opacity") === "1",
		{},
		id,
	);
}
async function pointAt(page, id) {
	await page.$eval(node(id), (el) => el.scrollIntoView({ block: "center" }));
	const point = await page.$eval(`${node(id)} .project-circle`, (el) => {
		const r = el.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	});
	await page.mouse.move(point.x, point.y);
}
async function snapshot(page) {
	return page.$$eval(".node-group", (nodes) =>
		nodes.map((el) => {
			const point = el.transform.baseVal.consolidate().matrix;
			const circle = el.querySelector(".project-circle");
			return {
				id: el.dataset.id,
				x: point.e,
				y: point.f,
				radius: +circle.getAttribute("r"),
				stroke: circle.getAttribute("stroke"),
				width: circle.getAttribute("stroke-width"),
				opacity: +getComputedStyle(circle).opacity,
				tier: el.dataset.tier,
				employer: el.dataset.employer,
				epoch: el.dataset.lensGroup,
			};
		}),
	);
}
function unchangedFacts(before, after) {
	assert.deepEqual(
		after.map(({ x, y, opacity, ...rest }) => rest),
		before.map(({ x, y, opacity, ...rest }) => rest),
	);
}
function displacement(before, after) {
	return Math.max(...before.map((a, i) => Math.hypot(a.x - after[i].x, a.y - after[i].y)));
}
async function packing(page, state) {
	await page.waitForSelector(`svg[data-packing-state="${state}"]`);
}
async function motion(page, state) {
	const selector = "[data-swarm-motion-control]";
	if ((await page.$eval(selector, (el) => el.dataset.motionState)) !== state)
		await page.click(selector);
	await page.waitForSelector(`[data-motion-state="${state}"]`);
}
async function containment(page) {
	const result = await page.evaluate(() => {
		const svg = document.querySelector(".node-group").ownerSVGElement.getBoundingClientRect();
		const outside = [...document.querySelectorAll(".project-circle")].filter((el) => {
			const r = el.getBoundingClientRect();
			return (
				r.left < svg.left - 1 ||
				r.right > svg.right + 1 ||
				r.top < svg.top - 1 ||
				r.bottom > svg.bottom + 1
			);
		}).length;
		return { outside, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
	});
	assert.deepEqual(result, { outside: 0, overflow: false });
}

const assertionSpecs = [
	[
		"Map, chronology and native overview retain the eligible roster",
		async (page) => {
			await navigate(page);
			const state = await page.evaluate(() => ({
				nodes: [...document.querySelectorAll(".node-group")].map((el) => el.dataset.id).sort(),
				links: [...document.querySelectorAll("[data-career-overview] a, .career-undated a")]
					.map((el) => el.dataset.project)
					.sort(),
				retired: document.querySelectorAll(
					"[data-lens-control], [data-tour-control], [data-pin-control], #record-band, [data-constellation]",
				).length,
				roles: document.querySelectorAll(".employer-zone").length,
				present: [...document.querySelectorAll(".employer-zone")].some((el) =>
					el.textContent.includes("2022–Present"),
				),
			}));
			assert.equal(state.nodes.length, 83);
			assert.deepEqual(state.links, state.nodes);
			assert.equal(state.retired, 0);
			assert.equal(state.roles, 11);
			assert.ok(state.present);
			await containment(page);
			return "83 project targets and native links; 11 dated employer periods";
		},
	],
	[
		"Pointer acquisition groups temporarily, preserves time anchors and holds reading on return",
		async (page) => {
			await navigate(page);
			await pointAt(page, "sc48");
			await packing(page, "grouping");
			const baseline = await snapshot(page);
			await selected(page, "sc48");
			const timeAnchor = await page.$eval(".career-focus-path circle", (el) =>
				el.getAttribute("cy"),
			);
			await packing(page, "grouped");
			const grouped = await snapshot(page);
			unchangedFacts(baseline, grouped);
			assert.ok(displacement(baseline, grouped) > 10);
			const i = baseline.findIndex((n) => n.id === "sc48");
			assert.ok(
				displacement([baseline[i]], [grouped[i]]) < 2,
				"hover target moved during acquisition",
			);
			assert.equal(
				await page.$eval(".career-focus-path circle", (el) => el.getAttribute("cy")),
				timeAnchor,
			);
			assert.equal(await page.$$eval('[data-packing-member="true"]', (els) => els.length), 16);
			await page.mouse.move(1100, 250);
			await packing(page, "rest");
			await selected(page, "sc48");
			assert.ok(displacement(baseline, await snapshot(page)) < 5, "baseline was not restored");
			const rings = await snapshot(page);
			assert.equal(rings.filter((n) => n.tier === "deep_dive").length, 31);
			assert.ok(rings.filter((n) => n.tier === "deep_dive").every((n) => n.width === "3"));
			assert.ok(rings.every((n) => n.opacity >= 0.95));
		},
	],
	[
		"Rapid focus changes retarget within the recorded employment period",
		async (page) => {
			await navigate(page);
			await focusNode(page, "sc48");
			await delay(220);
			await focusNode(page, "avegant-glyph");
			await delay(220);
			await focusNode(page, "bay-wheels");
			await selected(page, "bay-wheels");
			await packing(page, "grouped");
			assert.deepEqual(
				(
					await page.$$eval('[data-packing-member="true"]', (els) => els.map((el) => el.dataset.id))
				).sort(),
				["bay-wheels", "battery-lock", "iot-module", "pet-scale"].sort(),
			);
			await page.focus("[data-viewer-id] a");
			await packing(page, "rest");
			await selected(page, "bay-wheels");
		},
	],
	[
		"Keyboard traversal, activation and Escape preserve visible focus",
		async (page) => {
			await navigate(page);
			await focusNode(page, "avegant-glyph");
			await page.keyboard.press("Tab");
			const id = await page.evaluate(() => document.activeElement.dataset.id);
			assert.ok(id, "Tab must reach the next map project");
			await page.keyboard.press("Enter");
			await selected(page, id);
			assert.equal(
				await page.$eval(`${node(id)} .focus-ring`, (el) => getComputedStyle(el).strokeWidth),
				"1.5px",
			);
			await page.keyboard.press("Escape");
			await page.waitForSelector('[data-viewer-id="orientation"]');
			assert.equal(new URL(page.url()).hash, "");
			await page.keyboard.press("Space");
			await selected(page, id);
		},
	],
	[
		"Timeline selection, native navigation and Back/Forward share one held subject",
		async (page) => {
			await navigate(page, "/#project=sc48");
			await selected(page, "sc48");
			await page.click('[data-career-overview] a[data-project="avegant-glyph"]');
			await selected(page, "avegant-glyph");
			await Promise.all([
				page.waitForNavigation({ waitUntil: "networkidle0" }),
				page.click('[data-viewer-id] a[href="/projects/avegant-glyph/"]'),
			]);
			assert.equal(new URL(page.url()).pathname, "/projects/avegant-glyph/");
			await page.goBack({ waitUntil: "networkidle0" });
			await selected(page, "avegant-glyph");
			await page.goForward({ waitUntil: "networkidle0" });
			assert.equal(new URL(page.url()).pathname, "/projects/avegant-glyph/");
		},
	],
	[
		"Direct, invalid and retired URL parameters normalize safely",
		async (page) => {
			for (const hash of [
				"#project=avegant-glyph",
				"#lens=employer&pin=avegant-glyph",
				"#lens=category&pin=avegant-glyph&tour=field",
			]) {
				await navigate(page, `/${hash}`);
				await selected(page, "avegant-glyph");
			}
			for (const hash of ["#project=missing", "#pin=missing&lens=bogus", "#tour=field"]) {
				await navigate(page, `/${hash}`);
				assert.equal(new URL(page.url()).hash, "");
				await page.waitForSelector('[data-viewer-id="orientation"]');
			}
			await navigate(page, "/#career-map");
			assert.equal(new URL(page.url()).hash, "#career-map");
			await navigate(page);
			await page.evaluate(() => {
				location.hash = "project=sc48";
			});
			await selected(page, "sc48");
			await page.goBack();
			await page.waitForSelector('[data-viewer-id="orientation"]');
			assert.equal(new URL(page.url()).hash, "");
		},
	],
	[
		"Approximation and employment context retain visible qualifications",
		async (page) => {
			await navigate(page, "/#project=fissler-bbq");
			await selected(page, "fissler-bbq");
			assert.match(await page.$eval("[data-viewer-id]", (el) => el.textContent), /c\. 1996/);
			assert.match(
				await page.$eval(".career-tracks [aria-current]", (el) => el.textContent),
				/c\. 1996/,
			);
			assert.equal(await page.$eval(node("fissler-bbq"), (el) => el.dataset.lensGroup), "1995");
			assert.match(
				await page.$eval('.employer-zone[data-active="true"]', (el) => el.textContent),
				/1993–1997/,
			);
			await navigate(page, "/#project=makeline");
			await selected(page, "makeline");
			assert.match(
				await page.$eval("[data-viewer-id]", (el) => el.textContent),
				/2021–2022.*Hyphen period/i,
			);
			assert.equal(
				await page.$eval(
					".career-tracks [aria-current] .career-span",
					(el) => getComputedStyle(el).borderTopStyle,
				),
				"dashed",
			);
		},
	],
	[
		"Pause cancels grouping and suppresses hover deformation",
		async (page) => {
			await navigate(page);
			await focusNode(page, "sc48");
			await packing(page, "grouped");
			await motion(page, "paused");
			await packing(page, "rest");
			const before = await snapshot(page);
			await pointAt(page, "avegant-glyph");
			await selected(page, "avegant-glyph");
			await delay(900);
			const after = await snapshot(page);
			unchangedFacts(before, after);
			assert.equal(displacement(before, after), 0);
		},
	],
	[
		"Browser-emulated reduced motion remains static at three viewports",
		async (page) => {
			try {
				await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
				for (const viewport of VIEWPORTS) {
					await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
					await navigate(page);
					await page.waitForSelector('[data-motion-state="paused"]');
					const before = await snapshot(page);
					await pointAt(page, "sc48");
					await selected(page, "sc48");
					await delay(900);
					assert.equal(displacement(before, await snapshot(page)), 0);
					await packing(page, "rest");
					await containment(page);
					await page.screenshot({
						path: path.join(artifacts, `${viewport.name}-reduced.png`),
						fullPage: true,
					});
				}
			} finally {
				await page.emulateMediaFeatures([]);
				await page.setViewport({ ...desktop, deviceScaleFactor: 1 });
			}
		},
	],
	[
		"Responsive motion, map-to-detail access and employer labels stay in bounds",
		async (page) => {
			try {
				for (const viewport of [...VIEWPORTS, { name: "small-phone", width: 320, height: 740 }]) {
					await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
					await navigate(page);
					await delay(1100);
					await containment(page);
					await pointAt(page, "avegant-glyph");
					await selected(page, "avegant-glyph");
					await packing(page, "grouped");
					await containment(page);
					await page.click(node("avegant-glyph"));
					if (viewport.width < 1024) {
						await delay(150);
						const top = await page.$eval(
							".hxo-console-stage",
							(el) => el.getBoundingClientRect().top,
						);
						assert.ok(Math.abs(top - 64) < 3, `detail pane top ${top}`);
					}
					const clipped = await page.$$eval(".employer-zone text", (els) =>
						els
							.filter((el) => {
								const r = el.getBoundingClientRect();
								return r.left < 0 || r.right > innerWidth + 1;
							})
							.map((el) => el.textContent),
					);
					assert.deepEqual(clipped, []);
					await page.screenshot({
						path: path.join(artifacts, `${viewport.name}-selected.png`),
						fullPage: true,
					});
				}
			} finally {
				await page.setViewport({ ...desktop, deviceScaleFactor: 1 });
			}
		},
	],
	[
		"Phone touch selects details without hover grouping",
		async (page) => {
			try {
				await page.setViewport({
					width: 390,
					height: 844,
					deviceScaleFactor: 1,
					isMobile: true,
					hasTouch: true,
				});
				await navigate(page);
				await page.$eval(node("fissler-bbq"), (el) => el.scrollIntoView({ block: "center" }));
				await page.tap(node("fissler-bbq"));
				await selected(page, "fissler-bbq");
				await delay(900);
				await packing(page, "rest");
				await containment(page);
			} finally {
				await page.setViewport({
					...desktop,
					deviceScaleFactor: 1,
					isMobile: false,
					hasTouch: false,
				});
			}
		},
	],
	[
		"No JavaScript retains native links and an immediately reachable archive",
		async (page) => {
			try {
				await page.setJavaScriptEnabled(false);
				for (const viewport of [desktop, VIEWPORTS[2]]) {
					await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
					await page.goto(BASE_URL, { waitUntil: "networkidle0" });
					assert.equal(
						await page.$$eval(
							'[data-career-overview] a[href^="/projects/"], .career-undated a',
							(els) => els.length,
						),
						83,
					);
					assert.equal(
						await page.$eval(".swarm-fallback a", (el) => el.getAttribute("href")),
						"/projects/",
					);
					await Promise.all([
						page.waitForNavigation({ waitUntil: "networkidle0" }),
						page.click(".swarm-fallback a"),
					]);
					assert.equal(new URL(page.url()).pathname, "/projects/");
					const glyph = 'a[href="/projects/avegant-glyph/"]';
					await page.waitForSelector(glyph, { visible: true });
					await Promise.all([
						page.waitForNavigation({ waitUntil: "networkidle0" }),
						page.click(glyph),
					]);
					assert.equal(new URL(page.url()).pathname, "/projects/avegant-glyph/");
				}
			} finally {
				await page.setJavaScriptEnabled(true);
				await page.setViewport({ ...desktop, deviceScaleFactor: 1 });
			}
		},
	],
	[
		"Failed module loading leaves useful static access",
		async (page) => {
			const isolated = await page.browser().newPage();
			try {
				await isolated.setRequestInterception(true);
				isolated.on("request", (request) =>
					request.resourceType() === "script" ? request.abort() : request.continue(),
				);
				await isolated.goto(BASE_URL, { waitUntil: "networkidle0" });
				await isolated.waitForSelector(".swarm-fallback a", { visible: true });
				assert.equal(
					await isolated.$$eval("[data-career-overview] a, .career-undated a", (els) => els.length),
					83,
				);
				await Promise.all([
					isolated.waitForNavigation({ waitUntil: "networkidle0" }),
					isolated.click(".swarm-fallback a"),
				]);
				assert.equal(new URL(isolated.url()).pathname, "/projects/");
			} finally {
				await isolated.close();
			}
		},
	],
	[
		"Deep and lite accounts share chronology and native destinations",
		async (page) => {
			for (const id of ["sc48", "pet-scale"]) {
				const response = await page.goto(`${BASE_URL}/projects/${id}/`, {
					waitUntil: "networkidle0",
				});
				assert.equal(response.status(), 200);
				await page.waitForSelector(`[data-context-ribbon][data-current="${id}"]`);
				assert.equal(
					await page.$$eval("[data-career-overview] a, .career-undated a", (els) => els.length),
					83,
				);
				const link = ".career-tracks a:not([aria-current])";
				const href = await page.$eval(link, (el) => el.getAttribute("href"));
				await Promise.all([
					page.waitForNavigation({ waitUntil: "networkidle0" }),
					page.click(link),
				]);
				assert.equal(new URL(page.url()).pathname, href);
			}
		},
	],
];

const passed = await runBrowserContract({
	assertionSpecs: assertionSpecs.map(([name, assertion]) => [
		name,
		async (page, problems) => {
			const details = await assertion(page);
			assertNoPageProblems(problems);
			return details;
		},
	]),
	cacheDirectory,
	expectedAssertions: assertionSpecs.length,
	initialViewport: desktop,
	title: "Homepage reading, chronology and native-access contract (#291)",
});
if (!passed) process.exitCode = 1;
