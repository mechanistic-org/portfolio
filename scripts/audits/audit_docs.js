import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const DOCS_DIR = "src/content/docs";
const LOG_FILE = "audit_log.txt";

function walkDir(dir) {
	const findings = [];
	if (!fs.existsSync(dir)) return findings;
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			findings.push(...walkDir(fullPath));
		} else if (file.endsWith(".md") || file.endsWith(".mdx")) {
			const content = fs.readFileSync(fullPath, "utf8");

			// Check 1: Starts with ---
			if (!content.trim().startsWith("---")) {
				findings.push(`[FAIL] ${fullPath}: Missing Frontmatter`);
				continue;
			}

			// Check 2: Valid YAML
			const parts = content.split(/^---(?:\r?\n|\r)/m);
			if (parts.length < 3) {
				findings.push(`[FAIL] ${fullPath}: Malformed Frontmatter (No closing --- or split fail)`);
				continue;
			}

			try {
				const fm = yaml.load(parts[1]);
				if (!fm || typeof fm !== "object") {
					findings.push(`[FAIL] ${fullPath}: Invalid Frontmatter Object`);
				} else {
					// Check required fields
					if (!fm.title) findings.push(`[FAIL] ${fullPath}: Missing 'title'`);
					if (!fm.description)
						findings.push(`[FAIL] ${fullPath}: Missing 'description' (Required by Schema)`);
				}
			} catch (e) {
				findings.push(`[FAIL] ${fullPath}: YAML Syntax Error: ${e.message}`);
			}
		}
	}
	return findings;
}

console.log("Scanning " + DOCS_DIR + "...");
const errors = walkDir(DOCS_DIR);

const logContent = errors.join("\n") || "No errors found.";
fs.writeFileSync(LOG_FILE, logContent);

console.log("Found " + errors.length + " errors. Wrote to " + LOG_FILE);
