// scripts/update_taxonomy_values.ts
import { promises as fs } from "fs";
import * as path from "path";
import * as glob from "glob";

const replacements: Record<string, string> = {
	// Employer
	"Wearable / AR": "wearable_ar",
	Avegant: "avegant",
	// Employer
	"Mechanistic (Consulting)": "mechanistic_consulting",
	// Industry
	Other: "other",
	// Additional mappings
	frogdesign: "unknown",
	// Category

	// Category mappings
	Audio: "audio_interface",
	"Personal Computer": "personal_computer",
	Workstation: "workstation",
	"IoT Node": "iot_node",
	// Tools
	SOLIDWORKS: "solidworks",
	"Pro/ENGINEER": "pro_engineer",
	"Pro/Engineer": "pro_engineer",
};

async function replaceInFile(filePath: string) {
	let content = await fs.readFile(filePath, "utf8");
	let changed = false;

	// Convert all keys in replacements to lowercase for case-insensitive matching
	const lowercasedReplacements: Record<string, string> = {};
	for (const [oldVal, newVal] of Object.entries(replacements)) {
		lowercasedReplacements[oldVal.toLowerCase()] = newVal;
	}

	// First pass: replace exact matches (case-insensitive)
	for (const [oldVal, newVal] of Object.entries(lowercasedReplacements)) {
		const pattern = new RegExp(`(^|\\s)${oldVal}(\\s|$)`, "gi"); // 'g' for global, 'i' for case-insensitive
		if (pattern.test(content)) {
			content = content.replace(pattern, `$1${newVal}$2`);
			changed = true;
		}
	}

	// Second pass: replace dash-prefixed list items (case-insensitive)
	for (const [oldVal, newVal] of Object.entries(lowercasedReplacements)) {
		const dashPattern = new RegExp(`^\\s*-\\s*${oldVal}$`, "gim"); // 'm' for multiline
		if (dashPattern.test(content)) {
			content = content.replace(dashPattern, `- ${newVal}`);
			changed = true;
		}
	}

	if (changed) {
		await fs.writeFile(filePath, content, "utf8");
		console.log(`Updated ${filePath}`);
	}
}

async function main() {
	const pattern = path.join("src", "content", "projects", "**", "index.mdx");
	const files = glob.sync(pattern, { cwd: process.cwd() });
	for (const file of files) {
		await replaceInFile(file);
	}
}

main().catch((e) => {
	console.error("Error updating taxonomy values:", e);
	process.exit(1);
});
