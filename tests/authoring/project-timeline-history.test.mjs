import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Exercise the real controller's history listener with a bounded DOM fixture.
// Native rendering and browser history traversal remain separate browser checks.
class ElementFixture extends EventTarget {
	constructor() {
		super();
		this.dataset = {};
		this.childNodes = [];
		this.singles = new Map();
		this.lists = new Map();
		this.isConnected = true;
		this.attributes = new Map();
	}
	querySelector(selector) {
		return this.singles.get(selector) ?? null;
	}
	querySelectorAll(selector) {
		return this.lists.get(selector) ?? [];
	}
	contains(node) {
		return node === this || this.childNodes.some((child) => child.contains(node));
	}
	closest(selector) {
		return this.matches(selector) ? this : (this.parent?.closest(selector) ?? null);
	}
	matches(selector) {
		return (
			selector === "[data-timeline-reference-event]" && Boolean(this.dataset.timelineReferenceEvent)
		);
	}
	append(node) {
		this.childNodes.push(node);
		node.parent = this;
	}
	replaceChildren() {
		this.childNodes = [];
	}
	setAttribute(name, value) {
		this.attributes.set(name, value);
	}
	toggleAttribute(name, on) {
		if (on) this.attributes.set(name, "");
		else this.attributes.delete(name);
	}
	focus(options) {
		this.focused = options;
	}
	scrollIntoView() {}
}

function fixture(initialOverflow = "") {
	const document = new ElementFixture();
	const window = new EventTarget();
	const location = { hash: "#making-the-front-fit" };
	let overflow = initialOverflow;
	let priority = initialOverflow ? "important" : "";
	document.body = {
		style: {
			getPropertyValue: () => overflow,
			getPropertyPriority: () => priority,
			setProperty: (_name, value, nextPriority = "") => {
				overflow = value;
				priority = nextPriority;
			},
			removeProperty: () => {
				overflow = "";
				priority = "";
			},
		},
	};
	const source = fs.readFileSync(
		new URL("../../src/components/Projects/projectTimelineController.ts", import.meta.url),
		"utf8",
	);
	const code = ts.transpileModule(source, {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
	}).outputText;
	const context = {
		exports: {},
		HTMLElement: ElementFixture,
		AbortController,
		document,
		window,
		location,
	};
	vm.runInNewContext(code, context);
	const host = new context.exports.ProjectTimelineElement();
	const dialog = new ElementFixture();
	dialog.open = false;
	dialog.showModal = () => {
		dialog.open = true;
	};
	// Native close events are queued, rather than dispatched inside close().
	let closes = 0;
	dialog.close = () => {
		if (dialog.open) {
			dialog.open = false;
			closes++;
		}
	};
	const flushCloses = () => {
		while (closes > 0) {
			closes--;
			dialog.dispatchEvent(new Event("close"));
		}
	};
	const reference = new ElementFixture();
	const row = new ElementFixture();
	row.dataset.timelineReferenceEvent = "pilot";
	reference.append(row);
	reference.lists.set("[data-timeline-reference-event]", [row]);
	const article = new ElementFixture();
	const opener = new ElementFixture();
	const ids = new Map([
		["making-the-front-fit", article],
		["development-timeline", reference],
		["project-event-pilot", row],
	]);
	document.getElementById = (id) => ids.get(id) ?? null;
	host.singles = new Map([
		["dialog", dialog],
		["[data-timeline-reference]", reference],
		["[data-timeline-selected-copy]", new ElementFixture()],
		["[data-timeline-view='reference']", opener],
		[".timeline-selection-hint", new ElementFixture()],
	]);
	host.connectedCallback();
	const navigate = (hash) => {
		location.hash = hash;
		window.dispatchEvent(new Event("hashchange"));
	};
	return {
		host,
		dialog,
		article,
		opener,
		navigate,
		flushCloses,
		overflow: () => [overflow, priority],
	};
}

test("Back leaves Reference, restores article focus/overflow, and Forward keeps selected identity", () => {
	const view = fixture("clip");
	view.navigate("#project-event-pilot");
	assert.equal(view.dialog.open, true);
	assert.equal(view.host.dataset.selectedEvent, "pilot");
	assert.deepEqual(view.overflow(), ["hidden", ""]);
	view.navigate("#making-the-front-fit");
	assert.equal(view.dialog.open, false);
	assert.deepEqual(view.overflow(), ["clip", "important"]);
	assert.equal(view.article.focused?.preventScroll, true);
	assert.equal(view.host.dataset.view, "visualization");
	assert.equal(view.host.dataset.selectedEvent, "pilot");
	view.navigate("#project-event-pilot");
	view.flushCloses();
	assert.equal(view.dialog.open, true);
	assert.equal(view.host.dataset.view, "reference");
	assert.deepEqual(view.overflow(), ["hidden", ""]);
	assert.equal(view.host.dataset.selectedEvent, "pilot");
	view.host.disconnectedCallback();
	assert.deepEqual(view.overflow(), ["clip", "important"]);
});

test("legacy Reference with null selection closes for empty, unknown and malformed fragments", () => {
	for (const destination of ["", "#unknown", "#%invalid"]) {
		const view = fixture();
		view.navigate("#development-timeline");
		assert.equal(view.dialog.open, true);
		assert.equal(view.host.dataset.selectedEvent, "");
		view.navigate(destination);
		view.flushCloses();
		assert.equal(view.dialog.open, false);
		assert.deepEqual(view.overflow(), ["", ""]);
		assert.equal(view.host.dataset.selectedEvent, "");
		assert.equal(view.host.focused?.preventScroll, true);
		view.navigate("#development-timeline");
		assert.equal(view.dialog.open, true);
		assert.equal(view.host.dataset.selectedEvent, "");
		view.host.disconnectedCallback();
	}
});
