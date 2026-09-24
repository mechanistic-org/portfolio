import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Writable } from "node:stream";
import { finished } from "node:stream/promises";
import test from "node:test";
import { marked } from "marked";

const workspace = path.resolve(import.meta.dirname, "../..");
const outputRoot = path.join(workspace, ".astro");
const moduleUrl = pathToFileURL(path.join(workspace, "scripts/authoring/preview.mjs"));
const operatorEvidence = process.env.PORTFOLIO_EVIDENCE_ROOT || "D:/GitHub/portfolio-evidence";
const operatorDirectory = path.join(operatorEvidence, "authoring/projects/avegant-glyph");
const png = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aYuoAAAAASUVORK5CYII=",
	"base64",
);
const video = Buffer.from("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const asset = (name) => `../../../assets/avegant-glyph/${name}`;
const image = (name, caption = name) => ({ path: asset(name), alt: caption, caption });
const fixtureComposition = {
	project: "avegant-glyph",
	groups: [
		{
			id: "fixtures",
			title: "Inspection fixtures",
			replace: ["fixture-a.jpg", "fixture-b.jpg"],
			items: [image("fixture-a.jpg"), image("fixture-b.jpg")],
			followWith: ["inserts"],
		},
		{ id: "inserts", title: "Insert setups", items: [image("inserts.jpg")] },
		{
			id: "cable-cycling",
			title: "Kinking and abrasion across cable variants",
			replace: ["cycle-a.jpg"],
			items: [
				image("cycle-a.jpg", "Cycle-tested variant; no individual T5/T6 assignment."),
				image("cycle-b.jpg"),
			],
		},
		{
			id: "chassis-contact",
			title: "Pinching at the optical chassis",
			replace: ["chassis.jpg"],
			items: [image("chassis.jpg", "Pinching during normal use or straight out of assembly.")],
		},
		{
			id: "tool-trials",
			title: "Tool trials",
			beforeHeading: "### The outer-headband tool",
			items: [image("tool.jpg")],
		},
	],
};
const fixtureDraft = `# Avegant Glyph: getting it into production

Private opening metadata must not enter the article.

## Joining Avegant

I joined on July 20, 2015. Glyph weighed 434 g (15.3 oz), with 1280 × 720 mirrors at 5.4 µm pitch.[^weight]

### The outer-headband tool

The span measured 197.06 mm against 196.31 mm; the ledge was 1.133–1.140 mm and needed at least 1.15 mm.

| Outer inspection | Inner inspection |
| --- | --- |
| ![Outer fixture](${asset("fixture-a.jpg")}) | ![Inner fixture](${asset("fixture-b.jpg")}) |
| Outer fixture caption. | Inner fixture caption. |

*Two inspection fixtures I designed.*[^fixtures]

## Movement, reliability and dust

Different cable constructions went through 3,000 cycles, with checks every 500.

![Cycling](${asset("cycle-a.jpg")})

*Cycling caption with its only source citation.*[^cycling]

#### Pinching at the optical chassis

Chassis pinching occurred during normal use or straight out of assembly.

![Chassis](${asset("chassis.jpg")})

*Chassis contact, a separate mechanism.*[^chassis]

| Sample | Cycle count |
| --- | --- |
| T5 | 6,000 |
| T6 | 3,000 |

![Ejection](${asset("trial.mp4")})

*Ejection at 4–6 seconds.*[^video]

## Working notes

SECRET WORKING NOTE: a prospective 999,999-cycle claim is not article prose.

[^weight]: Product weight source, 434 g.
[^fixtures]: Fixture design source.
[^cycling]: Cable cycling source.
[^chassis]: Chassis inspection source.
[^video]: Ejection trial source.
`;

// All writes, including the loader's registry and resized media, stay in an
// independent fixture beneath .astro. The operator's files are read-only inputs.
async function withFixture(draft, composition, run) {
	fs.mkdirSync(outputRoot, { recursive: true });
	const root = fs.mkdtempSync(path.join(outputRoot, "authoring-test-"));
	const evidence = path.join(root, "evidence");
	const directory = path.join(evidence, "authoring/projects/avegant-glyph");
	const links = [...draft.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
	const media = composition.groups.flatMap((group) => group.items.map((item) => item.path));
	for (const relative of new Set([...links, ...media])) {
		if (/^(?:https?:|#)/.test(relative)) continue;
		const target = path.resolve(directory, decodeURIComponent(relative.split("#")[0]));
		assert.ok(
			target.startsWith(evidence + path.sep),
			`Fixture link must remain in its evidence root: ${relative}`,
		);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		const ext = path.extname(target).toLowerCase();
		fs.writeFileSync(
			target,
			ext === ".mp4"
				? video
				: [".png", ".jpg", ".jpeg", ".webp"].includes(ext)
					? png
					: "Independent source fixture.",
		);
	}
	fs.mkdirSync(directory, { recursive: true });
	fs.writeFileSync(path.join(directory, "Draft.md"), draft);
	fs.writeFileSync(path.join(directory, "Composition.json"), JSON.stringify(composition));
	const previous = {
		cwd: process.cwd(),
		evidence: process.env.PORTFOLIO_EVIDENCE_ROOT,
		project: process.env.PORTFOLIO_AUTHORING_PROJECT,
	};
	try {
		process.chdir(root);
		process.env.PORTFOLIO_EVIDENCE_ROOT = evidence;
		process.env.PORTFOLIO_AUTHORING_PROJECT = "avegant-glyph";
		const preview = await import(`${moduleUrl.href}?fixture=${path.basename(root)}`);
		await run({ preview, root, evidence, directory });
	} finally {
		process.chdir(previous.cwd);
		for (const [name, value] of [
			["PORTFOLIO_EVIDENCE_ROOT", previous.evidence],
			["PORTFOLIO_AUTHORING_PROJECT", previous.project],
		]) {
			if (value === undefined) delete process.env[name];
			else process.env[name] = value;
		}
		assert.ok(path.resolve(root).startsWith(path.resolve(outputRoot) + path.sep));
		fs.rmSync(root, { recursive: true, force: true });
	}
}

function plain(html) {
	return html
		.replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/g, "")
		.replace(/<[^>]*>/g, " ")
		.replace(
			/&(?:amp|lt|gt|quot|#39);/g,
			(entity) => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" })[entity],
		)
		.replace(/\s+/g, " ")
		.trim();
}
const articleBody = (source) =>
	source
		.slice(source.indexOf("## Joining Avegant"), source.indexOf("## Working notes"))
		.replace(/\r\n/g, "\n");
const groupsOf = (page) => page.pieces.filter((piece) => piece.group).map((piece) => piece.group);
const proseOf = (page) =>
	page.pieces
		.filter((piece) => "html" in piece)
		.map((piece) => piece.html)
		.join("\n");

function checkProseAndNotes(page, source) {
	const body = articleBody(source);
	const rendered = plain(proseOf(page));
	for (const token of marked.lexer(body)) {
		if (token.type !== "paragraph" || /^\s*(?:!\[|\*)/.test(token.raw)) continue;
		const expected = plain(marked.parse(token.raw.replace(/\[\^[^\]]+\]/g, "")));
		assert.ok(rendered.includes(expected), `Article paragraph was changed or lost: ${expected}`);
	}
	const definitions = new Set([...source.matchAll(/^\[\^([^\]]+)\]:/gm)].map((match) => match[1]));
	const references = new Set([...body.matchAll(/\[\^([^\]]+)\]/g)].map((match) => match[1]));
	const notes = new Set(page.footnotes.map((note) => note.id));
	for (const id of references) {
		assert.ok(definitions.has(id), `Missing source definition: ${id}`);
		assert.ok(notes.has(id), `Source note was dropped from the composed article: ${id}`);
	}
	for (const note of page.footnotes)
		assert.ok(definitions.has(note.id), `Rendered undefined note: ${note.id}`);
	assert.equal(notes.size, page.footnotes.length, "Notes are emitted once per ID");
	assert.doesNotMatch(proseOf(page), /Working notes|SECRET WORKING NOTE|Private opening metadata/);
}

function checkComposition(page, composition) {
	const groups = groupsOf(page);
	assert.equal(
		new Set(groups.map((group) => group.id)).size,
		groups.length,
		"Each gallery anchor appears exactly once",
	);
	for (const selected of composition.groups) {
		const actual = groups.find((group) => group.id === selected.id);
		assert.ok(actual, `Unplaced composition group: ${selected.id}`);
		assert.deepEqual(
			actual.items.map((item) => item.path),
			selected.items.map((item) => item.path),
		);
	}
	assert.doesNotMatch(
		proseOf(page),
		/data-authoring-group|^\s*\|/m,
		"No unresolved placeholders or broken image-table rows",
	);
	for (const group of groups)
		for (const item of group.items)
			assert.match(item.src, /^\/_authoring-media\/[a-f0-9]{24}\.[a-z0-9]+$/);
	const cycling = groups.find((group) => group.id === "cable-cycling");
	const chassis = groups.find((group) => group.id === "chassis-contact");
	assert.ok(cycling && chassis);
	assert.ok(
		cycling.items.every((item) => !chassis.items.some((other) => other.id === item.id)),
		"Cycle-test and chassis-pinching evidence stays distinct",
	);
	assert.ok(
		page.pieces.findIndex((piece) => piece.group?.id === cycling.id) <
			page.pieces.findIndex((piece) => piece.group?.id === chassis.id),
	);
	assert.match(chassis.title, /Pinching/);
}

function captureServer() {
	const middlewares = [];
	const watched = [];
	return {
		middlewares,
		watched,
		server: {
			watcher: { add: (files) => watched.push(...files), on() {} },
			ws: { send() {} },
			middlewares: { use: (middleware) => middlewares.push(middleware) },
		},
	};
}

async function request(middleware, url, { method = "GET", range } = {}) {
	const chunks = [];
	const response = new Writable({
		write(chunk, encoding, done) {
			chunks.push(Buffer.from(chunk));
			done();
		},
	});
	response.statusCode = 200;
	response.headers = {};
	response.setHeader = (key, value) => {
		response.headers[key.toLowerCase()] = String(value);
	};
	const completed = finished(response);
	await middleware({ url, method, headers: range ? { range } : {} }, response, () => {
		response.nextCalled = true;
		response.end();
	});
	await completed;
	return {
		status: response.statusCode,
		headers: response.headers,
		body: Buffer.concat(chunks),
		nextCalled: !!response.nextCalled,
	};
}

test("composition preserves article prose, source notes, numerical tables and gallery placement for LF and CRLF input", async (t) => {
	for (const [name, source] of [
		["LF", fixtureDraft],
		["CRLF", fixtureDraft.replace(/\n/g, "\r\n")],
	]) {
		await t.test(name, () =>
			withFixture(source, fixtureComposition, async ({ preview }) => {
				const page = await preview.loadAuthoringProject();
				checkProseAndNotes(page, source);
				checkComposition(page, fixtureComposition);
				assert.equal(
					(proseOf(page).match(/<table>/g) || []).length,
					1,
					"Only the numerical table remains a prose table",
				);
				assert.match(proseOf(page), /<td>T5<\/td>\s*<td>6,000<\/td>/);
				assert.match(proseOf(page), /<td>T6<\/td>\s*<td>3,000<\/td>/);
				assert.equal(page.videoCount, 1);
				assert.equal(page.imageCount, 7);
			}),
		);
	}
});

test(
	"active Glyph draft accounts for all 64 selected exports plus retained article media",
	{
		skip:
			!fs.existsSync(path.join(operatorDirectory, "Draft.md")) ||
			!fs.existsSync(path.join(operatorDirectory, "Composition.json"))
				? "Local operator source is unavailable"
				: false,
	},
	async () => {
		const source = fs.readFileSync(path.join(operatorDirectory, "Draft.md"), "utf8");
		const composition = JSON.parse(
			fs.readFileSync(path.join(operatorDirectory, "Composition.json"), "utf8"),
		);
		const selectedDirectory = path.join(operatorEvidence, "assets/avegant-glyph/2026-09-23_picks");
		const selected = fs
			.readdirSync(selectedDirectory)
			.filter((name) => /\.(?:jpe?g|png|webp)$/i.test(name))
			.sort();
		assert.equal(selected.length, 64, "The reviewed export set contains exactly 64 files");
		await withFixture(source, composition, async ({ preview }) => {
			const page = await preview.loadAuthoringProject();
			checkProseAndNotes(page, source);
			checkComposition(page, composition);
			const items = groupsOf(page).flatMap((group) => group.items);
			const exports = items
				.filter((item) => item.path.includes("/2026-09-23_picks/"))
				.map((item) => path.basename(item.path));
			assert.deepEqual(
				[...new Set(exports)].sort(),
				selected,
				"Every reviewed export appears in the composition",
			);
			assert.equal(exports.length, 64, "Selected exports are not duplicated");
			const retained = [...articleBody(source).matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)]
				.map((match) => match[1])
				.filter((relative) => !relative.includes("/2026-09-23_picks/"));
			for (const relative of retained)
				assert.ok(
					items.some((item) => item.path === relative),
					`Retained article media missing: ${relative}`,
				);
			assert.equal(page.headings.length, (articleBody(source).match(/^#{2,6} /gm) || []).length);
			assert.equal(page.videoCount, 2);
		});
	},
);

test("private media is explicitly enabled, dev-only and addressed through registered opaque IDs", () =>
	withFixture(fixtureDraft, fixtureComposition, async ({ preview }) => {
		const integration = preview.authoringPreview();
		assert.deepEqual(Object.keys(integration.hooks), ["astro:server:setup"]);
		for (const value of [undefined, "", "other-project"]) {
			if (value === undefined) delete process.env.PORTFOLIO_AUTHORING_PROJECT;
			else process.env.PORTFOLIO_AUTHORING_PROJECT = value;
			const disabled = captureServer();
			integration.hooks["astro:server:setup"]({ server: disabled.server });
			assert.equal(disabled.middlewares.length, 0);
			assert.equal(disabled.watched.length, 0);
			await assert.rejects(preview.loadAuthoringProject(), /not enabled/);
		}
		process.env.PORTFOLIO_AUTHORING_PROJECT = "avegant-glyph";
		const page = await preview.loadAuthoringProject();
		const enabled = captureServer();
		integration.hooks["astro:server:setup"]({ server: enabled.server });
		assert.equal(enabled.middlewares.length, 1);
		assert.equal(enabled.watched.length, 2);
		const middleware = enabled.middlewares[0];
		for (const url of [
			"/_authoring-media/../../../Draft.md",
			"/_authoring-media/D:/private/secret.md",
			"/_authoring-media/%2e%2e%2fDraft.md",
			"/_authoring-media/" + "0".repeat(24) + ".mp4",
		]) {
			assert.equal((await request(middleware, url)).status, 404, url);
		}
		const item = groupsOf(page)
			.flatMap((group) => group.items)
			.find((item) => item.kind === "video");
		assert.equal((await request(middleware, item.src, { method: "POST" })).status, 404);
		assert.equal((await request(middleware, "/ordinary-article")).nextCalled, true);
		const response = await request(middleware, item.src);
		assert.equal(response.status, 200);
		assert.equal(response.headers["content-type"], "video/mp4");
		assert.match(response.headers["cache-control"], /^private/);
		assert.match(response.headers["x-robots-tag"], /noindex/);
		assert.deepEqual(response.body, video);
	}));

test("video responses support byte ranges and HEAD without exposing filesystem paths", () =>
	withFixture(fixtureDraft, fixtureComposition, async ({ preview }) => {
		const page = await preview.loadAuthoringProject();
		const server = captureServer();
		preview.authoringPreview().hooks["astro:server:setup"]({ server: server.server });
		const middleware = server.middlewares[0];
		const item = groupsOf(page)
			.flatMap((group) => group.items)
			.find((item) => item.kind === "video");
		const partial = await request(middleware, item.src, { range: "bytes=2-8" });
		assert.equal(partial.status, 206);
		assert.equal(partial.headers["content-range"], `bytes 2-8/${video.length}`);
		assert.equal(partial.headers["content-length"], "7");
		assert.deepEqual(partial.body, video.subarray(2, 9));
		const tail = await request(middleware, item.src, { range: "bytes=30-" });
		assert.equal(tail.status, 206);
		assert.deepEqual(tail.body, video.subarray(30));
		const invalid = await request(middleware, item.src, { range: "bytes=999-" });
		assert.equal(invalid.status, 416);
		assert.equal(invalid.headers["content-range"], `bytes */${video.length}`);
		assert.equal(invalid.body.length, 0);
		const head = await request(middleware, item.src, { method: "HEAD" });
		assert.equal(head.status, 200);
		assert.equal(head.headers["content-length"], String(video.length));
		assert.equal(head.body.length, 0);
	}));
