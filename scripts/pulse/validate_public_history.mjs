import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { assertPublicProjectionPrivacy } from "./public_projection_privacy.mjs";
import { validatePublicProjection } from "./validate_public_projection.mjs";

const DAY_MS = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const WITHDRAWAL_REASONS = new Set(["incorrect", "provenance-invalid"]);

function fail(message) {
	throw new Error(`[public-history] ${message}`);
}

function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireExactKeys(value, keys, label) {
	if (!isRecord(value)) fail(`${label} must be an object`);
	const actual = Object.keys(value).sort();
	const expected = [...keys].sort();
	if (JSON.stringify(actual) !== JSON.stringify(expected)) {
		fail(`${label} fields must exactly match the public history schema`);
	}
}

function requireText(value, label) {
	if (typeof value !== "string" || value.length === 0) fail(`${label} must be non-empty text`);
	return value;
}

function calendarTimestamp(value, label) {
	if (typeof value !== "string" || !ISO_DATE.test(value)) fail(`${label} must be YYYY-MM-DD`);
	const timestamp = Date.parse(`${value}T00:00:00Z`);
	if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
		fail(`${label} must be a real calendar date`);
	}
	return timestamp;
}

function stableValue(value) {
	if (Array.isArray(value)) return value.map(stableValue);
	if (!isRecord(value)) return value;
	return Object.fromEntries(
		Object.keys(value)
			.sort()
			.map((key) => [key, stableValue(value[key])]),
	);
}

function stableJson(value) {
	return `${JSON.stringify(stableValue(value), null, "\t")}\n`;
}

function sha256(value) {
	return createHash("sha256").update(value).digest("hex");
}

function addCalendarDays(value, days) {
	return new Date(calendarTimestamp(value, "snapshot.as_of") + days * DAY_MS)
		.toISOString()
		.slice(0, 10);
}

function collectReceiptIds(record) {
	return new Set(
		record.snapshot.groups.flatMap((group) => group.metrics.map((metric) => metric.receipt.id)),
	);
}

function validateApproval(record) {
	if (Object.hasOwn(record.snapshot, "lifecycle_state")) {
		fail(
			`${record.snapshot.snapshot_id} historical snapshot exposes an approval-time active marker as a current implication`,
		);
	}
	requireExactKeys(
		record.approval,
		["approved_by", "approved_on", "public_projection_sha256"],
		`${record.snapshot.snapshot_id}.approval`,
	);
	if (record.approval.approved_by !== "eriknorris") {
		fail(`${record.snapshot.snapshot_id}.approval.approved_by must be eriknorris`);
	}
	calendarTimestamp(record.approval.approved_on, `${record.snapshot.snapshot_id}.approved_on`);
	if (!SHA256.test(record.approval.public_projection_sha256)) {
		fail(`${record.snapshot.snapshot_id}.approval hash must be SHA-256`);
	}

	const approvalTimeProjection = { ...record.snapshot, lifecycle_state: "active" };
	validatePublicProjection(approvalTimeProjection);
	const expectedHash = sha256(stableJson(approvalTimeProjection));
	if (record.approval.public_projection_sha256 !== expectedHash) {
		fail(`${record.snapshot.snapshot_id} historical values differ from the approved projection`);
	}
}

function validateLifecycle(record, evaluatedOn) {
	const id = record.snapshot.snapshot_id;
	requireExactKeys(
		record.lifecycle,
		["state", "is_current", "validity", "effective_on", "correction"],
		`${id}.lifecycle`,
	);
	const evaluatedAt = calendarTimestamp(evaluatedOn, "evaluated_on");
	const asOf = calendarTimestamp(record.snapshot.as_of, `${id}.as_of`);
	const effectiveOn = calendarTimestamp(record.lifecycle.effective_on, `${id}.effective_on`);
	const ageDays = (evaluatedAt - asOf) / DAY_MS;
	if (!Number.isInteger(ageDays) || ageDays < 0) fail(`${id} cannot be evaluated before as_of`);

	if (record.lifecycle.state === "active") {
		if (
			record.lifecycle.is_current !== true ||
			record.lifecycle.validity !== "valid" ||
			record.lifecycle.correction !== null
		) {
			fail(`${id} active lifecycle must be valid, current, and uncorrected`);
		}
		if (ageDays > 90) fail(`${id} cannot remain current after 90 days`);
		if (record.lifecycle.effective_on !== record.approval.approved_on) {
			fail(`${id} active effective_on must match approval`);
		}
		return;
	}

	if (record.lifecycle.state === "archived") {
		if (
			record.lifecycle.is_current !== false ||
			record.lifecycle.validity !== "valid" ||
			record.lifecycle.correction !== null
		) {
			fail(`${id} archived lifecycle must remain valid and cannot be current`);
		}
		if (ageDays <= 90) fail(`${id} may archive only after 90 days`);
		if (record.lifecycle.effective_on !== addCalendarDays(record.snapshot.as_of, 91)) {
			fail(`${id} archive effective_on must be the first day after 90 days`);
		}
		return;
	}

	if (record.lifecycle.state !== "withdrawn") fail(`${id} lifecycle state is unsupported`);
	if (record.lifecycle.is_current !== false || record.lifecycle.validity !== "invalid") {
		fail(`${id} withdrawn lifecycle must be invalid and inactive`);
	}
	if (effectiveOn < asOf || effectiveOn > evaluatedAt) {
		fail(`${id} withdrawal date must fall between as_of and evaluated_on`);
	}
	requireExactKeys(
		record.lifecycle.correction,
		["reason", "replacement_snapshot_id", "href"],
		`${id}.correction`,
	);
	if (!WITHDRAWAL_REASONS.has(record.lifecycle.correction.reason)) {
		fail(`${id} correction reason must be incorrect or provenance-invalid`);
	}
	const replacementId = requireText(
		record.lifecycle.correction.replacement_snapshot_id,
		`${id}.replacement_snapshot_id`,
	);
	const expectedHref = `/colophon/the-pulse/#pulse-snapshot-${replacementId}`;
	if (record.lifecycle.correction.href !== expectedHref) {
		fail(`${id} correction href must link to its replacement snapshot`);
	}
}

export function validatePublicHistory(history) {
	requireExactKeys(
		history,
		["schema_version", "evaluated_on", "current_snapshot_id", "snapshots"],
		"history",
	);
	if (history.schema_version !== 1) fail("schema_version must be 1");
	calendarTimestamp(history.evaluated_on, "evaluated_on");
	requireText(history.current_snapshot_id, "current_snapshot_id");
	if (!Array.isArray(history.snapshots) || history.snapshots.length === 0) {
		fail("snapshots must be a non-empty array");
	}

	for (const [index, record] of history.snapshots.entries()) {
		requireExactKeys(record, ["snapshot", "lifecycle", "approval"], `snapshots[${index}]`);
		validateApproval(record);
		validateLifecycle(record, history.evaluated_on);
	}
	const recordsById = new Map(
		history.snapshots.map((record) => [record.snapshot.snapshot_id, record]),
	);
	if (recordsById.size !== history.snapshots.length) fail("snapshot_id values must be unique");
	const currentRecords = history.snapshots.filter((record) => record.lifecycle.is_current);
	if (
		currentRecords.length !== 1 ||
		currentRecords[0].snapshot.snapshot_id !== history.current_snapshot_id
	) {
		fail("current_snapshot_id must identify exactly one active current snapshot");
	}

	for (const record of history.snapshots) {
		if (record.lifecycle.state !== "withdrawn") continue;
		const replacementId = record.lifecycle.correction.replacement_snapshot_id;
		const replacement = recordsById.get(replacementId);
		if (!replacement || replacement.lifecycle.state !== "active") {
			fail(`${record.snapshot.snapshot_id} correction must identify the active replacement`);
		}
		if (replacement.approval.approved_on < record.lifecycle.effective_on) {
			fail(`${replacementId} correction approval must be new`);
		}
		if (
			replacement.approval.public_projection_sha256 === record.approval.public_projection_sha256
		) {
			fail(`${replacementId} correction approval must bind a distinct snapshot`);
		}
		const withdrawnReceipts = collectReceiptIds(record);
		if ([...collectReceiptIds(replacement)].some((id) => withdrawnReceipts.has(id))) {
			fail(`${replacementId} correction must use new private receipts`);
		}
	}

	assertPublicProjectionPrivacy(history, fail);
	return history;
}

const historyPath = path.resolve(
	process.argv[2] ?? path.join("src", "data", "pulse", "public-history.json"),
);

try {
	const history = JSON.parse(fs.readFileSync(historyPath, "utf8"));
	validatePublicHistory(history);
	console.log(`[public-history] valid lifecycle history: ${history.snapshots.length} snapshots`);
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
