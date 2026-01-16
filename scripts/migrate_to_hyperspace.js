import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

// CONFIG
const PROJECTS_DIR = path.resolve("src/content/projects");
const DRY_RUN = !process.argv.includes("--write");

console.log(`\n🚀 HYPERSPACE MIGRATION PROTOCOL initialized...`);
console.log(`📂 Scanning: ${PROJECTS_DIR}`);
console.log(`🔧 Mode: ${DRY_RUN ? "DRY RUN (No changes will be written)" : "LIVE WRITE"}\n`);

// UTILS
function getProjectDirs() {
	return fs
		.readdirSync(PROJECTS_DIR)
		.filter((file) => fs.statSync(path.join(PROJECTS_DIR, file)).isDirectory());
}

function processProject(slug) {
	const filePath = path.join(PROJECTS_DIR, slug, "index.mdx");

	if (!fs.existsSync(filePath)) {
		console.log(`❌ [MISSING] ${slug}: No index.mdx found.`);
		return;
	}

	const fileContent = fs.readFileSync(filePath, "utf8");
	const { data, content } = matter(fileContent);
	let isModified = false;
	let upgradeType = "UNKNOWN";

	// 1. CLASSIFICATION
	const hasMetrics = !!(data.metrics || data.forensic_metrics);
	const hasCyberspace = !!data.cyberspace;
	const currentTheme = data.theme || "unknown";

	// DETERMINE TARGET STATE
	let targetTheme = "hyperspace";
	// The initial targetMode assignment is now handled within the refined B. Presentation Mode Logic.

	// 2. MIGRATION LOGIC

	// A. Theme Upgrade
	if (data.theme !== targetTheme) {
		data.theme = targetTheme;
		isModified = true;
	}

	// B. Presentation Mode Logic (REFINED)
	// Deep Dive = Full HUD (Row 2). Requires rich forensic data.
	// Standard (Lite) = Nav Only HUD. Best for older/simpler projects.
	// Logic: Only promote to Deep Dive if explicit 'forensic_metrics' exist or user manually flagged it.
	// Old 'metrics' object might be sparse, so we default to Standard to be safe unless it's clearly a flagship.
	const isDeepDiveCandidate = !!data.forensic_metrics || data.presentation_mode === "deep_dive";

	let targetMode = isDeepDiveCandidate ? "deep_dive" : "standard";

	if (data.presentation_mode !== targetMode) {
		data.presentation_mode = targetMode;
		isModified = true;
	}

	// C. Deck Standardization (deck -> legacy_deck)
	if (data.deck && !data.legacy_deck) {
		data.legacy_deck = data.deck;
		delete data.deck;
		isModified = true;
		console.log(`   🔸 [DATA] ${slug}: Migrated 'deck' to 'legacy_deck'`);
	}

	// D. Cyberspace Injection (If missing)
	if (!data.cyberspace) {
		// Fallback Logic (Lite)
		const year = data.date ? new Date(data.date).getFullYear() : "N/A";
		data.cyberspace = {
			enable: true,
			layout: "linear",
			stickies: [
				{
					id: "intro",
					title: data.title || slug,
					text: `<strong>YEAR:</strong> ${year}<br/><strong>ROLE:</strong> ${data.employer || "Contributor"}`,
					align: "center",
					type: "media",
					data: {
						src: data.heroImage || "",
					},
				},
				{
					id: "details",
					title: "PROJECT DATA",
					text: `This record has been upgraded to the Hyperspace Protocol.<br/><br/><strong>Group:</strong> ${data.industry || "N/A"}`,
					align: "center",
					type: "void",
				},
			],
		};
		isModified = true;
		upgradeType = "STANDARD INJECTION";
	} else {
		upgradeType = hasMetrics ? "DEEP DIVE" : "EXISTING STANDARD";
	}

	// 3. EXECUTION
	if (isModified) {
		if (DRY_RUN) {
			console.log(`📝 [PLAN] ${slug.padEnd(20)} -> ${targetMode.toUpperCase()} (${upgradeType})`);
		} else {
			const newFileContent = matter.stringify(content, data);
			fs.writeFileSync(filePath, newFileContent);
			console.log(`✅ [DONE] ${slug.padEnd(20)} -> Updated`);
		}
	} else {
		console.log(`✨ [SKIP] ${slug.padEnd(20)} -> Already Up-to-Date`);
	}
}

// MAIN
const projects = getProjectDirs();
projects.forEach(processProject);

if (DRY_RUN) {
	console.log(`\n⚠️  Run with --write to apply changes.`);
}
