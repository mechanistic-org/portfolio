import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repositoryRoot = path.resolve(import.meta.dirname, "..", "..");
const publicSnapshotPath = path.join(
	repositoryRoot,
	"src",
	"data",
	"pulse",
	"public-snapshot.json",
);
const publicHistoryPath = path.join(repositoryRoot, "src", "data", "pulse", "public-history.json");
const approvedSnapshotId = "pulse-2026-08-24-03";
const approvedProjectionSha256 = "744a8683c726d704b5309fca6828e1707a708339e53abb134015d90900b9d893";

function sha256(bytes) {
	return createHash("sha256").update(bytes).digest("hex");
}

test("the first real manual snapshot publishes exactly as approved and preserves the tracer", () => {
	const snapshotBytes = fs.readFileSync(publicSnapshotPath);
	const snapshot = JSON.parse(snapshotBytes.toString("utf8"));
	const history = JSON.parse(fs.readFileSync(publicHistoryPath, "utf8"));

	assert.equal(sha256(snapshotBytes), approvedProjectionSha256);
	assert.equal(snapshot.snapshot_id, approvedSnapshotId);
	assert.equal(snapshot.as_of, "2026-08-24");
	assert.equal(snapshot.lifecycle_state, "active");
	assert.deepEqual(
		snapshot.groups.map((group) => group.id),
		["issue-flow", "change-traceability", "durable-record-coverage"],
	);

	const durableGroup = snapshot.groups.find((group) => group.id === "durable-record-coverage");
	assert.equal(durableGroup.value, null);
	assert.equal(durableGroup.verification_state, "not_measurable");
	assert.equal(durableGroup.evidence_start, "2026-08-22");
	assert.equal(
		durableGroup.reason,
		"A native scoped-session denominator cannot be reproduced for the complete 90-day window.",
	);
	assert.equal(
		durableGroup.eligibility_rule,
		"Numeric coverage becomes eligible after both the native scoped-session denominator and its durable decision/finding joins are reproducible for every day in a complete 90-day window.",
	);

	assert.equal(history.current_snapshot_id, approvedSnapshotId);
	const tracer = history.snapshots.find(
		(record) => record.snapshot.snapshot_id === "pulse-fixture-2026-08-24",
	);
	assert.ok(tracer, "the controlled tracer disappeared from append-only history");
	assert.deepEqual(tracer.lifecycle, {
		state: "withdrawn",
		is_current: false,
		validity: "invalid",
		effective_on: "2026-08-25",
		correction: {
			reason: "provenance-invalid",
			replacement_snapshot_id: approvedSnapshotId,
			href: `/colophon/the-pulse/#pulse-snapshot-${approvedSnapshotId}`,
		},
	});

	const published = history.snapshots.find(
		(record) => record.snapshot.snapshot_id === approvedSnapshotId,
	);
	assert.ok(published, "the approved snapshot is absent from public history");
	assert.equal(published.lifecycle.state, "active");
	assert.equal(published.lifecycle.is_current, true);
	assert.equal(published.approval.approved_by, "eriknorris");
	assert.equal(published.approval.approved_on, "2026-08-25");
	assert.equal(published.approval.public_projection_sha256, approvedProjectionSha256);
});
