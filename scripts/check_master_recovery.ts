import fs from "fs";
import path from "path";
import { globSync } from "glob";

// CONFIG
const MASTER_ROOT = "D:/GitHub/eriknorris-workspace/R2_MASTER";

function checkMasterRecovery() {
	console.log("🕵️  Forensics: Checking R2_MASTER for Ghost Assets...");

	// Validate Master Root
	if (!fs.existsSync(MASTER_ROOT)) {
		console.error(`❌ CRITICAL: Master Root not found at ${MASTER_ROOT}`);
		process.exit(1);
	}

	const projectsDir = path.join(process.cwd(), "src/content/projects");
	const publicDir = path.join(process.cwd(), "public");

	const files = globSync(`${projectsDir}/**/*.mdx`);

	let ghostCount = 0;
	let recoveryCount = 0;
	let lostCount = 0;

	// Buffer for report
	let reportRows: string[] = [];

	files.forEach((file) => {
		const content = fs.readFileSync(file, "utf-8");
		// Regex Update: Capture characters until newline or quote (allowing parens)
		const assetMatches = content.match(/\/assets\/r2\/[^"'\n\r]+/g);

		if (assetMatches) {
			assetMatches.forEach((match) => {
				// Clean input: trim spaces
				let link = match.trim();

				// Heuristic: Handle Markdown trailing parenthesis or other artifacts
				// If the direct link doesn't exist in Master, try stripping the last char if it's ')'
				const testRel = link.replace("/assets/r2/", "");
				const testMaster = path.join(MASTER_ROOT, testRel);

				if (!fs.existsSync(testMaster) && link.endsWith(")")) {
					const stripped = link.slice(0, -1);
					const strippedRel = stripped.replace("/assets/r2/", "");
					const strippedMaster = path.join(MASTER_ROOT, strippedRel);
					if (fs.existsSync(strippedMaster)) {
						link = stripped;
					}
				}

				// 1. Check if it's currently broken (Ghost)
				const publicPath = path.join(publicDir, link);
				if (!fs.existsSync(publicPath)) {
					ghostCount++;

					// 2. Map to Master Path
					const relativePath = link.replace("/assets/r2/", "");
					const masterPath = path.join(MASTER_ROOT, relativePath);
					const projectSlug = path.basename(path.dirname(file)); // approximate

					if (fs.existsSync(masterPath)) {
						recoveryCount++;
						reportRows.push(`| ✅ FOUND | \`${projectSlug}\` | \`${link}\` |`);
					} else {
						lostCount++;
						reportRows.push(`| ❌ LOST | \`${projectSlug}\` | \`${link}\` |`);
						// Debug log for first few failures
						if (lostCount <= 5) {
							console.log(`[DEBUG] Failed to find: '${masterPath}'`);
						}
					}
				}
			});
		}
	});

	// Generate Report File
	const reportPath = path.join(process.cwd(), "MASTER_RECOVERY_REPORT.md");
	let reportContent = `# 🕵️ Master Recovery Report\n\n`;
	reportContent += `**Total Ghosts:** ${ghostCount}\n`;
	reportContent += `**Found in Master:** ${recoveryCount}\n`;
	reportContent += `**Truly Lost:** ${lostCount}\n\n`;
	reportContent += `| Status | Project | Asset Path |\n| :--- | :--- | :--- |\n`;
	reportContent += reportRows.join("\n");

	fs.writeFileSync(reportPath, reportContent);
	console.log(`📝 Master Recovery Report saved to: ${reportPath}`);

	console.log(`\n📊 Summary`);
	console.log(`------------------`);
	console.log(`👻 Total Ghosts: ${ghostCount}`);
	console.log(`✅ Found in Master: ${recoveryCount}`);
	console.log(`❌ Truly Lost: ${lostCount}`);

	if (lostCount === 0 && ghostCount > 0) {
		console.log(`\n✨ GOOD NEWS: All missing assets are safe in the Master Archive.`);
	} else if (lostCount > 0) {
		console.log(`\n⚠️  WARNING: ${lostCount} assets are missing from BOTH deployment and master.`);
	}
}

checkMasterRecovery();
