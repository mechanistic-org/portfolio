import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";
import {
	validateSynopsis,
	synopsisText,
	synopsisForRole,
	synopsisOpening,
} from "../../src/lib/project-synopsis.mjs";
import { buildSynopses, selectSections, verifySiteIndex } from "../../scripts/project_synopses.mjs";
import { buildAuthoredProject } from "../../src/utils/authoredProject.mjs";

const synopsis = () => ({
	version: 1,
	roleId: "avegant-2015",
	paragraphs: [
		{ id: "product", text: "A product & its purpose." },
		{ id: "work", text: "I developed the mechanism." },
		{ id: "outcome", text: "The prototype was evaluated." },
	],
	outputs: {
		resume: ["work"],
		linkedinExperience: ["product", "work", "outcome"],
		linkedinProjects: [
			{ id: "mechanism", title: "Mechanism development", sections: ["mechanism-work"] },
		],
	},
});
test("one canonical edit reaches all selected destinations without inventing an outcome", () => {
	const s = synopsis();
	s.paragraphs[1].text = "I tested the revised mechanism.";
	assert.equal(synopsisText(s, "resume"), s.paragraphs[1].text);
	assert.ok(synopsisText(s).includes(s.paragraphs[1].text));
	assert.ok(
		synopsisForRole(
			[{ roleId: s.roleId, title: "Product", synopsis: s }],
			s.roleId,
			"linkedinExperience",
		).includes(s.paragraphs[1].text),
	);
	assert.equal(synopsisForRole([], s.roleId, "resume"), null);
});
test("missing, duplicate and unknown selections fail; single-paragraph site-only records are valid", () => {
	for (const mutate of [
		(s) => s.paragraphs.push(s.paragraphs[0]),
		(s) => (s.outputs.resume = ["missing"]),
		(s) => (s.outputs.resume = ["work", "work"]),
		(s) => (s.roleId = undefined),
		(s) => (s.version = 2),
		(s) => (s.paragraphs[0].text = "<script>bad</script>"),
		(s) => (s.outputs.unknown = []),
	]) {
		const s = synopsis();
		mutate(s);
		assert.throws(() => validateSynopsis(s));
	}
	assert.ok(
		validateSynopsis({
			version: 1,
			paragraphs: [{ id: "account", text: "A completed design study." }],
		}),
	);
});
test("a body-free lite has the same independent synopsis/hero and needs no gallery", async () => {
	const page = await buildAuthoredProject({
		id: "lite-example",
		body: "",
		data: {
			title: "Lite",
			description: "Study",
			heroImage: "https://assets.eriknorris.com/test.webp",
			synopsis: synopsis(),
			cyberspace: { layout: "authored", stickies: [] },
		},
	});
	const o = synopsisOpening(page);
	assert.equal(o.blocks.length, 3);
	assert.equal(o.image, page.image);
	assert.equal(page.groups.length, 0);
	assert.deepEqual(o.pieces, []);
	assert.match(o.blocks[0], /&amp;/);
	assert.equal(synopsisOpening({ ...page, frontmatter: {} }), null);
});
test("new synopsis preserves article pieces and does not depend on matching article wording", () => {
	const pieces = [{ html: "<p>Independent detailed account.</p>" }];
	const page = { title: "Title", frontmatter: { synopsis: synopsis() }, pieces };
	assert.equal(synopsisOpening(page).pieces, pieces);
	assert.equal(synopsisOpening(page).blocks.length, 3);
});
test("selected sections preserve text, strip evidence/UI markers, and reject missing/overlapping/private content", () => {
	const body =
		'## Mechanism work\n\nA finding.{/* ^[evidence:EV-123456789abc] */}\n\n<span id="link"></span>\n\n<div data-authoring-group="figure"></div>\n\n### Detail\n\nA detail.\n\n## Next\n\nOther work.\n';
	assert.equal(
		selectSections(body, ["mechanism-work"])[0].text,
		"A finding.\n\nDetail\n\nA detail.",
	);
	assert.deepEqual(
		selectSections(body.replaceAll("\n", "\r\n"), ["mechanism-work"]),
		selectSections(body, ["mechanism-work"]),
	);
	for (const locator of [
		"\\\\morespace\\projects\\private.pdf",
		"project-file:private",
		"library-file:private",
		"visualize:private",
	])
		assert.throws(() => selectSections(`## Work\n\n${locator}`, ["work"]), /Unsafe/);
	assert.throws(() => selectSections(body, ["missing"]), /Missing/);
	assert.throws(() => selectSections(body, ["mechanism-work", "detail"]), /Overlapping/);
	assert.throws(() => selectSections("## Work\n\nD:/private/file\n", ["work"]), /Unsafe/);
	assert.throws(() => selectSections("```md\n## Fake\n```", ["fake"]), /Missing/);
});
test("canon projection validates career identity and binds exact changed source bytes", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "synopsis-contract-"));
	try {
		fs.mkdirSync(path.join(root, "career"));
		fs.mkdirSync(path.join(root, "entities/projects/example"), { recursive: true });
		fs.writeFileSync(
			path.join(root, "career/chronology.json"),
			JSON.stringify({ roles: [{ id: "avegant-2015" }] }),
		);
		const file = path.join(root, "entities/projects/example/example.md");
		const s = synopsis();
		fs.writeFileSync(
			file,
			matter.stringify("## Mechanism work\n\nI evaluated the design.\n", {
				title: "Example",
				synopsis: s,
			}),
		);
		const a = buildSynopses(root);
		assert.equal(a.projects[0].linkedinProjects[0].sections[0].text, "I evaluated the design.");
		const site = path.join(root, "site");
		fs.mkdirSync(path.join(site, "example"), { recursive: true });
		fs.copyFileSync(file, path.join(site, "example/index.mdx"));
		const roles = [{ id: "avegant-2015" }];
		assert.equal(verifySiteIndex(a, site, roles), true);
		assert.throws(() => verifySiteIndex({ version: 1, projects: [] }, site, roles), /membership/);
		assert.throws(
			() => verifySiteIndex({ version: 1, projects: [...a.projects, ...a.projects] }, site, roles),
			/membership/,
		);
		const stale = structuredClone(a);
		stale.projects[0].linkedinProjects[0].sections[0].text = "Stale text";
		assert.throws(() => verifySiteIndex(stale, site, roles), /sections differ/);
		fs.appendFileSync(file, "\n");
		assert.notEqual(buildSynopses(root).projects[0].sourceSha256, a.projects[0].sourceSha256);
		s.roleId = "unknown";
		fs.writeFileSync(
			file,
			matter.stringify("## Mechanism work\n\nText.", { title: "Example", synopsis: s }),
		);
		assert.throws(() => buildSynopses(root), /Unknown or duplicate canonical role/);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});

test("section exports keep working links outside the site, including anchors and relative projects", () => {
	const body =
		'## Work\n\nSee [test conditions](#conditions), [related project](../other/), and [reference](https://example.com/test_(detail) "Reference").\n';
	assert.equal(
		selectSections(body, ["work"], "https://eriknorris.com/projects/example/")[0].text,
		"See test conditions (https://eriknorris.com/projects/example/#conditions), related project (https://eriknorris.com/projects/other/), and reference (https://example.com/test_(detail)).",
	);
	assert.throws(() => selectSections(body, ["work"]), /source URL/);
	assert.equal(
		selectSections(
			"## Work\n\n[Cost $& scope](#scope)",
			["work"],
			"https://eriknorris.com/projects/example/",
		)[0].text,
		"Cost $& scope (https://eriknorris.com/projects/example/#scope)",
	);
	assert.equal(
		selectSections("## Work\n\nSee https://example.com/ and <https://example.org/>.", ["work"])[0]
			.text,
		"See https://example.com/ and https://example.org/.",
	);
	for (const target of [
		"file:///D:/private.pdf",
		"javascript:alert",
		"https://user:password@example.com/",
	])
		assert.throws(
			() =>
				selectSections(
					`## Work\n\n[Reference](${target})`,
					["work"],
					"https://eriknorris.com/projects/example/",
				),
			/Unsafe.*link/,
		);
});

test("section exports resolve whole-narrative reference links and omit their definitions", () => {
	const base = "https://eriknorris.com/projects/example/";
	for (const definition of [
		"[r]: #conditions\n\n## Other\n\nOther text.",
		"## Other\n\nOther text.\n\n[r]: #conditions",
	]) {
		const body = `## Work\n\nRead [test conditions][r].\n\n${definition}\n`;
		assert.equal(
			selectSections(body, ["work"], base)[0].text,
			"Read test conditions (https://eriknorris.com/projects/example/#conditions).",
		);
	}
});

test("section link conversion preserves inline and fenced code, including literal definitions", () => {
	const body = [
		"## Work",
		"",
		"Read [test](#test); literal `[test](#test)` and `[test][r]`.",
		"",
		"```md",
		"[test](#test)",
		"[r]: https://example.com/",
		"## Literal heading",
		"**literal emphasis**",
		"```",
		"",
		"Use [test][r].",
		"",
		"## Other",
		"",
		"[r]: #test",
		"",
	].join("\n");
	assert.equal(
		selectSections(body, ["work"], "https://eriknorris.com/projects/example/")[0].text,
		[
			"Read test (https://eriknorris.com/projects/example/#test); literal `[test](#test)` and `[test][r]`.",
			"",
			"```md",
			"[test](#test)",
			"[r]: https://example.com/",
			"## Literal heading",
			"**literal emphasis**",
			"```",
			"",
			"Use test (https://eriknorris.com/projects/example/#test).",
		].join("\n"),
	);
});

test("selected sections keep investigation prose without exporting UI markers", () => {
	const body =
		'## Pads\nChosen pads.\n\n{/* workbench {"id":"pads","title":"Pad tests","summary":"Tests","poster":"https://example.com/pad.jpg","alt":"Pad"} */}\nComparison results.\n{/* /workbench */}';
	const sections = selectSections(body, ["pads"], "https://eriknorris.com/projects/avegant-glyph/");
	assert.match(sections[0].text, /Chosen pads/);
	assert.match(sections[0].text, /Comparison results/);
	assert.doesNotMatch(sections[0].text, /workbench|poster/);
});
