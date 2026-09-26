import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import matter from "gray-matter";
import { buildAuthoredProject } from "../../src/utils/authoredProject.mjs";
import {
	bindTimelineReference,
	selectAuthoredTimeline,
	timelineOverview,
} from "../../src/utils/projectTimeline.mjs";

const event = (id, title) => ({
	id,
	date: "2012-01-09",
	date_label: "January 2012",
	title,
	summary: "A proposed change, not a completed outcome.",
	phase: "2012",
	prominence: "prominent",
	anchor: "article",
	link_label: "Context",
	source_ids: [],
});
const chronology = {
	phases: [{ id: "2012", label: "2012" }],
	events: [event("one", "First record"), event("two", "Second record")],
	clusters: [],
};
const row = (event) =>
	`<li><p><strong>${event.date_label} - ${event.title}.</strong> ${event.summary} <a href="#${event.anchor}">${event.link_label}</a>.</p>\n</li>`;
const reference = `<h2 id="development-timeline">Development timeline</h2>\n<p>Original introduction.</p><ul>${chronology.events.map(row).join("")}</ul>`;
const stripBindings = (html) =>
	html.replace(
		/<li id="project-event-[^"]+" data-timeline-reference-event="[^"]+" tabindex="0">/g,
		"<li>",
	);

test("full visible identity binds independently of event/row order and preserves original HTML", () => {
	const reversed = { ...chronology, events: [...chronology.events].reverse() };
	const bound = bindTimelineReference(reference, reversed);
	assert.equal(stripBindings(bound), reference);
	assert.match(bound, /id="project-event-one"[^>]*><p><strong>January 2012 - First record/);
	const reversedRows = `<ul>${[...chronology.events].reverse().map(row).join("")}</ul>`;
	assert.equal(stripBindings(bindTimelineReference(reversedRows, chronology)), reversedRows);
});

test("changed precision, outcome, title or destination fails instead of guessing an association", () => {
	for (const [from, to] of [
		["January 2012", "January 9, 2012"],
		["First record", "Another record"],
		["A proposed change, not a completed outcome.", "A completed outcome."],
		['href="#article"', 'href="#other"'],
		[">Context</a>", ">Other</a>"],
	]) {
		assert.throws(
			() => bindTimelineReference(reference.replace(from, to), chronology),
			/exact narrative identity/,
		);
	}
});

test("missing/duplicate identities, ambiguous content and unsupported markup fail closed", () => {
	assert.throws(
		() => bindTimelineReference(reference.replace(row(chronology.events[0]), ""), chronology),
		/coverage/,
	);
	assert.throws(
		() =>
			bindTimelineReference(reference, {
				...chronology,
				events: [chronology.events[0], chronology.events[0]],
			}),
		/duplicate event/,
	);
	assert.throws(
		() =>
			bindTimelineReference(reference, {
				...chronology,
				events: [chronology.events[0], { ...chronology.events[0], id: "another" }],
			}),
		/ambiguous/,
	);
	assert.throws(
		() =>
			bindTimelineReference(reference.replace("<strong>", '<strong onclick="bad()">'), chronology),
		/unsupported/,
	);
	assert.throws(
		() => timelineOverview({ ...chronology, events: [{ ...chronology.events[0], id: "" }] }),
		/invalid event/,
	);
});

test("decoded entities match text without rewriting original encoded markup", () => {
	const records = {
		...chronology,
		events: [
			{
				...chronology.events[0],
				title: "Review & proposal",
				summary: "The supplier's proposed change.",
			},
		],
	};
	const html = row(records.events[0]).replace("&", "&AMP;").replace("supplier's", "supplier&#39;s");
	assert.equal(stripBindings(bindTimelineReference(html, records)), html);
});

test("authored extraction moves once after the existing overview and preserves all other pieces", () => {
	const group = { id: "photo", items: [{}] };
	const before =
		'<h2 id="development-at-a-glance">At a glance</h2><ul><li><a href="#article">Account link</a></li></ul><p><a href="#development-timeline">Full timeline</a></p>';
	const body = '<h2 id="article">Account</h2><p>Exact article.</p>';
	const after = '<h2 id="after">Later section</h2><p>Still here.</p>';
	const pieces = [{ html: before + body }, { group }, { html: reference + after }];
	const result = selectAuthoredTimeline(pieces, chronology);
	assert.equal(result.referenceId, "development-timeline");
	assert.equal(stripBindings(result.referenceHtml), reference);
	assert.equal(result.pieces.map((piece) => piece.html ?? "").join(""), before + body + after);
	assert.equal(result.pieces[0].html, before);
	assert.deepEqual(result.pieces[1], { timeline: true });
	assert.strictEqual(result.pieces.find((piece) => piece.group).group, group);
	assert.equal(pieces[2].html, reference + after);
});

test("missing chronology preserves authored prose; colliding and repeated anchors are rejected", () => {
	const pieces = [{ html: reference }];
	assert.strictEqual(selectAuthoredTimeline(pieces, null).pieces, pieces);
	assert.throws(
		() => selectAuthoredTimeline([{ html: reference + reference }], chronology),
		/duplicate narrative/,
	);
	assert.throws(
		() =>
			selectAuthoredTimeline(
				[{ html: '<p id="project-event-one">Existing</p>' + reference }],
				chronology,
			),
		/collision/,
	);
	assert.throws(
		() =>
			selectAuthoredTimeline(
				[{ html: '<p id="project-phase-2012">Existing</p>' + reference }],
				chronology,
			),
		/collision/,
	);
});

test("C24 retains all records, prominent selection, phases, cluster membership and verification notes", () => {
	const input = JSON.parse(
		fs.readFileSync(new URL("../../src/content/projects/c24/_chronology.json", import.meta.url)),
	);
	const original = JSON.stringify(input);
	const phases = timelineOverview(input);
	assert.equal(input.events.length, 25);
	assert.equal(phases.length, 6);
	assert.equal(phases.flatMap((phase) => phase.events).length, 8);
	assert.equal(input.clusters[0].event_ids.length, 7);
	assert.equal(input.clusters[0].verified_identifier_count, 18);
	assert.equal(input.events.find((event) => event.id === "first-customer-ship").date, "2007-11-07");
	assert.match(
		input.events.find((event) => event.id === "sustaining-transition").verification_note,
		/dynamic date field/,
	);
	assert.equal(JSON.stringify(input), original);
});

const acceptedMdx = process.env.PORTFOLIO_TIMELINE_CINEMA_MDX;
const acceptedChronology = process.env.PORTFOLIO_TIMELINE_CINEMA_CHRONOLOGY;
test(
	"accepted Cinema input uses the production loader and exact 36-event reference binding",
	{ skip: !(acceptedMdx && acceptedChronology) },
	async () => {
		const source = matter(fs.readFileSync(acceptedMdx, "utf8"));
		const page = await buildAuthoredProject({
			id: "cinema-one",
			data: source.data,
			body: source.content,
		});
		const input = JSON.parse(fs.readFileSync(acceptedChronology, "utf8"));
		const before = page.pieces
			.filter((piece) => piece.html)
			.map((piece) => piece.html)
			.join("");
		const result = selectAuthoredTimeline(page.pieces, input);
		assert.equal(input.events.length, 36);
		assert.equal([...result.referenceHtml.matchAll(/data-timeline-reference-event=/g)].length, 36);
		const originalReference = stripBindings(result.referenceHtml);
		assert.equal(
			result.pieces
				.filter((piece) => piece.html)
				.map((piece) => piece.html)
				.join(""),
			before.replace(originalReference, ""),
		);
		assert.deepEqual(
			result.pieces.filter((piece) => piece.group),
			page.pieces.filter((piece) => piece.group),
		);
		assert.match(result.referenceHtml, /January 2012 - System architecture/);
		assert.match(result.referenceHtml, /April 2013 - My personal pilot build/);
		assert.match(result.referenceHtml, /November 13-14, 2014 - Further flow-mark work proposed/);
	},
);
