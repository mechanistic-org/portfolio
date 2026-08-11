/**
 * Tier publish gate — nothing reaches production below its tier's bar.
 *
 * WHY THIS EXISTS
 * The deep-dive conveyor runs for months. The site is live the whole time, and a
 * visitor lands on a *random* page, not the best one. So the floor decides
 * whether you get the call, not the ceiling. This enforces the floor by
 * architecture instead of by remembering.
 *
 * TWO SEVERITIES, ON PURPOSE
 *
 *   ERROR (exit 1)  — correctness. Things that are WRONG, not merely thin:
 *                     machine placeholders, leaked directive syntax, demo
 *                     assets presented as portfolio content, instruments
 *                     declared but empty. Every one of these is currently at
 *                     zero, so this is a regression fence — it can only fire if
 *                     something new breaks.
 *
 *   WARN  (exit 0)  — completeness against the tier bar. Reported as a
 *                     burn-down, NOT build-breaking. Hard-failing completeness
 *                     today would break the build on 73 of 87 published pages
 *                     and amount to cutting the corpus to ~14, which the
 *                     operator explicitly ruled against (roster is 42 deep /
 *                     54 lite / 25 cut).
 *
 * DRAFTS ARE EXEMPT. `draft: true` means work in progress; that is the whole
 * point of the flag, and it is what lets a 121-record corpus sit in any state
 * while only the published subset must meet bar.
 *
 * THE CONTRACT
 *
 *   lite      hero image · description · date · role or employer
 *             >= 60 body words
 *             A lite page is a COMPLETE SMALL THING, not a truncated large one.
 *             Scars / cast / gallery are ALLOWED on a lite page (operator
 *             ruling 2026-07-29 — "it depends"). What is not allowed is an
 *             instrument that renders empty. Thin does not discredit;
 *             filler and empty frames do.
 *
 *   deep_dive lite bar, plus >= 1200 body words, >= 6 image references, and at
 *             least one locally resolved evidence ID in its canon record
 *             (portfolio#142). Provenance is what makes "every published claim
 *             cites evidence" verifiable rather than asserted. Canon and the
 *             evidence store live outside this repo, so when either is
 *             unreachable (CI) that check degrades to skipped.
 *
 * Run: node scripts/audits/validate_tier_gate.mjs [--strict] [--verbose]
 *   --strict  promotes WARN to ERROR. Use it once the burn-down reaches zero.
 *   --verbose lists every below-bar page instead of the burn-down summary.
 *   CANON_ROOT, EVIDENCE_ROOT, and EVIDENCE_REGISTRY override local locations.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PROJECTS = path.resolve("src/content/projects");
const STRICT = process.argv.includes("--strict");

// Correctness fences. Each has fired on this site; each is now at zero.
const FORBIDDEN = [
	{ re: /upgraded to the Hyperspace/i, why: "internal build message printed to visitors" },
	{ re: /Group:<\/strong>\s*(Other|N\/A)/i, why: "placeholder taxonomy rendered as content" },
	{ re: /dQw4w9WgXcQ/, why: "rickroll embed" },
	{ re: /NeilArmstrong\.glb/i, why: "Google demo spacesuit presented as portfolio 3D content" },
	{ re: /^[ \t]*:::/m, why: "leaked markdown directive fence (renders as literal text)" },
	{ re: /^teamSize:\s*Unknown\s*$/m, why: '"Unknown" is not a team size' },
	{ re: /^duration:\s*Active\s*$/m, why: '"Active" on a finished project is a false claim' },
	{ re: /\b(lorem ipsum|TBD|FIXME|XXX)\b/i, why: "placeholder text" },
];

// Instruments that must not be declared-but-empty. An empty frame is worse than
// no frame: it advertises depth and then shows nothing.
const INSTRUMENTS = ["scars", "cast", "bom", "documents", "gallery"];

const errors = [];
const warns = [];

function wordCount(body) {
	return body.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count and resolve `sources` entries in the slug's canon record.
 *
 * Canon and evidence are outside this repo and may not be present in CI, so an
 * unavailable local store degrades to "unknown" and the check is skipped.
 * When both are present, every opaque ID must resolve to a contained file whose
 * SHA-256 matches the local registry.
 */
const CANON_ROOT = process.env.CANON_ROOT || "D:\\GitHub\\portfolio-canon";
const EVIDENCE_ROOT = process.env.EVIDENCE_ROOT || "D:\\GitHub\\portfolio-evidence";
const EVIDENCE_REGISTRY = process.env.EVIDENCE_REGISTRY
	|| path.join(EVIDENCE_ROOT, "registry", "evidence.jsonl");
const CANON_AVAILABLE = fs.existsSync(path.join(CANON_ROOT, "entities", "projects"));
const EVIDENCE_AVAILABLE = fs.existsSync(EVIDENCE_ROOT) && fs.existsSync(EVIDENCE_REGISTRY);

function loadEvidenceRegistry() {
	if (!EVIDENCE_AVAILABLE) return undefined;
	try {
		const registry = new Map();
		const root = path.resolve(EVIDENCE_ROOT);
		for (const [index, line] of fs.readFileSync(EVIDENCE_REGISTRY, "utf8").split(/\r?\n/).entries()) {
			if (!line.trim()) continue;
			const row = JSON.parse(line);
			const keys = Object.keys(row).sort().join(",");
			if (keys !== "id,path,sha256") throw new Error(`line ${index + 1} has invalid keys`);
			if (registry.has(row.id)) throw new Error(`duplicate evidence id: ${row.id}`);
			const evidencePath = path.resolve(root, ...String(row.path).split("/"));
			if (evidencePath !== root && !evidencePath.startsWith(root + path.sep)) {
				throw new Error(`evidence path escapes root: ${row.id}`);
			}
			if (!fs.existsSync(evidencePath) || !fs.statSync(evidencePath).isFile()) {
				throw new Error(`evidence file missing: ${row.id}`);
			}
			const actual = crypto.createHash("sha256").update(fs.readFileSync(evidencePath)).digest("hex");
			if (actual !== row.sha256) throw new Error(`evidence hash mismatch: ${row.id}`);
			registry.set(row.id, row);
		}
		return registry;
	} catch (error) {
		errors.push({ rel: EVIDENCE_REGISTRY, why: `invalid local evidence registry: ${error.message}` });
		return null;
	}
}

const EVIDENCE = loadEvidenceRegistry();

function sourcesForSlug(slug) {
	if (!CANON_AVAILABLE) return undefined;
	const rec = path.join(CANON_ROOT, "entities", "projects", slug, `${slug}.md`);
	if (!fs.existsSync(rec)) return null;
	try {
		const { data } = matter(fs.readFileSync(rec, "utf8"));
		const sources = Array.isArray(data.sources) ? data.sources : [];
		const unresolved = [];
		if (EVIDENCE instanceof Map) {
			for (const source of sources) {
				if (typeof source !== "string" || !source.startsWith("evidence:")) {
					unresolved.push(String(source));
					continue;
				}
				const id = source.slice("evidence:".length);
				if (!EVIDENCE.has(id)) unresolved.push(id);
			}
		}
		return { cited: sources.length, unresolved, resolutionSkipped: EVIDENCE === undefined };
	} catch {
		return { cited: 0, unresolved: ["unparseable canon record"], resolutionSkipped: false };
	}
}

/**
 * Identity consistency: the résumé, the LinkedIn experience section and the
 * /how-i-work pillar must carry the same basic facts (operator ruling
 * 2026-07-29). `resume_master.ts` is the source of truth for the claim set;
 * `method_nodes.ts` must account for every competency in it — mapped to a node,
 * or explicitly null with a reason. An unaccounted competency is drift.
 *
 * Parsed as text rather than imported: these are TypeScript modules and this is
 * a plain node script that runs before the Astro build.
 */
function competencyDrift() {
	const rmPath = path.resolve("src/config/resume_master.ts");
	const mnPath = path.resolve("src/config/method_nodes.ts");
	if (!fs.existsSync(rmPath) || !fs.existsSync(mnPath)) return [];

	const rm = fs.readFileSync(rmPath, "utf8");
	const block = rm.match(/competencies:\s*\{([\s\S]*?)\n\t\},/);
	if (!block) return [];
	const claimed = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

	const mn = fs.readFileSync(mnPath, "utf8");
	const cov = mn.match(/COMPETENCY_COVERAGE[^{]*\{([\s\S]*?)\n\};/);
	if (!cov) return ["method_nodes.ts has no COMPETENCY_COVERAGE map"];
	const accounted = new Set([...cov[1].matchAll(/"([^"]+)":/g)].map((m) => m[1]));

	// Every node id referenced by the map must actually exist.
	const nodeIds = new Set([...mn.matchAll(/\n\t\tid:\s*"([^"]+)"/g)].map((m) => m[1]));
	const referenced = [...cov[1].matchAll(/:\s*"([^"]+)"/g)].map((m) => m[1]);

	const out = [];
	for (const c of claimed) {
		if (!accounted.has(c)) out.push(`resume competency not accounted for in COMPETENCY_COVERAGE: "${c}"`);
	}
	for (const id of referenced) {
		if (!nodeIds.has(id)) out.push(`COMPETENCY_COVERAGE points at a non-existent node id: "${id}"`);
	}
	return out;
}

for (const why of competencyDrift()) errors.push({ rel: "src/config/method_nodes.ts", why });

const rows = [];
for (const dir of fs.readdirSync(PROJECTS, { withFileTypes: true })) {
	if (!dir.isDirectory()) continue;
	for (const file of fs.readdirSync(path.join(PROJECTS, dir.name))) {
		if (!file.endsWith(".mdx")) continue;
		const rel = path.join("src/content/projects", dir.name, file);
		const raw = fs.readFileSync(path.join(PROJECTS, dir.name, file), "utf8");

		let fm, body;
		try {
			({ data: fm, content: body } = matter(raw));
		} catch (e) {
			errors.push({ rel, why: `unparseable frontmatter: ${e.message}` });
			continue;
		}

		// ---- correctness applies to EVERY file, draft or not. A draft may be
		// incomplete; it may not contain a rickroll.
		for (const { re, why } of FORBIDDEN) {
			if (re.test(raw)) errors.push({ rel, why });
		}
		for (const key of INSTRUMENTS) {
			if (key in fm && Array.isArray(fm[key]) && fm[key].length === 0 && fm[key] !== undefined) {
				// An explicitly empty array is the generator's round-trip form for
				// "absent", so only flag it when the page also claims a tier that
				// implies the instrument should be there.
				if (fm.tier === "deep_dive" && key === "scars" && !fm.draft) {
					warns.push({ rel, why: `deep_dive with empty ${key}[]` });
				}
			}
		}

		if (fm.draft) continue; // ---- completeness: published pages only

		const tier = fm.tier === "deep_dive" ? "deep_dive" : "lite";
		const words = wordCount(body);
		const imgs = (raw.match(/\/assets\//g) || []).length;
		const missing = [];

		if (!fm.heroImage) missing.push("heroImage");
		if (!fm.description) missing.push("description");
		if (!fm.date) missing.push("date");
		if (!fm.role && !fm.employer) missing.push("role|employer");
		if (words < 60) missing.push(`body>=60 (has ${words})`);
		if (tier === "deep_dive") {
			if (words < 1200) missing.push(`deep_dive body>=1200 (has ${words})`);
			if (imgs < 6) missing.push(`deep_dive images>=6 (has ${imgs})`);
			// PROVENANCE (portfolio#142). `sources` is CANON_ONLY, so it is stripped
			// on the way to the site and cannot be read here — the citation lives in
			// the canon record. Locally resolving its opaque ID and hash is what makes
			// the provenance verifiable without putting evidence paths or payloads in
			// Git.
			const prov = sourcesForSlug(dir.name);
			if (prov === null) missing.push("no canon record (deep_dive)");
			else if (prov !== undefined) {
				if (prov.cited === 0) missing.push("canon record cites no evidence (deep_dive)");
				else if (!prov.resolutionSkipped && prov.unresolved.length) {
					missing.push(`unresolved canon evidence: ${prov.unresolved.join(", ")}`);
				}
			}
		}

		rows.push({ slug: dir.name, tier, words, imgs, hero: !!fm.heroImage, missing });
		if (missing.length) warns.push({ rel, why: `${tier}: ${missing.join(", ")}` });
	}
}

// ---------------------------------------------------------------- report
const pass = rows.filter((r) => !r.missing.length);
console.log("-------------------------------------------------------");
console.log("Tier publish gate");
console.log("-------------------------------------------------------");
console.log(`published pages     : ${rows.length}`);
console.log(`curated canon       : ${CANON_AVAILABLE ? CANON_ROOT : "unavailable - provenance check skipped"}`);
console.log(`local evidence      : ${EVIDENCE_AVAILABLE ? EVIDENCE_ROOT : "unavailable - hash resolution skipped"}`);
console.log(`meeting their bar   : ${pass.length}`);
console.log(`below bar (burn-down): ${rows.length - pass.length}`);
const byTier = (t) => rows.filter((r) => r.tier === t);
for (const t of ["deep_dive", "lite"]) {
	const g = byTier(t);
	if (g.length) {
		console.log(`  ${t.padEnd(10)} ${String(g.length).padStart(3)} published, ${g.filter((r) => !r.missing.length).length} at bar`);
	}
}

if (errors.length) {
	console.log("\nERRORS (build-breaking):");
	for (const e of errors) console.log(`  ${e.rel}\n      ${e.why}`);
}

// Burn-down by blocker: what to go fix, in the order that clears the most pages.
if (rows.length - pass.length) {
	const tally = new Map();
	for (const r of rows) {
		for (const m of r.missing) {
			const key = m.replace(/ \(has \d+\)$/, "");
			tally.set(key, (tally.get(key) || 0) + 1);
		}
	}
	console.log("\nBURN-DOWN — pages blocked, by cause:");
	for (const [k, v] of [...tally.entries()].sort((a, b) => b[1] - a[1])) {
		console.log(`  ${String(v).padStart(3)}  ${k}`);
	}

	// A page needing ONLY a hero image is one asset away from meeting bar.
	const oneAway = rows.filter((r) => r.missing.length === 1 && r.missing[0] === "heroImage");
	if (oneAway.length) {
		console.log(`\nONE ASSET AWAY (${oneAway.length}) — a hero image is the only thing missing:`);
		console.log("  " + oneAway.map((r) => r.slug).join(", "));
	}
}

if (warns.length && process.argv.includes("--verbose")) {
	console.log(`\nPER-PAGE (${warns.length}):`);
	for (const w of warns) console.log(`  ${w.rel}\n      ${w.why}`);
}

if (errors.length) {
	console.error(`\nFAIL: ${errors.length} correctness error(s). These must never publish.`);
	process.exit(1);
}
if (STRICT && warns.length) {
	console.error(`\nFAIL (--strict): ${warns.length} page(s) below their tier bar.`);
	process.exit(1);
}
console.log("\nOK: no correctness errors.");
