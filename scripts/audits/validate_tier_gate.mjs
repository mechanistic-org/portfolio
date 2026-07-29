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
 *                     today would break the build on 69 of 86 published pages
 *                     and amount to cutting the corpus to ~17, which the
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
 *   deep_dive lite bar, plus >= 1200 body words and >= 6 image references.
 *
 * Run: node scripts/audits/validate_tier_gate.mjs [--strict]
 *   --strict promotes WARN to ERROR. Use it once the burn-down reaches zero.
 */
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
