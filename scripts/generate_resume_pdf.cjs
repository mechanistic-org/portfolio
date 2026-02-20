const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

// Configuration
const RESUME_URL = "http://localhost:4321/resume";
const OUTPUT_DIR = path.resolve(__dirname, "../../eriknorris-assets/R2_STAGING/resume");
const ARCHIVE_DIR = path.join(OUTPUT_DIR, "archive");
const TODAY = new Date().toISOString().split("T")[0];

// File Naming: Lazy Option
const ARCHIVE_FILENAME = `Erik_Norris_Sr_Staff_Forensic_Architect_${TODAY}.pdf`;
const CURRENT_FILENAME = `Erik_Norris_Resume_Current.pdf`;

const ARCHIVE_PATH = path.join(ARCHIVE_DIR, ARCHIVE_FILENAME);
const CURRENT_PATH = path.join(OUTPUT_DIR, CURRENT_FILENAME);

async function generatePDF() {
	console.log(`🌍 Connecting to Resume Source: ${RESUME_URL}`);

	// Ensure directories exist
	if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

	let browser;
	try {
		browser = await puppeteer.launch({
			headless: "new",
			args: ["--no-sandbox", "--disable-setuid-sandbox"], // Safety for CI/Container environments
		});

		const page = await browser.newPage();

		// Navigate
		await page.goto(RESUME_URL, { waitUntil: "networkidle0" });

		// Generate PDF
		console.log(`🚀 Printing PDF to: ${CURRENT_PATH}`);
		await page.pdf({
			path: CURRENT_PATH,
			format: "Letter",
			printBackground: true,
			displayHeaderFooter: false,
			margin: {
				top: "0.4in", // Matches print CSS overrides roughly or lets CSS handle it
				bottom: "0.4in",
				left: "0.4in",
				right: "0.4in",
			},
		});

		console.log(`✅ Current Resume Updated: ${CURRENT_PATH}`);

		// Archive
		fs.copyFileSync(CURRENT_PATH, ARCHIVE_PATH);
		console.log(`📦 Archived Copy Saved: ${ARCHIVE_PATH}`);
	} catch (error) {
		console.error("❌ PDF Generation Failed:", error);
		console.error('   (Ensure "npm run dev" is running on port 4321)');
		if (browser) await browser.close();
		process.exit(1);
	} finally {
		if (browser) await browser.close();
	}
}

generatePDF();
