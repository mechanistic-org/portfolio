/**
 * Build-blocking publication integrity.
 *
 * This validator rejects demonstrably invalid public state. It deliberately
 * does not score readiness, require optional instruments, or count words,
 * images, galleries, scars, cast members, or citations.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";

export const FORBIDDEN_PUBLIC_STATE = [
	{ re: /upgraded to the Hyperspace/i, why: "internal build message printed to visitors" },
	{ re: /Group:<\/strong>\s*(Other|N\/A)/i, why: "placeholder taxonomy rendered as content" },
	{ re: /dQw4w9WgXcQ/, why: "rickroll embed" },
	{ re: /NeilArmstrong\.glb/i, why: "Google demo spacesuit presented as portfolio 3D content" },
	{ re: /^[ \t]*:::/m, why: "leaked markdown directive fence (renders as literal text)" },
	{ re: /^teamSize:\s*Unknown\s*$/m, why: '"Unknown" is not a team size' },
	{ re: /^duration:\s*Active\s*$/m, why: '"Active" on a finished project is a false claim' },
	{ re: /\b(lorem ipsum|TBD|FIXME|XXX)\b/i, why: "placeholder text" },
];

function projectFiles(projectsRoot) {
	if (!fs.existsSync(projectsRoot)) return [];
	const files = [];
	for (const dir of fs.readdirSync(projectsRoot, { withFileTypes: true })) {
		if (!dir.isDirectory()) continue;
		for (const file of fs.readdirSync(path.join(projectsRoot, dir.name))) {
			if (file.endsWith(".mdx")) files.push(path.join(projectsRoot, dir.name, file));
		}
	}
	return files.sort();
}

function canonRecords(canonRoot) {
	const projectsRoot = path.join(canonRoot, "entities", "projects");
	if (!fs.existsSync(projectsRoot)) return [];
	const records = [];
	for (const dir of fs.readdirSync(projectsRoot, { withFileTypes: true })) {
		if (!dir.isDirectory()) continue;
		const record = path.join(projectsRoot, dir.name, `${dir.name}.md`);
		if (fs.existsSync(record)) records.push(record);
	}
	return records.sort();
}

function competencyDrift(repoRoot) {
	const resumePath = path.join(repoRoot, "src", "config", "resume_master.ts");
	const methodPath = path.join(repoRoot, "src", "config", "method_nodes.ts");
	if (!fs.existsSync(resumePath) || !fs.existsSync(methodPath)) return [];

	const resume = fs.readFileSync(resumePath, "utf8");
	const competencyBlock = resume.match(/competencies:\s*\{([\s\S]*?)\n\t\},/);
	if (!competencyBlock) return [];
	const claimed = [...competencyBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

	const method = fs.readFileSync(methodPath, "utf8");
	const coverageBlock = method.match(/COMPETENCY_COVERAGE[^{]*\{([\s\S]*?)\n\};/);
	if (!coverageBlock) return ["method_nodes.ts has no COMPETENCY_COVERAGE map"];
	const accounted = new Set([...coverageBlock[1].matchAll(/"([^"]+)":/g)].map((match) => match[1]));
	const nodeIds = new Set([...method.matchAll(/\n\t\tid:\s*"([^"]+)"/g)].map((match) => match[1]));
	const referenced = [...coverageBlock[1].matchAll(/:\s*"([^"]+)"/g)].map((match) => match[1]);

	const findings = [];
	for (const competency of claimed) {
		if (!accounted.has(competency)) {
			findings.push(`resume competency not accounted for in COMPETENCY_COVERAGE: "${competency}"`);
		}
	}
	for (const nodeId of referenced) {
		if (!nodeIds.has(nodeId)) {
			findings.push(`COMPETENCY_COVERAGE points at a non-existent node id: "${nodeId}"`);
		}
	}
	return findings;
}

function loadEvidenceRegistry(evidenceRoot, evidenceRegistry, errors) {
	if (!fs.existsSync(evidenceRoot) || !fs.existsSync(evidenceRegistry)) return undefined;
	const registry = new Map();
	const root = path.resolve(evidenceRoot);
	try {
		for (const [index, line] of fs
			.readFileSync(evidenceRegistry, "utf8")
			.split(/\r?\n/)
			.entries()) {
			if (!line.trim()) continue;
			const row = JSON.parse(line);
			if (Object.keys(row).sort().join(",") !== "id,path,sha256") {
				throw new Error(`line ${index + 1} has invalid keys`);
			}
			if (registry.has(row.id)) throw new Error(`duplicate evidence id: ${row.id}`);
			const evidencePath = path.resolve(root, ...String(row.path).split("/"));
			if (evidencePath !== root && !evidencePath.startsWith(root + path.sep)) {
				throw new Error(`evidence path escapes root: ${row.id}`);
			}
			if (!fs.existsSync(evidencePath) || !fs.statSync(evidencePath).isFile()) {
				throw new Error(`evidence file missing: ${row.id}`);
			}
			const actual = crypto
				.createHash("sha256")
				.update(fs.readFileSync(evidencePath))
				.digest("hex");
			if (actual !== row.sha256) throw new Error(`evidence hash mismatch: ${row.id}`);
			registry.set(row.id, row);
		}
	} catch (error) {
		errors.push({
			file: evidenceRegistry,
			why: `invalid local evidence registry: ${error.message}`,
		});
		return null;
	}
	return registry;
}

function auditCanon(canonRoot, evidence, errors) {
	const records = canonRecords(canonRoot);
	for (const record of records) {
		let data;
		try {
			({ data } = matter(fs.readFileSync(record, "utf8")));
		} catch (error) {
			errors.push({ file: record, why: `unparseable canon frontmatter: ${error.message}` });
			continue;
		}
		if (data.sources !== undefined && !Array.isArray(data.sources)) {
			errors.push({ file: record, why: "canon `sources` must be a list" });
			continue;
		}
		for (const source of data.sources || []) {
			if (typeof source !== "string" || !source.startsWith("evidence:")) {
				errors.push({
					file: record,
					why: `canon source is not an opaque evidence id: ${String(source)}`,
				});
				continue;
			}
			const evidenceId = source.slice("evidence:".length);
			if (evidence instanceof Map && !evidence.has(evidenceId)) {
				errors.push({
					file: record,
					why: `canon source is absent from local registry: ${evidenceId}`,
				});
			}
		}
	}
	return records.length;
}

export function auditPublicationIntegrity(options = {}) {
	const repoRoot = path.resolve(options.repoRoot || ".");
	const projectsRoot = path.resolve(
		options.projectsRoot || path.join(repoRoot, "src", "content", "projects"),
	);
	const canonRoot = path.resolve(
		options.canonRoot || process.env.CANON_ROOT || "D:\\GitHub\\portfolio-canon",
	);
	const evidenceRoot = path.resolve(
		options.evidenceRoot || process.env.EVIDENCE_ROOT || "D:\\GitHub\\portfolio-evidence",
	);
	const evidenceRegistry = path.resolve(
		options.evidenceRegistry ||
			process.env.EVIDENCE_REGISTRY ||
			path.join(evidenceRoot, "registry", "evidence.jsonl"),
	);
	const errors = [];
	const files = projectFiles(projectsRoot);

	for (const file of files) {
		const raw = fs.readFileSync(file, "utf8");
		try {
			matter(raw);
		} catch (error) {
			errors.push({ file, why: `unparseable frontmatter: ${error.message}` });
			continue;
		}
		for (const { re, why } of FORBIDDEN_PUBLIC_STATE) {
			if (re.test(raw)) errors.push({ file, why });
		}
	}

	if (options.checkCompetency !== false) {
		for (const why of competencyDrift(repoRoot)) {
			errors.push({ file: path.join(repoRoot, "src", "config", "method_nodes.ts"), why });
		}
	}

	const evidence = loadEvidenceRegistry(evidenceRoot, evidenceRegistry, errors);
	const canonCount = auditCanon(canonRoot, evidence, errors);
	return {
		errors,
		projectCount: files.length,
		canonCount,
		canonAvailable: fs.existsSync(path.join(canonRoot, "entities", "projects")),
		evidenceAvailable: evidence instanceof Map,
	};
}

function runCli() {
	const result = auditPublicationIntegrity();
	console.log("-------------------------------------------------------");
	console.log("Publication integrity");
	console.log("-------------------------------------------------------");
	console.log(`project records : ${result.projectCount}`);
	console.log(
		`canon records   : ${result.canonAvailable ? result.canonCount : "unavailable - skipped"}`,
	);
	console.log(
		`local evidence  : ${result.evidenceAvailable ? "verified" : "unavailable - hash verification skipped"}`,
	);
	if (result.errors.length) {
		console.error("\nERRORS (build-blocking invalid public state):");
		for (const error of result.errors) console.error(`  ${error.file}\n      ${error.why}`);
		console.error(`\nFAIL: ${result.errors.length} publication-integrity error(s).`);
		process.exitCode = 1;
		return;
	}
	console.log("\nOK: no publication-integrity errors.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
	runCli();
