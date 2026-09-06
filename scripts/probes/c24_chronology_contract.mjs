import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
	BASE_URL,
	PAGE_TIMEOUT_MS,
	runBrowserContract,
	assertNoPageProblems,
} from "./browser_contract_harness.mjs";

const sidecarPath = "src/content/projects/c24/_chronology.json";
const chronologyBytes = await readFile(sidecarPath);
const articleText = await readFile("src/content/projects/c24/index.mdx", "utf8");
const entropy = JSON.parse(await readFile("src/content/projects/c24/_entropy.json", "utf8"));
const chronology = JSON.parse(chronologyBytes);
const prominent = chronology.events.filter((event) => event.prominence === "prominent");
const dcd = chronology.clusters.find((cluster) => cluster.id === "dcd-release-sequence");

assert.equal(chronology.schema_version, "1.0");
assert.equal(chronology.project, "c24");
assert.equal(prominent.length, 8);
assert.equal(chronology.verification.prominent_event_count, 8);
assert.equal(dcd.event_ids.length, 7);
assert.equal(dcd.verified_identifier_count, 18);
assert.ok(chronology.events.every((event) => event.source_ids.length > 0));
assert.ok(
	entropy.every((event) => typeof event.source_ref === "string" && event.source_ref.length > 0),
);
assert.deepEqual(
	entropy
		.filter((event) => event.chronology_event_id)
		.map(({ date, chronology_event_id: eventId, chronology_date_field: dateField = "date" }) => [
			date,
			eventId,
			dateField,
		]),
	[
		["2005-06-02", "kickoff-teardown", "date"],
		["2005-07-14", "architecture-strategy-lock", "date"],
		["2006-03-15", "dcd-system-priority", "date"],
		["2006-12-04", "domestic-fabrication-bridge", "date"],
		["2007-03-07", "top-panel-no-bid", "date"],
		["2007-04-25", "headphone-jack-redesign", "date"],
		["2007-10-03", "schedule-recovery", "date"],
		["2007-10-24", "schedule-recovery", "end_date"],
	],
);
const phaseOneEntropy = entropy.find((event) => event.date === "2006-10-23");
assert.equal(phaseOneEntropy.source_ref, "Curtis Phase 1 Exit.ppt");
assert.match(phaseOneEntropy.snippet, /deck dated October 23/u);
const vendorRunEntropy = entropy.find((event) => event.date === "2007-06-12");
assert.equal(
	vendorRunEntropy.source_ref,
	"07_09_07_Digidesgin C24 pilot run inspection report 20070705.xls",
);
assert.match(vendorRunEntropy.snippet, /nine-unit C24 run started June 12/u);
assert.ok(!vendorRunEntropy.snippet.match(/formal 15-unit|Aug 9-22/u));
assert.match(
	entropy.find((event) => event.date === "2007-08-15").snippet,
	/August 15 status report scheduled RTM for August 16 and Pilot for August 22/u,
);
assert.match(
	entropy.find((event) => event.date === "2007-10-03").snippet,
	/status report marked FCS At Risk; its cover listed October 29 as the current plan/u,
);
assert.ok(!entropy.some((event) => event.snippet.match(/Production start targeted for 9\/28/u)));
assert.equal(
	chronology.events.find((event) => event.id === "first-customer-ship").date,
	"2007-11-07",
);
const noBid = chronology.events.find((event) => event.id === "top-panel-no-bid");
assert.equal(noBid.date, "2007-03-07");
assert.equal(noBid.date_basis, "document-date");
assert.match(noBid.verification_note, /reporting checkpoint, not a claimed occurrence date/u);
assert.ok(!chronologyBytes.toString("utf8").includes("11/15/2006"));
assert.match(
	articleText,
	/earliest located primary checkpoint is the March 7, 2007 status report/u,
);
assert.ok(!articleText.match(/11\/15\/2006|Curtis\.11\.15\.06/u));
assert.ok(!chronologyBytes.toString("utf8").match(/[A-Z]:[\\/]|portfolio_working/u));
assert.deepEqual(
	entropy.slice(6, 10).map(({ date, time_delta: timeDelta }) => [date, timeDelta]),
	[
		["2006-10-23", 32],
		["2006-12-04", 42],
		["2007-03-07", 93],
		["2007-04-25", 49],
	],
);

if (process.env.CANON_ROOT) {
	const canonBytes = await readFile(
		path.join(process.env.CANON_ROOT, "entities/projects/c24/_chronology.json"),
	);
	assert.deepEqual(chronologyBytes, canonBytes);
}

if (process.argv.includes("--data-only")) {
	console.log("PASS C24 chronology data: 8 beats, 7 DCD checkpoints, 18 identifiers, exact FCS");
	process.exit(0);
}

const specs = [
	[
		"C24 chronology renders and coordinates every interaction mode",
		async (page, problems) => {
			await page.setViewport({ width: 1440, height: 1000 });
			const response = await page.goto(`${BASE_URL}/projects/c24`, {
				waitUntil: "networkidle0",
				timeout: PAGE_TIMEOUT_MS,
			});
			assert.equal(response.status(), 200);
			await page.waitForSelector("[data-chronology='25']");
			await page.waitForSelector("[data-entropy='21']");
			await page.waitForFunction(() => Boolean(customElements.get("chrono-strip")));
			assert.equal(
				await page.$eval("[data-entropy] h2", (node) => node.textContent),
				"Project entropy",
			);
			assert.match(
				await page.$eval("[data-entropy] header p", (node) => node.textContent || ""),
				/derived|scored signal/iu,
			);
			assert.equal(
				await page.$$eval("[data-chronology] [data-entropy]", (nodes) => nodes.length),
				0,
			);
			assert.equal(
				await page.$$eval("[data-entropy] [data-chronology]", (nodes) => nodes.length),
				0,
			);
			assert.equal(await page.$$eval(".marker", (nodes) => nodes.length), 8);
			assert.equal(await page.$$eval(".beats .beat", (nodes) => nodes.length), 8);
			assert.equal(
				await page.$eval("[data-chronology-cluster='dcd-release-sequence']", (node) => node.open),
				false,
			);
			await page.click("[data-chronology-cluster='dcd-release-sequence'] summary");
			assert.equal(
				await page.$$eval(
					"[data-chronology-cluster='dcd-release-sequence'] li",
					(nodes) => nodes.length,
				),
				7,
			);
			const firstMarker = await page.$(".marker");
			await page.$eval(".marker", (node) => node.click());
			await page.waitForFunction(
				() =>
					document.querySelectorAll('[data-chrono-event="kickoff-teardown"].is-hot').length === 3,
			);
			assert.equal(
				await page.$$eval('[data-chrono-event="kickoff-teardown"].is-hot', (nodes) => nodes.length),
				3,
			);
			await firstMarker.focus();
			await page.keyboard.press("ArrowRight");
			assert.equal(
				await page.evaluate(() => document.activeElement?.getAttribute("data-chrono-event")),
				"architecture-strategy-lock",
			);
			for (const width of [1440, 768, 390, 320]) {
				await page.setViewport({ width, height: 1000 });
				assert.ok(
					await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
					`overflow at ${width}`,
				);
			}
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			assert.equal(
				await page.$eval("chrono-strip", (node) => node.getAnimations({ subtree: true }).length),
				0,
			);
			assertNoPageProblems(problems);
			return "8 synchronized beats, native DCD disclosure, keyboard roving, four widths, reduced motion";
		},
	],
];

process.exitCode = (await runBrowserContract({
	assertionSpecs: specs,
	cacheDirectory: path.join(process.cwd(), "node_modules/.cache/c24-chronology"),
	expectedAssertions: 1,
	title: "C24 chronology (#138)",
}))
	? 0
	: 1;
