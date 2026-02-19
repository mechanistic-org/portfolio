const fs = require("fs");
const path = require("path");
const glob = require("glob");

const CONTENT_DIR = path.join(__dirname, "../src/content");
const files = glob.sync("**/*.{md,mdx}", { cwd: CONTENT_DIR, absolute: true });

console.log(`🔍 Diagnosing ${files.length} files for structure...`);

let issues = 0;

files.forEach((file) => {
	try {
		const filename = path.basename(file);
		if (filename.startsWith("_") || filename.startsWith(".")) return;

		const content = fs.readFileSync(file, "utf8");
		const relativePath = path.relative(process.cwd(), file);

		// 1. Check for valid frontmatter delimiters
		if (!content.startsWith("---")) {
			console.error(`❌ NO FRONTMATTER START: ${relativePath}`);
			issues++;
			return;
		}

		const closeIndex = content.indexOf("\n---", 3);
		if (closeIndex === -1) {
			console.error(`❌ NO FRONTMATTER END: ${relativePath}`);
			issues++;
			return;
		}

		// 2. Check for empty frontmatter
		const frontmatter = content.substring(3, closeIndex);
		if (!frontmatter.trim()) {
			console.warn(`⚠️  EMPTY FRONTMATTER: ${relativePath}`);
		}

		// 3. Scan for "tags" issues (unclosed quotes)
		if (frontmatter.includes("tags:")) {
			const tagsLine = frontmatter.match(/tags:.*$/m);
			if (tagsLine) {
				const line = tagsLine[0];
				const openSingle = (line.match(/'/g) || []).length;
				const openDouble = (line.match(/"/g) || []).length;
				const openBracket = (line.match(/\[/g) || []).length;
				const closeBracket = (line.match(/\]/g) || []).length;

				if (openSingle % 2 !== 0) {
					console.error(`❌ UNBALANCED SINGLE QUOTES in tags: ${relativePath}`);
					console.error(`   Line: ${line}`);
					issues++;
				}
				if (openDouble % 2 !== 0) {
					console.error(`❌ UNBALANCED DOUBLE QUOTES in tags: ${relativePath}`);
					console.error(`   Line: ${line}`);
					issues++;
				}
				if (openBracket !== closeBracket) {
					console.error(`❌ UNBALANCED BRACKETS in tags: ${relativePath}`);
					console.error(`   Line: ${line}`);
					issues++;
				}
			}
		}

		// 4. Check for binary/hidden chars in frontmatter
		// (Basic check for null bytes or weird control chars)
		if (/[\x00-\x08\x0E-\x1F]/.test(frontmatter)) {
			console.error(`❌ INVALID CONTROL CHARS in frontmatter: ${relativePath}`);
			issues++;
		}
	} catch (err) {
		console.error(`❌ FILE READ ERROR: ${file} - ${err.message}`);
		issues++;
	}
});

if (issues === 0) {
	console.log("✅ No structural issues found.");
} else {
	console.log(`found ${issues} issues`);
	process.exit(1);
}
