import test from "node:test";
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { acquire, setPreview, clearReading, viewerId, focusId } from "../../src/stores/hxoStore.ts";
import { buildContextRibbon, careerTimelineRecords } from "../../src/utils/contextRibbon.ts";

test("scan, acquire and cross-panel reading share one held subject", async () => {
	clearReading();
	acquire("c24");
	setPreview("sc48", "swarm");
	assert.equal(viewerId.get(), "c24", "crossing a target must not replace reading immediately");
	setPreview(null, "swarm");
	await delay(190);
	assert.equal(viewerId.get(), "c24", "an unfinished acquisition is cancelled on exit");
	setPreview("sc48", "swarm");
	await delay(190);
	assert.equal(viewerId.get(), "sc48");
	assert.equal(focusId.get(), "sc48", "the map and reading subject must agree");
	setPreview(null, "swarm");
	assert.equal(viewerId.get(), "sc48", "entering details must not lose the reading subject");
	acquire("d-control");
	assert.equal(viewerId.get(), "d-control", "timeline selection uses the same reading subject");
	clearReading();
	assert.equal(viewerId.get(), null);
});

test("one dated projection retains lites and never manufactures undated spans", () => {
	const nodes = [
		{
			id: "a",
			type: "project",
			data: { title: "A", date: "2005-01-01", endDate: "2007-01-01", tier: "deep_dive" },
		},
		{ id: "b", type: "project", data: { title: "B", date: "2006-01-01", tier: "lite" } },
		{
			id: "c",
			type: "project",
			data: { title: "C", date: "2006-06-01", endDate: "2004-01-01", tier: "lite" },
		},
		{ id: "undated", type: "project", data: { title: "Undated", tier: "lite" } },
	];
	assert.deepEqual(
		careerTimelineRecords(nodes).map((p) => p.slug),
		["a", "b", "c"],
	);
	const ribbon = buildContextRibbon(nodes, "b");
	assert.equal(ribbon.projects.find((p) => p.current).slug, "b");
	assert.equal(ribbon.projects.find((p) => p.slug === "c").end, null);
	assert.equal(buildContextRibbon(nodes, "undated"), null);
});

test("unknown and invalid project dates cannot become current work", async () => {
	const { projectDates } = await import("../../src/utils/projectDates.ts");
	for (const data of [{}, { date: "bad" }, { date: null }]) {
		assert.deepEqual(projectDates(data), { start_date: "", end_date: "" });
	}
	assert.deepEqual(projectDates({ date: "2002-01-01" }), {
		start_date: "2002-01-01T00:00:00.000Z",
		end_date: "",
	});
	assert.equal(projectDates({ date: "2002-01-01", endDate: "2001-01-01" }).end_date, "");
});

test("canonical career periods agree across map and shared timeline", async () => {
	const { projectPeriod } = await import("../../src/utils/projectDates.ts");
	for (const [id, year, basis] of [
		["avegant-glyph", 2015, "documented-work"],
		["kplayer-300", 2008, "documented-work"],
		["xbox", 2002, "documented-work"],
		["makeline", 2021, "employment-period"],
		["dispensers", 2021, "employment-period"],
		["portion-cup", 2021, "employment-period"],
	]) {
		const period = projectPeriod(id, {});
		const [record] = careerTimelineRecords([{ id, type: "project", data: { title: id } }]);
		assert.equal(new Date(period.start).getUTCFullYear(), year);
		assert.equal(record.start, Date.parse(period.start));
		assert.equal(record.basis, basis);
	}
	const fissler = projectPeriod("fissler-bbq", { date: "2026-09-22" });
	assert.equal(
		new Date(fissler.start).getUTCFullYear(),
		1996,
		"canonical recollection overrides a UI fallback",
	);
	assert.equal(
		fissler.period,
		"c. 1996",
		"approximate recollection must not gain precision in display",
	);
	assert.equal(fissler.end, null, "a recalled year does not establish duration");
	assert.equal(fissler.basis, "operator-recollection");
	assert.equal(
		careerTimelineRecords([
			{ id: "fissler-bbq", type: "project", data: { title: "Fissler BBQ" } },
		])[0].period,
		"c. 1996",
	);
});
