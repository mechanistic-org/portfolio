import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:4321";
const SNAPSHOT_DIR = path.join(process.cwd(), "tests/visual_snapshots");

// Core Routes to Snapshot
const ROUTES = [
	{ name: "home", path: "/" },
	{ name: "project-detail-xbox", path: "/projects/xbox" }, // Known valid project
	{ name: "listing-consumer", path: "/projects/consumer_electronics" },
];

async function runVisualSmokeTest() {
	console.log("📸 Potato Mode: Running Visual Smoke Test (The Power Move)...");

	// Ensure snapshot directory exists
	if (!fs.existsSync(SNAPSHOT_DIR)) {
		fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
	}

	let browser;
	try {
		browser = await puppeteer.launch({
			headless: true, // "new" is deprecated, but "true" works
			args: ["--no-sandbox", "--disable-setuid-sandbox"], // Safety for CI environments
		});
		const page = await browser.newPage();

		// Set Viewport (Standard Desktop)
		await page.setViewport({ width: 1920, height: 1080 });

		console.log(`🌍 Connecting to ${BASE_URL}...`);

		for (const route of ROUTES) {
			const url = `${BASE_URL}${route.path}`;
			console.log(`   👉 Visiting: ${route.name} (${url})`);

			try {
				const response = await page.goto(url, { waitUntil: "networkidle0" });

				if (!response || !response.ok()) {
					console.error(`   ❌ Failed to load ${route.name}: ${response?.status()}`);
					continue;
				}

				const screenshotPath = path.join(SNAPSHOT_DIR, `${route.name}.png`);
				await page.screenshot({ path: screenshotPath, fullPage: true });
				console.log(`      ✅ Snapshot saved: ${route.name}.png`);
			} catch (e) {
				console.error(`   ❌ Error visiting ${route.name}:`, e);
				console.error(`   (Ensure server is running at ${BASE_URL})`);
				process.exit(1);
			}
		}

		console.log("\n✨ Visual Smoke Test Complete.");
		console.log(`📁 Snapshots: ${SNAPSHOT_DIR}`);
	} catch (e) {
		console.error("❌ Browser Launch Failed:", e);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

runVisualSmokeTest();
