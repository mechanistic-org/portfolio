import fs from "fs";
import path from "path";
import { globSync } from "glob";

// Configuration
const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");
const PLACEHOLDER_REGEX = /\/assets\/placeholders\/[\w\-\.]+/g;

function refactorPlaceholders() {
	console.log("🧹 Starting Placeholder Cleanup...");

	const files = globSync(`${PROJECTS_DIR}/**/*.mdx`);
	let modifiedCount = 0;

	files.forEach((file) => {
		let content = fs.readFileSync(file, "utf-8");
		let modified = false;

		// 1. Check for heroImage using placeholder
		// Pattern: heroImage: /assets/placeholders/...
		if (content.match(/heroImage:\s*\/assets\/placeholders\//)) {
			console.log(`   - Removing heroImage from ${path.basename(file)}`);
			// Replace with nothing (effectively removing the line implies undefined,
			// but strict YAML might need empty. Let's comment it out or remove it.)
			// content = content.replace(/^heroImage:\s*\/assets\/placeholders\/.*$/gm, '# heroImage: removed (placeholder)');

			// Better: Remove the line entirely
			content = content.replace(/^heroImage:\s*\/assets\/placeholders\/.*\r?\n/gm, "");
			modified = true;
		}

		// 2. Check for Gallery Items
		// This is harder with regex on multi-line YAML arrays.
		// Simple approach: specific string replacement for known filenames if possible,
		// or just regex the paths.

		// If we find the string in the file, we need to be careful.
		// Let's do a naive check: if a line contains the placeholder path, verify it's a value.
		// If it's inside a gallery list, we might break the YAML structure if we just delete the line.

		// Revised Strategy for Gallery:
		// Use regex to find lines containing the path and remove them.
		// Assuming strictly formatted YAML:
		//   - src: /assets/placeholders/tech-1.jpg

		if (content.match(/src:\s*\/assets\/placeholders\//)) {
			console.log(`   - Removing gallery item from ${path.basename(file)}`);
			content = content.replace(/^\s*src:\s*\/assets\/placeholders\/.*\r?\n/gm, "");
			modified = true;
		}

		// Also catch inline stickies or other fields
		if (content.match(PLACEHOLDER_REGEX)) {
			// Fallback for anything missed by specific keys
			// This might leave dangling keys like "data:" with no "src:", but strict schema might catch that.
			// For now, let's just log it.
			console.log(`   ? Remaining matches in ${path.basename(file)}`);
			// content = content.replace(PLACEHOLDER_REGEX, ''); // Risky?
		}

		if (modified) {
			fs.writeFileSync(file, content, "utf-8");
			modifiedCount++;
		}
	});

	console.log(`✨ Cleanup Complete. Modified ${modifiedCount} files.`);
}

refactorPlaceholders();
