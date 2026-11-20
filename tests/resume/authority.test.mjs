import test from "node:test";
import assert from "node:assert/strict";
import { resumeMaster } from "../../src/config/resume_master.ts";
import { claimFor } from "../../src/config/claim-presentations.ts";
import { synopsisForRole } from "../../src/lib/project-synopsis.mjs";
import projectSynopses from "../../src/data/project-synopses.json" with { type: "json" };
import {
	resumeExperience,
	jsonResume,
	personSchema,
	identityMetadata,
	pdfConfiguration,
} from "../../src/config/resume_projection.ts";
test("12 distinct engagements project into eight compact entries without company/position joins", () => {
	assert.equal(resumeMaster.career.length, 12);
	assert.equal(resumeExperience().length, 8);
	const reordered = structuredClone(resumeMaster);
	reordered.career.reverse();
	assert.deepEqual(resumeExperience(reordered), resumeExperience());
	assert.equal(resumeMaster.career.filter((r) => r.company === "MECHANISTIC").length, 4);
	const sgi = personSchema().hasOccupation.find(
		(r) => r.roleName === "Mechanical Designer / Technician IV",
	);
	assert.ok(!("startDate" in sgi));
	assert.ok(!("endDate" in sgi));
	assert.equal(jsonResume().work[0].startDate, "2022");
	assert.ok(!("endDate" in jsonResume().work[0]));
});
test("canonical edits propagate to all projections without invented precision or mastery", () => {
	const changed = structuredClone(resumeMaster);
	changed.header.name = "Test Name";
	changed.header.title = "Test title";
	changed.header.contact.email = "test@example.com";
	changed.career[0].canonicalTitle = "Changed canonical title";
	changed.career[0].channels.resumeTitle = "Changed display";
	changed.career[0].period.start = "2023";
	changed.competencies.engineering[0] = "Test competency";
	changed.education[0].school = "Test school";
	changed.recognition[0] = "Test recognition";
	changed.pdf.url = "https://example.com/test.pdf";
	assert.equal(resumeExperience(changed)[0].title, "Changed display");
	assert.equal(resumeExperience(changed)[0].dates, "2023 - Present");
	const json = jsonResume(changed),
		person = personSchema(changed),
		metadata = identityMetadata(changed);
	assert.equal(json.basics.name, "Test Name");
	assert.equal(json.basics.email, "test@example.com");
	assert.equal(json.basics.label, "Test title");
	assert.equal(json.work[0].startDate, "2023");
	assert.equal(json.education[0].institution, "Test school");
	assert.equal(json.awards[0].title, "Test recognition");
	assert.ok(!json.skills.some((s) => "level" in s));
	assert.equal(person.name, "Test Name");
	assert.equal(person.hasOccupation[0].roleName, "Changed canonical title");
	assert.equal(person.alumniOf[0].name, "Test school");
	assert.equal(person.award[0], "Test recognition");
	assert.ok(person.knowsAbout.includes("Test competency"));
	assert.ok(metadata.title.includes("Test title"));
	assert.equal(metadata.author.email, "test@example.com");
	assert.equal(pdfConfiguration(changed).url, "https://example.com/test.pdf");
});
test("emitted Person uses schema.org Role intermediary and education alumni rather than invented employment alumni", () => {
	const person = JSON.parse(JSON.stringify(personSchema()));
	assert.equal(person["@type"], "Person");
	assert.equal(person["@context"], "https://schema.org");
	assert.ok(person.alumniOf.every((e) => e["@type"] === "EducationalOrganization"));
	for (const role of person.hasOccupation) {
		assert.equal(role["@type"], "Role");
		assert.equal(role.hasOccupation["@type"], "Occupation");
		assert.ok(role.hasOccupation.name);
		assert.ok(role.hasOccupation.description);
		if (role.startDate) assert.match(role.startDate, /^\d{4}$/);
	}
});
test("missing and duplicate canonical IDs fail instead of silently selecting an employer", () => {
	for (const mutate of [(a) => a.career.shift(), (a) => a.career.push(a.career[0])]) {
		const a = structuredClone(resumeMaster);
		mutate(a);
		assert.throws(() => resumeExperience(a), /Missing or duplicate/);
	}
});

test("approved hiring edition retains exact copy and prior chronology", async () => {
	const { default: approved } = await import("./fixtures/approved-2026-11-20.json", {
		with: { type: "json" },
	});
	const { linkedinMaster } = await import("../../src/config/linkedin_master.ts");
	assert.equal(linkedinMaster.tagline, approved.headline);
	assert.equal(linkedinMaster.about, approved.about);
	assert.deepEqual(
		resumeMaster.career.map(({ id, period }) => ({ id, period })),
		approved.periods,
	);
	for (const r of approved.roles) {
		const role = resumeMaster.career.find((e) => e.id === r.id);
		assert.equal(role.channels.linkedinTitle, r.title);
		assert.equal(role.channels.linkedinCompany, r.company);
		assert.equal(linkedinMaster.experience.find((e) => e.roleId === r.id).blurb, r.description);
	}
	const resume = jsonResume();
	for (const text of [
		resume.basics.summary,
		...resume.work.flatMap((r) => [r.summary, ...r.highlights]),
		...Object.values(resumeMaster.competencies).flat(),
	]) {
		if (text) assert.ok(approved.resume.includes(text), text);
	}
	const paragraphs = approved.resume
		.split("## Experience\n\n")[1]
		.split("\n## Technical capabilities")[0]
		.replace("<!-- page-break -->", "")
		.split("\n")
		.filter((x) => x.startsWith("- "))
		.map((x) => x.slice(2));
	assert.deepEqual(
		resume.work.flatMap((r) => r.highlights),
		paragraphs,
	);
	assert.equal(resume.work.length, 8);
	assert.equal(resumeMaster.header.title, approved.headline);
	assert.equal(
		resume.work[4].highlights[0],
		"Owned Glyph's whole mechanical bill of materials through tooling, validation and production ramp, including roughly 40 tools.",
	);
});
