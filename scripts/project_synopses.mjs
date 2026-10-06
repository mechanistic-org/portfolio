import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";
import { Lexer } from "marked";
import { validateSynopsis } from "../src/lib/project-synopsis.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const anchor = (text) =>
	text
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-") || "section";

export function selectSections(body, selected) {
	body = body.replace(/\r\n?/g, "\n");
	// Only narrative headings before canon's appended dossier can be reused.
	body = body.split(/^## (?:Cast|Galleries|BOM|Timeline)\s*$/m)[0];
	const used = new Set();
	let cursor = 0;
	const headings = Lexer.lex(body).flatMap((token) => {
		const start = body.indexOf(token.raw, cursor);
		cursor = start + token.raw.length;
		if (token.type !== "heading") return [];
		const heading = token.text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "");
		const base = anchor(heading);
		let id = base;
		for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
		used.add(id);
		return [{ heading, anchor: id, depth: token.depth, start, bodyStart: cursor }];
	});
	const ranges = selected.map((id) => {
		const h = headings.find((h) => h.anchor === id);
		if (!h) throw new Error(`Missing selected section ${id}`);
		const end = headings.find((n) => n.start > h.start && n.depth <= h.depth)?.start ?? body.length;
		return { ...h, end };
	});
	for (const a of ranges)
		for (const b of ranges)
			if (a !== b && a.start <= b.start && a.end > b.start)
				throw new Error("Overlapping section selections");
	return ranges.map((h) => {
		const text = body
			.slice(h.bodyStart, h.end)
			.replace(/\{\/\*\s*\^\[evidence:[^\]]+\]\s*\*\/\}/g, "")
			.replace(/<div\s+data-authoring-group=[^>]+>\s*<\/div>/g, "")
			.replace(/<span\s+id=[^>]*>\s*<\/span>/g, "")
			.replace(/<!--[^]*?-->/g, "")
			.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
			.replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g, "$1 ($2)")
			.replace(/^#{1,6}\s+/gm, "")
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\n{3,}/g, "\n\n")
			.trim();
		if (
			!text ||
			/<[^>]+>|\{\/\*|evidence:|data-authoring-group|\b(?:file|project-file|library-file|visualize):|\\\\|\b[A-Z]:[\\/]/i.test(
				text,
			)
		)
			throw new Error(`Unsafe or empty selected section ${h.anchor}`);
		return { heading: h.heading, anchor: h.anchor, text };
	});
}

export function buildSynopses(canonRoot) {
	const roles = JSON.parse(
		fs.readFileSync(path.join(canonRoot, "career/chronology.json"), "utf8"),
	).roles;
	const folder = path.join(canonRoot, "entities/projects");
	const projects = [];
	for (const slug of fs.readdirSync(folder).sort()) {
		const file = path.join(folder, slug, `${slug}.md`);
		if (!fs.existsSync(file)) continue;
		const bytes = fs.readFileSync(file);
		const record = matter(bytes.toString("utf8"));
		if (!record.data.synopsis) continue;
		const synopsis = validateSynopsis(record.data.synopsis);
		if (synopsis.roleId && roles.filter((r) => r.id === synopsis.roleId).length !== 1)
			throw new Error(`Unknown or duplicate canonical role ${synopsis.roleId}`);
		const url = `https://eriknorris.com/projects/${slug}/`;
		projects.push({
			slug,
			title: record.data.title,
			roleId: synopsis.roleId ?? null,
			synopsis,
			linkedinProjects: (synopsis.outputs?.linkedinProjects ?? []).map((p) => ({
				id: p.id,
				title: p.title,
				roleId: synopsis.roleId,
				url,
				sections: selectSections(record.content, p.sections),
			})),
			sourceSha256: hash(bytes),
		});
	}
	return { version: 1, projects };
}

export function verifySiteIndex(generated, directory, roles) {
	const actualSlugs = fs
		.readdirSync(directory, { recursive: true })
		.filter((name) => name.endsWith("index.mdx"))
		.flatMap((name) => {
			const entry = matter(fs.readFileSync(path.join(directory, name), "utf8"));
			return entry.data.synopsis ? [path.dirname(name).replaceAll(path.sep, "/")] : [];
		})
		.sort();
	const indexedSlugs = generated.projects.map((p) => p.slug).sort();
	if (
		JSON.stringify(actualSlugs) !== JSON.stringify(indexedSlugs) ||
		new Set(indexedSlugs).size !== indexedSlugs.length
	)
		throw new Error("Synopsis index membership differs from site records");
	for (const project of generated.projects) {
		if (
			!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) ||
			!/^[a-f0-9]{64}$/.test(project.sourceSha256 ?? "")
		)
			throw new Error("Invalid synopsis index identity");
		validateSynopsis(project.synopsis);
		const entry = matter(fs.readFileSync(path.join(directory, project.slug, "index.mdx"), "utf8"));
		if (entry.data.title !== project.title)
			throw new Error("Synopsis title differs from site record");
		if (JSON.stringify(entry.data.synopsis) !== JSON.stringify(project.synopsis))
			throw new Error(`Site synopsis differs from index: ${project.slug}`);
		if (
			project.roleId !== (project.synopsis.roleId ?? null) ||
			(project.roleId && roles.filter((r) => r.id === project.roleId).length !== 1)
		)
			throw new Error("Invalid synopsis role association");
		const expected = (project.synopsis.outputs?.linkedinProjects ?? []).map((p) => ({
			id: p.id,
			title: p.title,
			roleId: project.roleId,
			url: `https://eriknorris.com/projects/${project.slug}/`,
			sections: selectSections(entry.content, p.sections),
		}));
		if (JSON.stringify(expected) !== JSON.stringify(project.linkedinProjects))
			throw new Error(`Selected sections differ from index: ${project.slug}`);
	}
	return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	try {
		const args = process.argv.slice(2);
		if (args.some((arg) => !["--write", "--check"].includes(arg)) || args.length !== 1)
			throw new Error("Usage: node scripts/project_synopses.mjs --write|--check");
		const target = path.join(root, "src/data/project-synopses.json");
		if (args[0] === "--check" && !process.env.CANON_ROOT) {
			const generated = JSON.parse(fs.readFileSync(target, "utf8"));
			if (generated.version !== 1 || !Array.isArray(generated.projects))
				throw new Error("Invalid synopsis index");
			const roles = JSON.parse(
				fs.readFileSync(path.join(root, "src/data/careerChronology.json"), "utf8"),
			).roles;
			verifySiteIndex(generated, path.join(root, "src/content/projects"), roles);
			console.log(
				"Project synopsis index matches site records; canon byte parity requires CANON_ROOT.",
			);
			process.exit(0);
		}
		const data =
			JSON.stringify(
				buildSynopses(process.env.CANON_ROOT ?? "D:/GitHub/portfolio-canon"),
				null,
				2,
			) + "\n";
		if (args[0] === "--write") fs.writeFileSync(target, data);
		else if (
			!fs.existsSync(target) ||
			fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") !== data
		)
			throw new Error("Project synopsis projection stale; regenerate from selected CANON_ROOT");
		console.log(`Project synopses ${args[0]}: ${JSON.parse(data).projects.length} records`);
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}
