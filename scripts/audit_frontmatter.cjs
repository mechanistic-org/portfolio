const fs = require("fs");
const path = require("path");
const glob = require("glob");

const CONTENT_DIR = path.join(__dirname, "../src/content");

function auditFrontmatter() {
	console.log("🛡️  Shield 2: Auditing Frontmatter for Stability...");

	// Find all MDX files
	const files = glob.sync(`${CONTENT_DIR}/**/*.mdx`);
	let errorCount = 0;

	files.forEach((file) => {
		const content = fs.readFileSync(file, "utf8");
		const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

		if (!frontmatterMatch) return; // No frontmatter

		const frontmatter = frontmatterMatch[1];
		const lines = frontmatter.split("\n");
		const keys = new Set();
		const duplicates = [];

		lines.forEach((line) => {
			// Match top-level keys (no indentation at start of line)
			const keyMatch = line.match(/^([a-z0-9_]+):/i);
			if (keyMatch) {
				const key = keyMatch[1];
				if (keys.has(key)) {
					duplicates.push(key);
				} else {
					keys.add(key);
				}
			}
		});

		if (duplicates.length > 0) {
			console.error(
				`\n❌ CRITICAL FAILURE: Duplicate keys found in ${path.relative(process.cwd(), file)}`,
			);
			console.error(`   Keys: ${duplicates.join(", ")}`);
			console.error(`   Action: You MUST remove the duplicate keys before building.`);
			errorCount++;
		}
	});

	if (errorCount > 0) {
		console.error(`\n💥 Audit Failed: ${errorCount} files have corrupted frontmatter.`);
		console.error(`   The build has been stopped to prevent a hard system crash.`);
		process.exit(1);
	} else {
		console.log("✅ Frontmatter Integrity: 100%");
	}
}

auditFrontmatter();
