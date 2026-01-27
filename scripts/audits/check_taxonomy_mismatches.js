// scripts/check_taxonomy_mismatches.js
const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Helper to extract enum values from taxonomy.ts
function extractValues(fileContent, exportName) {
	const regex = new RegExp(`export const ${exportName} = \[([\s\S]*?)\];`);
	const match = fileContent.match(regex);
	if (!match) return [];
	const block = match[1];
	const valueRegex = /value:\s*"([^"]+)"/g;
	const values = [];
	let m;
	while ((m = valueRegex.exec(block)) !== null) {
		values.push(m[1]);
	}
	return values;
}

const taxonomyPath = path.resolve("src/config/taxonomy.ts");
const taxonomyContent = fs.readFileSync(taxonomyPath, "utf8");

const allowed = {
	industry: new Set(extractValues(taxonomyContent, "INDUSTRY_VALUES")),
	category: new Set(extractValues(taxonomyContent, "CATEGORY_VALUES")),
	employer: new Set(extractValues(taxonomyContent, "EMPLOYER_VALUES")),
	tools: new Set(extractValues(taxonomyContent, "TOOL_VALUES")),
};

function parseFrontMatter(content) {
	const fmMatch = content.match(/^---\n([\s\S]*?)\n---/m);
	if (!fmMatch) return {};
	const lines = fmMatch[1].split("\n");
	const result = {};
	let currentKey = null;
	for (let line of lines) {
		if (/^\s*$/.test(line)) continue;
		const keyVal = line.match(/^([^:]+):\s*(.*)$/);
		if (keyVal) {
			currentKey = keyVal[1].trim();
			let val = keyVal[2].trim();
			// Remove surrounding quotes if present
			if (
				(val.startsWith('"') && val.endsWith('"')) ||
				(val.startsWith("'") && val.endsWith("'"))
			) {
				val = val.slice(1, -1);
			}
			// If value is a list start (e.g., tools: ) we will collect items later
			if (val === "" && line.trim().endsWith(":")) {
				result[currentKey] = [];
			} else {
				result[currentKey] = val;
			}
		} else if (currentKey && line.trim().startsWith("-")) {
			const item = line
				.trim()
				.replace(/^[-\s]*/, "")
				.replace(/^"|"$/g, "");
			if (!Array.isArray(result[currentKey])) result[currentKey] = [];
			result[currentKey].push(item);
		}
	}
	return result;
}

const pattern = path.join("src", "content", "projects", "**", "index.mdx");
const files = glob.sync(pattern, { cwd: process.cwd() });
let mismatches = [];
files.forEach((file) => {
	const fullPath = path.resolve(file);
	const content = fs.readFileSync(fullPath, "utf8");
	const fm = parseFrontMatter(content);
	Object.entries(fm).forEach(([key, val]) => {
		if (!allowed[key]) return;
		if (Array.isArray(val)) {
			val.forEach((v) => {
				if (!allowed[key].has(v)) {
					mismatches.push({ file: fullPath, key, value: v });
				}
			});
		} else {
			if (!allowed[key].has(val)) {
				mismatches.push({ file: fullPath, key, value: val });
			}
		}
	});
});

if (mismatches.length === 0) {
	console.log("No taxonomy mismatches found.");
	process.exit(0);
} else {
	console.log("Found mismatches:");
	mismatches.forEach((m) => {
		console.log(`${m.file} -> ${m.key}: ${m.value}`);
	});
	process.exit(1);
}
