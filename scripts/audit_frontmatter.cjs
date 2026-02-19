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
		const keys = new Set();
		const lines = frontmatter.split("\n");

		// Check for duplicate keys
		lines.forEach((line) => {
			const match = line.match(/^([a-zA-Z0-9_-]+):/);
			if (match) {
				const key = match[1];
				if (keys.has(key)) {
					console.error(
						`❌ CRITICAL FAILURE: Duplicate keys found in ${path.relative(process.cwd(), file)}`,
					);
					console.error(`   Key: ${key}`);
					console.error(`   Action: You MUST remove the duplicate keys before building.`);
					errorCount++;
				}
				keys.add(key);
			}
		});

		// Check for numeric tags (primitive check)
		// Look for tags: [...]
		const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
		if (tagsMatch) {
			const tagsContent = tagsMatch[1];
			// If it contains a number not in quotes
			// e.g. 1, 4
			// Regex for numbers standing alone
			if (/\b\d+\b/.test(tagsContent)) {
				// Check if it's quoted?
				// Simple check: if we split by comma, is any item a pure number?
				const items = tagsContent.split(",").map((s) => s.trim());
				items.forEach((item) => {
					if (/^\d+$/.test(item)) {
						console.error(
							`❌ CRITICAL FAILURE: Numeric tag found in ${path.relative(process.cwd(), file)}`,
						);
						console.error(`   Tag: ${item}`);
						console.error(`   Action: Wrap numbers in quotes.`);
						errorCount++;
					}
				});
			}
		}
	});

	if (errorCount > 0) {
		console.error(`\n💥 Audit Failed: ${errorCount} files have corrupted frontmatter.`);
		console.error(`   The build has been stopped to prevent a hard system crash.`);
		process.exit(1);
	}

	console.log(`✅ Frontmatter Integrity: 100%`);
}

auditFrontmatter();
