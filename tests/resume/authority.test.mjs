import test from "node:test";
import assert from "node:assert/strict";
import { resumeMaster } from "../../src/config/resume_master.ts";
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

// Compare data through Node's TypeScript module loader, not regular-expression extraction.
test("accepted #152 program-first prose and display mappings survive byte-for-byte", async () => {
	const { execFileSync } = await import("node:child_process");
	const { stripTypeScriptTypes } = await import("node:module");
	const baseline = "1b2cd2f6eaba20544cef087d5e031f1e2dba8bac";
	const read = async (file) =>
		import(
			"data:text/javascript;base64," +
				Buffer.from(
					stripTypeScriptTypes(
						execFileSync("git", ["show", `${baseline}:${file}`], { encoding: "utf8" }),
					),
				).toString("base64")
		);
	const oldResume = (await read("src/config/resume_master.ts")).resumeMaster;
	const oldLinkedIn = (await read("src/config/linkedin_master.ts")).linkedinMaster;
	const { linkedinMaster } = await import("../../src/config/linkedin_master.ts");
	assert.equal(linkedinMaster.tagline, oldLinkedIn.tagline);
	assert.equal(linkedinMaster.about, oldLinkedIn.about);
	linkedinMaster.experience.forEach((entry, index) => {
		const role = resumeMaster.career.find((role) => role.id === entry.roleId);
		assert.equal(entry.blurb, oldLinkedIn.experience[index].blurb);
		assert.equal(role.channels.linkedinTitle, oldLinkedIn.experience[index].role);
		assert.equal(role.channels.linkedinCompany, oldLinkedIn.experience[index].company);
	});
	resumeExperience().forEach((entry, index) => {
		const old = oldResume.experience[index];
		for (const key of ["company", "title", "location", "dates", "blurb", "bullets"])
			assert.deepEqual(entry[key], old[key]);
	});
	assert.deepEqual(resumeMaster.summary, oldResume.summary);
	assert.deepEqual(resumeMaster.competencies, oldResume.competencies);
	assert.deepEqual(resumeMaster.education, oldResume.education);
	assert.deepEqual(resumeMaster.recognition, oldResume.recognition);
});
