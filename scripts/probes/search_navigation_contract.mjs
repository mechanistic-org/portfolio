import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { BASE_URL, runBrowserContract } from "./browser_contract_harness.mjs";
const cacheDirectory =
	process.env.SEARCH_CONTRACT_OUTPUT ??
	path.join(process.cwd(), "node_modules/.cache/search-navigation-contract");
await mkdir(cacheDirectory, { recursive: true });
const specs = [];
const samePageResults = [];
async function open(page, trigger) {
	await page.click(trigger);
	await page.waitForSelector("#pagefind-search-dialog[open] input");
	await page.waitForFunction(() =>
		document.activeElement?.matches("#pagefind-search-dialog input"),
	);
}
async function closed(page, trigger) {
	await page.waitForFunction(() => !document.querySelector("#pagefind-search-dialog").open);
	assert.equal(await page.$eval(trigger, (el) => el === document.activeElement), true);
	assert.equal(await page.evaluate(() => document.body.style.overflow), "auto");
}
function roles(node, found = []) {
	if (node?.role === "link" || node?.role === "dialog") found.push([node.role, node.name]);
	for (const child of node?.children ?? []) roles(child, found);
	return found;
}

for (const [name, width, height] of [
	["desktop", 1440, 1000],
	["phone", 390, 844],
]) {
	specs.push([
		`${name}: accessible header and modal focus/dismissal lifecycle`,
		async (page) => {
			await page.setViewport({ width, height });
			await page.goto(BASE_URL + "/projects/", { waitUntil: "networkidle0" });
			const trigger = name === "phone" ? "#mobile-search-trigger" : "#global-search-trigger";
			assert(
				await page.$eval(trigger, (el) => {
					const r = el.getBoundingClientRect();
					return r.width > 0 && r.left >= 0 && r.right <= innerWidth;
				}),
			);
			if (name === "desktop") {
				const links = roles(await page.accessibility.snapshot());
				for (const label of ["GitHub", "LinkedIn", "Email Erik Norris"])
					assert(
						links.some(([role, n]) => role === "link" && n === label),
						label,
					);
			}
			await page.evaluate(() => (document.body.style.overflow = "auto"));
			await open(page, trigger);
			assert(
				roles(await page.accessibility.snapshot({ interestingOnly: false })).some(
					([role, n]) => role === "dialog" && n === "Search",
				),
			);
			assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
			assert.equal(
				await page.$$eval("#pagefind-search-container .pagefind-ui", (nodes) => nodes.length),
				1,
			);
			for (const reverse of [false, true]) {
				if (reverse) await page.keyboard.down("Shift");
				for (let i = 0; i < 12; i++) {
					await page.keyboard.press("Tab");
					assert(
						await page.evaluate(() =>
							document.querySelector("dialog[open]").contains(document.activeElement),
						),
					);
				}
				if (reverse) await page.keyboard.up("Shift");
			}
			const hint = await page.$eval("#pagefind-search-dialog", (el) => el.innerText);
			assert(hint.includes("Tab to navigate"));
			assert(!hint.includes("↑↓"));
			await page.keyboard.press("Escape");
			await closed(page, trigger);
			await open(page, trigger);
			await page.click("[data-search-close]");
			await closed(page, trigger);
			await open(page, trigger);
			await page.mouse.click(4, 4);
			await closed(page, trigger);
			for (const key of ["Control", "Meta"]) {
				await page.focus(trigger);
				await page.keyboard.down(key);
				await page.keyboard.press("e");
				await page.keyboard.up(key);
				await page.waitForSelector("dialog[open] input");
				await page.keyboard.press("Escape");
				await closed(page, trigger);
			}
			await open(page, trigger);
			await page.type("#pagefind-search-container input", "nose");
			await page.waitForSelector('.pagefind-ui__result-link[href*="avegant-glyph"]');
			const links = await page.$$eval(".pagefind-ui__result-link", (els) =>
				els.map((el) => ({ href: el.getAttribute("href"), text: el.textContent })),
			);
			assert(
				links.some((link) => link.href.includes("avegant-glyph") && link.href.includes("#")),
				"specific query retains anchored subresults",
			);
			await page.screenshot({ path: path.join(cacheDirectory, `search-${name}.png`) });
			assert(
				await page.$eval("dialog", (el) => {
					const r = el.getBoundingClientRect();
					return r.left >= 0 && r.right <= innerWidth + 1 && r.bottom <= innerHeight;
				}),
			);
			// Tab reaches a real result and Enter follows it through ClientRouter.
			await page.focus("#pagefind-search-container input");
			for (let i = 0; i < 30; i++) {
				if (await page.evaluate(() => document.activeElement?.matches(".pagefind-ui__result-link")))
					break;
				await page.keyboard.press("Tab");
			}
			assert(
				await page.evaluate(() => document.activeElement.matches(".pagefind-ui__result-link")),
			);
			await page.keyboard.press("Enter");
			await page.waitForFunction(() => location.pathname.includes("/projects/avegant-glyph/"));
			assert.equal(await page.evaluate(() => document.body.style.overflow), "");
			assert.equal(await page.$$eval("dialog[open]", (els) => els.length), 0);
		},
	]);
	specs.push([
		`${name}: same-page results close search and focus new or already-selected destinations`,
		async (page) => {
			await page.setViewport({ width, height });
			const trigger = name === "phone" ? "#mobile-search-trigger" : "#global-search-trigger";
			const selector = '.pagefind-ui__result-link[href*="/projects/avegant-glyph/#"]';
			for (const activation of ["click", "Enter"]) {
				await page.goto(BASE_URL + "/projects/avegant-glyph/", { waitUntil: "networkidle0" });
				await page.evaluate(() => {
					window.__searchResultSwaps = 0;
					document.addEventListener("astro:before-swap", () => window.__searchResultSwaps++);
				});
				for (const repeated of [false, true]) {
					await page.evaluate(() => {
						document.body.style.setProperty("overflow", "auto", "important");
						window.scrollTo({ top: 0, behavior: "instant" });
					});
					await open(page, trigger);
					await page.$eval("#pagefind-search-container input", (input) => {
						input.value = "nose";
						input.dispatchEvent(new Event("input", { bubbles: true }));
					});
					await page.waitForSelector(selector);
					const href = await page.$eval(selector, (link) => link.href);
					const hash = new URL(href).hash;
					assert.equal(await page.evaluate(() => location.hash), repeated ? hash : "");
					const originalTabindex = await page.evaluate(
						(hash) =>
							document.getElementById(decodeURIComponent(hash.slice(1))).getAttribute("tabindex"),
						hash,
					);
					if (activation === "click") await page.click(selector);
					else {
						await page.focus(selector);
						await page.keyboard.press("Enter");
					}
					await page.waitForFunction((hash) => location.hash === hash, {}, hash);
					// Wait for the browser's default navigation and the destination focus handoff.
					await page.evaluate(
						() =>
							new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
					);
					const state = await page.evaluate((hash) => {
						const target = document.getElementById(decodeURIComponent(hash.slice(1)));
						return {
							hash: location.hash,
							open: document.querySelector("#pagefind-search-dialog").open,
							overflow: document.body.style.getPropertyValue("overflow"),
							priority: document.body.style.getPropertyPriority("overflow"),
							focused: document.activeElement === target,
							tabindex: target.getAttribute("tabindex"),
							top: target.getBoundingClientRect().top,
							height: innerHeight,
							scrollY,
							swaps: window.__searchResultSwaps,
						};
					}, hash);
					samePageResults.push({ name, activation, repeated, href, originalTabindex, state });
					await writeFile(
						path.join(cacheDirectory, "same-page-results.json"),
						JSON.stringify(samePageResults, null, 2),
					);
					assert.equal(state.open, false, "same-page result must dismiss Search");
					assert.equal(state.overflow, "auto");
					assert.equal(state.priority, "important");
					assert.equal(
						state.focused,
						true,
						"destination must receive focus, not the search opener",
					);
					assert.equal(
						state.tabindex,
						originalTabindex ?? "-1",
						"destination must remain focusable while focused",
					);
					assert.equal(state.swaps, 0, "same-page case must not rely on a body swap");
					assert(
						state.scrollY > 0 && state.top >= -1 && state.top < state.height,
						"destination remains visible",
					);
					await page.$eval(trigger, (element) => element.focus({ preventScroll: true }));
					assert.equal(
						await page.evaluate(
							(hash) =>
								document.getElementById(decodeURIComponent(hash.slice(1))).getAttribute("tabindex"),
							hash,
						),
						originalTabindex,
						"temporary focusability must be restored on blur",
					);
				}
			}
			await page.screenshot({ path: path.join(cacheDirectory, `same-page-${name}.png`) });
		},
	]);
	specs.push([
		`${name}: modified and new-tab results preserve the current search`,
		async (page) => {
			await page.setViewport({ width, height });
			await page.goto(BASE_URL + "/projects/avegant-glyph/", { waitUntil: "networkidle0" });
			const trigger = name === "phone" ? "#mobile-search-trigger" : "#global-search-trigger";
			const selector = '.pagefind-ui__result-link[href*="/projects/avegant-glyph/#"]';
			await open(page, trigger);
			await page.type("#pagefind-search-container input", "nose");
			await page.waitForSelector(selector);
			// Suppress only the synthetic event's final browser action, after both controllers
			// have seen it. The flags and cancellation behavior are what this check exercises.
			const guarded = await page.evaluate((selector) => {
				const link = document.querySelector(selector);
				return ["metaKey", "ctrlKey", "shiftKey", "altKey", "middle", "cancelled", "download"].map(
					(kind) => {
						const event = new MouseEvent("click", {
							bubbles: true,
							cancelable: true,
							button: kind === "middle" ? 1 : 0,
							...(kind.endsWith("Key") ? { [kind]: true } : {}),
						});
						if (kind === "cancelled") event.preventDefault();
						if (kind === "download") link.setAttribute("download", "");
						let cancelledByController;
						const preventBrowserAction = (seen) => {
							if (seen !== event) return;
							cancelledByController = seen.defaultPrevented;
							seen.preventDefault();
						};
						document.addEventListener("click", preventBrowserAction);
						link.dispatchEvent(event);
						document.removeEventListener("click", preventBrowserAction);
						if (kind === "download") link.removeAttribute("download");
						return {
							kind,
							cancelledByController,
							open: document.querySelector("#pagefind-search-dialog").open,
							hash: location.hash,
						};
					},
				);
			}, selector);
			for (const result of guarded) {
				assert.equal(result.open, true, result.kind);
				assert.equal(result.hash, "", result.kind);
				assert.equal(result.cancelledByController, result.kind === "cancelled", result.kind);
			}
			// Exercise real new-tab defaults too; close only the tab created by this click.
			for (const mode of ["Control", "_blank"]) {
				if (mode === "_blank")
					await page.$eval(selector, (link) => link.setAttribute("target", "_blank"));
				const existingTargets = new Set(page.browser().targets());
				const destination = await page.$eval(selector, (link) => link.href);
				const popupTarget = page
					.browser()
					.waitForTarget(
						(target) =>
							!existingTargets.has(target) &&
							target.type() === "page" &&
							target.browserContext() === page.browserContext() &&
							target.url() === destination,
						{ timeout: 10000 },
					);
				if (mode === "Control") await page.keyboard.down("Control");
				try {
					await page.click(selector);
				} finally {
					if (mode === "Control") await page.keyboard.up("Control");
				}
				const popup = await (await popupTarget).page();
				try {
					await popup.waitForFunction(
						() => location.pathname === "/projects/avegant-glyph/" && Boolean(location.hash),
					);
				} finally {
					await popup.close();
				}
				await page.bringToFront();
				assert.equal(await page.evaluate(() => location.hash), "");
				assert.equal(await page.$eval("#pagefind-search-dialog", (dialog) => dialog.open), true);
				assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
				if (mode === "_blank") await page.$eval(selector, (link) => link.removeAttribute("target"));
			}
			await page.keyboard.press("Escape");
			assert.equal(await page.$eval(trigger, (el) => el === document.activeElement), true);
		},
	]);
}
specs.push([
	"Repeated Astro swaps keep one search UI and working openers; resume keeps PDF control",
	async (page) => {
		await page.setViewport({ width: 1440, height: 1000 });
		await page.goto(BASE_URL + "/projects/", { waitUntil: "networkidle0" });
		await page.evaluate(() => {
			window.__swapCount = 0;
			document.addEventListener("astro:after-swap", () => window.__swapCount++);
		});
		for (const route of ["/about/", "/projects/", "/how-i-work/", "/projects/"]) {
			await page.click(`#nav-capsule a[href="${route}"]`);
			await page.waitForFunction(
				(route) =>
					location.pathname === route &&
					!document.documentElement.hasAttribute("data-astro-transition"),
				{},
				route,
			);
			await page.evaluate(() => (document.body.style.overflow = "auto"));
			await open(page, "#global-search-trigger");
			assert.equal(
				await page.$$eval("#pagefind-search-container .pagefind-ui", (els) => els.length),
				1,
			);
			await page.keyboard.press("Escape");
			await closed(page, "#global-search-trigger");
		}
		assert.equal(await page.evaluate(() => window.__swapCount), 4);
		await page.click('#nav-capsule a[href="/resume/"]');
		await page.waitForSelector("#nav-download-pdf");
		assert.equal(
			await page.$eval("#nav-download-pdf", (el) => el.textContent.trim()),
			"Download PDF",
		);
		assert.equal(await page.$("#global-search-trigger"), null);
		await page.setViewport({ width: 390, height: 844 });
		assert(await page.$eval("#mobile-download-pdf", (el) => el.getClientRects().length > 0));
		assert.equal(await page.$("#mobile-search-trigger"), null);
	},
]);
process.exit(
	(await runBrowserContract({
		assertionSpecs: specs,
		expectedAssertions: specs.length,
		cacheDirectory,
		title: "#341 header and search interaction contract; title/intro metadata deferred to #340",
	}))
		? 0
		: 1,
);
