import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "src/data/careerChronology.json");
function validateProjection(projection) {
	if (projection.schemaVersion !== 1 || !Array.isArray(projection.roles) || !projection.projects)
		throw new Error("Invalid career chronology projection");
	if (new Set(projection.roles.map((role) => role.id)).size !== projection.roles.length)
		throw new Error("Duplicate career role");
	for (const [id, period] of Object.entries(projection.projects)) {
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Invalid career project: ${id}`);
		if (
			[period.start, period.end].some((date) => date !== null && !Number.isFinite(Date.parse(date)))
		)
			throw new Error(`Invalid career date: ${id}`);
		if (period.end && (!period.start || period.end < period.start))
			throw new Error(`Reversed career span: ${id}`);
	}
}
if (process.argv.includes("--check") && !process.env.CANON_ROOT) {
	validateProjection(JSON.parse(fs.readFileSync(target, "utf8")));
	console.log("Career projection valid; canonical parity check requires CANON_ROOT.");
	process.exit(0);
}
const canon = process.env.CANON_ROOT ?? "D:/GitHub/portfolio-canon";
const authority = JSON.parse(fs.readFileSync(path.join(canon, "career/chronology.json"), "utf8"));
const roles = new Map(authority.roles.map((role) => [role.id, role]));
if (roles.size !== authority.roles.length) throw new Error("Duplicate career role");
const projects = {};
const iso = (value) => {
	if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(value)) return null;
	const parsed = new Date(value);
	return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
};
for (const entry of fs.readdirSync(path.join(canon, "entities/projects"), {
	withFileTypes: true,
})) {
	if (!entry.isDirectory()) continue;
	const filename = path.join(canon, "entities/projects", entry.name, `${entry.name}.md`);
	if (!fs.existsSync(filename)) continue;
	const raw = fs.readFileSync(filename, "utf8");
	const fm = YAML.parse(raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "");
	if (!fm) throw new Error(`Missing project frontmatter: ${entry.name}`);
	const start = iso(fm.date);
	const end = iso(fm.endDate);
	if (start) {
		projects[entry.name] = {
			start,
			end: end && end >= start ? end : null,
			basis: "project-record",
		};
		continue;
	}
	const placement = authority.placements[entry.name];
	if (!placement || placement.basis === "unresolved") {
		projects[entry.name] = { start: null, end: null, basis: "unresolved" };
		continue;
	}
	const role = placement.roleId ? roles.get(placement.roleId) : null;
	if (placement.roleId && !role) throw new Error(`Unknown career role: ${placement.roleId}`);
	const startYear = role ? Number(role.period.start) : placement.startYear;
	const endYear = role ? Number(role.period.end) : placement.endYear;
	if (
		![startYear, endYear].every((year) => Number.isInteger(year) && year >= 1900 && year < 2100) ||
		endYear < startYear
	)
		throw new Error(`Invalid career period: ${entry.name}`);
	projects[entry.name] = {
		start: new Date(Date.UTC(startYear, 0, 1)).toISOString(),
		end: endYear === startYear ? null : new Date(Date.UTC(endYear, 0, 1)).toISOString(),
		basis: placement.basis,
		...(placement.approximate ? { approximate: true } : {}),
		...(role ? { context: `${role.company} period` } : {}),
	};
}
for (const id of Object.keys(authority.placements))
	if (!projects[id]) throw new Error(`Placement without project: ${id}`);
// Existing published records awaiting entity migration retain their date metadata
// here in canon, with original source identity. They are not re-authored in the UI.
for (const [id, period] of Object.entries(authority.legacyProjectPeriods ?? {})) {
	if (projects[id])
		throw new Error(`Remove superseded legacy period now that a project entity exists: ${id}`);
	const start = iso(period.start);
	const end = iso(period.end);
	projects[id] = {
		start,
		end: start && end && end >= start ? end : null,
		basis: start ? "published-record" : "unresolved",
	};
}
const projection = { schemaVersion: 1, roles: authority.roles, projects };
validateProjection(projection);
const output = JSON.stringify(projection, null, 2) + "\n";
if (process.argv.includes("--write")) fs.writeFileSync(target, output);
else if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== output)
	throw new Error(
		"Career projection differs from canon; run project_career.mjs --write with the intended CANON_ROOT",
	);
console.log(
	`Career chronology: ${roles.size} roles and ${Object.keys(projects).length} project periods ${process.argv.includes("--write") ? "projected" : "verified"}.`,
);
