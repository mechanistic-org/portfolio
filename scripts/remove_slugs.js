import fs from "fs";
import path from "path";

const PROJECTS_DIR = "src/content/projects";

// Walk directory recursively to find all index.mdx files
function walkSync(dir, filelist = []) {
	if (!fs.existsSync(dir)) return filelist;
	const files = fs.readdirSync(dir);
	files.forEach(function (file) {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			filelist = walkSync(path.join(dir, file), filelist);
		} else {
			if (file === "index.mdx" || file === "index.md" || file.endsWith(".mdx")) {
				filelist.push(path.join(dir, file));
			}
		}
	});
	return filelist;
}

async function fixSlugs() {
	console.log(`[Fix] Removing 'slug' frontmatter from ${PROJECTS_DIR}...`);

	if (!fs.existsSync(PROJECTS_DIR)) {
		console.error(`[Error] Directory not found: ${PROJECTS_DIR}`);
		return;
	}

	const files = walkSync(PROJECTS_DIR);
	let fixedCount = 0;

	for (const file of files) {
		const content = fs.readFileSync(file, "utf8");

		// Regex to find "slug: " line in frontmatter
		// Frontmatter is between --- and ---
		// We look for "slug: ... \n"

		if (content.match(/^slug:.*$/m)) {
			const newContent = content.replace(/^slug:.*$\n/m, "");
			fs.writeFileSync(file, newContent, "utf8");
			console.log(
				`[Fix] Removed slug from ${path.basename(path.dirname(file))}/${path.basename(file)}`,
			);
			fixedCount++;
		}
	}

	console.log(`[Fix] Complete. Updated ${fixedCount} files.`);
}

fixSlugs();
