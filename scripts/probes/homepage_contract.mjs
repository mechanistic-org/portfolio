import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const HOST = "127.0.0.1";
const PORT = 4321;
const BASE_URL = `http://${HOST}:${PORT}/`;
const READY_TIMEOUT_MS = 90_000;
const PAGE_TIMEOUT_MS = 45_000;
const SETTLE_MS = 1_200;
const EXPECTED_ASSERTIONS = 21;
const EXPECTED_PROJECT_COUNT = 87;
const VIEWPORTS = [
	{ name: "desktop", width: 1440, height: 1000 },
	{ name: "tablet", width: 768, height: 1024 },
	{ name: "mobile", width: 390, height: 844 },
];
const HARNESS_CACHE_DIR = path.join(process.cwd(), "node_modules", ".cache", "hxo-contract");
const ARTIFACT_DIR = path.join(HARNESS_CACHE_DIR, "artifacts");
const ASTRO_HARNESS_CONFIG = path.join(HARNESS_CACHE_DIR, "astro.config.mjs");

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

async function prepareAstroHarnessConfig() {
	await mkdir(HARNESS_CACHE_DIR, { recursive: true });
	const baseConfigUrl = pathToFileURL(path.join(process.cwd(), "astro.config.mjs")).href;
	await writeFile(
		ASTRO_HARNESS_CONFIG,
		[
			`import baseConfig from ${JSON.stringify(baseConfigUrl)};`,
			"export default {",
			"\t...baseConfig,",
			"\tdevToolbar: { ...(baseConfig.devToolbar ?? {}), enabled: false },",
			"};",
			"",
		].join("\n"),
		"utf8",
	);
	return path.relative(process.cwd(), ASTRO_HARNESS_CONFIG);
}

function startAstroServer(configPath) {
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
				"--config",
				configPath,
			]
		: [
				"run",
				"dev",
				"--",
				"--host",
				HOST,
				"--port",
				String(PORT),
				"--strictPort",
				"--config",
				configPath,
			];
	const child = spawn(npmCommand, npmArguments, {
		cwd: process.cwd(),
		env: {
			...process.env,
			ASTRO_TELEMETRY_DISABLED: "1",
			BROWSER: "none",
			XDG_CONFIG_HOME: HARNESS_CACHE_DIR,
		},
		stdio: ["ignore", "pipe", "pipe"],
		windowsHide: true,
		detached: process.platform !== "win32",
	});

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

	await Promise.race([new Promise((resolve) => child.once("exit", resolve)), delay(5_000)]);
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
	await page.waitForSelector('[data-hxo-hydrated="true"]', { timeout: PAGE_TIMEOUT_MS });
	await delay(SETTLE_MS);
	assertNoPageProblems(problems);
}

async function getContractIds(page, minimum = 1) {
	const ids = await page.evaluate(() => {
		const nodeIds = new Set(
			Array.from(
				document.querySelectorAll("g.node-group[data-id]"),
				(element) => element.dataset.id,
			),
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

async function waitForFontsAndSwarmReady(page) {
	await page.evaluate(() => document.fonts.ready);
	await page.waitForSelector('[data-swarm-ready="true"]', { timeout: PAGE_TIMEOUT_MS });
}

async function getSwarmNodeSnapshot(page) {
	return page.evaluate(() =>
		Array.from(document.querySelectorAll("g.node-group[data-id]"))
			.map((group) => {
				const circle = group.querySelector("circle");
				if (!circle) return null;
				const rect = circle.getBoundingClientRect();
				return {
					id: group.dataset.id,
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2,
					radius: Number(circle.getAttribute("r")),
				};
			})
			.filter(Boolean)
			.sort((left, right) => left.id.localeCompare(right.id)),
	);
}

async function getContainmentSnapshot(page) {
	return page.evaluate(() => {
		const svg = document.querySelector("g.node-group[data-id]")?.ownerSVGElement;
		if (!svg) return null;
		const svgRect = svg.getBoundingClientRect();
		const tolerance = 0.5;
		const nodes = Array.from(document.querySelectorAll("g.node-group[data-id]"))
			.map((group) => {
				const circle = group.querySelector("circle");
				if (!circle) return null;
				const rect = circle.getBoundingClientRect();
				const contained =
					rect.left >= svgRect.left - tolerance &&
					rect.right <= svgRect.right + tolerance &&
					rect.top >= svgRect.top - tolerance &&
					rect.bottom <= svgRect.bottom + tolerance;
				const intersects =
					rect.right > svgRect.left &&
					rect.left < svgRect.right &&
					rect.bottom > svgRect.top &&
					rect.top < svgRect.bottom;
				return {
					id: group.dataset.id,
					contained,
					intersects,
					bounds: {
						left: Math.round(rect.left * 10) / 10,
						top: Math.round(rect.top * 10) / 10,
						right: Math.round(rect.right * 10) / 10,
						bottom: Math.round(rect.bottom * 10) / 10,
					},
				};
			})
			.filter(Boolean);
		return {
			total: nodes.length,
			contained: nodes.filter((node) => node.contained).length,
			clipped: nodes.filter((node) => !node.contained && node.intersects).length,
			offCanvas: nodes.filter((node) => !node.intersects).length,
			failures: nodes.filter((node) => !node.contained).slice(0, 8),
			svg: {
				width: Math.round(svgRect.width),
				height: Math.round(svgRect.height),
			},
			horizontalOverflow: Math.max(
				0,
				document.documentElement.scrollWidth - document.documentElement.clientWidth,
			),
		};
	});
}

function assertFullContainment(snapshot, label) {
	const value = requireValue(snapshot, `${label}: swarm containment snapshot is unavailable`);
	if (value.total !== EXPECTED_PROJECT_COUNT) {
		throw new Error(`${label}: expected ${EXPECTED_PROJECT_COUNT} circles; found ${value.total}`);
	}
	if (value.contained !== EXPECTED_PROJECT_COUNT || value.clipped !== 0 || value.offCanvas !== 0) {
		throw new Error(
			`${label}: containment ${value.contained}/${value.total}, ${value.clipped} clipped, ${value.offCanvas} off-canvas; failures=${JSON.stringify(value.failures)}`,
		);
	}
	if (value.horizontalOverflow !== 0) {
		throw new Error(`${label}: document overflows horizontally by ${value.horizontalOverflow}px`);
	}
}

function formatContainment(label, snapshot) {
	return `${label} ${snapshot.contained}/${snapshot.total} contained, ${snapshot.clipped} clipped, ${snapshot.offCanvas} off (${snapshot.svg.width}x${snapshot.svg.height} SVG)`;
}

async function setSwarmMotion(page, desiredState) {
	const selector = "button[data-swarm-motion-control]";
	await page.waitForSelector(selector, { timeout: PAGE_TIMEOUT_MS });
	let currentState = await page.$eval(selector, (button) => button.dataset.motionState);
	if (currentState !== desiredState) {
		await page.click(selector);
		await page.waitForFunction(
			(state, controlSelector) =>
				document.querySelector(controlSelector)?.getAttribute("data-motion-state") === state,
			{ timeout: 5_000 },
			desiredState,
			selector,
		);
		currentState = await page.$eval(selector, (button) => button.dataset.motionState);
	}
	if (currentState !== desiredState) {
		throw new Error(`Swarm motion control remained ${currentState}; expected ${desiredState}`);
	}
}

async function getDirectionalTargets(page) {
	return page.evaluate(() => {
		const describeElement = (element) =>
			element
				? `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${
						element.classList.length ? `.${Array.from(element.classList).join(".")}` : ""
					}`
				: null;
		const groups = Array.from(document.querySelectorAll("g.node-group[data-id]"));
		const nodes = groups
			.map((group) => {
				const circle = group.querySelector("circle");
				const svg = group.ownerSVGElement;
				if (!circle || !svg || !group.dataset.id) return null;
				const circleRect = circle.getBoundingClientRect();
				const svgRect = svg.getBoundingClientRect();
				return {
					id: group.dataset.id,
					group,
					svgElement: svg,
					x: circleRect.left + circleRect.width / 2,
					y: circleRect.top + circleRect.height / 2,
					radius: circleRect.width / 2,
					svgBounds: svgRect,
				};
			})
			.filter(Boolean)
			.sort((left, right) => left.id.localeCompare(right.id));

		const schedules = [
			"left",
			"right",
			"top",
			"bottom",
			"left",
			"right",
			"top",
			"bottom",
			"left",
			"right",
		];
		const vectors = {
			left: [-1, 0],
			right: [1, 0],
			top: [0, -1],
			bottom: [0, 1],
		};
		const selected = [];
		const used = new Set();

		for (const direction of schedules) {
			const [dx, dy] = vectors[direction];
			const candidates = nodes.map((node) => {
				const distance = node.radius * 1.15;
				const start = { x: node.x + dx * distance, y: node.y + dy * distance };
				const centerHit = document.elementFromPoint(node.x, node.y);
				const startHit = document.elementFromPoint(start.x, start.y);
				const occluders = nodes
					.filter(
						(other) =>
							other.id !== node.id &&
							Math.hypot(start.x - other.x, start.y - other.y) <= other.radius,
					)
					.map((other) => other.id);
				const insideSvg =
					start.x > node.svgBounds.left + 2 &&
					start.x < node.svgBounds.right - 2 &&
					start.y > node.svgBounds.top + 2 &&
					start.y < node.svgBounds.bottom - 2;
				return {
					node,
					start,
					insideSvg,
					centerReachable: Boolean(centerHit && node.group.contains(centerHit)),
					startReachable: Boolean(
						startHit && node.svgElement.contains(startHit) && occluders.length === 0,
					),
					centerHit: describeElement(centerHit),
					startHit: describeElement(startHit),
					occluders,
				};
			});
			const candidate = candidates.find(({ node, centerReachable, startReachable, insideSvg }) => {
				if (used.has(node.id)) return false;
				if (!insideSvg) return false;
				return centerReachable && startReachable;
			});
			if (!candidate) {
				return {
					selected,
					missingDirection: direction,
					diagnostics: candidates.slice(0, 12).map((entry) => ({
						id: entry.node.id,
						direction,
						geometry: {
							x: Math.round(entry.node.x * 10) / 10,
							y: Math.round(entry.node.y * 10) / 10,
							radius: Math.round(entry.node.radius * 10) / 10,
						},
						insideSvg: entry.insideSvg,
						centerReachable: entry.centerReachable,
						startReachable: entry.startReachable,
						centerHit: entry.centerHit,
						startHit: entry.startHit,
						occluders: entry.occluders,
					})),
				};
			}
			used.add(candidate.node.id);
			selected.push({ id: candidate.node.id, direction });
		}

		return { selected, missingDirection: null, diagnostics: [] };
	});
}

async function getPhysicalAimDiagnostics(page, id, direction) {
	return page.evaluate(
		(projectId, approachDirection) => {
			const describeElement = (element) =>
				element
					? `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${
							element.classList.length ? `.${Array.from(element.classList).join(".")}` : ""
						}`
					: null;
			const vectors = {
				left: [-1, 0],
				right: [1, 0],
				top: [0, -1],
				bottom: [0, 1],
			};
			const vector = vectors[approachDirection];
			const group = Array.from(document.querySelectorAll("g.node-group[data-id]")).find(
				(element) => element.dataset.id === projectId,
			);
			const circle = group?.querySelector("circle");
			const svg = group?.ownerSVGElement;
			if (!vector || !group || !circle || !svg) return null;
			const circleRect = circle.getBoundingClientRect();
			const svgRect = svg.getBoundingClientRect();
			const geometry = {
				x: circleRect.left + circleRect.width / 2,
				y: circleRect.top + circleRect.height / 2,
				radius: circleRect.width / 2,
			};
			const start = {
				x: geometry.x + vector[0] * geometry.radius * 1.15,
				y: geometry.y + vector[1] * geometry.radius * 1.15,
			};
			const centerStack = document.elementsFromPoint(geometry.x, geometry.y).slice(0, 6);
			const startStack = document.elementsFromPoint(start.x, start.y).slice(0, 6);
			return {
				id: projectId,
				direction: approachDirection,
				geometry: {
					x: Math.round(geometry.x * 10) / 10,
					y: Math.round(geometry.y * 10) / 10,
					radius: Math.round(geometry.radius * 10) / 10,
				},
				svg: {
					left: Math.round(svgRect.left * 10) / 10,
					top: Math.round(svgRect.top * 10) / 10,
					right: Math.round(svgRect.right * 10) / 10,
					bottom: Math.round(svgRect.bottom * 10) / 10,
				},
				start: {
					x: Math.round(start.x * 10) / 10,
					y: Math.round(start.y * 10) / 10,
				},
				centerReachable: Boolean(centerStack[0] && group.contains(centerStack[0])),
				startReachable: Boolean(startStack[0] && svg.contains(startStack[0])),
				centerStack: centerStack.map(describeElement),
				startStack: startStack.map(describeElement),
			};
		},
		id,
		direction,
	);
}

async function approachNodeFromDirection(page, id, direction) {
	await moveOutsideSwarm(page);
	const vector = {
		left: [-1, 0],
		right: [1, 0],
		top: [0, -1],
		bottom: [0, 1],
	}[direction];
	if (!vector) throw new Error(`Unknown approach direction: ${direction}`);
	const preflight = requireValue(
		await getPhysicalAimDiagnostics(page, id, direction),
		`No physical hit-test diagnostics are available for ${id} from ${direction}`,
	);
	if (!preflight.centerReachable || !preflight.startReachable) {
		throw new Error(`Physical aim preflight failed: ${JSON.stringify(preflight)}`);
	}

	let geometry = requireValue(await getNodeGeometry(page, id), `Node ${id} has no live geometry`);
	await page.mouse.move(
		geometry.x + vector[0] * geometry.radius * 1.15,
		geometry.y + vector[1] * geometry.radius * 1.15,
	);
	await delay(60);
	geometry = requireValue(await getNodeGeometry(page, id), `Node ${id} disappeared during aim`);
	await page.mouse.move(geometry.x, geometry.y);
	await delay(120);
}

async function clickNode(page, id) {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const geometry = requireValue(
			await getNodeGeometry(page, id),
			`Node ${id} has no live geometry`,
		);
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
	const svg = requireValue(
		await page.evaluate(() => {
			const element = document.querySelector("g.node-group[data-id]")?.ownerSVGElement;
			if (!element) return null;
			const rect = element.getBoundingClientRect();
			return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
		}),
		"Swarm SVG is missing",
	);

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
	if (after !== before)
		throw new Error(`Preview changed document scrollY from ${before} to ${after}`);
	assertNoPageProblems(problems);
}

async function assertionNoLayoutFeedback(page, problems) {
	await navigate(page, problems);
	const ids = await page.evaluate(() =>
		Array.from(
			document.querySelectorAll("button[data-id]"),
			(element) => element.dataset.id,
		).filter(Boolean),
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
			await page.evaluate(
				(measurementId) =>
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
		await page.waitForFunction(() => document.querySelector('[data-viewer-id="orientation"]'), {
			timeout: 5_000,
		});
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
					element.dataset.id !== excludedId && rect.top >= 0 && rect.bottom <= window.innerHeight
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
	const focusedViewerId = await page.$eval("[data-viewer-id]", (element) =>
		element.getAttribute("data-viewer-id"),
	);
	if (focusedViewerId !== indexSource.id) {
		throw new Error("Mouse leave cleared a still-focused index preview");
	}

	await approachNodeFromRight(page, targetId);
	await moveOutsideSwarm(page);
	const restoredViewerId = await page.$eval("[data-viewer-id]", (element) =>
		element.getAttribute("data-viewer-id"),
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
			if (sawInvalidDate)
				throw new Error(`Dated row ${row.id} follows an invalid date in tier ${tier}`);
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

async function assertionLabelVisibility(page, problems) {
	await navigate(page, problems);
	await waitForFontsAndSwarmReady(page);
	await setSwarmMotion(page, "paused");
	const targetPlan = await getDirectionalTargets(page);
	const target = requireValue(
		targetPlan.selected[0],
		`No clearance-checked label target is available: ${JSON.stringify(targetPlan)}`,
	);
	const targetId = target.id;
	await approachNodeFromDirection(page, targetId, target.direction);
	await page.waitForFunction(
		(projectId) => {
			const label = document.getElementById(`label-${projectId}`);
			if (!label) return false;
			const rect = label.getBoundingClientRect();
			return Number(getComputedStyle(label).opacity) > 0 && rect.width > 0 && rect.height > 0;
		},
		{ timeout: 5_000 },
		targetId,
	);

	const evidence = requireValue(
		await page.evaluate((projectId) => {
			const group = document.querySelector(`g.node-group[data-id="${CSS.escape(projectId)}"]`);
			const circle = group?.querySelector("circle");
			const svg = group?.ownerSVGElement;
			const label = document.getElementById(`label-${projectId}`);
			const nodeLayer = svg?.querySelector(":scope > g.nodes");
			const labelLayer = svg?.querySelector(":scope > g.labels") || label?.parentElement;
			if (!circle || !svg || !label || !nodeLayer || !labelLayer) return null;

			const labelRect = label.getBoundingClientRect();
			const circleRect = circle.getBoundingClientRect();
			const children = Array.from(svg.children);
			const padding = 16;
			const left = Math.max(0, Math.min(labelRect.left, circleRect.left) - padding);
			const top = Math.max(0, Math.min(labelRect.top, circleRect.top) - padding);
			const right = Math.min(
				window.innerWidth,
				Math.max(labelRect.right, circleRect.right) + padding,
			);
			const bottom = Math.min(
				window.innerHeight,
				Math.max(labelRect.bottom, circleRect.bottom) + padding,
			);
			const persistent = Array.from(
				svg.querySelectorAll('text.label[data-persistent-label="true"]'),
			).map((element) => {
				const rect = element.getBoundingClientRect();
				return {
					id: element.id,
					opacity: Number(getComputedStyle(element).opacity),
					width: rect.width,
					height: rect.height,
				};
			});

			return {
				labelLayerIndex: children.indexOf(labelLayer),
				nodeLayerIndex: children.indexOf(nodeLayer),
				labelOpacity: Number(getComputedStyle(label).opacity),
				labelRect: {
					left: labelRect.left,
					top: labelRect.top,
					right: labelRect.right,
					bottom: labelRect.bottom,
					width: labelRect.width,
					height: labelRect.height,
				},
				clip: { x: left, y: top, width: right - left, height: bottom - top },
				persistent,
			};
		}, targetId),
		`Focused label evidence is unavailable for ${targetId}`,
	);

	await mkdir(ARTIFACT_DIR, { recursive: true });
	await page.screenshot({
		path: path.join(ARTIFACT_DIR, `assertion-08-label-${targetId}.png`),
		clip: evidence.clip,
	});

	if (evidence.labelLayerIndex <= evidence.nodeLayerIndex) {
		throw new Error("Label layer does not follow the node layer in SVG paint order");
	}
	if (
		evidence.labelOpacity <= 0 ||
		evidence.labelRect.width <= 0 ||
		evidence.labelRect.height <= 0
	) {
		throw new Error(`Focused label ${targetId} is not visibly rendered`);
	}
	const { clip, labelRect } = evidence;
	if (
		labelRect.left < clip.x ||
		labelRect.top < clip.y ||
		labelRect.right > clip.x + clip.width ||
		labelRect.bottom > clip.y + clip.height
	) {
		throw new Error(`Focused label ${targetId} falls outside its diagnostic screenshot clip`);
	}
	const hiddenPersistent = evidence.persistent.filter(
		(label) => label.opacity <= 0 || label.width <= 0 || label.height <= 0,
	);
	if (hiddenPersistent.length > 0) {
		throw new Error(
			`Persistent labels are hidden: ${hiddenPersistent.map((label) => label.id).join(", ")}`,
		);
	}
	assertNoPageProblems(problems);
}

async function assertionNoStaleDim(page, problems) {
	await navigate(page, problems);
	const ids = await getContractIds(page);
	const targetId = ids.includes("c24") ? "c24" : ids[0];
	await approachNodeFromRight(page, targetId);
	await page.waitForFunction(
		(projectId) =>
			document
				.querySelector(`button[data-id="${CSS.escape(projectId)}"]`)
				?.getAttribute("data-focused") === "true",
		{ timeout: 5_000 },
		targetId,
	);
	await moveOutsideSwarm(page);
	await delay(500);

	const state = await page.evaluate(() => ({
		nodes: Array.from(document.querySelectorAll("g.node-group[data-id] circle")).map((circle) => ({
			id: circle.parentElement?.getAttribute("data-id"),
			opacity: Number(getComputedStyle(circle).opacity),
		})),
		unexpectedLabels: Array.from(document.querySelectorAll("text.label"))
			.filter(
				(label) =>
					label.getAttribute("data-persistent-label") !== "true" &&
					Number(getComputedStyle(label).opacity) > 0,
			)
			.map((label) => label.id),
	}));
	const staleNodes = state.nodes.filter((node) => Math.abs(node.opacity - 0.9) > 0.001);
	if (staleNodes.length > 0) {
		throw new Error(
			`Nodes did not return to rest opacity: ${JSON.stringify(staleNodes.slice(0, 8))}`,
		);
	}
	if (state.unexpectedLabels.length > 0) {
		throw new Error(`Non-persistent labels remained visible: ${state.unexpectedLabels.join(", ")}`);
	}
	assertNoPageProblems(problems);
}

async function assertionRadiusClamp(page, problems) {
	await navigate(page, problems);
	const flagship = await page.evaluate(() => {
		const explicit = document.querySelector('g.node-group[data-presentation-mode="flagship"]');
		const fallback = Array.from(document.querySelectorAll("g.node-group[data-id]")).find(
			(group) => group.querySelector("circle")?.getAttribute("stroke-width") === "4",
		);
		const group = explicit || fallback;
		if (!group) return null;
		const circle = group.querySelector("circle");
		if (!circle) return null;
		const rect = circle.getBoundingClientRect();
		return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
	});
	if (flagship) {
		await page.mouse.move(flagship.x, flagship.y);
		await delay(250);
	}

	const radii = await page.evaluate(() =>
		Array.from(document.querySelectorAll("g.node-group[data-id] circle")).map((circle) => ({
			id: circle.parentElement?.getAttribute("data-id"),
			radius: Number(circle.getAttribute("r")),
		})),
	);
	if (radii.length === 0) throw new Error("No rendered project circles found");
	const invalid = radii.filter(
		(node) => !Number.isFinite(node.radius) || node.radius < 15 || node.radius > 55,
	);
	if (invalid.length > 0) {
		throw new Error(`Rendered radii escaped [15,55]: ${JSON.stringify(invalid.slice(0, 12))}`);
	}
	assertNoPageProblems(problems);
}

async function assertionNoRelationshipLines(page, problems) {
	await navigate(page, problems);
	const lineCount = await page.$$eval("g.links line", (lines) => lines.length);
	if (lineCount !== 0)
		throw new Error(`Relationship layer still renders ${lineCount} line elements`);
	assertNoPageProblems(problems);
}

async function assertionReducedMotion(page, problems) {
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	try {
		await navigate(page, problems);
		await waitForFontsAndSwarmReady(page);
		const control = await page.$eval("button[data-swarm-motion-control]", (button) => ({
			state: button.getAttribute("data-motion-state"),
			name: button.getAttribute("aria-label") || button.textContent?.trim() || "",
		}));
		if (control.state !== "paused" || !/resume/i.test(control.name)) {
			throw new Error(
				`Reduced motion did not expose paused/Resume state: ${JSON.stringify(control)}`,
			);
		}

		const initial = await getSwarmNodeSnapshot(page);
		await delay(3_000);
		const delayed = await getSwarmNodeSnapshot(page);
		if (JSON.stringify(delayed) !== JSON.stringify(initial)) {
			throw new Error(
				"Reduced-motion node geometry changed during the three-second stability window",
			);
		}

		await setSwarmMotion(page, "running");
		await delay(600);
		await setSwarmMotion(page, "paused");
		const paused = await getSwarmNodeSnapshot(page);
		await delay(3_000);
		const pausedDelayed = await getSwarmNodeSnapshot(page);
		if (JSON.stringify(pausedDelayed) !== JSON.stringify(paused)) {
			throw new Error("Pause did not return the resumed swarm to a static field");
		}
		assertNoPageProblems(problems);
	} finally {
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
	}
}

async function assertionDirectionalAimIntegrity(page, problems) {
	await navigate(page, problems);
	await waitForFontsAndSwarmReady(page);
	await setSwarmMotion(page, "paused");
	const targetPlan = await getDirectionalTargets(page);
	if (targetPlan.missingDirection || targetPlan.selected.length !== 10) {
		throw new Error(`Could not select 10 direction-neutral targets: ${JSON.stringify(targetPlan)}`);
	}
	const directionCounts = targetPlan.selected.reduce((counts, target) => {
		counts[target.direction] = (counts[target.direction] || 0) + 1;
		return counts;
	}, {});
	for (const direction of ["left", "right", "top", "bottom"]) {
		if ((directionCounts[direction] || 0) < 2) {
			throw new Error(`Direction ${direction} has fewer than two deterministic targets`);
		}
	}

	let successes = 0;
	for (const target of targetPlan.selected) {
		await approachNodeFromDirection(page, target.id, target.direction);
		const activeId = await page.evaluate(() =>
			document.querySelector('button[data-id][data-focused="true"]')?.getAttribute("data-id"),
		);
		if (activeId !== target.id) {
			const diagnostics = await getPhysicalAimDiagnostics(page, target.id, target.direction);
			throw new Error(
				`Approached ${target.id} from ${target.direction}, but active project was ${activeId || "none"}; diagnostics=${JSON.stringify(diagnostics)}`,
			);
		}
		successes += 1;
	}
	if (successes !== 10) throw new Error(`Direction-neutral aim succeeded ${successes}/10 times`);
	assertNoPageProblems(problems);
}

async function assertionResponsiveFlowAndContainment(page, problems) {
	const details = [];
	try {
		for (const viewport of VIEWPORTS) {
			await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
			await navigate(page, problems);
			await waitForFontsAndSwarmReady(page);

			const layout = await page.evaluate(() => {
				const toBounds = (element) => {
					if (!element) return null;
					const rect = element.getBoundingClientRect();
					return {
						left: rect.left,
						top: rect.top,
						right: rect.right,
						bottom: rect.bottom,
						width: rect.width,
						height: rect.height,
					};
				};
				const main = document.querySelector(".hxo-prototype > main");
				return {
					swarm: toBounds(document.querySelector(".hxo-swarm-stage")),
					console: toBounds(document.querySelector(".hxo-console-stage")),
					ledger: toBounds(document.querySelector("#ledger")),
					mainOverflowY: main ? getComputedStyle(main).overflowY : null,
				};
			});
			const swarm = requireValue(layout.swarm, `${viewport.name}: swarm stage is missing`);
			const consoleStage = requireValue(
				layout.console,
				`${viewport.name}: console stage is missing`,
			);
			const ledger = requireValue(layout.ledger, `${viewport.name}: Ledger is missing`);

			if (viewport.width >= 1024) {
				if (consoleStage.left < swarm.right - 1 || consoleStage.top >= swarm.bottom) {
					throw new Error(
						`${viewport.name}: desktop swarm and console are not preserved as side-by-side columns`,
					);
				}
			} else {
				if (layout.mainOverflowY === "hidden") {
					throw new Error(`${viewport.name}: responsive main still hides vertical overflow`);
				}
				if (consoleStage.top < swarm.bottom - 1) {
					throw new Error(`${viewport.name}: console does not follow the swarm in document flow`);
				}
				if (consoleStage.height < Math.min(768, viewport.height - 64)) {
					throw new Error(
						`${viewport.name}: hydrated console has only ${consoleStage.height}px height`,
					);
				}
				if (consoleStage.bottom > ledger.top + 1) {
					throw new Error(`${viewport.name}: console overlaps the Ledger`);
				}

				await page.evaluate(() => window.scrollTo(0, 0));
				await page.mouse.move(Math.floor(viewport.width / 2), Math.floor(viewport.height / 2));
				let exposed = false;
				for (let attempt = 0; attempt < 20; attempt += 1) {
					await page.mouse.wheel({ deltaY: Math.max(320, Math.floor(viewport.height * 0.7)) });
					await delay(45);
					exposed = await page.evaluate(() => {
						const rect = document.querySelector(".hxo-console-stage")?.getBoundingClientRect();
						return Boolean(
							rect && rect.top < window.innerHeight && rect.bottom > 0 && window.scrollY > 0,
						);
					});
					if (exposed) break;
				}
				if (!exposed) {
					throw new Error(`${viewport.name}: ordinary wheel scrolling never exposed the console`);
				}
			}

			const ready = await getContainmentSnapshot(page);
			assertFullContainment(ready, `${viewport.width}x${viewport.height} ready`);
			await setSwarmMotion(page, "running");
			await delay(3_000);
			const moved = await getContainmentSnapshot(page);
			assertFullContainment(moved, `${viewport.width}x${viewport.height} motion +3s`);
			details.push(
				formatContainment(`${viewport.width}x${viewport.height} ready`, ready),
				formatContainment(`${viewport.width}x${viewport.height} motion +3s`, moved),
			);
			assertNoPageProblems(problems);
		}
	} finally {
		await page.setViewport({ ...VIEWPORTS[0], deviceScaleFactor: 1 });
	}
	return details.join(" | ");
}

async function assertionResponsiveReducedMotion(page, problems) {
	const details = [];
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	try {
		for (const viewport of VIEWPORTS) {
			await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
			await navigate(page, problems);
			await waitForFontsAndSwarmReady(page);
			await delay(250);
			const control = await page.$eval("button[data-swarm-motion-control]", (button) => ({
				state: button.getAttribute("data-motion-state"),
				name: button.getAttribute("aria-label") || button.textContent?.trim() || "",
			}));
			if (control.state !== "paused" || !/resume/i.test(control.name)) {
				throw new Error(
					`${viewport.name}: reduced motion did not expose paused/Resume state: ${JSON.stringify(control)}`,
				);
			}

			const ready = await getContainmentSnapshot(page);
			assertFullContainment(ready, `${viewport.width}x${viewport.height} reduced ready`);
			const initialGeometry = await getSwarmNodeSnapshot(page);
			await delay(3_000);
			const delayedGeometry = await getSwarmNodeSnapshot(page);
			if (JSON.stringify(delayedGeometry) !== JSON.stringify(initialGeometry)) {
				throw new Error(
					`${viewport.name}: reduced-motion geometry changed during the three-second window`,
				);
			}
			const delayed = await getContainmentSnapshot(page);
			assertFullContainment(delayed, `${viewport.width}x${viewport.height} reduced +3s`);
			details.push(
				formatContainment(`${viewport.width}x${viewport.height} reduced ready`, ready),
				formatContainment(`${viewport.width}x${viewport.height} reduced +3s`, delayed),
			);
			assertNoPageProblems(problems);
		}
	} finally {
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
		await page.setViewport({ ...VIEWPORTS[0], deviceScaleFactor: 1 });
	}
	return details.join(" | ");
}

async function assertionMobileNativeKeyboard(page, problems) {
	const viewport = VIEWPORTS.find((candidate) => candidate.name === "mobile");
	try {
		await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
		await navigate(page, problems);
		await waitForFontsAndSwarmReady(page);
		let target = null;
		let tabCount = 0;
		for (; tabCount < 200; tabCount += 1) {
			await page.keyboard.press("Tab");
			target = await page.evaluate(() => {
				const active = document.activeElement;
				if (!(active instanceof HTMLButtonElement) || !active.matches("button[data-id]"))
					return null;
				const rect = active.getBoundingClientRect();
				return {
					id: active.dataset.id,
					focusVisible: active.matches(":focus-visible"),
					visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
					outlineWidth: Number.parseFloat(getComputedStyle(active).outlineWidth),
				};
			});
			if (target) break;
		}
		const focused = requireValue(target, "Native Tab traversal did not reach a project button");
		if (!focused.focusVisible || !focused.visible || focused.outlineWidth <= 0) {
			throw new Error(
				`First project button lacks visible keyboard focus: ${JSON.stringify(focused)}`,
			);
		}

		await page.keyboard.press("Enter");
		await page.waitForFunction(
			(projectId) =>
				document
					.querySelector(`button[data-id="${CSS.escape(projectId)}"]`)
					?.getAttribute("data-pinned") === "true",
			{ timeout: 5_000 },
			focused.id,
		);
		await page.keyboard.press("Escape");
		await delay(100);
		const firstEscape = await page.evaluate(
			(projectId) => ({
				pinned: document
					.querySelector(`button[data-id="${CSS.escape(projectId)}"]`)
					?.getAttribute("data-pinned"),
				viewer: document.querySelector("[data-viewer-id]")?.getAttribute("data-viewer-id"),
			}),
			focused.id,
		);
		if (firstEscape.pinned !== "true" || firstEscape.viewer !== focused.id) {
			throw new Error(`First Escape did not preserve the pin: ${JSON.stringify(firstEscape)}`);
		}

		await page.keyboard.press("Escape");
		await page.waitForFunction(
			() =>
				document.querySelector('[data-viewer-id="orientation"]') &&
				!document.querySelector('button[data-pinned="true"]'),
			{ timeout: 5_000 },
		);
		await page.keyboard.press("Space");
		await page.waitForFunction(
			(projectId) =>
				document
					.querySelector(`button[data-id="${CSS.escape(projectId)}"]`)
					?.getAttribute("data-pinned") === "true",
			{ timeout: 5_000 },
			focused.id,
		);
		await page.keyboard.press("Tab");
		const anchor = await page.evaluate((projectId) => {
			const active = document.activeElement;
			return active instanceof HTMLAnchorElement
				? { href: new URL(active.href).pathname, label: active.getAttribute("aria-label") }
				: null;
		}, focused.id);
		if (!anchor || anchor.href !== `/projects/${focused.id}/`) {
			throw new Error(
				`Next Tab did not reach the matching native Open anchor: ${JSON.stringify(anchor)}`,
			);
		}
		assertNoPageProblems(problems);
		return `390x844 reached ${focused.id} in ${tabCount + 1} native Tabs; Enter/Escape/Escape/Space/Tab passed`;
	} finally {
		await page.setViewport({ ...VIEWPORTS[0], deviceScaleFactor: 1 });
	}
}

async function assertionNoJavaScript(page, problems) {
	const details = [];
	await page.setJavaScriptEnabled(false);
	try {
		for (const viewport of VIEWPORTS) {
			await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
			const response = await page.goto(BASE_URL, {
				waitUntil: "networkidle0",
				timeout: PAGE_TIMEOUT_MS,
			});
			if (!response || response.status() < 200 || response.status() >= 300) {
				throw new Error(
					`${viewport.name}: no-JS response was HTTP ${response?.status() ?? "none"}`,
				);
			}
			await page.waitForSelector("body", { timeout: PAGE_TIMEOUT_MS });
			const state = await page.evaluate(() => {
				const bounds = (selector) => {
					const element = document.querySelector(selector);
					if (!element) return null;
					const rect = element.getBoundingClientRect();
					return { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
				};
				const heroLinks = Array.from(document.querySelectorAll(".hxo-swarm-stage a[href]")).map(
					(anchor) => new URL(anchor.href).pathname,
				);
				const rowButtons = Array.from(document.querySelectorAll("button[data-id]"));
				const rowAnchors = rowButtons
					.map((button) => button.parentElement?.querySelector(":scope > a[href^='/projects/']"))
					.filter(Boolean);
				const lensButtons = Array.from(document.querySelectorAll("button[data-lens-control]"));
				return {
					h1: document.querySelector("h1")?.textContent?.trim() || "",
					heroLinks,
					ledger: Boolean(document.querySelector("#ledger")),
					rowCount: rowButtons.length,
					rowAnchorCount: rowAnchors.length,
					uniqueProjectDestinations: new Set(
						rowAnchors.map((anchor) => new URL(anchor.href).pathname),
					).size,
					disabledRowCount: rowButtons.filter((button) => button.disabled).length,
					lensCount: lensButtons.length,
					disabledLensCount: lensButtons.filter((button) => button.disabled).length,
					swarmControls: document.querySelectorAll("[data-swarm-motion-control]").length,
					main: bounds(".hxo-prototype > main"),
					swarm: bounds(".hxo-swarm-stage"),
					console: bounds(".hxo-console-stage"),
					ledgerBounds: bounds("#ledger"),
					horizontalOverflow: Math.max(
						0,
						document.documentElement.scrollWidth - document.documentElement.clientWidth,
					),
				};
			});
			if (!state.h1.includes("Erik Norris"))
				throw new Error(`${viewport.name}: no-JS H1 is missing`);
			if (!state.heroLinks.includes("/projects/c24/") || !state.heroLinks.includes("/resume/")) {
				throw new Error(`${viewport.name}: no-JS hero destinations are incomplete`);
			}
			if (!state.ledger) throw new Error(`${viewport.name}: no-JS Ledger is missing`);
			if (
				state.rowCount !== EXPECTED_PROJECT_COUNT ||
				state.rowAnchorCount !== EXPECTED_PROJECT_COUNT ||
				state.uniqueProjectDestinations !== EXPECTED_PROJECT_COUNT
			) {
				throw new Error(
					`${viewport.name}: prerendered index is incomplete: ${JSON.stringify(state)}`,
				);
			}
			if (
				state.disabledRowCount !== EXPECTED_PROJECT_COUNT ||
				state.lensCount !== 3 ||
				state.disabledLensCount !== 3 ||
				state.swarmControls !== 0
			) {
				throw new Error(
					`${viewport.name}: no-JS control fallback is unsafe: ${JSON.stringify(state)}`,
				);
			}
			if (state.horizontalOverflow !== 0) {
				throw new Error(
					`${viewport.name}: no-JS overflows horizontally by ${state.horizontalOverflow}px`,
				);
			}
			const main = requireValue(state.main, `${viewport.name}: no-JS main is missing`);
			const swarm = requireValue(state.swarm, `${viewport.name}: no-JS hero stage is missing`);
			const consoleStage = requireValue(
				state.console,
				`${viewport.name}: no-JS console stage is missing`,
			);
			const ledger = requireValue(
				state.ledgerBounds,
				`${viewport.name}: no-JS Ledger bounds are missing`,
			);
			if (Math.abs(ledger.top - main.bottom) > 1) {
				throw new Error(
					`${viewport.name}: no-JS inserted empty space before the Ledger: ${JSON.stringify({ main, ledger })}`,
				);
			}
			if (consoleStage.height < 1) {
				throw new Error(`${viewport.name}: no-JS prerendered console has no height`);
			}
			if (viewport.width < 1024 && consoleStage.top < swarm.bottom - 1) {
				throw new Error(
					`${viewport.name}: no-JS console does not follow the hero in flow: ${JSON.stringify({ swarm, consoleStage })}`,
				);
			}
			if (consoleStage.bottom > ledger.top + 1) {
				throw new Error(
					`${viewport.name}: no-JS console overlaps the Ledger: ${JSON.stringify({ consoleStage, ledger })}`,
				);
			}
			if (swarm.height < viewport.height - 1 || swarm.height > viewport.height + 1) {
				throw new Error(
					`${viewport.name}: no-JS hero is ${swarm.height}px instead of one viewport`,
				);
			}
			details.push(
				`${viewport.width}x${viewport.height} HTTP ${response.status()}, ${state.rowAnchorCount} prerendered anchors`,
			);
		}
		assertNoPageProblems(problems);
	} finally {
		await page.setJavaScriptEnabled(true);
		await page.setViewport({ ...VIEWPORTS[0], deviceScaleFactor: 1 });
	}
	return details.join(" | ");
}

async function setLensProjection(page, lens) {
	const selector = `button[data-lens-control="${lens}"]`;
	await page.waitForSelector(`${selector}:not([disabled])`, { timeout: PAGE_TIMEOUT_MS });
	await page.click(selector);
	await page.waitForFunction(
		(requestedLens) => {
			const consoleRoot = document.querySelector("[data-current-lens]");
			const swarmRoot = document.querySelector("[data-swarm-lens]");
			return (
				consoleRoot?.getAttribute("data-current-lens") === requestedLens &&
				swarmRoot?.getAttribute("data-swarm-lens") === requestedLens &&
				swarmRoot?.getAttribute("data-swarm-ready") === "true"
			);
		},
		{ timeout: PAGE_TIMEOUT_MS },
		lens,
	);
	await delay(250);
}

async function assertionLensProjections(page, problems) {
	await navigate(page, problems);
	await waitForFontsAndSwarmReady(page);
	await setSwarmMotion(page, "paused");

	const captureProjection = () =>
		page.evaluate(() => ({
			lens: document.querySelector("[data-current-lens]")?.getAttribute("data-current-lens"),
			circles: Array.from(document.querySelectorAll("g.node-group[data-id]"))
				.map((group) => {
					const circle = group.querySelector("circle");
					const rect = circle?.getBoundingClientRect();
					return circle && rect
						? {
								id: group.dataset.id,
								employer: group.dataset.employer,
								group: group.dataset.lensGroup,
								fill: circle.getAttribute("fill"),
								x: rect.left + rect.width / 2,
								y: rect.top + rect.height / 2,
							}
						: null;
				})
				.filter(Boolean)
				.sort((left, right) => left.id.localeCompare(right.id)),
			labels: Array.from(document.querySelectorAll("[data-lens-group-label]")).map((label) => ({
				id: label.getAttribute("data-lens-group-label"),
				count: Number(label.getAttribute("data-group-count")),
			})),
			sections: Array.from(document.querySelectorAll("[data-lens-section]")).map((section) => ({
				id: section.getAttribute("data-lens-section"),
				count: Number(section.getAttribute("data-section-count")),
			})),
			rowSectionsValid: Array.from(document.querySelectorAll("button[data-id]")).every(
				(button) =>
					button.closest("[data-lens-section]")?.getAttribute("data-lens-section") ===
					button.getAttribute("data-lens-group"),
			),
			anchorCount: document.querySelectorAll("button[data-id] + a[href^='/projects/']").length,
		}));

	const projections = [];
	for (const requestedLens of ["time", "employer", "category"]) {
		await setLensProjection(page, requestedLens);
		const projection = await captureProjection();
		if (projection.lens !== requestedLens) {
			throw new Error(`${requestedLens}: console projection remained ${projection.lens}`);
		}
		if (
			projection.circles.length !== EXPECTED_PROJECT_COUNT ||
			projection.anchorCount !== EXPECTED_PROJECT_COUNT
		) {
			throw new Error(
				`${requestedLens}: projection lost nodes or anchors: ${JSON.stringify({ circles: projection.circles.length, anchors: projection.anchorCount })}`,
			);
		}
		if (projection.labels.reduce((sum, group) => sum + group.count, 0) !== EXPECTED_PROJECT_COUNT) {
			throw new Error(`${requestedLens}: swarm group-label counts do not sum to 87`);
		}
		if (
			projection.sections.reduce((sum, section) => sum + section.count, 0) !==
			EXPECTED_PROJECT_COUNT
		) {
			throw new Error(`${requestedLens}: index section counts do not sum to 87`);
		}
		if (requestedLens !== "time") {
			const labels = [...projection.labels.map(({ id }) => id)].sort();
			const sections = [...projection.sections.map(({ id }) => id)].sort();
			if (JSON.stringify(labels) !== JSON.stringify(sections) || !projection.rowSectionsValid) {
				throw new Error(
					`${requestedLens}: swarm labels and index sections disagree: ${JSON.stringify({ labels, sections, rowSectionsValid: projection.rowSectionsValid })}`,
				);
			}
		}
		projections.push(projection);
	}

	const baselineFills = new Map(
		projections[0].circles.map((circle) => [circle.id, `${circle.employer}:${circle.fill}`]),
	);
	for (const projection of projections.slice(1)) {
		const changedFill = projection.circles.find(
			(circle) => baselineFills.get(circle.id) !== `${circle.employer}:${circle.fill}`,
		);
		if (changedFill)
			throw new Error(`${projection.lens}: employer color changed for ${changedFill.id}`);
	}

	for (let index = 1; index < projections.length; index += 1) {
		const previous = new Map(projections[index - 1].circles.map((circle) => [circle.id, circle]));
		const moved = projections[index].circles.filter((circle) => {
			const before = previous.get(circle.id);
			return before && Math.hypot(circle.x - before.x, circle.y - before.y) > 4;
		}).length;
		if (moved < Math.floor(EXPECTED_PROJECT_COUNT / 3)) {
			throw new Error(`${projections[index].lens}: only ${moved} nodes changed projection`);
		}
	}

	assertNoPageProblems(problems);
	return projections
		.map((projection) => `${projection.lens} ${projection.labels.length} groups`)
		.join(" | ");
}

async function assertionPinnedLensCohort(page, problems) {
	await navigate(page, problems);
	await waitForFontsAndSwarmReady(page);
	await setSwarmMotion(page, "paused");
	await setLensProjection(page, "employer");

	const target = await page.evaluate(() => {
		const groups = Array.from(document.querySelectorAll("g.node-group[data-id]")).reduce(
			(map, group) => {
				const key = group.getAttribute("data-lens-group") || "";
				const ids = map.get(key) ?? [];
				if (group.dataset.id) ids.push(group.dataset.id);
				map.set(key, ids);
				return map;
			},
			new Map(),
		);
		return [...groups.entries()].find(([, ids]) => ids.length > 1)?.[1]?.[0] ?? null;
	});
	if (!target) throw new Error("No employer cohort with at least two projects exists");

	await page.evaluate((id) => {
		const button = Array.from(document.querySelectorAll("button[data-id]")).find(
			(element) => element.dataset.id === id,
		);
		button?.click();
	}, target);
	await page.waitForFunction(
		(id) =>
			document.querySelector(`button[data-id="${id}"]`)?.getAttribute("data-pinned") === "true",
		{ timeout: 5_000 },
		target,
	);

	await setLensProjection(page, "category");
	await setLensProjection(page, "employer");
	const pinnedState = await page.evaluate(
		(id) => ({
			pinned: document.querySelector(`button[data-id="${id}"]`)?.getAttribute("data-pinned"),
			viewer: document.querySelector("[data-viewer-id]")?.getAttribute("data-viewer-id"),
		}),
		target,
	);
	if (pinnedState.pinned !== "true" || pinnedState.viewer !== target) {
		throw new Error(`Pin did not survive lens switches: ${JSON.stringify(pinnedState)}`);
	}

	const ghost = await page.evaluate((id) => {
		const targetGroup = document
			.querySelector(`g.node-group[data-id="${id}"]`)
			?.getAttribute("data-lens-group");
		const values = Array.from(document.querySelectorAll("g.node-group[data-id]")).map((group) => ({
			id: group.dataset.id,
			group: group.getAttribute("data-lens-group"),
			opacity: Number(group.querySelector("circle")?.style.opacity),
		}));
		return {
			target: values.find((value) => value.id === id),
			cohort: values.find((value) => value.id !== id && value.group === targetGroup),
			unrelated: values.find((value) => value.group !== targetGroup),
		};
	}, target);
	if (
		!ghost.target ||
		ghost.target.opacity < 0.99 ||
		!ghost.cohort ||
		ghost.cohort.opacity < 0.45 ||
		ghost.cohort.opacity > 0.55 ||
		!ghost.unrelated ||
		ghost.unrelated.opacity > 0.1
	) {
		throw new Error(`Cohort ghost contract failed: ${JSON.stringify(ghost)}`);
	}

	await page.keyboard.press("Escape");
	await page.waitForFunction(() => !document.querySelector('button[data-id][data-pinned="true"]'), {
		timeout: 5_000,
	});
	const restOpacities = await page.$$eval("g.node-group[data-id] circle", (circles) =>
		circles.map((circle) => Number(circle.style.opacity)),
	);
	if (restOpacities.some((opacity) => Math.abs(opacity - 0.9) > 0.001)) {
		throw new Error("Unpin did not restore the complete swarm to rest opacity");
	}
	assertNoPageProblems(problems);
	return `${target} stayed pinned; cohort and rest states verified`;
}

async function assertionUrlState(page, problems) {
	await navigate(page, problems);
	const ids = await getContractIds(page, 2);
	const target = ids[0];
	const previewTarget = ids[1];
	await page.goto(`${BASE_URL}#lens=category&pin=${encodeURIComponent(target)}`, {
		waitUntil: "networkidle0",
		timeout: PAGE_TIMEOUT_MS,
	});
	await page.waitForSelector('[data-hxo-hydrated="true"]', { timeout: PAGE_TIMEOUT_MS });
	await waitForFontsAndSwarmReady(page);
	await page.waitForFunction(
		(id) =>
			document.querySelector("[data-current-lens]")?.getAttribute("data-current-lens") ===
				"category" &&
			document.querySelector(`button[data-id="${id}"]`)?.getAttribute("data-pinned") === "true",
		{ timeout: PAGE_TIMEOUT_MS },
		target,
	);
	const restored = await page.evaluate(() => ({
		hash: window.location.hash,
		scrollY: window.scrollY,
		viewer: document.querySelector("[data-viewer-id]")?.getAttribute("data-viewer-id"),
	}));
	if (
		restored.hash !== `#lens=category&pin=${encodeURIComponent(target)}` ||
		restored.scrollY !== 0 ||
		restored.viewer !== target
	) {
		throw new Error(`Valid URL state did not restore cleanly: ${JSON.stringify(restored)}`);
	}

	const hashBeforePreview = restored.hash;
	await page.evaluate((id) => {
		const button = Array.from(document.querySelectorAll("button[data-id]")).find(
			(element) => element.dataset.id === id,
		);
		button?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
	}, previewTarget);
	await delay(200);
	const hashAfterPreview = await page.evaluate(() => window.location.hash);
	if (hashAfterPreview !== hashBeforePreview) {
		throw new Error("Hover/focus preview mutated persistent URL state");
	}

	await page.goto(`${BASE_URL}#lens=bogus&pin=does-not-exist`, {
		waitUntil: "networkidle0",
		timeout: PAGE_TIMEOUT_MS,
	});
	await page.waitForSelector('[data-hxo-hydrated="true"]', { timeout: PAGE_TIMEOUT_MS });
	await page.waitForFunction(
		() =>
			document.querySelector("[data-current-lens]")?.getAttribute("data-current-lens") === "time" &&
			!document.querySelector('button[data-id][data-pinned="true"]'),
		{ timeout: PAGE_TIMEOUT_MS },
	);
	await delay(200);
	const invalid = await page.evaluate(() => ({
		hash: window.location.hash,
		scrollY: window.scrollY,
	}));
	if (invalid.hash !== "" || invalid.scrollY !== 0) {
		throw new Error(`Invalid URL state did not fail closed: ${JSON.stringify(invalid)}`);
	}
	assertNoPageProblems(problems);
	return `category/${target} restored; invalid state failed closed`;
}

async function assertionStaticLensSwitches(page, problems) {
	const details = [];
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	try {
		await navigate(page, problems);
		await waitForFontsAndSwarmReady(page);
		for (const requestedLens of ["employer", "category"]) {
			await setLensProjection(page, requestedLens);
			const initial = await getSwarmNodeSnapshot(page);
			await delay(2_000);
			const delayed = await getSwarmNodeSnapshot(page);
			const control = await page.$eval("button[data-swarm-motion-control]", (button) => ({
				state: button.getAttribute("data-motion-state"),
				name: button.getAttribute("aria-label") || "",
			}));
			if (
				JSON.stringify(initial) !== JSON.stringify(delayed) ||
				control.state !== "paused" ||
				!/resume/i.test(control.name)
			) {
				throw new Error(
					`${requestedLens}: reduced-motion lens switch was not static: ${JSON.stringify(control)}`,
				);
			}
			details.push(`reduced ${requestedLens} static`);
		}
	} finally {
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
	}

	await navigate(page, problems);
	await waitForFontsAndSwarmReady(page);
	await setSwarmMotion(page, "paused");
	await setLensProjection(page, "employer");
	const paused = await getSwarmNodeSnapshot(page);
	await delay(2_000);
	const pausedDelayed = await getSwarmNodeSnapshot(page);
	if (JSON.stringify(paused) !== JSON.stringify(pausedDelayed)) {
		throw new Error("Explicit Pause restarted during an employer lens switch");
	}
	details.push("explicit Pause static");
	assertNoPageProblems(problems);
	return details.join(" | ");
}

const assertionSpecs = [
	["Pin persists and viewer CTA is reachable", assertionPinPersists],
	["Preview never scrolls the document", assertionNoDocumentScroll],
	["Viewer swaps cause no index layout feedback", assertionNoLayoutFeedback],
	["Viewer memory is sticky and Escape dismisses pin", assertionStickyViewerAndEscape],
	["Index tiers and dates are ordered", assertionIndexOrder],
	["Every index row has a native Open anchor", assertionRealAnchors],
	["Deterministic 10-node aim integrity", assertionAimIntegrity],
	["Focused and flagship labels paint visibly above nodes", assertionLabelVisibility],
	["Hover-out restores rest visuals without stale dim", assertionNoStaleDim],
	["Every rendered project radius stays within [15,55]", assertionRadiusClamp],
	["Relationship lines are absent from the rendered swarm", assertionNoRelationshipLines],
	["Reduced-motion and Pause produce a static field", assertionReducedMotion],
	["Direction-neutral aim integrity succeeds 10/10", assertionDirectionalAimIntegrity],
	[
		"Responsive flow and motion containment hold at three viewports",
		assertionResponsiveFlowAndContainment,
	],
	["Reduced-motion containment is static at three viewports", assertionResponsiveReducedMotion],
	["Mobile native keyboard traversal preserves the Escape ladder", assertionMobileNativeKeyboard],
	["No-JavaScript exposes the prerendered project index", assertionNoJavaScript],
	[
		"Time, Employer, and Category projections stay complete and color-stable",
		assertionLensProjections,
	],
	[
		"Pin survives lens switches and cohort ghost returns cleanly to rest",
		assertionPinnedLensCohort,
	],
	["URL lens and pin state restores and fails closed", assertionUrlState],
	["Reduced motion and Pause stay static across lens switches", assertionStaticLensSwitches],
];

function printResults(results) {
	console.log("\nP1 homepage exploration contract");
	for (const [index, result] of results.entries()) {
		const status = result.passed ? "PASS" : "FAIL";
		console.log(`${String(index + 1).padStart(2, "0")} ${status}  ${result.name}`);
		if (result.details) console.log(`         ${result.details}`);
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

	server = startAstroServer(await prepareAstroHarnessConfig());
	await waitForHttpReady(server);
	browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
	const pageProblems = createPageProblemCollector(page);

	for (const [name, assertion] of assertionSpecs) {
		try {
			const details = await assertion(page, pageProblems);
			results.push({ name, passed: true, details });
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

if (
	fatalError ||
	results.length !== EXPECTED_ASSERTIONS ||
	results.some((result) => !result.passed)
) {
	process.exitCode = 1;
}
