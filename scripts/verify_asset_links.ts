import fs from "fs";
import path from "path";
import { globSync } from "glob";

function verifyAssetLinks() {
	console.log("🥔 Potato Mode: Verifying Asset Sovereignty (The Air Gap)...");

	const projectsDir = path.join(process.cwd(), "src/content/projects");
	const publicDir = path.join(process.cwd(), "public");

	const files = globSync(`${projectsDir}/**/*.mdx`);

	let validLinks = 0;
	let brokenLinks = 0;

	files.forEach((file) => {
		const content = fs.readFileSync(file, "utf-8");

		// Regex Update: Capture characters until newline or quote
		const assetMatches = content.match(/\/assets\/r2\/[^"'\n\r]+/g);

		if (assetMatches) {
			assetMatches.forEach((match) => {
				// Clean input: trim spaces
				let link = match.trim();

				// Heuristic: Strip markdown artifacts if file doesn't exist
				const publicPath = path.join(publicDir, link);
				if (!fs.existsSync(publicPath)) {
					// Try stripping trailing ')'
					if (link.endsWith(")")) {
						const stripped = link.slice(0, -1);
						if (fs.existsSync(path.join(publicDir, stripped))) {
							link = stripped;
						}
					}
					// Try stripping trailing ').' or other common punctuation if needed
				}
				// Resolve absolute path in public dir
				// link: /assets/r2/foo.jpg -> public/assets/r2/foo.jpg
				const localPath = path.join(publicDir, link);

				if (fs.existsSync(localPath)) {
					validLinks++;
				} else {
					console.error(`❌ GHOST ASSET in ${path.basename(file)}: ${link}`);
					brokenLinks++;
				}
			});
		}
	});

	console.log(`\n📊 Asset Report: ${validLinks} Valid, ${brokenLinks} Broken.`);

	// Generate Markdown Report
	if (brokenLinks > 0) {
		const reportPath = path.join(process.cwd(), "GHOST_ASSET_REPORT.md");
		let reportContent = `# 👻 Ghost Asset Report\n\n**Total Broken Links:** ${brokenLinks}\n\n| Project | Missing Asset |\n| :--- | :--- |\n`;

		files.forEach((file) => {
			const content = fs.readFileSync(file, "utf-8");
			const assetMatches = content.match(/\/assets\/r2\/[a-zA-Z0-9_\-\.\/]+/g);

			if (assetMatches) {
				assetMatches.forEach((link) => {
					const localPath = path.join(publicDir, link);
					if (!fs.existsSync(localPath)) {
						const projectSlug = path
							.relative(projectsDir, file)
							.replace(/\\index.mdx$/, "")
							.replace(/\/index.mdx$/, "");
						reportContent += `| \`${projectSlug}\` | \`${link}\` |\n`;
					}
				});
			}
		});

		fs.writeFileSync(reportPath, reportContent);
		console.log(`📝 Full Report saved to: ${reportPath}`);
		console.log("⚠️  Recommendation: Audit the broken links. Do not deploy to main.");
		process.exit(1);
	}
}

verifyAssetLinks();
