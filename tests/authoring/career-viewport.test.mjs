import assert from "node:assert/strict";
import test from "node:test";
import { careerViewport } from "../../src/utils/careerViewport.mjs";
test("Glyph overview shows a twenty-year portion centered on its context window", () => {
 assert.deepEqual(careerViewport(1986, 2026, { startYear: 2013, endYear: 2018 }), { startYear: 2006, endYear: 2025 });
});
test("overview shifts at either career edge without changing scale", () => {
 assert.deepEqual(careerViewport(1986, 2026, { startYear: 1985, endYear: 1991 }), { startYear: 1986, endYear: 2005 });
 assert.deepEqual(careerViewport(1986, 2026, { startYear: 2020, endYear: 2028 }), { startYear: 2007, endYear: 2026 });
});
test("wide selected periods retain context and short careers never overshoot", () => {
 assert.deepEqual(careerViewport(1986, 2026, { startYear: 1990, endYear: 2010 }), { startYear: 1986, endYear: 2014 });
 assert.deepEqual(careerViewport(2020, 2026, { startYear: 2021, endYear: 2024 }), { startYear: 2020, endYear: 2026 });
});
test("full career view remains the default", () => {
 assert.deepEqual(careerViewport(1986, 2026, null), { startYear: 1986, endYear: 2026 });
});
