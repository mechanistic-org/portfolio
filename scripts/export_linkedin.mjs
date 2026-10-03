import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resumeMaster } from "../src/config/resume_master.ts";
import { linkedinMaster } from "../src/config/linkedin_master.ts";
import { linkedinReview } from "../src/config/linkedin_review.ts";
import { formatPeriod, roleById } from "../src/config/resume_projection.ts";
import { synopsisForRole, validateSynopsis } from "../src/lib/project-synopsis.mjs";
import projectSynopses from "../src/data/project-synopses.json" with { type: "json" };
export const EXPORTER_VERSION = "1.1.0";
export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
export const normalize = (text) => text.replace(/\r\n?/g, "\n").normalize("NFC").trim();
export const factsDigest = (authority) => sha256(JSON.stringify(authority));
export const proseDigest = (prose) =>
	sha256(
		JSON.stringify({
			tagline: normalize(prose.tagline),
			about: normalize(prose.about),
			experience: prose.experience.map((entry) => ({
				roleId: entry.roleId,
				blurb: normalize(entry.blurb),
			})),
		}),
	);
// Regression tripwires only. Exact reviewed prose/facts hashes below are the acceptance gate.
export const forbidden =
	/\b(?:The Challenge|Key Achievements|The Reality|TIR|Foundation Robotics|walking[ -]humanoid|actuator design|designed actuators|direct reports?|hiring authority|people[ -]management|bachelor(?:'s)?|master(?:'s)? degree|engineering degree)\b/i;
export function validateProjection(authority, prose, review = linkedinReview) {
	const canonicalIds = authority.career.map((role) => role.id);
	const mappedIds = prose.experience.map((entry) => entry.roleId);
	const resumeIds = authority.experience.flatMap((entry) => entry.roleIds);
	for (const [name, ids] of [
		["canonical", canonicalIds],
		["LinkedIn", mappedIds],
		["resume", resumeIds],
	]) {
		if (ids.some((id) => !id) || new Set(ids).size !== ids.length)
			throw new Error(`Missing/duplicate ${name} role IDs`);
		if (ids.length !== review.roleIds.length || review.roleIds.some((id) => !ids.includes(id)))
			throw new Error(`Unmapped ${name} role IDs`);
	}
	if (JSON.stringify(mappedIds) !== JSON.stringify(review.roleIds))
		throw new Error("Unapproved LinkedIn order");
	for (const entry of prose.experience) {
		if (Object.keys(entry).some((key) => !["roleId", "blurb"].includes(key)))
			throw new Error("Channel facts must resolve from canonical role IDs");
		const role = roleById(authority, entry.roleId);
		const date = role.period;
		if (date.precision === "year") {
			if (
				!/^[12]\d{3}$/.test(date.start) ||
				(date.end !== null && (!/^[12]\d{3}$/.test(date.end) || date.end < date.start))
			)
				throw new Error(`Invalid year precision: ${role.id}`);
		} else if (date.precision !== "unknown" || date.start !== null || date.end !== null)
			throw new Error(`Invalid unknown dates: ${role.id}`);
		if (
			!role.canonicalTitle ||
			!role.channels.linkedinTitle ||
			!role.channels.linkedinCompany ||
			!role.evidence.source ||
			!role.evidence.review
		)
			throw new Error(`Unreviewed canonical role: ${role.id}`);
	}
	const text = [
		prose.tagline,
		prose.about,
		...prose.experience.flatMap((entry) => {
			const role = roleById(authority, entry.roleId);
			return [role.channels.linkedinCompany, role.channels.linkedinTitle, entry.blurb];
		}),
	].join("\n");
	if (text.includes("\u2014")) throw new Error("Outbound candidate contains an em dash");
	if (forbidden.test(text)) throw new Error("Forbidden #152 framing or claim");
	if (factsDigest(authority) !== review.factsSha256)
		throw new Error(
			"Unapproved canonical fact/title/date drift; evidence and recorded review required",
		);
	if (proseDigest(prose) !== review.proseSha256)
		throw new Error("Unapproved prose drift; lexical checks are not factual review");
}
/** Canon project wording is a local draft layered over the unchanged #152 baseline. */
export function resolveCanonicalContent(authority, prose, data = projectSynopses) {
	if (data.version !== 1 || !Array.isArray(data.projects))
		throw new Error("Invalid canonical synopsis projection");
	const projectIds = new Set();
	const slugs = new Set();
	const projects = [];
	const origin = new URL(
		/^https:\/\//.test(authority.header.contact.portfolio)
			? authority.header.contact.portfolio
			: `https://${authority.header.contact.portfolio}`,
	).origin;
	for (const record of data.projects) {
		validateSynopsis(record.synopsis);
		if (record.synopsis.roleId && record.synopsis.roleId !== record.roleId)
			throw new Error("Synopsis role differs from canonical project association");
		if (typeof record.title !== "string" || !record.title.trim())
			throw new Error("Missing canonical project title");
		if (!record.slug || slugs.has(record.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug))
			throw new Error("Missing or duplicate canonical project slug");
		slugs.add(record.slug);
		if (!/^[0-9a-f]{64}$/.test(record.sourceSha256 ?? ""))
			throw new Error(`Missing canonical source digest: ${record.slug}`);
		if (record.roleId) roleById(authority, record.roleId);
		if (!Array.isArray(record.linkedinProjects ?? []))
			throw new Error("Invalid LinkedIn project selection");
		for (const project of record.linkedinProjects ?? []) {
			if (!project.roleId || !record.roleId)
				throw new Error("Missing LinkedIn project role association");
			const role = roleById(authority, project.roleId);
			if (project.roleId !== record.roleId)
				throw new Error("LinkedIn project association differs from canonical project role");
			if (
				!project.id ||
				projectIds.has(project.id) ||
				typeof project.title !== "string" ||
				!project.title.trim()
			)
				throw new Error("Missing or duplicate LinkedIn project identity");
			projectIds.add(project.id);
			let url;
			try {
				url = new URL(project.url);
			} catch {
				throw new Error("Invalid LinkedIn project source URL");
			}
			if (
				url.protocol !== "https:" ||
				url.origin !== origin ||
				url.pathname.replace(/\/$/, "") !== `/projects/${record.slug}` ||
				url.search
			)
				throw new Error("LinkedIn project URL must resolve to its canonical project");
			if (!Array.isArray(project.sections) || !project.sections.length)
				throw new Error("LinkedIn project requires selected sections");
			const anchors = new Set();
			for (const section of project.sections) {
				if (
					typeof section.heading !== "string" ||
					!section.heading.trim() ||
					typeof section.text !== "string" ||
					!section.text.trim() ||
					!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.anchor ?? "") ||
					anchors.has(section.anchor)
				)
					throw new Error("Invalid or duplicate LinkedIn project section");
				anchors.add(section.anchor);
			}
			projects.push({
				...project,
				slug: record.slug,
				company: role.channels.linkedinCompany,
				position: role.channels.linkedinTitle,
				sourceSha256: record.sourceSha256,
			});
		}
	}
	const experience = prose.experience.map((entry) => ({
		...entry,
		blurb: synopsisForRole(data.projects, entry.roleId, "linkedinExperience") ?? entry.blurb,
	}));
	return { experience, projects };
}
export function buildPacket(
	authority = resumeMaster,
	prose = linkedinMaster,
	review = linkedinReview,
	data = projectSynopses,
) {
	validateProjection(authority, prose, review);
	const resolved = resolveCanonicalContent(authority, prose, data);
	const sections = [
		"HEADLINE",
		normalize(prose.tagline),
		"ABOUT",
		normalize(prose.about),
		"EXPERIENCE",
	];
	for (const entry of resolved.experience) {
		const role = roleById(authority, entry.roleId);
		sections.push(
			`${normalize(role.channels.linkedinCompany)} | ${normalize(role.channels.linkedinTitle)}\n${formatPeriod(role.period)}\n\n${normalize(entry.blurb)}`,
		);
	}
	if (resolved.projects.length) sections.push("PROJECTS");
	for (const project of resolved.projects) {
		const selectedSections = project.sections
			.map((section) => {
				const source = new URL(project.url);
				source.hash = section.anchor;
				return `${normalize(section.heading)}\n\n${normalize(section.text)}\n\nSource: ${source.href}`;
			})
			.join("\n\n");
		sections.push(
			`${normalize(project.title)}\nAssociated with: ${normalize(project.company)} | ${normalize(project.position)}\n\n${selectedSections}`,
		);
	}
	const packet = sections.join("\n\n") + "\n";
	if (packet.includes("\u2014")) throw new Error("Outbound packet contains an em dash");
	if (forbidden.test(packet)) throw new Error("Forbidden framing or claim in resolved packet");
	return Buffer.from(packet, "utf8");
}
export const INPUT_PATHS = [
	"src/config/resume_master.ts",
	"src/data/careerChronology.json",
	"src/config/linkedin_master.ts",
	"src/config/linkedin_review.ts",
	"src/config/resume_projection.ts",
	"src/lib/project-synopsis.mjs",
	"src/data/project-synopses.json",
	"scripts/export_linkedin.mjs",
	"package.json",
];
const MODULE_ROOT = fs.realpathSync(fileURLToPath(new URL("../", import.meta.url)));
const readInputs = () =>
	Object.fromEntries(
		INPUT_PATHS.map((name) => [name, sha256(fs.readFileSync(path.join(MODULE_ROOT, name)))]),
	);
const loadedInputs = readInputs();
export function exportPacket({
	root = fileURLToPath(new URL("../", import.meta.url)),
	output = path.join(root, ".astro/linkedin"),
} = {}) {
	root = fs.realpathSync(root);
	if (root !== fs.realpathSync(fileURLToPath(new URL("../", import.meta.url))))
		throw new Error("Exporter checkout mismatch: data and receipt must share this module root");
	output = path.resolve(output);
	for (const relative of ["src", "public", "dist", "R2_MIRROR"]) {
		const target = path.join(root, relative);
		if (output === target || output.startsWith(target + path.sep))
			throw new Error("Packet output must be a private local candidate directory");
	}
	const inputs = readInputs();
	if (JSON.stringify(inputs) !== JSON.stringify(loadedInputs))
		throw new Error("Exporter inputs changed since module load; start a fresh export process");
	const packet = buildPacket();
	const resolved = resolveCanonicalContent(resumeMaster, linkedinMaster);
	const revision = execFileSync("git", ["rev-parse", "HEAD"], {
		cwd: root,
		encoding: "utf8",
	}).trim();
	const receipt = {
		schemaVersion: 2,
		status: "local-draft",
		exporterVersion: EXPORTER_VERSION,
		sourceRevision: revision,
		dirty: !!execFileSync("git", ["status", "--porcelain", "--", ...INPUT_PATHS], {
			cwd: root,
			encoding: "utf8",
		}).trim(),
		inputs,
		packetSha256: sha256(packet),
		bytes: packet.length,
		entries: resolved.experience.length,
		projectEntries: resolved.projects.length,
		resolvedContentSha256: sha256(JSON.stringify(resolved)),
		canonicalProjects: projectSynopses.projects.map(
			({ slug, roleId, sourceSha256, linkedinProjects }) => ({
				slug,
				roleId,
				sourceSha256,
				projectIds: (linkedinProjects ?? []).map(({ id }) => id),
			}),
		),
		review: linkedinReview.source,
		baselineReview: {
			source: linkedinReview.source,
			factsSha256: linkedinReview.factsSha256,
			proseSha256: linkedinReview.proseSha256,
		},
	};
	fs.mkdirSync(output, { recursive: true });
	fs.writeFileSync(path.join(output, "linkedin.txt"), packet);
	fs.writeFileSync(
		path.join(output, "linkedin.receipt.json"),
		JSON.stringify(receipt, null, 2) + "\n",
		"utf8",
	);
	return receipt;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	try {
		const args = process.argv.slice(2);
		if (args.length && (args.length !== 2 || args[0] !== "--output"))
			throw new Error("Usage: node scripts/export_linkedin.mjs [--output <private-directory>]");
		console.log(JSON.stringify(exportPacket(args.length ? { output: args[1] } : {}), null, 2));
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}
