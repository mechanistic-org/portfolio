const fs = require("fs");
const path = require("path");
const glob = require("glob");
const yaml = require("js-yaml");

const CONTENT_DIR = path.join(__dirname, "../src/content");
const files = glob.sync("**/*.{md,mdx}", { cwd: CONTENT_DIR, absolute: true });

console.log(`🔍 Deep Scanning ${files.length} files with JS-YAML...`);

let errorCount = 0;

files.forEach((file) => {
	try {
		const content = fs.readFileSync(file, "utf8");
		const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

		if (!frontmatterMatch) return;

		const frontmatter = frontmatterMatch[1];

		// 1. Check for Duplicates (Regex - Strict)
		const lines = frontmatter.split(/\r?\n/);
		const keys = new Set();
		lines.forEach((line) => {
			const match = line.match(/^([a-zA-Z0-9_-]+):/);
			if (match) {
				const key = match[1];
				if (keys.has(key)) {
					throw new Error(`Duplicate ley detected: ${key}`);
				}
				keys.add(key);
			}
		});

		// 2. Check for Syntax (JS-YAML)
		try {
			yaml.load(frontmatter, { schema: yaml.JSON_SCHEMA });
		} catch (e) {
			throw new Error(`YAML Syntax Error: ${e.message}`);
		}
	} catch (err) {
		console.error(`\n❌ ERROR in ${path.relative(process.cwd(), file)}`);
		console.error(`   ${err.message}`);
		errorCount++;
	}
});

if (errorCount === 0) {
	console.log(`\n✅ All ${files.length} files passed JS-YAML validation.`);
} else {
	console.error(`\n💥 Found ${errorCount} corrupted files.`);
	process.exit(1);
}
