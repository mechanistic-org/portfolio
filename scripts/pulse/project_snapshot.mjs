import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const REQUIRED_GROUP_IDS = ["issue-flow", "change-traceability", "durable-record-coverage"];
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

		for (const [metricIndex, metric] of group.metrics.entries()) {
			const metricLabel = `definitions.groups[${groupIndex}].metrics[${metricIndex}]`;
			requireExactKeys(metric, REQUIRED_DEFINITION_FIELDS, metricLabel);
			for (const field of REQUIRED_DEFINITION_FIELDS) {
				requireString(metric[field], `${metricLabel}.${field}`);
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

function validateReceipts(manifest, receiptsDirectory, receiptReferences) {
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
			["status", "sha256"],
			`${label}.independent_reproduction`,
		);
		if (receipt.independent_reproduction.status !== "matched") {
			fail(`${label} was not independently reproduced`);
		}
		if (receipt.independent_reproduction.sha256 !== receipt.sha256) {
			fail(`${label} independent reproduction hash does not match`);
		}

		const receiptPath = path.resolve(absoluteReceiptsDirectory, receipt.file);
		if (path.dirname(receiptPath) !== absoluteReceiptsDirectory) {
			fail(`${label}.file escapes the private receipt directory`);
		}
		const privateReceipt = readJson(receiptPath, `private receipt ${receipt.id}`);
		if (sha256(privateReceipt.bytes) !== receipt.sha256) {
			fail(`${label} full-file hash does not match its private receipt`);
		}
		requireRecord(privateReceipt.value, `private receipt ${receipt.id}`);
		if (privateReceipt.value.receipt_id !== receipt.id) {
			fail(`${label} id does not match the private receipt payload`);
		}

		verifiedReceipts.set(receipt.id, {
			id: receipt.id,
			sha256: receipt.sha256,
		});
	}

	for (const receiptReference of receiptReferences) {
		if (!verifiedReceipts.has(receiptReference)) {
			fail(`receipt reference ${receiptReference} is unresolved`);
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
		if (typeof value === "string" && (/^[a-zA-Z]:[\\/]/u.test(value) || /^\\\\/u.test(value))) {
			fail(`${label} contains a local path`);
		}
		return;
	}

	for (const [key, child] of Object.entries(value)) {
		if (PRIVATE_PUBLIC_KEYS.has(key)) fail(`${label} contains private field ${key}`);
		assertPrivacySafe(child, `${label}.${key}`);
	}
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
					receipt: verifiedReceipts.get(measuredValue.receipt_ref),
				};
			}),
		})),
	};

	assertPrivacySafe(publicProjection);
	return publicProjection;
}

function validateApproval(approval, definitions, snapshot, publicBytes) {
	requireExactKeys(approval, ["status", "approved_by", "approved_on", "binding"], "approval");
	if (approval.status !== "approved") fail("approval.status must be approved");
	if (approval.approved_by !== "eriknorris") {
		fail("approval.approved_by must be eriknorris");
	}
	if (!ISO_DATE.test(approval.approved_on)) {
		fail("approval.approved_on must be YYYY-MM-DD");
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
	const receiptReferences = new Set(
		Object.values(snapshot.values).map((metric) => metric.receipt_ref),
	);
	const verifiedReceipts = validateReceipts(
		receiptManifest,
		argumentsByName["receipts-dir"],
		receiptReferences,
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
