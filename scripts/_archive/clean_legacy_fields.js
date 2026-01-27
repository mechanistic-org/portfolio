import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");
const FIELDS_TO_REMOVE = ["skillGraph", "skillData", "additionalSkills", "partGraph"];

function cleanProjectFiles() {
	if (!fs.existsSync(PROJECTS_DIR)) {
		console.error(`Directory not found: ${PROJECTS_DIR}`);
		return;
	}

	const projects = fs.readdirSync(PROJECTS_DIR);
	let modifiedCount = 0;

	projects.forEach((projectDir) => {
		const dirPath = path.join(PROJECTS_DIR, projectDir);
		if (!fs.statSync(dirPath).isDirectory()) return;

		const mdxPath = path.join(dirPath, "index.mdx");
		if (fs.existsSync(mdxPath)) {
			const content = fs.readFileSync(mdxPath, "utf8");
			const lines = content.split("\n");
			const newLines = [];

			let insideFrontmatter = false;
			let fenceCount = 0;
			let skippingBlock = false;
			let skippingIndent = 0;

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				const trimmed = line.trim();

				// Detect Frontmatter Fences
				if (trimmed === "---") {
					fenceCount++;
					if (fenceCount === 1) insideFrontmatter = true;
					if (fenceCount === 2) insideFrontmatter = false;
					newLines.push(line);
					continue;
				}

				if (insideFrontmatter) {
					// Check if we are checking a new key
					const match = line.match(/^(\s*)([a-zA-Z0-9_]+):/);

					if (match) {
						const indent = match[1].length;
						const key = match[2];

						if (FIELDS_TO_REMOVE.includes(key)) {
							// Start skipping this key and its children
							skippingBlock = true;
							skippingIndent = indent;
							continue; // Skip the key line itself
						} else {
							// Valid key, stop skipping (unless it was a child, but this is a new key at same/lower indent)
							// Actually, if we hit a new key, we are definitely done with previous block
							skippingBlock = false;
						}
					} else {
						// Not a key line (comment, array item, multi-line string, or empty)
						if (skippingBlock) {
							// If it's an array item or indented content, check indentation
							// If it's a list item "- ...", it usually has same indent as key? No, strictly YAML is lenient.
							// But usually children are indented more.
							// Standard check: is it indented MORE than the key?
							const currentIndent = line.search(/\S|$/);
							if (currentIndent > skippingIndent) {
								continue; // Skip child
							} else if (trimmed === "" || trimmed.startsWith("#")) {
								continue; // Skip comments/empty within the block
							} else {
								// Indent returned to parent level or less -> End of block
								skippingBlock = false;
							}
						}
					}
				}

				if (!skippingBlock) {
					newLines.push(line);
				}
			}

			const newContent = newLines.join("\n");
			if (newContent !== content) {
				fs.writeFileSync(mdxPath, newContent);
				console.log(`Cleaned ${projectDir}`);
				modifiedCount++;
			}
		}
	});

	console.log(`\nCleanup complete. Modified ${modifiedCount} files.`);
}

cleanProjectFiles();
