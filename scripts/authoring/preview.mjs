import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { marked, Marked } from "marked";
import sharp from "sharp";

const evidence = process.env.PORTFOLIO_EVIDENCE_ROOT || "D:/GitHub/portfolio-evidence";
const project = "avegant-glyph";
const directory = path.join(evidence, "authoring/projects", project);
const draftPath = path.join(directory, "Draft.md");
const compositionPath = path.join(directory, "Composition.json");
const cache = path.resolve(".astro/authoring");
const registryPath = path.join(cache, "media.json");
const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
export const escapeHtml = (value = "") =>
	String(value).replace(
		/[&<>"']/g,
		(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
	);
export const slugify = (value) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-");
export const enabled = () => process.env.PORTFOLIO_AUTHORING_PROJECT === project;

export async function loadAuthoringProject() {
	if (!enabled()) throw new Error("Private authoring is not enabled");
	const source = fs.readFileSync(draftPath, "utf8").replace(/\r\n?/g, "\n");
	const composition = JSON.parse(fs.readFileSync(compositionPath, "utf8"));
	if (composition.project !== project) throw new Error("Composition project mismatch");
	const assets = {};
	function register(relative) {
		const absolute = path.resolve(directory, relative);
		const inside = path.relative(path.resolve(evidence), absolute);
		if (inside.startsWith("..") || path.isAbsolute(inside))
			throw new Error(`Outside evidence root: ${relative}`);
		const stat = fs.statSync(absolute);
		if (!stat.isFile()) throw new Error(`Not a file: ${relative}`);
		const id = digest(absolute + stat.mtimeMs + stat.size).slice(0, 24);
		const ext = path.extname(absolute).toLowerCase();
		assets[id] = { path: absolute, ext, size: stat.size };
		return { id, src: `/_authoring-media/${id}${ext}`, kind: ext === ".mp4" ? "video" : "image" };
	}
	const groups = composition.groups.map((group) => ({
		...group,
		items: group.items.map((item) => ({ ...item, ...register(item.path) })),
	}));
	const groupsById = new Map(groups.map((group) => [group.id, group]));
	const used = new Set();
	const inline = [];
	const notes = Object.fromEntries(
		[...source.matchAll(/^\[\^([^\]]+)\]: (.*)$/gm)].map((m) => [m[1], m[2]]),
	);
	let body = source
		.slice(source.indexOf("## Joining Avegant"), source.indexOf("## Working notes"))
		.trim();
	const originalBody = body;
	const renderedNotes = new Set();
	const noteRefs = (text) =>
		text.replace(/\[\^([^\]]+)\]/g, (_, id) => {
			renderedNotes.add(id);
			return `<sup><a href="#note-${escapeHtml(id)}" data-note="${escapeHtml(id)}" aria-label="Source note: ${escapeHtml(id)}">↗</a></sup>`;
		});
	function rewriteLinks(text) {
		return text.replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, (whole, label, url) => {
			if (/^(https?:|#)/.test(url)) return whole;
			const [file, anchor] = url.split("#");
			try {
				return `[${label}](${register(decodeURIComponent(file)).src}${anchor ? "#" + anchor : ""})`;
			} catch {
				return label;
			}
		});
	}
	function placeholder(id) {
		return `\n\n<div data-authoring-group="${id}"></div>\n\n`;
	}
	function insertGroup(group) {
		if (used.has(group.id)) return "";
		used.add(group.id);
		let result = placeholder(group.id);
		for (const linked of group.followWith || []) result += insertGroup(groupsById.get(linked));
		return result;
	}
	function groupFor(files) {
		return groups.find((group) => group.replace?.some((name) => files.includes(name)));
	}
	// Existing paired-image tables become one composition group. Their image captions
	// are represented by the group/items; ordinary numerical tables remain Markdown.
	body = body.replace(/(?:^\|.*\n)+\n\*[^\n]+\*[^\n]*/gm, (table) => {
		const files = [...table.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => path.basename(m[1]));
		const group = groupFor(files);
		if (group) {
			noteRefs(table);
			return insertGroup(group);
		}
		return table;
	});
	body = body.replace(
		/!\[([^\]]*)\]\(([^)]+)\)(?:\n\n\*([^\n]+)\*([^\n]*))?/g,
		(_, alt, url, caption, refs) => {
			const group = groupFor([path.basename(url)]);
			if (group) {
				noteRefs((caption || "") + (refs || ""));
				return insertGroup(group);
			}
			const item = {
				...register(url),
				alt,
				caption: noteRefs(rewriteLinks((caption || alt) + (refs || ""))),
				path: url,
			};
			const id = `figure-${inline.length + 1}`;
			inline.push({ id, title: "", items: [item], mode: "figure" });
			return placeholder(id);
		},
	);
	for (const group of groups.filter((g) => g.beforeHeading)) {
		const marker = group.beforeHeading;
		if (!body.includes(marker)) throw new Error(`Missing composition anchor: ${marker}`);
		body = body.replace(marker, insertGroup(group) + marker);
	}
	body = noteRefs(rewriteLinks(body));
	const headings = [];
	const parser = new Marked();
	parser.use({
		renderer: {
			heading({ tokens, depth }) {
				const text = this.parser.parseInline(tokens);
				const slug = slugify(text.replace(/<[^>]*>/g, ""));
				headings.push({ depth, slug, text: text.replace(/<[^>]*>/g, "") });
				return `<h${depth} id="${slug}">${text}</h${depth}>\n`;
			},
		},
	});
	const html = await parser.parse(body);
	const allGroups = [...groups.filter((g) => used.has(g.id)), ...inline];
	const pieces = html
		.split(/<div data-authoring-group="([^"]+)"><\/div>/g)
		.map((value, i) =>
			i % 2 ? { group: allGroups.find((g) => g.id === value) } : { html: value },
		);
	if (pieces.some((p) => !("html" in p) && !p.group)) throw new Error("Unresolved gallery");
	const footnotes = [...renderedNotes].map((id) => ({
		id,
		html: marked.parse(rewriteLinks(notes[id] || id)),
	}));
	fs.mkdirSync(cache, { recursive: true });
	fs.writeFileSync(registryPath, JSON.stringify(assets));
	const uniqueMedia = new Set(allGroups.flatMap((g) => g.items.map((i) => i.id)));
	const videos = allGroups.flatMap((g) => g.items).filter((i) => i.kind === "video").length;
	return {
		project,
		markdown: body,
		title: source.split("\n")[0].replace(/^# /, ""),
		pieces,
		headings,
		footnotes,
		revision: digest(source + JSON.stringify(composition)).slice(0, 12),
		imageCount: uniqueMedia.size - videos,
		videoCount: videos,
		galleryCount: groups.filter((g) => used.has(g.id)).length,
		wordCount: originalBody
			.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
			.replace(/\[\^.*?\]/g, "")
			.split(/\s+/).length,
	};
}

// This integration exists only on the local dev server. Files are served through
// opaque IDs registered by the selected composition, never arbitrary path inputs.
export function authoringPreview() {
	return {
		name: "private-authoring-preview",
		hooks: {
			"astro:server:setup": ({ server }) => {
				if (!enabled()) return;
				server.watcher.add([draftPath, compositionPath]);
				server.watcher.on("change", (file) => {
					if ([draftPath, compositionPath].map((p) => path.resolve(p)).includes(path.resolve(file)))
						server.ws.send({ type: "full-reload", path: "*" });
				});
				const pending = new Map();
				server.middlewares.use(async (req, res, next) => {
					if (!req.url?.startsWith("/_authoring-media/")) return next();
					try {
						const url = new URL(req.url, "http://localhost");
						const match = url.pathname.match(/^\/_authoring-media\/([a-f0-9]{24})\.[a-z0-9]+$/);
						if (!match || !["GET", "HEAD"].includes(req.method)) {
							res.statusCode = 404;
							return res.end();
						}
						const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
						const item = registry[match[1]];
						if (!item) {
							res.statusCode = 404;
							return res.end();
						}
						res.setHeader("X-Robots-Tag", "noindex, nofollow");
						res.setHeader("Cache-Control", "private, max-age=3600");
						const isImage = [".jpg", ".jpeg", ".png", ".webp"].includes(item.ext);
						const width = Math.min(3000, Math.max(160, Number(url.searchParams.get("w")) || 1600));
						if (isImage && !url.searchParams.has("original")) {
							const key = `${match[1]}-${width}`;
							const output = path.join(cache, key + ".webp");
							if (!fs.existsSync(output)) {
								if (!pending.has(key))
									pending.set(
										key,
										sharp(item.path)
											.rotate()
											.resize({ width, withoutEnlargement: true })
											.webp({ quality: 85 })
											.toFile(output)
											.finally(() => pending.delete(key)),
									);
								await pending.get(key);
							}
							res.setHeader("Content-Type", "image/webp");
							res.setHeader("Content-Length", fs.statSync(output).size);
							if (req.method === "HEAD") return res.end();
							return fs.createReadStream(output).pipe(res);
						}
						const types = {
							".mp4": "video/mp4",
							".jpg": "image/jpeg",
							".png": "image/png",
							".webp": "image/webp",
							".pdf": "application/pdf",
							".md": "text/plain; charset=utf-8",
							".json": "application/json",
						};
						res.setHeader("Content-Type", types[item.ext] || "application/octet-stream");
						res.setHeader("Accept-Ranges", "bytes");
						const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
						let start = 0,
							end = item.size - 1;
						if (range) {
							start = Number(range[1]);
							end = range[2] ? Math.min(Number(range[2]), end) : end;
							if (start > end) {
								res.statusCode = 416;
								res.setHeader("Content-Range", `bytes */${item.size}`);
								return res.end();
							}
							res.statusCode = 206;
							res.setHeader("Content-Range", `bytes ${start}-${end}/${item.size}`);
						}
						res.setHeader("Content-Length", end - start + 1);
						if (req.method === "HEAD") return res.end();
						fs.createReadStream(item.path, { start, end }).pipe(res);
					} catch (error) {
						console.error("[authoring media]", error.message);
						res.statusCode = 500;
						res.end("Media unavailable");
					}
				});
			},
		},
	};
}
