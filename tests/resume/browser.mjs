import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer";
import { startResumeSource } from "../../scripts/resume_source.mjs";
import { resumeMaster } from "../../src/config/resume_master.ts";
const root = process.cwd(),
	revision = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const masterPath = path.join(root, "src/config/resume_master.ts"),
	original = fs.readFileSync(masterPath, "utf8");
const output = path.join(root, ".astro/resume-checks");
fs.mkdirSync(output, { recursive: true });
const source = await startResumeSource({ root, revision, port: 43920, allowDirty: true });
let browser,
	changed = false;
try {
	browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setJavaScriptEnabled(false);
	for (const [name, width, height, selector] of [
		["desktop", 1440, 900, "#nav-download-pdf"],
		["mobile", 390, 844, "#mobile-download-pdf"],
	]) {
		await page.setViewport({ width, height });
		const response = await page.goto(source.url + "/resume/", {
			waitUntil: "networkidle0",
			timeout: 120000,
		});
		assert.equal(response.headers()["x-resume-source"], source.identity.nonce);
		const anchor = await page.$(selector);
		assert.ok(anchor);
		assert.ok(await anchor.isVisible());
		const link = await anchor.evaluate((node) => ({
			tag: node.tagName,
			href: node.href,
			text: node.textContent.trim(),
			radius: getComputedStyle(node).borderRadius,
			rect: node.getBoundingClientRect().toJSON(),
		}));
		assert.equal(link.tag, "A");
		assert.equal(link.href, resumeMaster.pdf.url);
		assert.equal(link.text, "Download PDF");
		assert.equal(link.radius, "0px");
		assert.ok(link.rect.height >= 44);
		assert.ok(link.rect.x >= 0 && link.rect.right <= width);
		await anchor.focus();
		assert.equal(await page.$eval(selector, (node) => node === document.activeElement), true);
		await page.screenshot({ path: path.join(output, `download-${name}.png`) });
	}
	const legacy = await (await fetch(source.url + "/resume/pdf/")).text();
	assert.ok(legacy.includes(resumeMaster.pdf.url));
	assert.ok(legacy.includes('http-equiv="refresh"'));
	assert.ok(!legacy.includes("Professional Experience"));
	const structured = await (await fetch(source.url + "/resume.json")).json();
	assert.equal(structured.work.length, 8);
	assert.equal(structured.work[0].startDate, "2022");
	fs.writeFileSync(path.join(output, "resume.json"), JSON.stringify(structured, null, 2));
	// Behavioral mutation is confined to this isolated checkout and restored in finally.
	const revised = original
		.replaceAll("Erik Norris", "CANONICAL TEST NAME")
		.replaceAll("erik@eriknorris.com", "canonical@example.com")
		.replace(
			"Mechanical Engineering Lead | Complex Physical Systems · Prototype → Production",
			"CANONICAL TEST TITLE",
		)
		.replace("Tolerance / Alignment / Load Paths", "CANONICAL TEST COMPETENCY")
		.replace("De Anza College", "CANONICAL TEST SCHOOL")
		.replace(
			"Patent US20240164588A1: Modular System for Food Assembly (co-inventor)",
			"CANONICAL TEST RECOGNITION",
		)
		.replace(
			"https://assets.eriknorris.com/resume/Erik_Norris_Resume_Current.pdf",
			"https://example.com/canonical-test.pdf",
		);
	changed = true;
	fs.writeFileSync(masterPath, revised);
	let latest;
	for (let attempt = 0; attempt < 60; attempt++) {
		latest = await (await fetch(source.url + "/resume.json")).json();
		if (latest.basics.name === "CANONICAL TEST NAME") break;
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	assert.equal(latest.basics.name, "CANONICAL TEST NAME");
	assert.equal(latest.basics.email, "canonical@example.com");
	assert.equal(latest.basics.label, "CANONICAL TEST TITLE");
	assert.equal(latest.education[0].institution, "CANONICAL TEST SCHOOL");
	assert.equal(latest.awards[0].title, "CANONICAL TEST RECOGNITION");
	await page.goto(source.url + "/resume/", { waitUntil: "domcontentloaded", timeout: 120000 });
	const html = await page.content();
	for (const value of [
		"CANONICAL TEST NAME",
		"canonical@example.com",
		"CANONICAL TEST TITLE",
		"CANONICAL TEST COMPETENCY",
		"CANONICAL TEST SCHOOL",
		"CANONICAL TEST RECOGNITION",
		"https://example.com/canonical-test.pdf",
	])
		assert.ok(html.includes(value), value);
	assert.equal(
		await page.$eval("#mobile-download-pdf", (node) => node.href),
		"https://example.com/canonical-test.pdf",
	);
	await page.goto(source.url + "/", { waitUntil: "domcontentloaded", timeout: 120000 });
	assert.ok((await page.title()).includes("CANONICAL TEST TITLE"));
	assert.ok(
		(await page.$eval('meta[name="description"]', (node) => node.content)).includes(
			"CANONICAL TEST TITLE",
		),
	);
	const schemas = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
		nodes.map((node) => JSON.parse(node.textContent)),
	);
	const person = schemas.find((schema) => schema["@type"] === "ProfilePage").mainEntity;
	assert.equal(person.name, "CANONICAL TEST NAME");
	assert.equal(person.jobTitle, "CANONICAL TEST TITLE");
	assert.equal(person.email, "canonical@example.com");
	assert.ok(person.knowsAbout.includes("CANONICAL TEST COMPETENCY"));
	assert.equal(person.alumniOf[0].name, "CANONICAL TEST SCHOOL");
	assert.equal(person.award[0], "CANONICAL TEST RECOGNITION");
	assert.ok(
		(await page.$eval("footer", (node) => node.textContent)).includes("CANONICAL TEST TITLE"),
	);
	console.log(
		"PASS: emitted resume/JSON/Person/footer/download propagation; desktop/mobile no-JS anchors; compatibility route; screenshots in .astro/resume-checks",
	);
} finally {
	if (changed) fs.writeFileSync(masterPath, original);
	if (browser) await browser.close();
	await source.stop();
}
