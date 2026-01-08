import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

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
			let hasChanges = false;

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				const trimmed = line.trim();

				// Check for imports to remove
				if (trimmed.startsWith("import { YouTube }") || trimmed.startsWith("import ModelViewer")) {
					hasChanges = true;
					continue; // Skip this line
				}

				newLines.push(line);
			}

			if (hasChanges) {
				const newContent = newLines.join("\n");
				fs.writeFileSync(mdxPath, newContent);
				console.log(`Cleaned imports from ${projectDir}`);
				modifiedCount++;
			}
		}
	});

	console.log(`\nCleanup complete. Modified ${modifiedCount} files.`);
}

cleanProjectFiles();
