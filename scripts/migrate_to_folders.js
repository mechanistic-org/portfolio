import fs from "fs";
import path from "path";

const PROJECTS_DIR = "src/content/projects";

// Valid extensions to migrate
const EXTENSIONS = [".mdx", ".md"];

async function migrate() {
	console.log(`[Migration] Scanning ${PROJECTS_DIR}...`);

	if (!fs.existsSync(PROJECTS_DIR)) {
		console.error(`[Error] Directory not found: ${PROJECTS_DIR}`);
		return;
	}

	const files = fs.readdirSync(PROJECTS_DIR);
	let migratedCount = 0;

	for (const file of files) {
		const fullPath = path.join(PROJECTS_DIR, file);
		const stats = fs.statSync(fullPath);

		// Process only Files (skip Directories like 'c24')
		if (stats.isFile()) {
			const ext = path.extname(file);
			if (EXTENSIONS.includes(ext)) {
				const slug = path.basename(file, ext);
				const targetDir = path.join(PROJECTS_DIR, slug);
				const targetFile = path.join(targetDir, `index${ext}`);

				// Skip if target directory already exists (prevent overwriting existing folders like sc48)
				if (fs.existsSync(targetDir)) {
					// Special Case: sc48 has both sc48.mdx AND sc48 directory.
					// We need to move sc48.mdx INTO sc48/index.mdx
					if (slug === "sc48" || slug === "c24") {
						console.log(`[Merge] Merging root file ${file} into existing folder ${slug}...`);
					} else {
						console.log(`[Skip] Folder ${slug} already exists. checking contents...`);
						// Determine if we should move it anyway?
						// If folder exists but has NO index.mdx, we move.
						if (fs.existsSync(targetFile)) {
							console.log(`   -> Target index exists. Skipping.`);
							continue;
						}
					}
				} else {
					fs.mkdirSync(targetDir);
				}

				// Move the file
				fs.renameSync(fullPath, targetFile);
				console.log(`[Migrate] ${file} -> ${slug}/index${ext}`);
				migratedCount++;
			}
		}
	}

	console.log(`[Migration] Complete. Migrated ${migratedCount} projects.`);
}

migrate();
