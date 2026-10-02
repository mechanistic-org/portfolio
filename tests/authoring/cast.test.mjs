import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCast, groupCast } from "../../src/utils/cast.mjs";

test("visibility excludes owner, blank and declined, including conflicting duplicate", () => {
 const raw = [
  {name:"Erik Norris (ME)", role:"Owner", org:"Avegant"},
  {name:" ", role:"", org:""},
  {name:"A", role:"Engineer", org:"Company", consent:"approved"},
  {name:"A", role:"Engineer", org:"Company", consent:"declined"},
 ];
 assert.deepEqual(normalizeCast(raw), []);
});
test("deduplicate identical work but retain multiple recorded affiliations and roles", () => {
 const row = { name:"Leonard Pang", role:"Drawing revisions", org:"Avegant" };
 const rows = normalizeCast([row, {...row, name:" Leonard   Pang "}, {...row, role:"Another recorded role"}]);
 assert.equal(rows.length, 2);
 assert.equal(rows[0].consent, undefined);
});
test("organization and curated stakeholder grouping do not guess disciplines or vendors", () => {
 const groups = groupCast(normalizeCast([
  {name:"Supplier", role:"Cable work", org:"Fujikura"},
  {name:"Colleague", role:"Drawing updates", org:"Avegant", roster:"key"},
  {name:"Contact", role:"Program support", org:"Partner", roster:"stakeholder"},
 ]));
 assert.deepEqual(groups.map(g=>g.roster), ["key", "stakeholder"]);
 assert.deepEqual(groups[0].organizations.map(g=>g.org), ["Fujikura", "Avegant"]);
});
