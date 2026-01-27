import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const DOCS_DIR = "src/content/docs";

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
			let newContent = content;
			let changed = false;

			if (!content.trim().startsWith("---")) {
				// Add default FM
				const title = path.basename(file, path.extname(file)).replace(/_/g, " ");
				const description = `Documentation for ${title}.`;
				const slug = path.basename(file, path.extname(file)).toLowerCase();
				newContent = `---\ntitle: "${title}"\ndescription: "${description}"\nslug: "${slug}"\n---\n\n${content}`;
				changed = true;
			} else {
				const parts = content.split(/^---(?:\r?\n|\r)/m);
				if (parts.length >= 3) {
					try {
						const fm = yaml.load(parts[1]);
						let fmChanged = false;
						if (!fm.description) {
							fm.description = `Documentation for ${fm.title || "this file"}.`;
							fmChanged = true;
						}
						if (fmChanged) {
							const newFM = yaml.dump(fm, { lineWidth: -1 }).trim();
							// Reconstruct file
							// preserve content (parts[2] onwards)
							const body = parts.slice(2).join("---");
							newContent = `---\n${newFM}\n---${body}`;
							changed = true;
						}
					} catch (e) {
						console.error(`Error parsing ${fullPath}: ${e.message}`);
					}
				}
			}

			if (changed) {
				fs.writeFileSync(fullPath, newContent);
				console.log(`Fixed: ${fullPath}`);
			}
		}
	}
	return findings;
}

console.log("Fixing missing descriptions in " + DOCS_DIR + "...");
walkDir(DOCS_DIR);
console.log("Done.");
