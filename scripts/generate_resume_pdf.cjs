// Local candidate preparation only. No upload, mirror write, archive or deployment.
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { createHash } = require("node:crypto");
async function generatePDF({ root, output, revision, port = 43919, allowDirty = false }) {
	if (!root || !output || !revision)
		throw new Error("Explicit --source-root, --output and --revision are required");
	root = fs.realpathSync(root);
	output = path.resolve(output);
	if (root !== fs.realpathSync(path.resolve(__dirname, "..")))
		throw new Error(
			"PDF preparer checkout mismatch; invoke the script from the intended source checkout",
		);
	for (const directory of ["src", "public", "dist", "R2_MIRROR"]) {
		const base = path.join(root, directory);
		if (output === base || output.startsWith(base + path.sep))
			throw new Error("PDF must remain a private candidate");
	}
	if (fs.existsSync(output) || fs.existsSync(output + ".receipt.json"))
		throw new Error("Candidate output already exists");
	const { startResumeSource, verifySource } = await import("./resume_source.mjs");
	const { resumeMaster } = await import(
		pathToFileURL(path.join(root, "src/config/resume_master.ts")).href
	);
	const { pdfConfiguration } = await import(
		pathToFileURL(path.join(root, "src/config/resume_projection.ts")).href
	);
	const config = pdfConfiguration(resumeMaster);
	const source = await startResumeSource({ root, revision, port, allowDirty });
	let browser;
	try {
		const puppeteer = require("puppeteer");
		browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setJavaScriptEnabled(false);
		await page.emulateMediaType("print");
		const response = await page.goto(source.url + config.sourcePath, {
			waitUntil: "networkidle0",
			timeout: 120000,
		});
		if (!response?.ok() || response.headers()["x-resume-source"] !== source.identity.nonce)
			throw new Error("Rendered page came from a mismatched endpoint");
		if ((await page.$eval("h1", (node) => node.textContent.trim())) !== resumeMaster.header.name)
			throw new Error("Rendered resume identity mismatch");
		await page.evaluate(() => document.fonts.ready);
		await verifySource(source.url, source.identity);
		source.assertUnchanged();
		const pdf = await page.pdf({
			format: "Letter",
			printBackground: false,
			displayHeaderFooter: false,
			margin: { top: "0.4in", bottom: "0.4in", left: "0.4in", right: "0.4in" },
		});
		source.assertUnchanged();
		const receipt = {
			schemaVersion: 1,
			source: source.identity,
			canonicalPDF: config.url,
			filename: config.filename,
			sha256: createHash("sha256").update(pdf).digest("hex"),
			bytes: pdf.length,
		};
		fs.mkdirSync(path.dirname(output), { recursive: true });
		fs.writeFileSync(output, pdf, { flag: "wx" });
		fs.writeFileSync(output + ".receipt.json", JSON.stringify(receipt, null, 2) + "\n", {
			encoding: "utf8",
			flag: "wx",
		});
		return receipt;
	} finally {
		if (browser) await browser.close();
		await source.stop();
	}
}
module.exports = { generatePDF };
if (require.main === module) {
	const args = process.argv.slice(2),
		options = {};
	try {
		for (let i = 0; i < args.length; i++) {
			if (args[i] === "--allow-dirty") {
				options.allowDirty = true;
				continue;
			}
			const keys = {
				"--source-root": "root",
				"--output": "output",
				"--revision": "revision",
				"--port": "port",
			};
			const key = keys[args[i]];
			if (!key || !args[i + 1])
				throw new Error(
					"Usage: node scripts/generate_resume_pdf.cjs --source-root <checkout> --output <private.pdf> --revision <full-sha> [--port <port>] [--allow-dirty]",
				);
			options[key] = key === "port" ? Number(args[++i]) : args[++i];
		}
		generatePDF(options)
			.then((receipt) => console.log(JSON.stringify(receipt, null, 2)))
			.catch((error) => {
				console.error(error);
				process.exitCode = 1;
			});
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}
