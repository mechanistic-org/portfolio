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

test("project selections cannot replace the approved resume or LinkedIn Experience", () => {
	const value = record();
	assert.deepEqual(resumeExperience(resumeMaster, [value]), resumeExperience(resumeMaster, []));
	assert.deepEqual(resolve(data(value)).experience, linkedinMaster.experience);
	assert.ok(
		packet(data(value)).includes(
			linkedinMaster.experience.find((e) => e.roleId === "avegant-2015").blurb,
		),
	);
	assert.deepEqual(pdfConfiguration(), {
		url: resumeMaster.pdf.url,
		filename: resumeMaster.pdf.filename,
		sourcePath: "/resume/",
	});
});

test("multiple selected Projects retain employer links without rewriting approved Experience", () => {
	const value = data(record(), record("second-project"));
	const resolved = resolve(value);
	assert.equal(resolved.projects.length, 2);
	assert.deepEqual(resolved.experience, linkedinMaster.experience);
	const role = resumeMaster.career.find((r) => r.id === "avegant-2015");
	for (const p of resolved.projects) {
		assert.equal(p.company, role.channels.linkedinCompany);
		assert.equal(p.position, role.channels.linkedinTitle);
	}
	assert.ok(
		packet(value).includes(
			"Source: https://eriknorris.com/projects/second-project/#engineering-decisions",
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

test("partial or complete project selections preserve all grouped early engagements", () => {
	const group = resumeMaster.experience.find((e) => e.id === "earlier-work");
	for (const records of [
		[record("first-project", group.roleIds[0])],
		group.roleIds.map((id, i) => record("project-" + i, id)),
	]) {
		const projected = resumeExperience(resumeMaster, records).find((e) => e.id === group.id);
		assert.equal(projected.blurb, group.blurb);
		assert.deepEqual(projected.roleIds, group.roleIds);
	}
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
