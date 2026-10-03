import test from "node:test";
import assert from "node:assert/strict";
import { resumeMaster } from "../../src/config/resume_master.ts";
import { linkedinMaster } from "../../src/config/linkedin_master.ts";
import { linkedinReview } from "../../src/config/linkedin_review.ts";
import { resumeExperience, pdfConfiguration } from "../../src/config/resume_projection.ts";
import { buildPacket, resolveCanonicalContent, sha256 } from "../../scripts/export_linkedin.mjs";
import projectSynopses from "../../src/data/project-synopses.json" with { type: "json" };

function record(slug = "first-project", roleId = "avegant-2015") {
	return {
		slug,
		title: slug === "first-project" ? "First project" : "Second project",
		roleId,
		sourceSha256: "a".repeat(64),
		synopsis: {
			version: 1,
			roleId,
			paragraphs: [
				{ id: "work", text: "Canonical work for " + slug + "." },
				{ id: "outcome", text: "Canonical outcome for " + slug + "." },
			],
			outputs: { resume: ["work"], linkedinExperience: ["work", "outcome"] },
		},
		linkedinProjects: [
			{
				id: slug,
				title: "Selected work: " + slug,
				roleId,
				url: "https://eriknorris.com/projects/" + slug + "/",
				sections: [
					{
						heading: "Engineering decisions",
						anchor: "engineering-decisions",
						text: "Selected evidence for " + slug + ".",
					},
				],
			},
		],
	};
}
const data = (...projects) => ({ version: 1, projects });
const resolve = (value) => resolveCanonicalContent(resumeMaster, linkedinMaster, value);
const packet = (value) =>
	buildPacket(resumeMaster, linkedinMaster, linkedinReview, value).toString("utf8");

test("selected canonical text replaces only its role blurb and preserves detailed résumé claims", () => {
	const value = record();
	const original = resumeExperience(resumeMaster, []);
	const projected = resumeExperience(resumeMaster, [value]);
	const glyph = projected.find((entry) => entry.id === "avegant-2015");
	assert.equal(glyph.blurb, value.synopsis.paragraphs[0].text);
	for (let i = 0; i < original.length; i++) {
		assert.deepEqual(projected[i].bullets, original[i].bullets);
		assert.deepEqual(projected[i].roleIds, original[i].roleIds);
		assert.equal(projected[i].company, original[i].company);
		assert.equal(projected[i].title, original[i].title);
		assert.equal(projected[i].dates, original[i].dates);
		if (projected[i].id !== "avegant-2015") assert.equal(projected[i].blurb, original[i].blurb);
	}
	const projectedLI = resolve(data(value));
	const oldGlyph = linkedinMaster.experience.find((entry) => entry.roleId === "avegant-2015");
	assert.equal(
		projectedLI.experience.find((entry) => entry.roleId === "avegant-2015").blurb,
		value.synopsis.paragraphs.map((p) => p.text).join("\n\n"),
	);
	assert.ok(!packet(data(value)).includes(oldGlyph.blurb));
	assert.deepEqual(pdfConfiguration(), {
		url: resumeMaster.pdf.url,
		filename: resumeMaster.pdf.filename,
		sourcePath: "/resume/",
	});
});

test("multiple projects under one role retain both descriptions and separate employer-linked Projects", () => {
	const first = record(),
		second = record("second-project");
	const blurb =
		"First project\n\nCanonical work for first-project.\n\nSecond project\n\nCanonical work for second-project.";
	assert.equal(
		resumeExperience(resumeMaster, [first, second]).find((entry) => entry.id === "avegant-2015")
			.blurb,
		blurb,
	);
	const resolved = resolve(data(first, second));
	assert.equal(resolved.projects.length, 2);
	const role = resumeMaster.career.find((role) => role.id === "avegant-2015");
	for (const project of resolved.projects) {
		assert.equal(project.company, role.channels.linkedinCompany);
		assert.equal(project.position, role.channels.linkedinTitle);
	}
	const text = packet(data(first, second));
	assert.ok(text.includes("PROJECTS\n\nSelected work: first-project"));
	assert.ok(
		text.includes(
			"Associated with: " + role.channels.linkedinCompany + " | " + role.channels.linkedinTitle,
		),
	);
	assert.ok(
		text.includes("Source: https://eriknorris.com/projects/second-project/#engineering-decisions"),
	);
	assert.ok(
		text.includes(
			"First project\n\nCanonical work for first-project.\n\nCanonical outcome for first-project.",
		),
	);
});

test("channel opt-in leaves legacy text alone and site-only records need no employer", () => {
	const value = record();
	delete value.synopsis.outputs;
	delete value.synopsis.roleId;
	value.roleId = null;
	value.linkedinProjects = [];
	assert.deepEqual(resolve(data(value)).experience, linkedinMaster.experience);
	assert.deepEqual(resumeExperience(resumeMaster, [value]), resumeExperience(resumeMaster, []));
	assert.ok(!packet(data(value)).includes("\n\nPROJECTS\n"));
});

for (const [name, mutate, pattern] of [
	[
		"missing selected role",
		(r) => {
			r.roleId = null;
		},
		/association/,
	],
	[
		"unknown selected role",
		(r) => {
			r.roleId = r.synopsis.roleId = "missing-role";
		},
		/canonical role ID/,
	],
	[
		"mismatched synopsis role",
		(r) => {
			r.synopsis.roleId = "digidesign-2003";
		},
		/association/,
	],
	[
		"missing Project employer",
		(r) => {
			r.linkedinProjects[0].roleId = null;
		},
		/association/,
	],
	[
		"different Project employer",
		(r) => {
			r.linkedinProjects[0].roleId = "digidesign-2003";
		},
		/association/,
	],
	[
		"wrong canonical URL",
		(r) => {
			r.linkedinProjects[0].url = "https://eriknorris.com/projects/other/";
		},
		/canonical project/,
	],
	[
		"external URL",
		(r) => {
			r.linkedinProjects[0].url = "https://example.com/projects/first-project/";
		},
		/canonical project/,
	],
	[
		"missing source digest",
		(r) => {
			delete r.sourceSha256;
		},
		/source digest/,
	],
	[
		"empty selected sections",
		(r) => {
			r.linkedinProjects[0].sections = [];
		},
		/selected sections/,
	],
	[
		"missing section text",
		(r) => {
			r.linkedinProjects[0].sections[0].text = "";
		},
		/section/,
	],
	[
		"missing paragraph selection",
		(r) => {
			r.synopsis.outputs.resume = ["absent"];
		},
		/paragraph selection/,
	],
])
	test("canonical adapter rejects " + name, () => {
		const value = record();
		mutate(value);
		assert.throws(() => resolve(data(value)), pattern);
	});

test("résumé rejects missing or mismatched selected role associations", () => {
	for (const roleId of [null, "missing-role"]) {
		const value = record();
		value.roleId = roleId;
		assert.throws(() => resumeExperience(resumeMaster, [value]), /association|canonical role ID/);
	}
});

test("duplicate project identities and duplicate selected anchors are rejected", () => {
	const first = record(),
		second = record("second-project");
	second.linkedinProjects[0].id = first.linkedinProjects[0].id;
	assert.throws(() => resolve(data(first, second)), /duplicate LinkedIn project/);
	const value = record();
	value.linkedinProjects[0].sections.push(structuredClone(value.linkedinProjects[0].sections[0]));
	assert.throws(() => resolve(data(value)), /duplicate LinkedIn project section/);
});

test("actual Glyph Experience omits the superseded claim and exports two selected Projects", () => {
	const resolved = resolve(projectSynopses);
	const glyph = resolved.experience.find((entry) => entry.roleId === "avegant-2015");
	assert.doesNotMatch(glyph.blurb, /35\.4|77\.87|40% seizure/);
	assert.equal(resolved.projects.filter((project) => project.roleId === "avegant-2015").length, 2);
});

test("resolved content and packet digests change with selected canon prose", () => {
	const before = data(record()),
		after = structuredClone(before);
	after.projects[0].synopsis.paragraphs[0].text = "Revised source-backed work.";
	after.projects[0].linkedinProjects[0].sections[0].text = "Revised section evidence.";
	after.projects[0].sourceSha256 = "b".repeat(64);
	assert.notEqual(sha256(JSON.stringify(resolve(before))), sha256(JSON.stringify(resolve(after))));
	assert.notEqual(sha256(packet(before)), sha256(packet(after)));
	assert.equal(resolve(after).projects[0].sourceSha256, "b".repeat(64));
});
