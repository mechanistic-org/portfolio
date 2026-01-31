const fs = require("fs");
const path = require("path");

// Safe path resolution
const projectsDir = path.join(__dirname, "src/content/projects");

function getNewCategory(filename) {
	if (
		filename.startsWith("mbox") ||
		filename.startsWith("acer") ||
		filename.startsWith("usb-box")
	) {
		return "consumer_electronics";
	}
	if (filename.startsWith("sugarfoot")) {
		return "input_device";
	}
	// Default to enterprise hardware for consoles etc
	return "enterprise_hardware";
}

function processFile(file) {
	if (!fs.existsSync(file)) return;
	let content = fs.readFileSync(file, "utf-8");
	let changed = false;

	// 1. Fix Category: pro_audio
	if (content.match(/category:\s*pro_audio/)) {
		const filename = path.basename(path.dirname(file));
		const newCat = getNewCategory(filename);
		content = content.replace(/category:\s*pro_audio/, `category: ${newCat}`);
		console.log(`[Category] ${filename}: pro_audio -> ${newCat}`);
		changed = true;
	}

	// 2. Remove dcdCount inside process block
	const lines = content.split("\n");
	const newLines = [];
	let inMetrics = false;
	let inProcess = false;
	let metricsIndent = -1;
	let processIndent = -1;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();
		// find indent
		const indentMatch = line.match(/^\s*/);
		const indent = indentMatch ? indentMatch[0].length : 0;

		// Check entry into metrics
		if (trimmed.startsWith("metrics:")) {
			inMetrics = true;
			metricsIndent = indent;
			newLines.push(line);
			continue;
		}

		// Check exit of metrics
		if (inMetrics && indent <= metricsIndent && trimmed !== "" && !trimmed.startsWith("#")) {
			inMetrics = false;
			inProcess = false;
		}

		if (inMetrics) {
			// Check entry into process
			if (trimmed.startsWith("process:")) {
				inProcess = true;
				processIndent = indent;
				newLines.push(line);
				continue;
			}

			// Check exit of process
			if (inProcess && indent <= processIndent && trimmed !== "" && !trimmed.startsWith("#")) {
				inProcess = false;
			}

			// If inside process, check for dcdCount
			if (inProcess) {
				if (trimmed.startsWith("dcdCount:")) {
					console.log(`[DCD Removal] Removing dcdCount from ${path.basename(path.dirname(file))}`);
					changed = true;
					continue; // Skip line
				}
			}
		}

		newLines.push(line);
	}

	if (changed) {
		fs.writeFileSync(file, newLines.join("\n"), "utf-8");
	}
}

if (fs.existsSync(projectsDir)) {
	const entries = fs.readdirSync(projectsDir, { withFileTypes: true });
	entries.forEach((entry) => {
		if (entry.isDirectory()) {
			let p = path.join(projectsDir, entry.name, "index.mdx");
			if (fs.existsSync(p)) {
				processFile(p);
			} else {
				p = path.join(projectsDir, entry.name, "index.md");
				if (fs.existsSync(p)) processFile(p);
			}
		}
	});
} else {
	console.error(`Projects dir not found: ${projectsDir}`);
}

console.log("Metadata fix complete.");
