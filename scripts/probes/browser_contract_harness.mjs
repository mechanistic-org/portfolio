import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

export const HOST = "127.0.0.1";
export const PORT = 4321;
export const BASE_URL = `http://${HOST}:${PORT}`;
export const PAGE_TIMEOUT_MS = 45_000;
export const VIEWPORTS = [
	{ name: "desktop", width: 1440, height: 1000 },
	{ name: "tablet", width: 768, height: 1024 },
	{ name: "mobile", width: 390, height: 844 },
];

const READY_TIMEOUT_MS = 90_000;
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

async function prepareAstroHarnessConfig(cacheDirectory, disableAdapter) {
	await mkdir(cacheDirectory, { recursive: true });
	const configPath = path.join(cacheDirectory, "astro.config.mjs");
	const baseConfigUrl = pathToFileURL(path.join(process.cwd(), "astro.config.mjs")).href;
	await writeFile(
		configPath,
		[
			`import baseConfig from ${JSON.stringify(baseConfigUrl)};`,
			"export default {",
			"\t...baseConfig,",
			...(disableAdapter ? ["\tadapter: undefined,"] : []),
			`\tvite: { ...(baseConfig.vite ?? {}), cacheDir: ${JSON.stringify(path.join(cacheDirectory, "vite"))} },`,
			"\tdevToolbar: { ...(baseConfig.devToolbar ?? {}), enabled: false },",
			"};",
			"",
		].join("\n"),
		"utf8",
	);
	return path.relative(process.cwd(), configPath);
}

function startAstroServer(configPath, cacheDirectory) {
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
			XDG_CONFIG_HOME: cacheDirectory,
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

export function createPageProblemCollector(page) {
	const problems = [];
	page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
	page.on("console", (message) => {
		if (message.type() === "error") problems.push(`console.error: ${message.text()}`);
	});
	return problems;
}

export function assertNoPageProblems(problems) {
	if (problems.length > 0) throw new Error(problems.join(" | "));
}

function printResults(title, results, expectedAssertions) {
	console.log(`\n${title}`);
	for (const [index, result] of results.entries()) {
		const status = result.passed ? "PASS" : "FAIL";
		console.log(`${String(index + 1).padStart(2, "0")} ${status}  ${result.name}`);
		if (result.details) console.log(`         ${result.details}`);
		if (!result.passed) console.log(`         ${result.error}`);
	}
	const passed = results.filter((result) => result.passed).length;
	console.log(`\n${passed}/${expectedAssertions} assertions passed`);
}

export async function runBrowserContract({
	assertionSpecs,
	cacheDirectory,
	expectedAssertions,
	initialViewport = VIEWPORTS[0],
	disableAdapter = false,
	title,
}) {
	let server = null;
	let browser = null;
	let fatalError = null;
	const results = [];
	try {
		if (await isPortOccupied()) throw new Error(`Refusing to run: ${HOST}:${PORT} is occupied`);
		server = startAstroServer(
			await prepareAstroHarnessConfig(cacheDirectory, disableAdapter),
			cacheDirectory,
		);
		await waitForHttpReady(server);
		browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setViewport({ ...initialViewport, deviceScaleFactor: 1 });
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
	if (results.length > 0) printResults(title, results, expectedAssertions);
	if (fatalError) {
		console.error(`\nHARNESS ERROR: ${fatalError.message}`);
		if (server?.getOutput?.()) console.error(`\nAstro output:\n${server.getOutput()}`);
	}
	return !(
		fatalError ||
		assertionSpecs.length !== expectedAssertions ||
		results.length !== expectedAssertions ||
		results.some((result) => !result.passed)
	);
}
