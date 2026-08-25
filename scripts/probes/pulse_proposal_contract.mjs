import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import {
	assertNoPageProblems,
	BASE_URL,
	PAGE_TIMEOUT_MS,
	runBrowserContract,
	VIEWPORTS,
} from "./browser_contract_harness.mjs";

const EXPECTED_ASSERTIONS = 3;
const PULSE_PATH = "/colophon/the-pulse/";
const HARNESS_CACHE_DIR = path.join(
	process.cwd(),
	"node_modules",
	".cache",
	"pulse-proposal-contract",
);
const PROPOSAL_PATH_ENV = "PULSE_PROPOSAL_PATH";

function proposalFixture() {
	const proposal = JSON.parse(
		fs.readFileSync(path.join("src", "data", "pulse", "public-snapshot.json"), "utf8"),
	);
	const durableGroup = proposal.groups[2];
	Object.assign(durableGroup, {
		verification_state: "not_measurable",
		value: null,
		reason:
			"A native scoped-session denominator cannot be reproduced for the complete 90-day window.",
		evidence_start: "2026-08-22",
		eligibility_rule:
			"Numeric coverage becomes eligible after the native scoped-session identity is reproducible for every day in a complete 90-day window.",
		receipt: {
			id: "rct_11111111111111111111111111111111",
			sha256: "1".repeat(64),
		},
	});
	Object.assign(durableGroup.metrics[0], {
		value: null,
		refresh_state: "not_measurable",
		receipt: durableGroup.receipt,
	});
	return proposal;
}

async function navigate(page, problems) {
	problems.length = 0;
	const response = await page.goto(`${BASE_URL}${PULSE_PATH}`, {
		waitUntil: "networkidle0",
		timeout: PAGE_TIMEOUT_MS,
	});
	if (!response || response.status() < 200 || response.status() >= 300) {
		throw new Error(`${PULSE_PATH} returned HTTP ${response?.status() ?? "no response"}`);
	}
	await page.waitForSelector('[data-pulse-unavailable="not_measurable"]', {
		timeout: PAGE_TIMEOUT_MS,
	});
	assertNoPageProblems(problems);
}

async function readProposal(page) {
	return page.evaluate(() => {
		const text = (element) => element?.textContent?.replace(/\s+/gu, " ").trim() ?? "";
		const groups = Array.from(document.querySelectorAll("[data-pulse-proof-group]")).map(
			(group) => ({
				id: group.getAttribute("data-pulse-proof-group"),
				unavailable: group.getAttribute("data-pulse-unavailable"),
				text: text(group),
				numericReadings: group.querySelectorAll(".pulse-reading strong").length,
			}),
		);
		return {
			groups,
			heading: text(document.querySelector(".pulse-heading")),
			lifecycle: text(
				Array.from(document.querySelectorAll(".pulse-boundary div"))
					.find((item) => text(item.querySelector("dt")) === "Lifecycle state")
					?.querySelector("dd"),
			),
		};
	});
}

async function assertionProposalContract(page, problems) {
	await navigate(page, problems);
	const proposal = await readProposal(page);
	assert.deepEqual(
		proposal.groups.map((group) => group.id),
		["issue-flow", "change-traceability", "durable-record-coverage"],
	);
	assert.match(proposal.heading, /^Unapproved snapshot proposal/u);
	assert.equal(proposal.lifecycle, "proposal");
	const durableGroup = proposal.groups[2];
	assert.equal(durableGroup.unavailable, "not_measurable");
	assert.equal(durableGroup.numericReadings, 0);
	assert.match(durableGroup.text, /Not measurable/u);
	assert.match(durableGroup.text, /Evidence starts August 22, 2026/u);
	assert.match(durableGroup.text, /complete 90-day window/u);
	assertNoPageProblems(problems);
	return "3 groups; durable value unavailable; proposal state explicit";
}

async function assertionNoJavaScriptParity(page, problems) {
	await page.setJavaScriptEnabled(true);
	await navigate(page, problems);
	const withJavaScript = await readProposal(page);
	await page.setJavaScriptEnabled(false);
	await navigate(page, problems);
	const withoutJavaScript = await readProposal(page);
	assert.deepEqual(withoutJavaScript, withJavaScript);
	await page.setJavaScriptEnabled(true);
	assertNoPageProblems(problems);
	return "proposal state, reason, evidence boundary, and eligibility match without JavaScript";
}

async function assertionResponsiveContainment(page, problems) {
	const checked = [];
	for (const viewport of VIEWPORTS) {
		await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
		await navigate(page, problems);
		const layout = await page.evaluate(() => ({
			horizontalOverflow:
				document.documentElement.scrollWidth - document.documentElement.clientWidth,
			failures: Array.from(
				document.querySelectorAll(
					'[data-pulse-unavailable="not_measurable"], .pulse-unavailable, .pulse-unavailable dl div',
				),
			).flatMap((element) => {
				const rect = element.getBoundingClientRect();
				return rect.width <= 0 ||
					rect.height <= 0 ||
					rect.left < -1 ||
					rect.right > document.documentElement.clientWidth + 1
					? [{ left: rect.left, right: rect.right, width: rect.width, height: rect.height }]
					: [];
			}),
		}));
		assert.ok(layout.horizontalOverflow <= 1, `${viewport.name} overflows horizontally`);
		assert.deepEqual(layout.failures, [], `${viewport.name} clips unavailable evidence`);
		assertNoPageProblems(problems);
		checked.push(`${viewport.width}x${viewport.height}`);
	}
	return `${checked.join(" / ")} contained and legible`;
}

const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-pulse-browser-proposal-"));
const proposalPath = path.join(workspace, "proposal.json");
const previousProposalPath = process.env[PROPOSAL_PATH_ENV];
let passed = false;
try {
	fs.writeFileSync(proposalPath, `${JSON.stringify(proposalFixture(), null, "\t")}\n`);
	process.env[PROPOSAL_PATH_ENV] = proposalPath;
	passed = await runBrowserContract({
		assertionSpecs: [
			[
				"The proposal is explicit and carries no durable numeric shortcut",
				assertionProposalContract,
			],
			["No-JavaScript preserves the unavailable proposal contract", assertionNoJavaScriptParity],
			[
				"Unavailable evidence stays contained at supported viewports",
				assertionResponsiveContainment,
			],
		],
		cacheDirectory: HARNESS_CACHE_DIR,
		expectedAssertions: EXPECTED_ASSERTIONS,
		initialViewport: VIEWPORTS[0],
		title: "Pulse proposal public behavior contract",
	});
} finally {
	if (previousProposalPath === undefined) delete process.env[PROPOSAL_PATH_ENV];
	else process.env[PROPOSAL_PATH_ENV] = previousProposalPath;
	fs.rmSync(workspace, { force: true, recursive: true });
}

if (!passed) process.exitCode = 1;
