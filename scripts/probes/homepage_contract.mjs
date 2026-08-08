import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import puppeteer from "puppeteer";

const HOST = "127.0.0.1";
const PORT = 4321;
const BASE_URL = `http://${HOST}:${PORT}/`;
const READY_TIMEOUT_MS = 90_000;
const PAGE_TIMEOUT_MS = 45_000;
const SETTLE_MS = 1_200;
const EXPECTED_ASSERTIONS = 7;

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function isPortOccupied() {
	return new Promise((resolve, reject) => {
		const socket = net.createConnection({ host: HOST, port: PORT });
		let settled = false;

		const finish = (value) => {
			if (settled) return;
			settled = true;
			socket.destroy();
			resolve(value);
		};

		socket.setTimeout(750, () => finish(false));
		socket.once("connect", () => finish(true));
		socket.once("error", (error) => {
			if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
				finish(false);
				return;
			}
			if (!settled) {
				settled = true;
				reject(error);
			}
		});
	});
}

function startAstroServer() {
	const isWindows = process.platform === "win32";
	const npmCommand = isWindows ? process.execPath : "npm";
	const npmArguments = isWindows
		? [
				path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js"),
				"run",
				"dev",
				"--",
				"--host",
				HOST,
				"--port",
				String(PORT),
				"--strictPort",
			]
		: ["run", "dev", "--", "--host", HOST, "--port", String(PORT), "--strictPort"];
	const child = spawn(
		npmCommand,
		npmArguments,
		{
			cwd: process.cwd(),
			env: {
				...process.env,
				ASTRO_TELEMETRY_DISABLED: "1",
				BROWSER: "none",
				XDG_CONFIG_HOME: path.join(process.cwd(), "node_modules", ".cache", "hxo-contract"),
			},
			stdio: ["ignore", "pipe", "pipe"],
			windowsHide: true,
			detached: process.platform !== "win32",
		},
	);

	let output = "";
	const capture = (chunk) => {
		output += chunk.toString();
		if (output.length > 40_000) output = output.slice(-40_000);
	};
	child.stdout?.on("data", capture);
	child.stderr?.on("data", capture);
	child.getOutput = () => output.trim();
	return child;
}

async function waitForHttpReady(child) {
	const deadline = Date.now() + READY_TIMEOUT_MS;
	let spawnError = null;
	child.once("error", (error) => {
		spawnError = error;
	});

	while (Date.now() < deadline) {
		if (spawnError) throw new Error(`Astro failed to launch: ${spawnError.message}`);
		if (child.exitCode !== null) {
			throw new Error(
				`Astro exited before readiness (code ${child.exitCode}).\n${child.getOutput()}`,
			);
		}

		try {
			const response = await fetch(BASE_URL, { signal: AbortSignal.timeout(2_000) });
			if (!response.ok) {
				throw new Error(`Astro readiness returned HTTP ${response.status}`);
			}
			return;
		} catch (error) {
			if (error.message?.startsWith("Astro readiness returned")) throw error;
			await delay(250);
		}
	}

	throw new Error(`Timed out waiting for ${BASE_URL}.\n${child.getOutput()}`);
}

async function stopAstroServer(child) {
	if (!child || child.exitCode !== null || !child.pid) return;

	if (process.platform === "win32") {
		spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
			stdio: "ignore",
			windowsHide: true,
		});
	} else {
		try {
			process.kill(-child.pid, "SIGTERM");
		} catch {
			child.kill("SIGTERM");
		}
	}

	await Promise.race([
		new Promise((resolve) => child.once("exit", resolve)),
		delay(5_000),
	]);
}

function requireValue(value, message) {
	if (!value) throw new Error(message);
	return value;
}

function createPageProblemCollector(page) {
	const problems = [];
	page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
	page.on("console", (message) => {
		if (message.type() === "error") problems.push(`console.error: ${message.text()}`);
	});
	return problems;
}

function assertNoPageProblems(problems) {
	if (problems.length > 0) throw new Error(problems.join(" | "));
}

async function navigate(page, problems) {
	await page.mouse.move(2, 2);
	const response = await page.goto(BASE_URL, {
		waitUntil: "networkidle0",
		timeout: PAGE_TIMEOUT_MS,
	});
	if (!response || response.status() < 200 || response.status() >= 300) {
		throw new Error(`Homepage navigation returned HTTP ${response?.status() ?? "no response"}`);
	}
	await page.waitForSelector("body", { timeout: PAGE_TIMEOUT_MS });
	await delay(SETTLE_MS);
	assertNoPageProblems(problems);
}

async function getContractIds(page, minimum = 1) {
	const ids = await page.evaluate(() => {
		const nodeIds = new Set(
			Array.from(document.querySelectorAll("g.node-group[data-id]"), (element) => element.dataset.id),
		);
		return Array.from(document.querySelectorAll("button[data-id]"))
			.map((element) => element.dataset.id)
			.filter((id) => id && nodeIds.has(id));
	});
	if (ids.length < minimum) {
		throw new Error(`Expected at least ${minimum} deterministic project IDs; found ${ids.length}`);
	}
	return ids;
}

async function getNodeGeometry(page, id) {
	return page.evaluate((projectId) => {
		const group = Array.from(document.querySelectorAll("g.node-group[data-id]")).find(
			(element) => element.dataset.id === projectId,
		);
		const circle = group?.querySelector("circle");
		const svg = group?.ownerSVGElement;
		if (!circle || !svg) return null;
		const circleRect = circle.getBoundingClientRect();
		const svgRect = svg.getBoundingClientRect();
		return {
			x: circleRect.left + circleRect.width / 2,
			y: circleRect.top + circleRect.height / 2,
			radius: circleRect.width / 2,
			svg: {
				left: svgRect.left,
				top: svgRect.top,
				right: svgRect.right,
				bottom: svgRect.bottom,
			},
		};
	}, id);
}

async function moveOutsideSwarm(page) {
	const viewport = page.viewport();
	requireValue(viewport, "Puppeteer viewport is unavailable");
	await page.mouse.move(viewport.width - 2, 2);
	await delay(100);
}

async function approachNodeFromRight(page, id) {
	await moveOutsideSwarm(page);
	const geometry = requireValue(await getNodeGeometry(page, id), `Node ${id} has no live geometry`);

	await page.mouse.move(geometry.svg.left + 2, geometry.svg.bottom - 2);
	await delay(80);
	await moveOutsideSwarm(page);

	const availableRight = Math.max(4, geometry.svg.right - geometry.x - 4);
	const approachWidth = Math.min(geometry.radius * 1.25, availableRight);
	for (let step = 0; step < 10; step += 1) {
		const liveGeometry = requireValue(
			await getNodeGeometry(page, id),
			`Node ${id} disappeared during aim`,
		);
		const fraction = 1 - (step / 9) * 0.7;
		await page.mouse.move(geometry.x + approachWidth * fraction, liveGeometry.y);
		await delay(38);
	}

	for (let correction = 0; correction < 3; correction += 1) {
		let liveGeometry = requireValue(
			await getNodeGeometry(page, id),
			`Node ${id} disappeared during final aim`,
		);
		await page.mouse.move(
			liveGeometry.x + Math.min(liveGeometry.radius * 0.75, 18),
			liveGeometry.y,
		);
		await delay(38);
		liveGeometry = requireValue(
			await getNodeGeometry(page, id),
			`Node ${id} disappeared during final aim`,
		);
		await page.mouse.move(liveGeometry.x, liveGeometry.y);
		await delay(80);
		const activeId = await page.evaluate(() =>
			document.querySelector('button[data-id][data-focused="true"]')?.getAttribute("data-id"),
		);
		if (activeId === id) return;
	}
}

async function clickNode(page, id) {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const geometry = requireValue(await getNodeGeometry(page, id), `Node ${id} has no live geometry`);
		await page.mouse.click(geometry.x, geometry.y);
		try {
			await page.waitForFunction(
				(projectId) =>
					Array.from(document.querySelectorAll("button[data-id]"))
						.find((element) => element.dataset.id === projectId)
						?.getAttribute("data-pinned") === "true",
				{ timeout: 1_000 },
				id,
			);
			return;
		} catch {
			if (attempt === 2) throw new Error(`Physical click did not pin node ${id}`);
		}
	}
}

async function assertionPinPersists(page, problems) {
	await navigate(page, problems);
	const ids = await getContractIds(page);
	const targetId = ids.includes("c24") ? "c24" : ids[0];
	await approachNodeFromRight(page, targetId);
	await clickNode(page, targetId);

	const viewport = requireValue(page.viewport(), "Puppeteer viewport is unavailable");
	for (const [x, y] of [
		[2, 2],
		[viewport.width - 2, 2],
		[viewport.width - 2, viewport.height - 2],
		[2, viewport.height - 2],
	]) {
		await page.mouse.move(x, y);
		await delay(100);
	}

	const result = await page.evaluate((projectId) => {
		const viewer = document.querySelector(`[data-viewer-id="${CSS.escape(projectId)}"]`);
		const anchor = viewer?.querySelector(`a[href="/projects/${CSS.escape(projectId)}/"]`);
		if (!viewer || !anchor) return { viewer: Boolean(viewer), anchor: Boolean(anchor) };
		const rect = anchor.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;
		const hit = document.elementFromPoint(x, y);
		return {
			viewer: true,
			anchor: true,
			href: new URL(anchor.href).pathname,
			clickable: Boolean(hit && anchor.contains(hit)),
		};
	}, targetId);

	if (!result.viewer) throw new Error(`Viewer did not retain pinned project ${targetId}`);
	if (!result.anchor || result.href !== `/projects/${targetId}/`) {
		throw new Error(`Viewer CTA does not expose /projects/${targetId}/`);
	}
	if (!result.clickable) throw new Error("Viewer CTA is not topmost at its center point");
	assertNoPageProblems(problems);
}

async function assertionNoDocumentScroll(page, problems) {
	await navigate(page, problems);
	const before = await page.evaluate(() => window.scrollY);
	const svg = requireValue(await page.evaluate(() => {
		const element = document.querySelector("g.node-group[data-id]")?.ownerSVGElement;
		if (!element) return null;
		const rect = element.getBoundingClientRect();
		return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
	}), "Swarm SVG is missing");

	for (let step = 0; step < 15; step += 1) {
		const x = svg.left + 20 + ((svg.width - 40) * step) / 14;
		const y = svg.top + 100 + ((svg.height - 140) * ((step * 7) % 15)) / 14;
		await page.mouse.move(x, y);
		await delay(100);
	}

	for (let step = 0; step < 15; step += 1) {
		const centers = await page.evaluate(() =>
			Array.from(document.querySelectorAll("button[data-id]"))
				.map((element) => {
					const rect = element.getBoundingClientRect();
					return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
				})
				.filter((point) => point.y > 0 && point.y < window.innerHeight),
		);
		if (centers.length === 0) throw new Error("No visible index selection row is available");
		const point = centers[step % centers.length];
		await page.mouse.move(point.x, point.y);
		await delay(100);
	}

	const after = await page.evaluate(() => window.scrollY);
	if (after !== before) throw new Error(`Preview changed document scrollY from ${before} to ${after}`);
	assertNoPageProblems(problems);
}

async function assertionNoLayoutFeedback(page, problems) {
	await navigate(page, problems);
	const ids = await page.evaluate(() =>
		Array.from(document.querySelectorAll("button[data-id]"), (element) => element.dataset.id).filter(
			Boolean,
		),
	);
	if (ids.length < 6) throw new Error(`Expected at least 6 index rows; found ${ids.length}`);
	const hoverIds = await page.evaluate(() =>
		Array.from(document.querySelectorAll("button[data-id]"))
			.filter((element) => {
				const rect = element.getBoundingClientRect();
				return rect.top >= 0 && rect.bottom <= window.innerHeight;
			})
			.slice(0, 4)
			.map((element) => element.dataset.id)
			.filter(Boolean),
	);
	if (hoverIds.length < 2) throw new Error("Expected at least two visible index rows for hover");
	const observedTops = [];

	for (const id of hoverIds) {
		const center = await page.evaluate((projectId) => {
			const target = Array.from(document.querySelectorAll("button[data-id]")).find(
				(element) => element.dataset.id === projectId,
			);
			if (!target) return null;
			const rect = target.getBoundingClientRect();
			return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
		}, id);
		if (!center) throw new Error("Could not locate a deterministic index row for hover");
		await page.mouse.move(center.x, center.y);
		await delay(350);
		observedTops.push(
			await page.evaluate((measurementId) =>
				Array.from(document.querySelectorAll("button[data-id]"))
					.find((element) => element.dataset.id === measurementId)
					?.getBoundingClientRect().top,
			ids[3],
			),
		);
	}

	const finiteTops = observedTops.filter(Number.isFinite);
	const drift = Math.max(...finiteTops) - Math.min(...finiteTops);
	if (finiteTops.length !== observedTops.length || drift > 0.5) {
		throw new Error(`Index row position drifted ${drift.toFixed(2)}px as viewer content changed`);
	}
	assertNoPageProblems(problems);
}

async function assertionStickyViewerAndEscape(page, problems) {
	await navigate(page, problems);
	const ids = await getContractIds(page);
	const targetId = ids.includes("c24") ? "c24" : ids[0];
	await approachNodeFromRight(page, targetId);

	try {
		await page.waitForFunction(
			(projectId) => document.querySelector(`[data-viewer-id="${CSS.escape(projectId)}"]`),
			{ timeout: 5_000 },
			targetId,
		);
	} catch {
		throw new Error(`Swarm hover did not preview deterministic node ${targetId}`);
	}
	await moveOutsideSwarm(page);
	await delay(250);
	const stickyId = await page.$eval("[data-viewer-id]", (element) => element.dataset.viewerId);
	if (stickyId !== targetId) throw new Error(`Viewer forgot ${targetId} after passive hover-out`);

	await approachNodeFromRight(page, targetId);
	await clickNode(page, targetId);
	await moveOutsideSwarm(page);
	await page.keyboard.press("Escape");
	try {
		await page.waitForFunction(
			() => document.querySelector('[data-viewer-id="orientation"]'),
			{ timeout: 5_000 },
		);
	} catch {
		const state = await page.evaluate(() => ({
			viewerId: document.querySelector("[data-viewer-id]")?.getAttribute("data-viewer-id"),
			pinnedId: document.querySelector('button[data-pinned="true"]')?.getAttribute("data-id"),
			focusedId: document.querySelector('button[data-focused="true"]')?.getAttribute("data-id"),
		}));
		throw new Error(`Escape did not restore orientation: ${JSON.stringify(state)}`);
	}

	const indexSource = requireValue(
		await page.evaluate((excludedId) => {
			const button = Array.from(document.querySelectorAll("button[data-id]")).find((element) => {
				const rect = element.getBoundingClientRect();
				return (
					element.dataset.id !== excludedId &&
					rect.top >= 0 &&
					rect.bottom <= window.innerHeight
				);
			});
			if (!button) return null;
			button.focus({ preventScroll: true });
			const rect = button.getBoundingClientRect();
			return {
				id: button.dataset.id,
				x: rect.left + rect.width / 2,
				y: rect.top + rect.height / 2,
			};
		}, targetId),
		"No visible index row is available for source-arbitration checks",
	);
	await page.mouse.move(indexSource.x, indexSource.y);
	await delay(100);
	await moveOutsideSwarm(page);
	const focusedViewerId = await page.$eval(
		"[data-viewer-id]",
		(element) => element.getAttribute("data-viewer-id"),
	);
	if (focusedViewerId !== indexSource.id) {
		throw new Error("Mouse leave cleared a still-focused index preview");
	}

	await approachNodeFromRight(page, targetId);
	await moveOutsideSwarm(page);
	const restoredViewerId = await page.$eval(
		"[data-viewer-id]",
		(element) => element.getAttribute("data-viewer-id"),
	);
	if (restoredViewerId !== indexSource.id) {
		throw new Error("Swarm leave erased the active index-focus preview");
	}
	assertNoPageProblems(problems);
}

async function assertionIndexOrder(page, problems) {
	await navigate(page, problems);
	const rows = await page.evaluate(() =>
		Array.from(document.querySelectorAll("button[data-id]"), (element) => ({
			id: element.dataset.id,
			tier: element.dataset.tier || "",
			date: element.dataset.date || "",
		})),
	);
	if (rows.length === 0) throw new Error("No semantic index selection buttons found");

	const rank = (tier) => ({ deep_dive: 0, lite: 1 })[tier] ?? 2;
	for (let index = 1; index < rows.length; index += 1) {
		if (rank(rows[index].tier) < rank(rows[index - 1].tier)) {
			throw new Error(`Tier order regressed at ${rows[index].id}`);
		}
	}

	for (const tier of [...new Set(rows.map((row) => row.tier))]) {
		const tierRows = rows.filter((row) => row.tier === tier);
		let sawInvalidDate = false;
		let previousDate = Number.POSITIVE_INFINITY;
		for (const row of tierRows) {
			const timestamp = Date.parse(row.date);
			if (!Number.isFinite(timestamp)) {
				sawInvalidDate = true;
				continue;
			}
			if (sawInvalidDate) throw new Error(`Dated row ${row.id} follows an invalid date in tier ${tier}`);
			if (timestamp > previousDate) throw new Error(`Dates increase at ${row.id} in tier ${tier}`);
			previousDate = timestamp;
		}
	}
	assertNoPageProblems(problems);
}

async function assertionRealAnchors(page, problems) {
	await navigate(page, problems);
	const result = await page.evaluate(() => {
		const buttons = Array.from(document.querySelectorAll("button[data-id]"));
		const valid = buttons.filter((button) => {
			const anchor = button.parentElement?.querySelector(":scope > a[href^='/projects/']");
			return anchor && !button.contains(anchor);
		});
		return { rowCount: buttons.length, anchorCount: valid.length };
	});
	if (result.rowCount === 0) throw new Error("No semantic index selection buttons found");
	if (result.anchorCount !== result.rowCount) {
		throw new Error(`Found ${result.anchorCount} native row anchors for ${result.rowCount} rows`);
	}
	assertNoPageProblems(problems);
}

async function assertionAimIntegrity(page, problems) {
	await navigate(page, problems);
	const ids = (await getContractIds(page, 10)).reverse();
	const visibleIds = [];
	for (const id of ids) {
		const aimable = await page.evaluate((projectId) => {
			const group = Array.from(document.querySelectorAll("g.node-group[data-id]")).find(
				(element) => element.dataset.id === projectId,
			);
			const circle = group?.querySelector("circle");
			const svg = group?.ownerSVGElement;
			if (!circle || !svg) return false;
			const circleRect = circle.getBoundingClientRect();
			const svgRect = svg.getBoundingClientRect();
			const x = circleRect.left + circleRect.width / 2;
			const y = circleRect.top + circleRect.height / 2;
			const radius = circleRect.width / 2;
			const hit = document.elementFromPoint(x, y);
			return (
				x > svgRect.left + radius &&
				x < svgRect.right - radius &&
				y > svgRect.top + radius &&
				y < svgRect.bottom - radius &&
				Boolean(hit && svg.contains(hit))
			);
		}, id);
		if (aimable) {
			visibleIds.push(id);
		}
		if (visibleIds.length === 10) break;
	}
	if (visibleIds.length < 10) {
		throw new Error(`Only ${visibleIds.length} deterministic project nodes are aimable`);
	}

	for (const id of visibleIds) {
		await approachNodeFromRight(page, id);
		const state = await page.evaluate((projectId) => {
			const active = document.querySelector('button[data-id][data-focused="true"]');
			const group = Array.from(document.querySelectorAll("g.node-group[data-id]")).find(
				(element) => element.dataset.id === projectId,
			);
			const rect = group?.querySelector("circle")?.getBoundingClientRect();
			const hit = rect
				? document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
				: null;
			return {
				activeId: active?.dataset.id || null,
				hit: hit
					? `${hit.tagName.toLowerCase()}#${hit.id}.${Array.from(hit.classList).join(".")}`
					: null,
				viewerId: document.querySelector("[data-viewer-id]")?.getAttribute("data-viewer-id"),
			};
		}, id);
		if (state.activeId !== id) {
			throw new Error(`Aimed ${id}, but state was ${JSON.stringify(state)}`);
		}
	}
	assertNoPageProblems(problems);
}

const assertionSpecs = [
	["Pin persists and viewer CTA is reachable", assertionPinPersists],
	["Preview never scrolls the document", assertionNoDocumentScroll],
	["Viewer swaps cause no index layout feedback", assertionNoLayoutFeedback],
	["Viewer memory is sticky and Escape dismisses pin", assertionStickyViewerAndEscape],
	["Index tiers and dates are ordered", assertionIndexOrder],
	["Every index row has a native Open anchor", assertionRealAnchors],
	["Deterministic 10-node aim integrity", assertionAimIntegrity],
];

function printResults(results) {
	console.log("\nP0A homepage interaction contract");
	for (const [index, result] of results.entries()) {
		const status = result.passed ? "PASS" : "FAIL";
		console.log(`${String(index + 1).padStart(2, "0")} ${status}  ${result.name}`);
		if (!result.passed) console.log(`         ${result.error}`);
	}
	const passed = results.filter((result) => result.passed).length;
	console.log(`\n${passed}/${EXPECTED_ASSERTIONS} assertions passed`);
}

let server = null;
let browser = null;
let fatalError = null;
const results = [];

try {
	if (await isPortOccupied()) {
		throw new Error(`Refusing to run: ${HOST}:${PORT} is already occupied`);
	}

	server = startAstroServer();
	await waitForHttpReady(server);
	browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
	const pageProblems = createPageProblemCollector(page);

	for (const [name, assertion] of assertionSpecs) {
		try {
			await assertion(page, pageProblems);
			results.push({ name, passed: true });
		} catch (error) {
			results.push({ name, passed: false, error: error.message });
		}
	}
} catch (error) {
	fatalError = error;
} finally {
	try {
		await browser?.close();
	} catch (error) {
		fatalError ??= new Error(`Chrome cleanup failed: ${error.message}`);
	}
	try {
		await stopAstroServer(server);
	} catch (error) {
		fatalError ??= new Error(`Astro cleanup failed: ${error.message}`);
	}
}

if (results.length > 0) printResults(results);
if (fatalError) {
	console.error(`\nHARNESS ERROR: ${fatalError.message}`);
	if (server?.getOutput?.()) console.error(`\nAstro output:\n${server.getOutput()}`);
}

if (fatalError || results.length !== EXPECTED_ASSERTIONS || results.some((result) => !result.passed)) {
	process.exitCode = 1;
}
