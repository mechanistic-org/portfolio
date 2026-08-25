import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const HOST = "127.0.0.1";
const PORT = 4321;
const BASE_URL = `http://${HOST}:${PORT}`;
const READY_TIMEOUT_MS = 90_000;
const PAGE_TIMEOUT_MS = 45_000;
const EXPECTED_ASSERTIONS = 5;
const PULSE_PATH = "/colophon/the-pulse/";
const EXPECTED_GROUP_IDS = ["issue-flow", "change-traceability", "durable-record-coverage"];
const VIEWPORTS = [
	{ name: "desktop", width: 1440, height: 1000 },
	{ name: "tablet", width: 768, height: 1024 },
	{ name: "mobile", width: 390, height: 844 },
];
const HARNESS_CACHE_DIR = path.join(process.cwd(), "node_modules", ".cache", "pulse-contract");
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
			if (!settled) reject(error);
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
			const response = await fetch(`${BASE_URL}/`, { signal: AbortSignal.timeout(2_000) });
			if (!response.ok) throw new Error(`Astro readiness returned HTTP ${response.status}`);
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

async function navigate(page, pathname, problems) {
	problems.length = 0;
	const response = await page.goto(`${BASE_URL}${pathname}`, {
		waitUntil: "networkidle0",
		timeout: PAGE_TIMEOUT_MS,
	});
	if (!response || response.status() < 200 || response.status() >= 300) {
		throw new Error(`${pathname} returned HTTP ${response?.status() ?? "no response"}`);
	}
	await page.waitForSelector("body", { timeout: PAGE_TIMEOUT_MS });
	assertNoPageProblems(problems);
}

async function assertionHowIWorkEntry(page, problems) {
	await navigate(page, "/how-i-work/", problems);
	const entry = await page.$(`[data-pulse-entry] a[href="${PULSE_PATH}"]`);
	if (!entry) throw new Error("How I Work does not expose the canonical Pulse entry point");
	await Promise.all([
		page.waitForNavigation({ waitUntil: "networkidle0", timeout: PAGE_TIMEOUT_MS }),
		entry.click(),
	]);
	await page.waitForSelector("[data-pulse-proof-group]", { timeout: PAGE_TIMEOUT_MS });
	const groupCount = await page.$$eval("[data-pulse-proof-group]", (groups) => groups.length);
	if (groupCount !== 3) throw new Error(`The Pulse rendered ${groupCount} headline proof groups`);
	assertNoPageProblems(problems);
	return `How I Work -> ${new URL(page.url()).pathname} -> ${groupCount} proof groups`;
}

async function readPulseContract(page) {
	return page.evaluate(() => {
		const text = (element) => element?.textContent?.replace(/\s+/gu, " ").trim() ?? "";
		const boundary = Object.fromEntries(
			Array.from(document.querySelectorAll(".pulse-boundary > div")).map((item) => [
				text(item.querySelector("dt")),
				text(item.querySelector("dd")),
			]),
		);
		const groups = Array.from(document.querySelectorAll("[data-pulse-proof-group]")).map(
			(group) => ({
				id: group.getAttribute("data-pulse-proof-group"),
				label: text(group.querySelector("h3")),
				purpose: text(group.querySelector("[data-pulse-group-purpose]")),
				metrics: Array.from(group.querySelectorAll("[data-pulse-metric]")).map((metric) => ({
					id: metric.getAttribute("data-pulse-metric"),
					reading: text(metric.querySelector(".pulse-reading")),
					definition: text(metric.querySelector("[data-pulse-definition]")),
					method: text(metric.querySelector("[data-pulse-method]")),
					source: text(metric.querySelector(".pulse-source")),
				})),
			}),
		);
		const history = Array.from(document.querySelectorAll("[data-pulse-history-state]")).map(
			(record) => ({
				state: record.getAttribute("data-pulse-history-state"),
				notice: text(record.querySelector(".pulse-history-notice")),
				boundary: text(record.querySelector(".pulse-history-boundary")),
				metrics: Array.from(record.querySelectorAll("[data-pulse-history-metric]")).map(text),
				correctionHref:
					record.querySelector(".pulse-correction-link a")?.getAttribute("href") ?? null,
			}),
		);
		return { boundary, groups, history };
	});
}

async function assertionVisibleContract(page, problems) {
	await page.setJavaScriptEnabled(true);
	await navigate(page, PULSE_PATH, problems);
	const contract = await readPulseContract(page);
	assert.deepEqual(
		contract.groups.map((group) => group.id),
		EXPECTED_GROUP_IDS,
		"headline proof groups changed",
	);
	assert.deepEqual(
		Object.keys(contract.boundary),
		["Measurement window", "As of", "Refresh state", "Lifecycle state", "Verification state"],
		"snapshot boundary is incomplete",
	);
	assert.match(contract.boundary["Measurement window"], /90 days/u);
	assert.match(contract.boundary["As of"], /\w+ \d{1,2}, \d{4}/u);
	assert.equal(contract.boundary["Lifecycle state"], "active");
	assert.equal(contract.boundary["Verification state"], "independently reproduced");
	const metrics = contract.groups.flatMap((group) => group.metrics);
	assert.equal(metrics.length, 9, "the three proof groups must expose nine approved metrics");
	for (const metric of metrics) {
		assert.ok(metric.reading, `${metric.id} has no visible value`);
		assert.match(metric.definition, /^Definition\s+\S/u, `${metric.id} has no definition`);
		assert.match(metric.method, /^Method\s+\S/u, `${metric.id} has no method`);
		assert.ok(metric.source, `${metric.id} has no source and refresh summary`);
	}
	assertNoPageProblems(problems);
	return `${contract.groups.length} groups / ${metrics.length} metrics / complete dated boundary`;
}

async function assertionLifecycleTreatments(page, problems) {
	await page.setJavaScriptEnabled(true);
	await navigate(page, PULSE_PATH, problems);
	const lifecycle = await page.evaluate(() => {
		const records = Array.from(document.querySelectorAll("[data-pulse-history-state]")).map(
			(record) => ({
				state: record.getAttribute("data-pulse-history-state"),
				borderColor: getComputedStyle(record).borderTopColor,
				notice: record
					.querySelector(".pulse-history-notice")
					?.textContent?.replace(/\s+/gu, " ")
					.trim(),
				correctionHref:
					record.querySelector(".pulse-correction-link a")?.getAttribute("href") ?? null,
			}),
		);
		const correctionHref = records.find((record) => record.state === "withdrawn")?.correctionHref;
		const correctionTargetId = correctionHref
			? new URL(correctionHref, location.href).hash.slice(1)
			: null;
		return {
			records,
			correctionTargetExists: Boolean(
				correctionTargetId && document.getElementById(correctionTargetId),
			),
		};
	});
	assert.deepEqual(
		lifecycle.records.map((record) => record.state),
		["archived", "withdrawn"],
		"historical lifecycle states changed",
	);
	const [archived, withdrawn] = lifecycle.records;
	assert.notEqual(archived.borderColor, withdrawn.borderColor, "lifecycle states look identical");
	assert.match(archived.notice, /valid historical evidence and is not current or live/u);
	assert.match(withdrawn.notice, /inactive and cannot serve as the current snapshot/u);
	assert.equal(
		withdrawn.correctionHref,
		"/colophon/the-pulse/#pulse-snapshot-pulse-fixture-2026-08-24",
	);
	assert.equal(lifecycle.correctionTargetExists, true, "withdrawn correction target is missing");
	assertNoPageProblems(problems);
	return "archived valid/not-live; withdrawn inactive; correction reaches replacement";
}

async function assertionNoJavaScriptParity(page, problems) {
	await page.setJavaScriptEnabled(true);
	await navigate(page, PULSE_PATH, problems);
	const withJavaScript = await readPulseContract(page);
	await page.setJavaScriptEnabled(false);
	await navigate(page, PULSE_PATH, problems);
	const withoutJavaScript = await readPulseContract(page);
	assert.deepEqual(
		withoutJavaScript,
		withJavaScript,
		"disabling JavaScript changed Pulse values, definitions, dates, methods, or states",
	);
	assertNoPageProblems(problems);
	await page.setJavaScriptEnabled(true);
	return `${withJavaScript.groups.flatMap((group) => group.metrics).length} current and ${withJavaScript.history.flatMap((record) => record.metrics).length} historical metric records match`;
}

async function assertionResponsiveContainment(page, problems) {
	const details = [];
	await page.setJavaScriptEnabled(true);
	for (const viewport of VIEWPORTS) {
		await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
		await navigate(page, "/how-i-work/", problems);
		const entryLayout = await page.$eval("[data-pulse-entry]", (entry) => {
			const rect = entry.getBoundingClientRect();
			const link = entry.querySelector("a");
			return {
				left: rect.left,
				right: rect.right,
				width: rect.width,
				height: rect.height,
				linkFontSize: Number.parseFloat(getComputedStyle(link).fontSize),
				viewportWidth: document.documentElement.clientWidth,
				horizontalOverflow:
					document.documentElement.scrollWidth - document.documentElement.clientWidth,
			};
		});
		assert.ok(entryLayout.width > 0 && entryLayout.height > 0, `${viewport.name} entry is empty`);
		assert.ok(
			entryLayout.left >= -1 && entryLayout.right <= entryLayout.viewportWidth + 1,
			`${viewport.name} entry is clipped`,
		);
		assert.ok(entryLayout.linkFontSize >= 10, `${viewport.name} entry link is illegible`);
		assert.ok(
			entryLayout.horizontalOverflow <= 1,
			`${viewport.name} How I Work overflows horizontally`,
		);
		assertNoPageProblems(problems);
		await navigate(page, PULSE_PATH, problems);
		const layout = await page.evaluate(() => {
			const selectors = [
				"[data-pulse-snapshot]",
				".pulse-boundary",
				"[data-pulse-proof-group]",
				"[data-pulse-metric]",
				"[data-pulse-history-state]",
				"[data-pulse-history-metric]",
				".pulse-correction-link a",
			];
			const elements = selectors.flatMap((selector) =>
				Array.from(document.querySelectorAll(selector)),
			);
			return {
				horizontalOverflow:
					document.documentElement.scrollWidth - document.documentElement.clientWidth,
				failures: elements.flatMap((element) => {
					const rect = element.getBoundingClientRect();
					const fontSize = Number.parseFloat(getComputedStyle(element).fontSize);
					if (
						rect.width <= 0 ||
						rect.height <= 0 ||
						rect.left < -1 ||
						rect.right > document.documentElement.clientWidth + 1 ||
						fontSize < 10
					) {
						return [
							{
								identity: element.getAttribute("data-pulse-metric") ?? element.tagName,
								left: rect.left,
								right: rect.right,
								width: rect.width,
								height: rect.height,
								fontSize,
							},
						];
					}
					return [];
				}),
			};
		});
		assert.ok(
			layout.horizontalOverflow <= 1,
			`${viewport.name} overflows horizontally by ${layout.horizontalOverflow}px`,
		);
		assert.deepEqual(
			layout.failures,
			[],
			`${viewport.name} has clipped or illegible Pulse content`,
		);
		assertNoPageProblems(problems);
		details.push(`${viewport.width}x${viewport.height}`);
	}
	return `${details.join(" / ")} contained, legible, and error-free`;
}

const assertionSpecs = [
	["How I Work reaches the canonical three-group Pulse", assertionHowIWorkEntry],
	["The dated metric definition and method contract is visible", assertionVisibleContract],
	["Archived and withdrawn evidence stay distinct and corrected", assertionLifecycleTreatments],
	["No-JavaScript preserves the complete public record", assertionNoJavaScriptParity],
	["The Pulse is contained and legible at all supported viewports", assertionResponsiveContainment],
];

function printResults(results) {
	console.log("\nPulse public behavior contract");
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
	if (await isPortOccupied()) throw new Error(`Refusing to run: ${HOST}:${PORT} is occupied`);
	server = startAstroServer(await prepareAstroHarnessConfig());
	await waitForHttpReady(server);
	browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setViewport({ ...VIEWPORTS[0], deviceScaleFactor: 1 });
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
