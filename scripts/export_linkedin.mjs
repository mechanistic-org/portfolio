import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resumeMaster } from "../src/config/resume_master.ts";
import { linkedinMaster } from "../src/config/linkedin_master.ts";
import { linkedinReview } from "../src/config/linkedin_review.ts";
import { formatPeriod, roleById } from "../src/config/resume_projection.ts";
export const EXPORTER_VERSION = "1.0.0";
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
export function buildPacket(
	authority = resumeMaster,
	prose = linkedinMaster,
	review = linkedinReview,
) {
	validateProjection(authority, prose, review);
	const sections = [
		"HEADLINE",
		normalize(prose.tagline),
		"ABOUT",
		normalize(prose.about),
		"EXPERIENCE",
	];
	for (const entry of prose.experience) {
		const role = roleById(authority, entry.roleId);
		sections.push(
			`${normalize(role.channels.linkedinCompany)} | ${normalize(role.channels.linkedinTitle)}\n${formatPeriod(role.period)}\n\n${normalize(entry.blurb)}`,
		);
	}
	const packet = sections.join("\n\n") + "\n";
	if (packet.includes("\u2014")) throw new Error("Outbound packet contains an em dash");
	return Buffer.from(packet, "utf8");
}
export const INPUT_PATHS = [
	"src/config/resume_master.ts",
	"src/config/linkedin_master.ts",
	"src/config/linkedin_review.ts",
	"src/config/resume_projection.ts",
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
	const revision = execFileSync("git", ["rev-parse", "HEAD"], {
		cwd: root,
		encoding: "utf8",
	}).trim();
	const receipt = {
		schemaVersion: 1,
		exporterVersion: EXPORTER_VERSION,
		sourceRevision: revision,
		dirty: !!execFileSync("git", ["status", "--porcelain", "--", ...INPUT_PATHS], {
			cwd: root,
			encoding: "utf8",
		}).trim(),
		inputs,
		packetSha256: sha256(packet),
		bytes: packet.length,
		entries: linkedinMaster.experience.length,
		review: linkedinReview.source,
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
