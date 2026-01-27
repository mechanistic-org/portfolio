import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Native recursive directory walk
function getFiles(dir) {
	const dirents = fs.readdirSync(dir, { withFileTypes: true });
	const files = dirents.map((dirent) => {
		const res = path.resolve(dir, dirent.name);
		return dirent.isDirectory() ? getFiles(res) : res;
	});
	return Array.prototype.concat(...files);
}

const contentDir = path.resolve("src/content/projects");

// Helper to recursively find all keys in an object
function getKeys(obj, prefix = "") {
	let keys = new Set();
	if (!obj || typeof obj !== "object") return keys;

	if (Array.isArray(obj)) {
		// For arrays, check keys of objects inside
		obj.slice(0, 10).forEach((item) => {
			const subKeys = getKeys(item, prefix);
			subKeys.forEach((k) => keys.add(k));
		});
	} else {
		Object.keys(obj).forEach((key) => {
			const newPrefix = prefix ? `${prefix}.${key}` : key;
			keys.add(newPrefix);
			const subKeys = getKeys(obj[key], newPrefix);
			subKeys.forEach((k) => keys.add(k));
		});
	}
	return keys;
}

async function run() {
	console.log(`Scanning dir: ${contentDir}`);
	const allFiles = getFiles(contentDir);
	const mdxFiles = allFiles.filter((f) => f.endsWith(".mdx"));

	const allKeys = new Set();
	const keyOccurrences = {};

	console.log(`Analyzing ${mdxFiles.length} MDX files...`);

	mdxFiles.forEach((file) => {
		const content = fs.readFileSync(file, "utf8");
		try {
			const { data } = matter(content);
			const keys = getKeys(data);
			keys.forEach((k) => {
				allKeys.add(k);
				keyOccurrences[k] = (keyOccurrences[k] || 0) + 1;
			});
		} catch (e) {
			console.error(`Error parsing ${file}:`, e.message);
		}
	});

	console.log("\n--- ALL FOUND KEYS ---");
	const sortedKeys = Array.from(allKeys).sort();
	sortedKeys.forEach((key) => {
		console.log(`${key} (${keyOccurrences[key]} files)`);
	});
}

run();
