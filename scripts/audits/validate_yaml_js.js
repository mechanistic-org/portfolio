import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIRS = [
	path.resolve("src/content/colophon"),
	path.resolve("src/content/docs"),
	path.resolve("src/content/projects"),
	path.resolve("src/content/prompts"),
	path.resolve("src/data/otherPages"),
];

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function frontmatterContext(content, errorLine) {
	const match = content.match(FRONTMATTER_RE);
	if (!match || !errorLine) return [];

	const lines = match[1].split(/\r?\n/);
	const index = Number(errorLine) - 1;
	const start = Math.max(0, index - 2);
	const end = Math.min(lines.length, index + 3);

	return lines.slice(start, end).map((line, offset) => {
		const lineNumber = start + offset + 1;
		const marker = lineNumber === Number(errorLine) ? ">" : " ";
		return `${marker} ${lineNumber}: ${line}`;
	});
}

function validateFile(filePath) {
	const content = fs.readFileSync(filePath, "utf-8");
	if (!content.startsWith("---")) return [];

	try {
		matter(content);
		return [];
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		const lineMatch = message.match(/line\s+(\d+)/i);
		const context = frontmatterContext(content, lineMatch?.[1]);

		return [
			`[frontmatter] YAML error in ${path.relative(process.cwd(), filePath)}`,
			`  ${message}`,
			...context.map((line) => `  ${line}`),
		];
	}
}

function scanDir(dir) {
	if (!fs.existsSync(dir)) return [];

	const errors = [];
	const entries = fs.readdirSync(dir, { recursive: true });
	for (const entry of entries) {
		if (!entry.endsWith(".md") && !entry.endsWith(".mdx")) continue;
		errors.push(...validateFile(path.join(dir, entry)));
	}
	return errors;
}

const errors = CONTENT_DIRS.flatMap((dir) => scanDir(dir));

if (errors.length > 0) {
	console.error(errors.join("\n"));
	process.exit(1);
}

console.log(`[frontmatter] OK: scanned ${CONTENT_DIRS.length} content roots`);
