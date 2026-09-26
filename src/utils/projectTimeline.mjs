import { chronologyDate } from "./projectChronology.ts";

const fail = (message) => {
	throw new Error(`[project timeline] ${message}`);
};
const decode = (text) =>
	text.replace(/&(?:amp|lt|gt|quot|apos|#39|#\d+|#x[0-9a-f]+);/gi, (entity) => {
		const named = {
			"&amp;": "&",
			"&lt;": "<",
			"&gt;": ">",
			"&quot;": '"',
			"&apos;": "'",
			"&#39;": "'",
		};
		if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
		return String.fromCodePoint(
			parseInt(
				entity.slice(entity[2].toLowerCase() === "x" ? 3 : 2, -1),
				entity[2].toLowerCase() === "x" ? 16 : 10,
			),
		);
	});

export function timelineEventAnchor(id) {
	if (typeof id !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(id)) fail("invalid event ID");
	return `project-event-${id}`;
}

/** Validate identities before either view renders. Keep the admitted records intact. */
export function timelineOverview(chronology) {
	const events = chronology.events;
	const ids = new Set();
	for (const event of events) {
		timelineEventAnchor(event.id);
		if (ids.has(event.id)) fail(`duplicate event ${event.id}`);
		ids.add(event.id);
	}
	const phases = chronology.phases.map((phase) => ({
		...phase,
		events: events.filter((event) => event.phase === phase.id && event.prominence === "prominent"),
	}));
	if (new Set(phases.map((phase) => phase.id)).size !== phases.length) fail("duplicate phase");
	for (const phase of phases) timelineEventAnchor(phase.id);
	for (const event of events) {
		if (!phases.some((phase) => phase.id === event.phase)) fail(`unknown phase for ${event.id}`);
	}
	for (const cluster of chronology.clusters ?? []) {
		if (
			new Set(cluster.event_ids).size !== cluster.event_ids.length ||
			cluster.event_ids.some((id) => !ids.has(id))
		)
			fail(`invalid cluster ${cluster.id}`);
	}
	return phases;
}

/** Attach a narrative row only when its complete visible identity matches one record.
 * No fuzzy, positional or date-only association; changed or ambiguous prose fails closed.
 */
export function bindTimelineReference(html, chronology) {
	timelineOverview(chronology);
	const key = (dateTitle, summary, href, label) =>
		JSON.stringify([dateTitle, summary, href, label]);
	const byContent = new Map();
	for (const event of chronology.events) {
		const identity = key(
			`${chronologyDate(event)} - ${event.title}.`,
			event.summary,
			event.anchor,
			event.link_label,
		);
		if (byContent.has(identity)) fail("ambiguous narrative event identity");
		byContent.set(identity, event);
	}
	const rows = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)];
	if (rows.length !== chronology.events.length) fail("narrative/event coverage differs");
	const used = new Set();
	let rendered = html;
	for (const row of rows) {
		const fields = row[1].match(
			/^\s*<p><strong>([\s\S]*?)<\/strong> ([\s\S]*?) <a href="#([^"]+)">([^<]*)<\/a>\.<\/p>\s*$/,
		);
		if (!fields) fail("unsupported narrative row markup");
		const event = byContent.get(key(...fields.slice(1).map(decode)));
		if (!event || used.has(event.id)) fail("missing or repeated exact narrative identity");
		used.add(event.id);
		rendered = rendered.replace(
			row[0],
			`<li id="${timelineEventAnchor(event.id)}" data-timeline-reference-event="${event.id}" tabindex="0">${row[1]}</li>`,
		);
	}
	if (used.size !== chronology.events.length) fail("unmatched chronology events");
	return rendered;
}

/** Move the complete authored reference once and insert the feature after the existing
 * overview. Media objects and every unselected HTML byte are preserved.
 */
export function selectAuthoredTimeline(pieces, chronology) {
	if (!chronology?.events?.length) return { pieces, referenceHtml: null, referenceId: null };
	const heading = /<h2\b[^>]*\bid="development-timeline"[^>]*>[\s\S]*?<\/h2>/g;
	const matches = pieces.flatMap((piece, index) =>
		[...(piece.html ?? "").matchAll(heading)].map((match) => ({ index, match })),
	);
	if (matches.length > 1) fail("duplicate narrative timeline heading");
	let remaining = [...pieces];
	let referenceHtml = null;
	if (matches.length) {
		const { index, match } = matches[0];
		const html = pieces[index].html;
		const next = html.slice(match.index + match[0].length).search(/<h2\b/);
		const end = next < 0 ? html.length : match.index + match[0].length + next;
		referenceHtml = bindTimelineReference(html.slice(match.index, end), chronology);
		remaining[index] = { ...pieces[index], html: html.slice(0, match.index) + html.slice(end) };
	}
	const reserved = new Set([
		"project-timeline",
		...chronology.phases.map((phase) => `project-phase-${phase.id}`),
		...chronology.events.map((event) => timelineEventAnchor(event.id)),
		...(!referenceHtml ? ["chronology-heading"] : []),
	]);
	for (const piece of pieces) {
		for (const match of (piece.html ?? "").matchAll(/\bid="([^"]+)"/g)) {
			if (reserved.has(match[1])) fail(`existing anchor collision ${match[1]}`);
		}
	}
	const overview = remaining.flatMap((piece, index) =>
		[
			...(piece.html ?? "").matchAll(
				/<h2\b[^>]*\bid="development-at-a-glance"[^>]*>[\s\S]*?<\/h2>/g,
			),
		].map((match) => ({ index, match })),
	);
	if (overview.length > 1) fail("duplicate authored overview");
	if (overview.length) {
		const { index, match } = overview[0];
		const html = remaining[index].html;
		const next = html.slice(match.index + match[0].length).search(/<h2\b/);
		const offset = next < 0 ? html.length : match.index + match[0].length + next;
		remaining.splice(
			index,
			1,
			{ ...remaining[index], html: html.slice(0, offset) },
			{ timeline: true },
			{ html: html.slice(offset) },
		);
	} else remaining.unshift({ timeline: true });
	return {
		pieces: remaining,
		referenceHtml,
		referenceId: referenceHtml ? "development-timeline" : "chronology-heading",
	};
}
