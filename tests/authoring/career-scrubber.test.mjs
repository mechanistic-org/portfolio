import assert from "node:assert/strict";
import test from "node:test";
import { nearestPip, stepPip } from "../../src/utils/careerScrubber.mjs";
const pips = [
	{ id: "early", x: 16 },
	{ id: "same-a", x: 480 },
	{ id: "same-b", x: 480 },
	{ id: "late", x: 944 },
];
test("pointer clamps to real edge pips rather than a detached viewport edge", () => {
	assert.equal(nearestPip(pips, -100).x, 16);
	assert.equal(nearestPip(pips, 2000).x, 944);
	assert.equal(nearestPip([], 0), null);
});
test("pointer ties are deterministic and retain the indicated same-date record", () => {
	assert.equal(nearestPip(pips, 480).id, "same-a");
	assert.equal(nearestPip(pips, 480, "same-b").id, "same-b");
	assert.equal(nearestPip(pips, 248).id, "early");
});
test("keyboard visits every same-date project and clamps at both ends", () => {
	assert.equal(stepPip(pips, "same-a", 1).id, "same-b");
	assert.equal(stepPip(pips, "same-b", -1).id, "same-a");
	assert.equal(stepPip(pips, "early", -1).id, "early");
	assert.equal(stepPip(pips, "late", 1).id, "late");
	assert.equal(stepPip([], "none", 1), null);
});
