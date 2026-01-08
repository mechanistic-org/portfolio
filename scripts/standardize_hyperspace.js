import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	return match ? { raw: match[1], end: match[0].length } : null;
}

// Simple YAML parser/stringifier helper that preserves specialized spacing if possible,
// but for robust manipulation we might just use string replacement or a regex based approach
// to avoid destroying the existing YAML formatting if we can help it.
// However, since we are moving large chunks of data, we might need to parse.
// Let's rely on regex insertion to avoid re-serializing the whole file and losing comments/formatting.

// Actually, rewriting the file is safer for structure.
// We will assume standard YAML format.

function run() {
	const projects = fs.readdirSync(PROJECTS_DIR);

	projects.forEach((projectDir) => {
		const dirPath = path.join(PROJECTS_DIR, projectDir);
		if (!fs.statSync(dirPath).isDirectory()) return;
		const mdxPath = path.join(dirPath, "index.mdx");
		if (!fs.existsSync(mdxPath)) return;

		let content = fs.readFileSync(mdxPath, "utf8");
		const fmData = parseFrontmatter(content);
		if (!fmData) return;

		const bodyContent = content.slice(fmData.end).trim();

		// CHECK 1: Is there Body Content?
		if (bodyContent.length < 10) {
			console.log(`Skipping ${projectDir}: No significant body content.`);
			// Only continue if we need to merge narrative...
			// But we can check for narrative in frontmatter.
		}

		// We will perform a rough parse of the YAML to find 'cyberspace'
		// This is tricky without a library.
		// Strategy: Use a regex to find `narrative:` block and identifying `stickies:` block.

		// Let's try to just detect if we need to act.
		const hasNarrative = content.includes("narrative:");
		const hasBody = bodyContent.length > 10;

		if (!hasNarrative && !hasBody) return;

		console.log(`Migrating ${projectDir}... Body: ${hasBody}, Narrative: ${hasNarrative}`);

		// READ FILE AS TEXT LINES
		let lines = content.split("\n");
		let newLines = [];
		let inFrontmatter = false;
		let inNarrative = false;
		let narrativeBuffer = [];
		let stickiesStartLine = -1;
		let narrativeData = [];

		// 1. Extract Narrative Data (Manual Parse)
		// This is fragile. Ideally we use the user's existing "Stickies" structure.
		// If we can't parse easily, we might break it.

		// ALTERNATIVE: Use the fact that the user is watching.
		// We can just construct the "00_brief" sticky for the Body first.
		// Merging narrative is harder.

		// Let's focus on the Body -> Brief migration first (The "Empty Room" fix).
		// That is the verified user request (C24 rule).
		// The Narrative merge is for "Split Brain" (D-Control).

		// Let's implement Body -> Sticky '00_intro'

		if (hasBody) {
			// Construct the new Sticky Object string
			const cleanBody = JSON.stringify(bodyContent); // Escape special chars
			const introSticky = `
    - id: "00_intro"
      type: "brief"
      title: "Project Brief"
      deck:
        - title: "Overview"
          body: ${cleanBody}
      data: {}`;

			// Insert into 'stickies:' array
			// Find "stickies:"
			const stickiesIndex = lines.findIndex((l) => l.trim().startsWith("stickies:"));
			if (stickiesIndex !== -1) {
				lines.splice(stickiesIndex + 1, 0, introSticky);
				// Clear Body
				// Find end of frontmatter
				const fmEndIndex = lines.indexOf("---", 1);
				if (fmEndIndex !== -1) {
					lines = lines.slice(0, fmEndIndex + 1); // Keep only frontmatter
				}

				fs.writeFileSync(mdxPath, lines.join("\n"));
				console.log(`  -> Validated and Migrated Body to 00_intro.`);
			} else {
				console.log(`  -> ERROR: No 'stickies' field found.`);
			}
		}
	});
}

run();
