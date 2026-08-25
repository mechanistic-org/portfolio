import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { assertPublicProjectionPrivacy } from "./public_projection_privacy.mjs";

const REQUIRED_GROUPS = [
	[
		"issue-flow",
		[
			"issue-flow.created-count",
			"issue-flow.cohort-closure-percentage",
			"issue-flow.median-close-time",
			"issue-flow.net-backlog-change",
		],
	],
	[
		"change-traceability",
		[
			"change-traceability.trunk-commits",
			"change-traceability.scheduled-maintenance-commits",
			"change-traceability.issue-reference-coverage",
			"change-traceability.distinct-issues",
		],
	],
	["durable-record-coverage", ["durable-record-coverage.session-coverage-percentage"]],
];
const TOP_LEVEL_KEYS = [
	"as_of",
	"groups",
	"lifecycle_state",
	"measurement_window",
	"public_wording",
	"schema_version",
	"snapshot_id",
	"verification_state",
];
const METRIC_KEYS = [
	"as_of",
	"definition",
	"denominator",
	"exclusions",
	"id",
	"inclusions",
	"label",
	"measurement_window",
	"method_summary",
	"numerator",
	"receipt",
	"refresh_state",
	"source_class",
	"unit",
	"value",
];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;
const RECEIPT_ID = /^rct_[a-f0-9]{32}$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const SOURCE_CLASSES = new Set(["issue-tracker", "version-control", "session-registry"]);

function fail(message) {
	throw new Error(`[public-projection] ${message}`);
}

function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireExactKeys(value, keys, label) {
	if (!isRecord(value)) fail(`${label} must be an object`);
	const actual = Object.keys(value).sort();
	const expected = [...keys].sort();
	if (JSON.stringify(actual) !== JSON.stringify(expected)) {
		fail(`${label} fields must exactly match the public schema`);
	}
}

function requireText(value, label) {
	if (typeof value !== "string" || value.trim().length === 0) {
		fail(`${label} must be a non-empty string`);
	}
}

function requireCalendarDate(value, label) {
	if (typeof value !== "string" || !ISO_DATE.test(value)) fail(`${label} must be YYYY-MM-DD`);
	const date = new Date(`${value}T00:00:00Z`);
	if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
		fail(`${label} must be a real calendar date`);
	}
	return date;
}

function validateWindow(window, label) {
	requireExactKeys(window, ["days", "end", "start"], label);
	if (window.days !== 90) fail(`${label}.days must be 90`);
	const start = requireCalendarDate(window.start, `${label}.start`);
	const end = requireCalendarDate(window.end, `${label}.end`);
	const inclusiveDays = Math.round((end - start) / 86_400_000) + 1;
	if (inclusiveDays !== window.days) fail(`${label} must span 90 inclusive calendar days`);
}

function windowsMatch(left, right) {
	return left.days === right.days && left.start === right.start && left.end === right.end;
}

export function validatePublicProjection(projection) {
	requireExactKeys(projection, TOP_LEVEL_KEYS, "projection");
	if (projection.schema_version !== 1) fail("schema_version must be 1");
	requireText(projection.snapshot_id, "snapshot_id");
	requireCalendarDate(projection.as_of, "as_of");
	validateWindow(projection.measurement_window, "measurement_window");
	if (projection.as_of !== projection.measurement_window.end) {
		fail("as_of must match measurement_window.end");
	}
	if (projection.lifecycle_state !== "active") fail("lifecycle_state must be active");
	if (projection.verification_state !== "independently-reproduced") {
		fail("verification_state must be independently-reproduced");
	}
	requireExactKeys(projection.public_wording, ["summary", "title"], "public_wording");
	requireText(projection.public_wording.title, "public_wording.title");
	requireText(projection.public_wording.summary, "public_wording.summary");

	if (!Array.isArray(projection.groups)) fail("groups must be an array");
	const actualGroups = projection.groups.map((group) => group?.id);
	const expectedGroups = REQUIRED_GROUPS.map(([groupId]) => groupId);
	if (JSON.stringify(actualGroups) !== JSON.stringify(expectedGroups)) {
		fail("groups must exactly match the three headline proof groups");
	}

	for (const [groupIndex, [groupId, expectedMetricIds]] of REQUIRED_GROUPS.entries()) {
		const group = projection.groups[groupIndex];
		requireExactKeys(group, ["id", "label", "metrics"], `groups[${groupIndex}]`);
		requireText(group.label, `${groupId}.label`);
		if (!Array.isArray(group.metrics)) fail(`${groupId}.metrics must be an array`);
		if (
			JSON.stringify(group.metrics.map((metric) => metric?.id)) !==
			JSON.stringify(expectedMetricIds)
		) {
			fail(`${groupId}.metrics must exactly match its required public metrics`);
		}

		for (const metric of group.metrics) {
			requireExactKeys(metric, METRIC_KEYS, metric.id);
			for (const field of [
				"definition",
				"denominator",
				"exclusions",
				"id",
				"inclusions",
				"label",
				"method_summary",
				"numerator",
				"source_class",
				"unit",
			]) {
				requireText(metric[field], `${metric.id}.${field}`);
			}
			if (!Number.isFinite(metric.value)) fail(`${metric.id}.value must be a finite number`);
			if (metric.as_of !== projection.as_of) fail(`${metric.id}.as_of must match snapshot as_of`);
			validateWindow(metric.measurement_window, `${metric.id}.measurement_window`);
			if (!windowsMatch(metric.measurement_window, projection.measurement_window)) {
				fail(`${metric.id}.measurement_window must match the snapshot window`);
			}
			if (metric.refresh_state !== projection.verification_state) {
				fail(`${metric.id}.refresh_state must match verification_state`);
			}
			if (!SOURCE_CLASSES.has(metric.source_class)) {
				fail(`${metric.id}.source_class is not public`);
			}
			requireExactKeys(metric.receipt, ["id", "sha256"], `${metric.id}.receipt`);
			if (!RECEIPT_ID.test(metric.receipt.id)) fail(`${metric.id}.receipt.id must be opaque`);
			if (!SHA256.test(metric.receipt.sha256)) fail(`${metric.id}.receipt.sha256 must be a hash`);
		}
	}

	assertPublicProjectionPrivacy(projection, fail);
	return projection;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	const projectionPath = path.resolve(
		process.argv[2] ?? path.join("src", "data", "pulse", "public-snapshot.json"),
	);

	try {
		const projection = JSON.parse(fs.readFileSync(projectionPath, "utf8"));
		validatePublicProjection(projection);
		console.log(`[public-projection] valid active snapshot: ${projection.snapshot_id}`);
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}
}
