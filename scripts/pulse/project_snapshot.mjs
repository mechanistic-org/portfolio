import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

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
const REQUIRED_ARGUMENTS = [
	"definitions",
	"snapshot",
	"approval",
	"receipt-manifest",
	"receipts-dir",
	"output",
];
const OPAQUE_RECEIPT_ID = /^rct_[a-f0-9]{32}$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;
const PUBLIC_SOURCE_CLASSES = new Set(["issue-tracker", "version-control", "session-registry"]);
const PRIVATE_PUBLIC_KEYS = new Set([
	"command",
	"exact_command",
	"raw_output",
	"private_source_identity",
	"local_path",
	"person",
	"person_id",
	"customer",
	"customer_id",
	"transcript",
	"prompt",
	"session_id",
	"private_repository",
	"confidential",
]);
const PRIVATE_PUBLIC_TEXT_PATTERNS = [
	{ pattern: /^[a-zA-Z]:[\\/]/u, description: "a local drive path" },
	{ pattern: /^\\\\/u, description: "a UNC path" },
	{
		pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu,
		description: "an email identity",
	},
];
const PUBLIC_URL = /\bhttps:\/\/[^\s<>"']+/giu;

function fail(message) {
	throw new Error(`[snapshot-contract] ${message}`);
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
			requireExactKeys(metric, REQUIRED_DEFINITION_FIELDS, metricLabel);
			for (const field of REQUIRED_DEFINITION_FIELDS) {
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

function inclusiveWindowDays(start, end) {
	const startDate = Date.parse(`${start}T00:00:00Z`);
	const endDate = Date.parse(`${end}T00:00:00Z`);
	if (!Number.isFinite(startDate) || !Number.isFinite(endDate)) return Number.NaN;
	return (endDate - startDate) / 86_400_000 + 1;
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
	if (!ISO_DATE.test(snapshot.as_of)) fail("snapshot.as_of must be YYYY-MM-DD");
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
	if (!ISO_DATE.test(start) || !ISO_DATE.test(end)) {
		fail("measurement window dates must be YYYY-MM-DD");
	}
	if (!Number.isInteger(days) || days < 30) {
		fail("public operational windows shorter than 30 days are forbidden");
	}
	if (days !== 90 || inclusiveWindowDays(start, end) !== 90) {
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
		requireExactKeys(measuredValue, ["value", "receipt_ref"], `value ${metricId}`);
		if (typeof measuredValue.value !== "number" || !Number.isFinite(measuredValue.value)) {
			fail(`value ${metricId}.value must be a finite number`);
		}
		if (!OPAQUE_RECEIPT_ID.test(measuredValue.receipt_ref)) {
			fail(`value ${metricId}.receipt_ref must be an opaque receipt identifier`);
		}
	}
}

function validateReceiptOutput(rawOutput, label) {
	requireRecord(rawOutput, label);
	const entries = Object.entries(rawOutput);
	if (entries.length === 0) fail(`${label} must contain reproduced metric values`);
	for (const [metricId, value] of entries) {
		requireString(metricId, `${label} metric id`);
		if (typeof value !== "number" || !Number.isFinite(value)) {
			fail(`${label}.${metricId} must be a finite number`);
		}
	}
}

function validatePrivateReceipt(privateReceipt, receiptId, label) {
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
	validateReceiptOutput(privateReceipt.primary.raw_output, `${label}.primary.raw_output`);

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
	validateReceiptOutput(
		privateReceipt.independent_reproduction.raw_output,
		`${label}.independent_reproduction.raw_output`,
	);

	const primaryResultHash = canonicalHash(privateReceipt.primary.raw_output);
	const reproductionResultHash = canonicalHash(privateReceipt.independent_reproduction.raw_output);
	if (primaryResultHash !== reproductionResultHash) {
		fail(`${label} independent reproduction does not match the primary raw output`);
	}

	return {
		rawOutput: privateReceipt.primary.raw_output,
		resultSha256: primaryResultHash,
	};
}

function validateReceipts(manifest, receiptsDirectory, snapshotValues) {
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
		);
		if (validatedReceipt.resultSha256 !== receipt.independent_reproduction.result_sha256) {
			fail(`${label} reproduced result hash does not match the private receipt`);
		}

		verifiedReceipts.set(receipt.id, {
			publicReference: {
				id: receipt.id,
				sha256: receipt.sha256,
			},
			rawOutput: validatedReceipt.rawOutput,
		});
	}

	for (const [metricId, measuredValue] of Object.entries(snapshotValues)) {
		const verifiedReceipt = verifiedReceipts.get(measuredValue.receipt_ref);
		if (!verifiedReceipt) {
			fail(`receipt reference ${measuredValue.receipt_ref} is unresolved`);
		}
		if (
			!Object.hasOwn(verifiedReceipt.rawOutput, metricId) ||
			verifiedReceipt.rawOutput[metricId] !== measuredValue.value
		) {
			fail(`receipt ${measuredValue.receipt_ref} does not reproduce ${metricId}`);
		}
	}

	return verifiedReceipts;
}

function assertPrivacySafe(value, label = "public projection") {
	if (Array.isArray(value)) {
		value.forEach((item, index) => assertPrivacySafe(item, `${label}[${index}]`));
		return;
	}
	if (!isRecord(value)) {
		if (typeof value === "string") {
			for (const privatePattern of PRIVATE_PUBLIC_TEXT_PATTERNS) {
				if (privatePattern.pattern.test(value)) {
					fail(`${label} contains ${privatePattern.description}`);
				}
			}
		}
		return;
	}

	for (const [key, child] of Object.entries(value)) {
		if (PRIVATE_PUBLIC_KEYS.has(key)) fail(`${label} contains private field ${key}`);
		assertPrivacySafe(child, `${label}.${key}`);
	}
}

function collectPublicNarrative(definitions, snapshot) {
	return [
		snapshot.public_wording.title,
		snapshot.public_wording.summary,
		...definitions.groups.flatMap((group) => [
			group.label,
			...group.metrics.flatMap((metric) =>
				REQUIRED_DEFINITION_FIELDS.map((field) => metric[field]),
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
		groups: definitions.groups.map((group) => ({
			id: group.id,
			label: group.label,
			metrics: group.metrics.map((definition) => {
				const measuredValue = snapshot.values[definition.id];
				return {
					...definition,
					value: measuredValue.value,
					as_of: snapshot.as_of,
					measurement_window: snapshot.measurement_window,
					refresh_state: snapshot.refresh_state,
					receipt: verifiedReceipts.get(measuredValue.receipt_ref).publicReference,
				};
			}),
		})),
	};

	assertPrivacySafe(publicProjection);
	return publicProjection;
}

function validateApproval(approval, definitions, snapshot, publicBytes) {
	requireExactKeys(
		approval,
		["status", "approved_by", "approved_on", "privacy_review", "binding"],
		"approval",
	);
	if (approval.status !== "approved") fail("approval.status must be approved");
	if (approval.approved_by !== "eriknorris") {
		fail("approval.approved_by must be eriknorris");
	}
	if (!ISO_DATE.test(approval.approved_on)) {
		fail("approval.approved_on must be YYYY-MM-DD");
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
	if (approval.privacy_review.status !== "approved") {
		fail("approval.privacy_review.status must be approved");
	}
	if (approval.privacy_review.reviewed_by !== "eriknorris") {
		fail("approval.privacy_review.reviewed_by must be eriknorris");
	}
	if (!ISO_DATE.test(approval.privacy_review.reviewed_on)) {
		fail("approval.privacy_review.reviewed_on must be YYYY-MM-DD");
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
	if (JSON.stringify(approvedPublicSourceUrls) !== JSON.stringify(expectedPublicSourceUrls)) {
		fail(
			`approved public source URLs must exactly match the public narrative: expected ${expectedPublicSourceUrls.join(", ") || "none"}`,
		);
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
			fail(
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
	);
	const publicProjection = buildPublicProjection(definitions, snapshot, verifiedReceipts);
	const publicBytes = Buffer.from(stableJson(publicProjection), "utf8");
	validateApproval(approval, definitions, snapshot, publicBytes);
	writeAtomically(argumentsByName.output, publicBytes);

	console.log(
		`[snapshot-contract] projected ${metricIds.size} metrics in ${REQUIRED_GROUP_IDS.length} groups; sha256=${sha256(publicBytes)}`,
	);
}

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
