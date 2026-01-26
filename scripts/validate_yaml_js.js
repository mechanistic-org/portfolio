import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const CONTENT_DIRS = [path.resolve("src/content/projects"), path.resolve("src/data/otherPages")];

function validateFile(filePath) {
	const content = fs.readFileSync(filePath, "utf-8");
	// Split Frontmatter
	if (!content.startsWith("---")) return;

	const parts = content.split(/^---$/m);
	if (parts.length < 3) return;

	const fm = parts[1];
	try {
		yaml.load(fm);
	} catch (e) {
		console.error(`JS-YAML Error in ${filePath}:`);
		console.error(e.message);
	}
}

function scanDir(dir) {
	if (!fs.existsSync(dir)) return;
	const files = fs.readdirSync(dir, { recursive: true });
	files.forEach((f) => {
		if (f.endsWith(".mdx") || f.endsWith(".md")) {
			validateFile(path.join(dir, f));
		}
	});
}

console.log("Scanning files with js-yaml...");
CONTENT_DIRS.forEach((d) => scanDir(d));
