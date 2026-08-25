import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { assertPublicProjectionPrivacy } from "./public_projection_privacy.mjs";

const REQUIRED_GROUP_IDS = ["issue-flow", "change-traceability", "durable-record-coverage"];
const REQUIRED_METRIC_IDS_BY_GROUP = new Map([
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
]);
const REQUIRED_DEFINITION_FIELDS = [
	"id",
	"label",
	"unit",
	"definition",
	"numerator",
	"denominator",
	"method_summary",
	"source_class",
];
const REQUIRED_SCOPED_DEFINITION_FIELDS = [
	...REQUIRED_DEFINITION_FIELDS,
	"inclusions",
	"exclusions",
];
const GROUPS_WITH_INCLUSION_EXCLUSION = new Set([
	"issue-flow",
	"change-traceability",
	"durable-record-coverage",
]);
const REQUIRED_ARGUMENTS = [
	"definitions",
	"snapshot",
	"approval",
	"receipt-manifest",
	"receipts-dir",
	"output",
];
const OPAQUE_RECEIPT_ID = /^rct_[a-f0-9]{32}$/u;
const OPAQUE_ISSUE_ID = /^iss_[a-f0-9]{32}$/u;
const OPAQUE_COMMIT_ID = /^cmt_[a-f0-9]{32}$/u;
const OPAQUE_SESSION_ID = /^ssn_[a-f0-9]{32}$/u;
const OPAQUE_RECORD_ID = /^rec_[a-f0-9]{32}$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;
const DURABLE_RECORD_COVERAGE_METRIC_ID = "durable-record-coverage.session-coverage-percentage";
const PUBLIC_SOURCE_CLASSES = new Set(["issue-tracker", "version-control", "session-registry"]);
const PUBLIC_URL = /\bhttps:\/\/[^\s<>"']+/giu;
const PUBLIC_PULSE_DATA_DIRECTORY = path.resolve(import.meta.dirname, "../../src/data/pulse");

function fail(message) {
	throw new Error(`[snapshot-contract] ${message}`);
}

function failProposal(message) {
	throw new Error(`[snapshot-contract] effective_state=proposal; ${message}`);
}

function parseArguments(argv) {
	const argumentsByName = {};

	for (let index = 0; index < argv.length; index += 2) {
		const flag = argv[index];
		const value = argv[index + 1];
		if (!flag?.startsWith("--") || !value) {
			fail(`Expected --name value arguments; received ${argv.join(" ")}`);
		}
		argumentsByName[flag.slice(2)] = path.resolve(value);
	}

	for (const requiredArgument of REQUIRED_ARGUMENTS) {
		if (!argumentsByName[requiredArgument]) {
			fail(`Missing required argument --${requiredArgument}`);
		}
	}

	return argumentsByName;
}

function readJson(filePath, label) {
	let bytes;
	try {
		bytes = fs.readFileSync(filePath);
	} catch (error) {
		fail(`Cannot read ${label} at ${filePath}: ${error.message}`);
	}

	try {
		return { bytes, value: JSON.parse(bytes.toString("utf8")) };
	} catch (error) {
		fail(`${label} is not valid JSON: ${error.message}`);
	}
}

function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireRecord(value, label) {
	if (!isRecord(value)) fail(`${label} must be an object`);
	return value;
}

function requireString(value, label) {
	if (typeof value !== "string" || value.length === 0) {
		fail(`${label} must be a non-empty string`);
	}
	return value;
}

function requireExactKeys(value, expectedKeys, label) {
	const actualKeys = Object.keys(requireRecord(value, label)).sort();
	const sortedExpectedKeys = [...expectedKeys].sort();
	if (JSON.stringify(actualKeys) !== JSON.stringify(sortedExpectedKeys)) {
		fail(
			`${label} keys must be exactly ${sortedExpectedKeys.join(", ")}; received ${actualKeys.join(", ")}`,
		);
	}
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

function canonicalHash(value) {
	return sha256(stableJson(value));
}

function definitionFieldsForGroup(groupId) {
	return GROUPS_WITH_INCLUSION_EXCLUSION.has(groupId)
		? REQUIRED_SCOPED_DEFINITION_FIELDS
		: REQUIRED_DEFINITION_FIELDS;
}

function validateDefinitions(definitions) {
	requireRecord(definitions, "definitions");
	if (definitions.schema_version !== 1) {
		fail("definitions.schema_version must be 1");
	}
	if (!Array.isArray(definitions.groups)) {
		fail("definitions.groups must be an array");
	}

	const groupIds = definitions.groups.map((group, groupIndex) =>
		requireString(group?.id, `definitions.groups[${groupIndex}].id`),
	);
	if (JSON.stringify(groupIds) !== JSON.stringify(REQUIRED_GROUP_IDS)) {
		fail(`headline groups must be exactly ${REQUIRED_GROUP_IDS.join(", ")}`);
	}

	const metricIds = new Set();
	for (const [groupIndex, group] of definitions.groups.entries()) {
		requireExactKeys(group, ["id", "label", "metrics"], `group ${group.id}`);
		requireString(group.label, `group ${group.id}.label`);
		if (!Array.isArray(group.metrics) || group.metrics.length === 0) {
			fail(`group ${group.id} must contain at least one metric`);
		}
		const requiredMetricIds = REQUIRED_METRIC_IDS_BY_GROUP.get(group.id);
		const groupMetricIds = group.metrics.map((metric) => metric?.id);
		if (JSON.stringify(groupMetricIds) !== JSON.stringify(requiredMetricIds)) {
			fail(`group ${group.id} metrics must be exactly ${requiredMetricIds.join(", ")}`);
		}

		for (const [metricIndex, metric] of group.metrics.entries()) {
			const metricLabel = `definitions.groups[${groupIndex}].metrics[${metricIndex}]`;
			const requiredDefinitionFields = definitionFieldsForGroup(group.id);
			requireExactKeys(metric, requiredDefinitionFields, metricLabel);
			for (const field of requiredDefinitionFields) {
				requireString(metric[field], `${metricLabel}.${field}`);
			}
			if (!PUBLIC_SOURCE_CLASSES.has(metric.source_class)) {
				fail(`metric ${metric.id}.source_class is not an approved public class`);
			}
			if (!metric.id.startsWith(`${group.id}.`)) {
				fail(`metric ${metric.id} must belong to group ${group.id}`);
			}
			if (metricIds.has(metric.id)) fail(`duplicate metric id ${metric.id}`);
			metricIds.add(metric.id);
		}
	}

	return metricIds;
}

function requireIsoCalendarDate(value, label) {
	if (typeof value !== "string" || !ISO_DATE.test(value)) {
		fail(`${label} must be YYYY-MM-DD`);
	}
	const timestamp = Date.parse(`${value}T00:00:00Z`);
	if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
		fail(`${label} must be a real ISO calendar date`);
	}
	return timestamp;
}

function inclusiveWindowDays(startInclusive, endInclusive) {
	return (endInclusive - startInclusive) / 86_400_000 + 1;
}

function validateSnapshot(snapshot, metricIds) {
	requireExactKeys(
		snapshot,
		[
			"schema_version",
			"snapshot_id",
			"as_of",
			"measurement_window",
			"refresh_state",
			"lifecycle_state",
			"public_wording",
			"values",
		],
		"snapshot",
	);
	if (snapshot.schema_version !== 1) fail("snapshot.schema_version must be 1");
	requireString(snapshot.snapshot_id, "snapshot.snapshot_id");
	requireIsoCalendarDate(snapshot.as_of, "snapshot.as_of");
	if (snapshot.refresh_state !== "independently-reproduced") {
		fail("snapshot.refresh_state must be independently-reproduced");
	}
	if (snapshot.lifecycle_state !== "active") {
		fail("the happy-path snapshot lifecycle_state must be active");
	}

	requireExactKeys(
		snapshot.measurement_window,
		["start", "end", "days"],
		"snapshot.measurement_window",
	);
	const { start, end, days } = snapshot.measurement_window;
	const startInclusive = requireIsoCalendarDate(start, "snapshot.measurement_window.start");
	const endInclusive = requireIsoCalendarDate(end, "snapshot.measurement_window.end");
	if (!Number.isInteger(days) || days < 30) {
		fail("public operational windows shorter than 30 days are forbidden");
	}
	if (days !== 90 || inclusiveWindowDays(startInclusive, endInclusive) !== 90) {
		fail("all headline groups must share one inclusive 90-day window");
	}
	if (snapshot.as_of !== end) {
		fail("snapshot.as_of must match the measurement window end date");
	}

	requireExactKeys(snapshot.public_wording, ["title", "summary"], "public_wording");
	requireString(snapshot.public_wording.title, "public_wording.title");
	requireString(snapshot.public_wording.summary, "public_wording.summary");

	requireRecord(snapshot.values, "snapshot.values");
	const valueIds = Object.keys(snapshot.values).sort();
	const definitionIds = [...metricIds].sort();
	if (JSON.stringify(valueIds) !== JSON.stringify(definitionIds)) {
		fail("snapshot values must match every defined metric exactly");
	}

	for (const metricId of definitionIds) {
		const measuredValue = snapshot.values[metricId];
		if (measuredValue?.value === null) {
			if (metricId !== DURABLE_RECORD_COVERAGE_METRIC_ID) {
				fail(`only ${DURABLE_RECORD_COVERAGE_METRIC_ID} may be not_measurable`);
			}
			requireExactKeys(
				measuredValue,
				[
					"value",
					"verification_state",
					"reason",
					"evidence_start",
					"eligibility_rule",
					"receipt_ref",
				],
				`value ${metricId}`,
			);
			if (measuredValue.verification_state !== "not_measurable") {
				fail(`value ${metricId}.verification_state must be not_measurable`);
			}
			requireString(measuredValue.reason, `value ${metricId}.reason`);
			if (measuredValue.evidence_start !== null) {
				requireIsoCalendarDate(measuredValue.evidence_start, `value ${metricId}.evidence_start`);
			}
			requireString(measuredValue.eligibility_rule, `value ${metricId}.eligibility_rule`);
		} else {
			requireExactKeys(measuredValue, ["value", "receipt_ref"], `value ${metricId}`);
			if (typeof measuredValue.value !== "number" || !Number.isFinite(measuredValue.value)) {
				fail(`value ${metricId}.value must be a finite number`);
			}
		}
		if (!OPAQUE_RECEIPT_ID.test(measuredValue.receipt_ref)) {
			fail(`value ${metricId}.receipt_ref must be an opaque receipt identifier`);
		}
	}
}

function validateMetricValueMap(rawOutput, label) {
	requireRecord(rawOutput, label);
	const entries = Object.entries(rawOutput);
	if (entries.length === 0) fail(`${label} must contain reproduced metric values`);
	for (const [metricId, value] of entries) {
		requireString(metricId, `${label} metric id`);
		if (typeof value !== "number" || !Number.isFinite(value)) {
			fail(`${label}.${metricId} must be a finite number`);
		}
	}
	return rawOutput;
}

function requireIsoTimestamp(value, label) {
	requireString(value, label);
	const parsedTimestamp = Date.parse(value);
	const normalizedInput =
		value.endsWith("Z") && !value.includes(".") ? value.replace(/Z$/u, ".000Z") : value;
	if (
		!ISO_TIMESTAMP.test(value) ||
		!Number.isFinite(parsedTimestamp) ||
		new Date(parsedTimestamp).toISOString() !== normalizedInput
	) {
		fail(`${label} must be an ISO-8601 UTC timestamp`);
	}
	return parsedTimestamp;
}

function requireNonnegativeInteger(value, label) {
	if (!Number.isInteger(value) || value < 0) {
		fail(`${label} must be a non-negative integer`);
	}
	return value;
}

function requireMatchingMeasurementWindow(measurementWindow, label, snapshotWindow) {
	requireExactKeys(measurementWindow, ["start", "end"], label);
	const { start, end } = measurementWindow;
	const startInclusive = requireIsoCalendarDate(start, `${label}.start`);
	const endInclusive = requireIsoCalendarDate(end, `${label}.end`);
	if (start !== snapshotWindow.start || end !== snapshotWindow.end) {
		fail(`${label} must match the snapshot measurement window`);
	}
	return {
		startInclusive,
		endExclusive: endInclusive + 86_400_000,
	};
}

function median(values) {
	const ordered = [...values].sort((left, right) => left - right);
	const midpoint = Math.floor(ordered.length / 2);
	return ordered.length % 2 === 1
		? ordered[midpoint]
		: (ordered[midpoint - 1] + ordered[midpoint]) / 2;
}

function calculateIssueFlowMetrics(rawOutput, label, snapshotWindow) {
	requireExactKeys(rawOutput, ["kind", "measurement_window", "issues", "open_backlog"], label);
	if (rawOutput.kind !== "issue-flow-v1") fail(`${label}.kind must be issue-flow-v1`);
	const { startInclusive, endExclusive } = requireMatchingMeasurementWindow(
		rawOutput.measurement_window,
		`${label}.measurement_window`,
		snapshotWindow,
	);

	if (!Array.isArray(rawOutput.issues)) fail(`${label}.issues must be an array`);
	const issueIds = new Set();
	const issues = rawOutput.issues.map((issue, index) => {
		const issueLabel = `${label}.issues[${index}]`;
		requireExactKeys(issue, ["issue_id", "created_at", "closed_at"], issueLabel);
		const issueId = requireString(issue.issue_id, `${issueLabel}.issue_id`);
		if (!OPAQUE_ISSUE_ID.test(issueId)) {
			fail(`${issueLabel}.issue_id must be an opaque issue identity`);
		}
		if (issueIds.has(issueId)) fail(`${label} contains duplicate issue identity ${issueId}`);
		issueIds.add(issueId);
		const createdAt = requireIsoTimestamp(issue.created_at, `${issueLabel}.created_at`);
		let closedAt = null;
		if (issue.closed_at !== null) {
			closedAt = requireIsoTimestamp(issue.closed_at, `${issueLabel}.closed_at`);
			if (closedAt < createdAt) fail(`${issueLabel}.closed_at cannot precede created_at`);
		}
		return { createdAt, closedAt };
	});

	const createdCohort = issues.filter(
		(issue) => issue.createdAt >= startInclusive && issue.createdAt < endExclusive,
	);
	if (createdCohort.length === 0) fail(`${label} created cohort cannot be empty`);
	const closedCohort = createdCohort.filter(
		(issue) => issue.closedAt !== null && issue.closedAt < endExclusive,
	);
	if (closedCohort.length === 0) fail(`${label} closed cohort cannot be empty`);

	requireExactKeys(rawOutput.open_backlog, ["window_start", "window_end"], `${label}.open_backlog`);
	const openingBacklog = requireNonnegativeInteger(
		rawOutput.open_backlog.window_start,
		`${label}.open_backlog.window_start`,
	);
	const closingBacklog = requireNonnegativeInteger(
		rawOutput.open_backlog.window_end,
		`${label}.open_backlog.window_end`,
	);
	const closeDurations = closedCohort.map(
		(issue) => (issue.closedAt - issue.createdAt) / 86_400_000,
	);

	return {
		"issue-flow.created-count": createdCohort.length,
		"issue-flow.cohort-closure-percentage":
			Math.round((closedCohort.length / createdCohort.length) * 1000) / 10,
		"issue-flow.median-close-time": median(closeDurations),
		"issue-flow.net-backlog-change": closingBacklog - openingBacklog,
	};
}

function calculateChangeTraceabilityMetrics(rawOutput, label, snapshotWindow) {
	requireExactKeys(rawOutput, ["kind", "measurement_window", "valid_issue_ids", "commits"], label);
	if (rawOutput.kind !== "change-traceability-v1") {
		fail(`${label}.kind must be change-traceability-v1`);
	}

	const { startInclusive, endExclusive } = requireMatchingMeasurementWindow(
		rawOutput.measurement_window,
		`${label}.measurement_window`,
		snapshotWindow,
	);

	if (!Array.isArray(rawOutput.valid_issue_ids)) {
		fail(`${label}.valid_issue_ids must be an array`);
	}
	const validIssueIds = new Set();
	for (const [issueIndex, issueId] of rawOutput.valid_issue_ids.entries()) {
		if (!OPAQUE_ISSUE_ID.test(issueId)) {
			fail(`${label}.valid_issue_ids[${issueIndex}] must be an opaque issue identity`);
		}
		if (validIssueIds.has(issueId)) {
			fail(`${label}.valid_issue_ids contains duplicate issue identity ${issueId}`);
		}
		validIssueIds.add(issueId);
	}

	if (!Array.isArray(rawOutput.commits)) fail(`${label}.commits must be an array`);
	const commitIds = new Set();
	const commits = rawOutput.commits.map((commit, commitIndex) => {
		const commitLabel = `${label}.commits[${commitIndex}]`;
		requireExactKeys(
			commit,
			["commit_id", "committed_at", "classification", "issue_references"],
			commitLabel,
		);
		const commitId = requireString(commit.commit_id, `${commitLabel}.commit_id`);
		if (!OPAQUE_COMMIT_ID.test(commitId)) {
			fail(`${commitLabel}.commit_id must be an opaque commit identity`);
		}
		if (commitIds.has(commitId)) fail(`${label} contains duplicate commit identity ${commitId}`);
		commitIds.add(commitId);

		const committedAt = requireIsoTimestamp(commit.committed_at, `${commitLabel}.committed_at`);
		if (!new Set(["scheduled-maintenance", "non-maintenance"]).has(commit.classification)) {
			fail(`${commitLabel}.classification must be scheduled-maintenance or non-maintenance`);
		}
		if (!Array.isArray(commit.issue_references)) {
			fail(`${commitLabel}.issue_references must be an array`);
		}
		const issueReferences = new Set();
		for (const [referenceIndex, issueId] of commit.issue_references.entries()) {
			if (!OPAQUE_ISSUE_ID.test(issueId)) {
				fail(`${commitLabel}.issue_references[${referenceIndex}] must be an opaque issue identity`);
			}
			if (issueReferences.has(issueId)) {
				fail(`${commitLabel}.issue_references contains duplicate issue identity ${issueId}`);
			}
			issueReferences.add(issueId);
		}

		return { committedAt, classification: commit.classification, issueReferences };
	});

	const trunkCommits = commits.filter(
		(commit) => commit.committedAt >= startInclusive && commit.committedAt < endExclusive,
	);
	if (trunkCommits.length === 0) fail(`${label} in-window trunk commit set cannot be empty`);
	const scheduledMaintenanceCommits = trunkCommits.filter(
		(commit) => commit.classification === "scheduled-maintenance",
	);
	const nonMaintenanceCommits = trunkCommits.filter(
		(commit) => commit.classification === "non-maintenance",
	);
	if (nonMaintenanceCommits.length === 0) {
		fail(`${label} non-maintenance denominator cannot be empty`);
	}
	const coveredCommits = nonMaintenanceCommits.filter((commit) =>
		[...commit.issueReferences].some((issueId) => validIssueIds.has(issueId)),
	);
	const representedIssues = new Set(
		coveredCommits.flatMap((commit) =>
			[...commit.issueReferences].filter((issueId) => validIssueIds.has(issueId)),
		),
	);

	return {
		"change-traceability.trunk-commits": trunkCommits.length,
		"change-traceability.scheduled-maintenance-commits": scheduledMaintenanceCommits.length,
		"change-traceability.issue-reference-coverage":
			Math.round((coveredCommits.length / nonMaintenanceCommits.length) * 1000) / 10,
		"change-traceability.distinct-issues": representedIssues.size,
	};
}

function calculateDurableRecordCoverageResult(rawOutput, label, snapshotWindow) {
	requireExactKeys(
		rawOutput,
		["kind", "measurement_window", "scoped_sessions", "durable_records"],
		label,
	);
	if (rawOutput.kind !== "durable-record-coverage-v1") {
		fail(`${label}.kind must be durable-record-coverage-v1`);
	}

	const { startInclusive, endExclusive } = requireMatchingMeasurementWindow(
		rawOutput.measurement_window,
		`${label}.measurement_window`,
		snapshotWindow,
	);

	if (!Array.isArray(rawOutput.scoped_sessions)) {
		fail(`${label}.scoped_sessions must be an array`);
	}
	const scopedSessions = new Map();
	for (const [sessionIndex, session] of rawOutput.scoped_sessions.entries()) {
		const sessionLabel = `${label}.scoped_sessions[${sessionIndex}]`;
		requireExactKeys(session, ["session_id", "started_at"], sessionLabel);
		const sessionId = requireString(session.session_id, `${sessionLabel}.session_id`);
		if (!OPAQUE_SESSION_ID.test(sessionId)) {
			fail(`${sessionLabel}.session_id must be an opaque session identity`);
		}
		if (scopedSessions.has(sessionId)) {
			fail(`${label}.scoped_sessions contains duplicate session identity ${sessionId}`);
		}
		scopedSessions.set(
			sessionId,
			requireIsoTimestamp(session.started_at, `${sessionLabel}.started_at`),
		);
	}

	const denominatorSessionIds = new Set(
		[...scopedSessions]
			.filter(([, startedAt]) => startedAt >= startInclusive && startedAt < endExclusive)
			.map(([sessionId]) => sessionId),
	);
	if (denominatorSessionIds.size === 0) {
		fail(`${label} reproducible scoped-session denominator cannot be empty`);
	}

	if (!Array.isArray(rawOutput.durable_records)) {
		fail(`${label}.durable_records must be an array`);
	}
	const recordIds = new Set();
	const coveredSessionIds = new Set();
	for (const [recordIndex, record] of rawOutput.durable_records.entries()) {
		const recordLabel = `${label}.durable_records[${recordIndex}]`;
		requireExactKeys(
			record,
			["record_id", "session_id", "recorded_at", "record_type"],
			recordLabel,
		);
		const recordId = requireString(record.record_id, `${recordLabel}.record_id`);
		if (!OPAQUE_RECORD_ID.test(recordId)) {
			fail(`${recordLabel}.record_id must be an opaque durable-record identity`);
		}
		if (recordIds.has(recordId)) {
			fail(`${label}.durable_records contains duplicate record identity ${recordId}`);
		}
		recordIds.add(recordId);

		const sessionId = requireString(record.session_id, `${recordLabel}.session_id`);
		if (!OPAQUE_SESSION_ID.test(sessionId)) {
			fail(`${recordLabel}.session_id must be an opaque session identity`);
		}
		const recordedAt = requireIsoTimestamp(record.recorded_at, `${recordLabel}.recorded_at`);
		if (!new Set(["decision", "finding"]).has(record.record_type)) {
			fail(`${recordLabel}.record_type must be decision or finding`);
		}
		const sessionStartedAt = scopedSessions.get(sessionId);
		if (sessionStartedAt !== undefined && recordedAt < sessionStartedAt) {
			fail(`${recordLabel}.recorded_at cannot precede its scoped session`);
		}

		if (
			denominatorSessionIds.has(sessionId) &&
			recordedAt >= startInclusive &&
			recordedAt < endExclusive
		) {
			coveredSessionIds.add(sessionId);
		}
	}

	return {
		metricValues: {
			[DURABLE_RECORD_COVERAGE_METRIC_ID]:
				Math.round((coveredSessionIds.size / denominatorSessionIds.size) * 1000) / 10,
		},
		durableRecordDenominatorIdentity: [...denominatorSessionIds].sort(),
		unavailableValues: {},
	};
}

function optionalIsoCalendarDate(value, label) {
	if (value === null) return null;
	requireIsoCalendarDate(value, label);
	return value;
}

function calculateDurableRecordReadinessResult(rawOutput, label, snapshotWindow) {
	requireExactKeys(
		rawOutput,
		[
			"kind",
			"measurement_window",
			"verification_state",
			"reason",
			"evidence_start",
			"eligibility_rule",
			"denominator_checks",
		],
		label,
	);
	if (rawOutput.kind !== "durable-record-readiness-v1") {
		fail(`${label}.kind must be durable-record-readiness-v1`);
	}
	requireMatchingMeasurementWindow(
		rawOutput.measurement_window,
		`${label}.measurement_window`,
		snapshotWindow,
	);
	if (rawOutput.verification_state !== "not_measurable") {
		fail(`${label}.verification_state must be not_measurable`);
	}
	requireString(rawOutput.reason, `${label}.reason`);
	optionalIsoCalendarDate(rawOutput.evidence_start, `${label}.evidence_start`);
	requireString(rawOutput.eligibility_rule, `${label}.eligibility_rule`);
	if (!Array.isArray(rawOutput.denominator_checks) || rawOutput.denominator_checks.length === 0) {
		fail(`${label}.denominator_checks must be a non-empty array`);
	}

	let hasIncompleteWindow = false;
	let hasUnstableSessionIdentity = false;
	const observedSources = new Set();
	for (const [checkIndex, check] of rawOutput.denominator_checks.entries()) {
		const checkLabel = `${label}.denominator_checks[${checkIndex}]`;
		requireExactKeys(
			check,
			["source", "evidence_start", "complete_window", "stable_session_identity", "observations"],
			checkLabel,
		);
		if (
			!new Set(["typed-session-lifecycle", "durable-decision-finding-records"]).has(check.source)
		) {
			fail(`${checkLabel}.source is not a controlled denominator source`);
		}
		if (observedSources.has(check.source)) fail(`${label} repeats source ${check.source}`);
		observedSources.add(check.source);
		optionalIsoCalendarDate(check.evidence_start, `${checkLabel}.evidence_start`);
		if (typeof check.complete_window !== "boolean") {
			fail(`${checkLabel}.complete_window must be boolean`);
		}
		if (typeof check.stable_session_identity !== "boolean") {
			fail(`${checkLabel}.stable_session_identity must be boolean`);
		}
		hasIncompleteWindow ||= !check.complete_window;
		hasUnstableSessionIdentity ||= !check.stable_session_identity;

		if (check.source === "typed-session-lifecycle") {
			requireExactKeys(
				check.observations,
				["row_count", "unique_session_ids", "first_event_at", "last_event_at"],
				`${checkLabel}.observations`,
			);
			const rowCount = requireNonnegativeInteger(
				check.observations.row_count,
				`${checkLabel}.observations.row_count`,
			);
			const uniqueSessionIds = requireNonnegativeInteger(
				check.observations.unique_session_ids,
				`${checkLabel}.observations.unique_session_ids`,
			);
			requireIsoTimestamp(
				check.observations.first_event_at,
				`${checkLabel}.observations.first_event_at`,
			);
			requireIsoTimestamp(
				check.observations.last_event_at,
				`${checkLabel}.observations.last_event_at`,
			);
			if (rowCount === 0 || uniqueSessionIds === 0 || uniqueSessionIds > rowCount) {
				fail(`${checkLabel}.observations does not establish complete lifecycle identities`);
			}
			if (
				check.evidence_start !== check.observations.first_event_at.slice(0, 10) ||
				rawOutput.evidence_start !== check.evidence_start
			) {
				fail(`${checkLabel} does not bind the public evidence-start date`);
			}
		} else {
			requireExactKeys(
				check.observations,
				[
					"complete_identity_sessions",
					"complete_with_capture_document",
					"complete_with_produced_touch",
					"surrogate_sessions",
					"surrogate_with_capture_document",
				],
				`${checkLabel}.observations`,
			);
			for (const [field, value] of Object.entries(check.observations)) {
				requireNonnegativeInteger(value, `${checkLabel}.observations.${field}`);
			}
			if (
				check.observations.complete_identity_sessions === 0 ||
				check.observations.complete_with_capture_document !== 0 ||
				check.observations.complete_with_produced_touch !== 0 ||
				check.observations.surrogate_sessions === 0 ||
				check.observations.surrogate_with_capture_document !== check.observations.surrogate_sessions
			) {
				fail(`${checkLabel}.observations does not establish the native identity join gap`);
			}
		}
	}
	if (observedSources.size !== 2 || !hasIncompleteWindow || !hasUnstableSessionIdentity) {
		fail(`${label} does not prove the scoped-session denominator gap`);
	}

	return {
		metricValues: {},
		durableRecordDenominatorIdentity: null,
		unavailableValues: {
			[DURABLE_RECORD_COVERAGE_METRIC_ID]: {
				value: null,
				verification_state: rawOutput.verification_state,
				reason: rawOutput.reason,
				evidence_start: rawOutput.evidence_start,
				eligibility_rule: rawOutput.eligibility_rule,
			},
		},
	};
}

function metricResultFromReceiptOutput(rawOutput, label, snapshotWindow) {
	requireRecord(rawOutput, label);
	if (Object.hasOwn(rawOutput, "kind")) {
		if (rawOutput.kind === "issue-flow-v1") {
			return {
				metricValues: calculateIssueFlowMetrics(rawOutput, label, snapshotWindow),
				durableRecordDenominatorIdentity: null,
				unavailableValues: {},
			};
		}
		if (rawOutput.kind === "change-traceability-v1") {
			return {
				metricValues: calculateChangeTraceabilityMetrics(rawOutput, label, snapshotWindow),
				durableRecordDenominatorIdentity: null,
				unavailableValues: {},
			};
		}
		if (rawOutput.kind === "durable-record-coverage-v1") {
			return calculateDurableRecordCoverageResult(rawOutput, label, snapshotWindow);
		}
		if (rawOutput.kind === "durable-record-readiness-v1") {
			return calculateDurableRecordReadinessResult(rawOutput, label, snapshotWindow);
		}
		fail(`${label}.kind is not supported`);
	}
	const metricValues = validateMetricValueMap(rawOutput, label);
	if (Object.keys(metricValues).some((metricId) => metricId.startsWith("change-traceability."))) {
		fail(`${label} change-traceability receipts must use controlled change evidence`);
	}
	if (
		Object.keys(metricValues).some((metricId) => metricId.startsWith("durable-record-coverage."))
	) {
		fail(`${label} durable-record-coverage receipts must use controlled session evidence`);
	}
	return {
		metricValues,
		durableRecordDenominatorIdentity: null,
		unavailableValues: {},
	};
}

function validatePrivateReceipt(privateReceipt, receiptId, label, snapshotWindow) {
	requireExactKeys(privateReceipt, ["receipt_id", "primary", "independent_reproduction"], label);
	if (privateReceipt.receipt_id !== receiptId) {
		fail(`${label} id does not match the manifest`);
	}

	requireExactKeys(
		privateReceipt.primary,
		["exact_command", "raw_output", "private_source_identity", "local_path"],
		`${label}.primary`,
	);
	requireString(privateReceipt.primary.exact_command, `${label}.primary.exact_command`);
	requireString(
		privateReceipt.primary.private_source_identity,
		`${label}.primary.private_source_identity`,
	);
	const localPath = requireString(privateReceipt.primary.local_path, `${label}.primary.local_path`);
	if (!/^(?:[a-zA-Z]:[\\/]|\/)/u.test(localPath)) {
		fail(`${label}.primary.local_path must be an absolute private path`);
	}
	const primaryMetricResult = metricResultFromReceiptOutput(
		privateReceipt.primary.raw_output,
		`${label}.primary.raw_output`,
		snapshotWindow,
	);

	requireExactKeys(
		privateReceipt.independent_reproduction,
		["exact_command", "raw_output", "reproduced_by"],
		`${label}.independent_reproduction`,
	);
	requireString(
		privateReceipt.independent_reproduction.exact_command,
		`${label}.independent_reproduction.exact_command`,
	);
	requireString(
		privateReceipt.independent_reproduction.reproduced_by,
		`${label}.independent_reproduction.reproduced_by`,
	);
	const reproductionMetricResult = metricResultFromReceiptOutput(
		privateReceipt.independent_reproduction.raw_output,
		`${label}.independent_reproduction.raw_output`,
		snapshotWindow,
	);
	if (
		primaryMetricResult.durableRecordDenominatorIdentity !== null &&
		reproductionMetricResult.durableRecordDenominatorIdentity !== null &&
		canonicalHash(primaryMetricResult.durableRecordDenominatorIdentity) !==
			canonicalHash(reproductionMetricResult.durableRecordDenominatorIdentity)
	) {
		fail(`${label} scoped-session denominator is not independently reproducible`);
	}

	const primaryResultHash = canonicalHash(privateReceipt.primary.raw_output);
	const reproductionResultHash = canonicalHash(privateReceipt.independent_reproduction.raw_output);
	if (primaryResultHash !== reproductionResultHash) {
		fail(`${label} independent reproduction does not match the primary raw output`);
	}
	if (
		canonicalHash(primaryMetricResult.metricValues) !==
		canonicalHash(reproductionMetricResult.metricValues)
	) {
		fail(`${label} independent reproduction does not reproduce the derived metric values`);
	}
	if (
		canonicalHash(primaryMetricResult.unavailableValues) !==
		canonicalHash(reproductionMetricResult.unavailableValues)
	) {
		fail(`${label} independent reproduction does not reproduce the readiness assertion`);
	}

	return {
		metricValues: primaryMetricResult.metricValues,
		resultSha256: primaryResultHash,
		unavailableValues: primaryMetricResult.unavailableValues,
	};
}

function validateReceipts(manifest, receiptsDirectory, snapshotValues, snapshotWindow) {
	requireExactKeys(manifest, ["schema_version", "receipts"], "receipt manifest");
	if (manifest.schema_version !== 1) fail("receipt manifest schema_version must be 1");
	if (!Array.isArray(manifest.receipts)) fail("receipt manifest receipts must be an array");

	const absoluteReceiptsDirectory = path.resolve(receiptsDirectory);
	const verifiedReceipts = new Map();
	for (const [index, receipt] of manifest.receipts.entries()) {
		const label = `receipt manifest entry ${index}`;
		requireExactKeys(receipt, ["id", "file", "sha256", "independent_reproduction"], label);
		if (!OPAQUE_RECEIPT_ID.test(receipt.id)) fail(`${label}.id is not opaque`);
		if (receipt.file !== `${receipt.id}.json`) {
			fail(`${label}.file must be the opaque receipt id plus .json`);
		}
		if (!SHA256.test(receipt.sha256)) fail(`${label}.sha256 must be a full SHA-256`);
		requireExactKeys(
			receipt.independent_reproduction,
			["status", "result_sha256"],
			`${label}.independent_reproduction`,
		);
		if (receipt.independent_reproduction.status !== "matched") {
			fail(`${label} was not independently reproduced`);
		}
		if (!SHA256.test(receipt.independent_reproduction.result_sha256)) {
			fail(`${label} independent reproduction result must have a full SHA-256`);
		}

		const receiptPath = path.resolve(absoluteReceiptsDirectory, receipt.file);
		if (path.dirname(receiptPath) !== absoluteReceiptsDirectory) {
			fail(`${label}.file escapes the private receipt directory`);
		}
		const privateReceipt = readJson(receiptPath, `private receipt ${receipt.id}`);
		if (sha256(privateReceipt.bytes) !== receipt.sha256) {
			fail(`${label} full-file hash does not match its private receipt`);
		}
		const validatedReceipt = validatePrivateReceipt(
			privateReceipt.value,
			receipt.id,
			`private receipt ${receipt.id}`,
			snapshotWindow,
		);
		if (validatedReceipt.resultSha256 !== receipt.independent_reproduction.result_sha256) {
			fail(`${label} reproduced result hash does not match the private receipt`);
		}

		verifiedReceipts.set(receipt.id, {
			publicReference: {
				id: receipt.id,
				sha256: receipt.sha256,
			},
			metricValues: validatedReceipt.metricValues,
			unavailableValues: validatedReceipt.unavailableValues,
		});
	}

	for (const [metricId, measuredValue] of Object.entries(snapshotValues)) {
		const verifiedReceipt = verifiedReceipts.get(measuredValue.receipt_ref);
		if (!verifiedReceipt) {
			fail(`receipt reference ${measuredValue.receipt_ref} is unresolved`);
		}
		if (measuredValue.value === null) {
			const expectedUnavailable = { ...measuredValue };
			delete expectedUnavailable.receipt_ref;
			if (
				!Object.hasOwn(verifiedReceipt.unavailableValues, metricId) ||
				canonicalHash(verifiedReceipt.unavailableValues[metricId]) !==
					canonicalHash(expectedUnavailable)
			) {
				fail(`receipt ${measuredValue.receipt_ref} does not reproduce ${metricId} readiness`);
			}
		} else if (
			!Object.hasOwn(verifiedReceipt.metricValues, metricId) ||
			verifiedReceipt.metricValues[metricId] !== measuredValue.value
		) {
			fail(`receipt ${measuredValue.receipt_ref} does not reproduce ${metricId}`);
		}
	}

	return verifiedReceipts;
}

function collectPublicNarrative(definitions, snapshot) {
	return [
		snapshot.public_wording.title,
		snapshot.public_wording.summary,
		...definitions.groups.flatMap((group) => [
			group.label,
			...group.metrics.flatMap((metric) =>
				definitionFieldsForGroup(group.id).map((field) => metric[field]),
			),
		]),
	];
}

function collectPublicSourceUrls(narrative) {
	return [
		...new Set(
			narrative.flatMap((text) =>
				[...(text.match(PUBLIC_URL) ?? [])].map((url) => url.replace(/[),.;!?]+$/u, "")),
			),
		),
	].sort();
}

function buildPublicProjection(definitions, snapshot, verifiedReceipts) {
	const publicProjection = {
		schema_version: 1,
		snapshot_id: snapshot.snapshot_id,
		as_of: snapshot.as_of,
		measurement_window: snapshot.measurement_window,
		lifecycle_state: snapshot.lifecycle_state,
		verification_state: snapshot.refresh_state,
		public_wording: snapshot.public_wording,
		groups: definitions.groups.map((group) => {
			const publicGroup = {
				id: group.id,
				label: group.label,
				metrics: group.metrics.map((definition) => {
					const measuredValue = snapshot.values[definition.id];
					return {
						...definition,
						value: measuredValue.value,
						as_of: snapshot.as_of,
						measurement_window: snapshot.measurement_window,
						refresh_state:
							measuredValue.value === null
								? measuredValue.verification_state
								: snapshot.refresh_state,
						receipt: verifiedReceipts.get(measuredValue.receipt_ref).publicReference,
					};
				}),
			};
			const unavailableValue = group.metrics
				.map((definition) => snapshot.values[definition.id])
				.find((measuredValue) => measuredValue.value === null);
			if (unavailableValue) {
				Object.assign(publicGroup, {
					verification_state: unavailableValue.verification_state,
					value: null,
					reason: unavailableValue.reason,
					evidence_start: unavailableValue.evidence_start,
					eligibility_rule: unavailableValue.eligibility_rule,
					receipt: verifiedReceipts.get(unavailableValue.receipt_ref).publicReference,
				});
			}
			return publicGroup;
		}),
	};

	assertPublicProjectionPrivacy(publicProjection, fail);
	return publicProjection;
}

function validateReleaseDecision(approval, definitions, snapshot, publicBytes) {
	requireExactKeys(
		approval,
		["status", "approved_by", "approved_on", "privacy_review", "binding"],
		"approval",
	);
	if (!new Set(["approved", "proposal"]).has(approval.status)) {
		fail("approval.status must be approved or proposal");
	}
	const isProposal = approval.status === "proposal";
	if (isProposal) {
		if (approval.approved_by !== null) {
			failProposal("approval.approved_by must be null");
		}
		if (approval.approved_on !== null) {
			failProposal("approval.approved_on must be null");
		}
	} else {
		if (approval.approved_by !== "eriknorris") {
			fail("approval.approved_by must be eriknorris");
		}
		if (!ISO_DATE.test(approval.approved_on)) {
			fail("approval.approved_on must be YYYY-MM-DD");
		}
	}

	requireExactKeys(
		approval.privacy_review,
		[
			"status",
			"reviewed_by",
			"reviewed_on",
			"public_narrative_sha256",
			"approved_public_source_urls",
		],
		"approval.privacy_review",
	);
	if (isProposal) {
		if (approval.privacy_review.status !== "proposal") {
			failProposal("approval.privacy_review.status must be proposal");
		}
		if (approval.privacy_review.reviewed_by !== null) {
			failProposal("approval.privacy_review.reviewed_by must be null");
		}
		if (approval.privacy_review.reviewed_on !== null) {
			failProposal("approval.privacy_review.reviewed_on must be null");
		}
	} else {
		if (approval.privacy_review.status !== "approved") {
			fail("approval.privacy_review.status must be approved");
		}
		if (approval.privacy_review.reviewed_by !== "eriknorris") {
			fail("approval.privacy_review.reviewed_by must be eriknorris");
		}
		if (!ISO_DATE.test(approval.privacy_review.reviewed_on)) {
			fail("approval.privacy_review.reviewed_on must be YYYY-MM-DD");
		}
	}
	if (!SHA256.test(approval.privacy_review.public_narrative_sha256)) {
		fail("approval.privacy_review.public_narrative_sha256 must be a full SHA-256");
	}
	if (!Array.isArray(approval.privacy_review.approved_public_source_urls)) {
		fail("approval.privacy_review.approved_public_source_urls must be an array");
	}

	const publicNarrative = collectPublicNarrative(definitions, snapshot);
	const expectedNarrativeHash = canonicalHash(publicNarrative);
	if (approval.privacy_review.public_narrative_sha256 !== expectedNarrativeHash) {
		fail(
			`privacy review does not match the exact public narrative: expected ${expectedNarrativeHash}, received ${approval.privacy_review.public_narrative_sha256}`,
		);
	}
	const approvedPublicSourceUrls = approval.privacy_review.approved_public_source_urls;
	for (const [urlIndex, url] of approvedPublicSourceUrls.entries()) {
		requireString(url, `approval.privacy_review.approved_public_source_urls[${urlIndex}]`);
		try {
			if (new URL(url).protocol !== "https:")
				fail(`approved public source URL must use HTTPS: ${url}`);
		} catch (error) {
			if (error.message.startsWith("[snapshot-contract]")) throw error;
			fail(`approved public source URL is invalid: ${url}`);
		}
	}
	const expectedPublicSourceUrls = collectPublicSourceUrls(publicNarrative);
	if (isProposal && expectedPublicSourceUrls.length > 0) {
		failProposal("public source URLs require explicit privacy approval");
	}
	if (JSON.stringify(approvedPublicSourceUrls) !== JSON.stringify(expectedPublicSourceUrls)) {
		const message = `approved public source URLs must exactly match the public narrative: expected ${expectedPublicSourceUrls.join(", ") || "none"}`;
		isProposal ? failProposal(message) : fail(message);
	}

	requireExactKeys(
		approval.binding,
		[
			"definitions_sha256",
			"values_sha256",
			"public_wording_sha256",
			"as_of",
			"public_projection_sha256",
		],
		"approval.binding",
	);
	const expectedBindings = {
		definitions_sha256: canonicalHash(definitions),
		values_sha256: canonicalHash(snapshot.values),
		public_wording_sha256: canonicalHash(snapshot.public_wording),
		as_of: snapshot.as_of,
		public_projection_sha256: sha256(publicBytes),
	};

	for (const [bindingName, expectedValue] of Object.entries(expectedBindings)) {
		if (approval.binding[bindingName] !== expectedValue) {
			failProposal(
				`approval binding ${bindingName} does not match the approved content: expected ${expectedValue}, received ${approval.binding[bindingName]}`,
			);
		}
	}
}

function writeAtomically(outputPath, bytes) {
	const outputDirectory = path.dirname(outputPath);
	fs.mkdirSync(outputDirectory, { recursive: true });
	const temporaryPath = path.join(
		outputDirectory,
		`.${path.basename(outputPath)}.${process.pid}.tmp`,
	);

	try {
		fs.writeFileSync(temporaryPath, bytes, { flag: "wx" });
		fs.renameSync(temporaryPath, outputPath);
	} finally {
		if (fs.existsSync(temporaryPath)) fs.rmSync(temporaryPath, { force: true });
	}
}

function validateOutputDestination(outputPath, releaseState) {
	if (releaseState !== "proposal") return;
	const relativePath = path.relative(PUBLIC_PULSE_DATA_DIRECTORY, outputPath);
	const targetsPublicPulseData =
		relativePath === "" ||
		(relativePath !== ".." &&
			!relativePath.startsWith(`..${path.sep}`) &&
			!path.isAbsolute(relativePath));
	if (targetsPublicPulseData) {
		failProposal("output must not target the public Pulse data directory");
	}
}

function main() {
	const argumentsByName = parseArguments(process.argv.slice(2));
	const definitions = readJson(argumentsByName.definitions, "canon definitions").value;
	const snapshot = readJson(argumentsByName.snapshot, "canon snapshot").value;
	const approval = readJson(argumentsByName.approval, "canon approval").value;
	const receiptManifest = readJson(
		argumentsByName["receipt-manifest"],
		"private receipt manifest",
	).value;

	const metricIds = validateDefinitions(definitions);
	validateSnapshot(snapshot, metricIds);
	const verifiedReceipts = validateReceipts(
		receiptManifest,
		argumentsByName["receipts-dir"],
		snapshot.values,
		snapshot.measurement_window,
	);
	const publicProjection = buildPublicProjection(definitions, snapshot, verifiedReceipts);
	const publicBytes = Buffer.from(stableJson(publicProjection), "utf8");
	validateReleaseDecision(approval, definitions, snapshot, publicBytes);
	validateOutputDestination(argumentsByName.output, approval.status);
	writeAtomically(argumentsByName.output, publicBytes);

	console.log(
		`[snapshot-contract] effective_state=${approval.status}; projected ${metricIds.size} metrics in ${REQUIRED_GROUP_IDS.length} groups; sha256=${sha256(publicBytes)}`,
	);
}

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
