const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

// Configuration
const RESUME_URL = "http://localhost:4321/resume";
const OUTPUT_DIR = path.resolve(__dirname, "../../portfolio-assets/R2_STAGING/resume");
const ARCHIVE_DIR = path.join(OUTPUT_DIR, "archive");
const TODAY = new Date().toISOString().split("T")[0];

// File Naming: Lazy Option
const ARCHIVE_FILENAME = `Erik_Norris_Sr_Staff_Forensic_Architect_${TODAY}.pdf`;
const CURRENT_FILENAME = `Erik_Norris_Resume_Current.pdf`;

const ARCHIVE_PATH = path.join(ARCHIVE_DIR, ARCHIVE_FILENAME);
const CURRENT_PATH = path.join(OUTPUT_DIR, CURRENT_FILENAME);

const { spawn } = require("child_process");

async function generatePDF() {
	console.log(`🚀 Spinning up Headless Astro Server...`);

	// Ensure directories exist
	if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

	// Spawn the local dev server
	const serverProcess = spawn("npm", ["run", "dev", "--", "--port", "4321"], {
		cwd: path.resolve(__dirname, ".."),
		shell: process.platform === "win32",
	});

	let serverReady = false;

	serverProcess.stdout.on("data", (data) => {
		if (data.toString().includes("Local")) serverReady = true;
	});
	serverProcess.stderr.on("data", (data) => {
		if (data.toString().includes("Local")) serverReady = true;
	});

	// Wait up to 30 seconds for server
	for (let i = 0; i < 30; i++) {
		if (serverReady) break;
		await new Promise((r) => setTimeout(r, 1000));
	}

	if (!serverReady) {
		console.error("❌ Headless server failed to start within the timeout.");
		if (process.platform === "win32") {
			spawn("taskkill", ["/pid", serverProcess.pid, "/f", "/t"]);
		} else {
			serverProcess.kill();
		}
		process.exit(1);
	}

	console.log(`🌍 Connecting to Resume Source: ${RESUME_URL}`);

	let browser;
	try {
		browser = await puppeteer.launch({
			headless: "new",
			args: ["--no-sandbox", "--disable-setuid-sandbox"], // Safety for CI/Container environments
		});

		const page = await browser.newPage();

		// Emulate print media so Tailwind print: variants fire (strips starfield, dark bg, shadows)
		await page.emulateMediaType("print");

		// Navigate
		await page.goto(RESUME_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

		// Generate PDF to a temp path first to avoid Windows file-lock errors
		// if the current PDF is open in a viewer
		const TEMP_PATH = CURRENT_PATH + ".tmp.pdf";
		console.log(`🚀 Printing PDF...`);
		await page.pdf({
			path: TEMP_PATH,
			format: "Letter",
			printBackground: false,
			displayHeaderFooter: false,
			margin: {
				top: "0.4in",
				bottom: "0.4in",
				left: "0.4in",
				right: "0.4in",
			},
		});

		// Swap temp -> current (atomic on same drive)
		if (fs.existsSync(CURRENT_PATH)) fs.unlinkSync(CURRENT_PATH);
		fs.renameSync(TEMP_PATH, CURRENT_PATH);
		console.log(`✅ Current Resume Updated: ${CURRENT_PATH}`);

		// Archive
		fs.copyFileSync(CURRENT_PATH, ARCHIVE_PATH);
		console.log(`📦 Archived Copy Saved: ${ARCHIVE_PATH}`);
	} catch (error) {
		console.error("❌ PDF Generation Failed:", error);
	} finally {
		if (browser) await browser.close();
		// Kill the headless server
		console.log("🛑 Tearing down Headless Astro Server...");
		if (process.platform === "win32") {
			spawn("taskkill", ["/pid", serverProcess.pid, "/f", "/t"]);
		} else {
			serverProcess.kill();
		}
	}
}

generatePDF();
