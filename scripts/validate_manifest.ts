import { z } from "astro/zod";
import fs from "fs";
import path from "path";
import { globSync } from "glob";

// Import the schema definition (replicating the logic from content.config.ts)
// We replicate it to run standalone without Astro's build pipeline
import {
	EMPLOYER_VALUES,
	INDUSTRY_VALUES,
	CATEGORY_VALUES,
	CLIENT_VALUES,
	TOOL_VALUES,
	PRODUCTION_STATUS_VALUES,
	PRODUCTION_SCALE_VALUES,
} from "../src/config/taxonomy";

// Define the Schema (Hardened Version)
const projectSchema = z.object({
	title: z.string().catch("MISSING TITLE"),
	slug: z.string().optional(),
	date: z.coerce.date().optional(),
	employer: z
		.enum(EMPLOYER_VALUES as any)
		.catch("Self-Employed")
		.optional(),
	industry: z
		.enum(INDUSTRY_VALUES as any)
		.catch("consumer_electronics")
		.default("consumer_electronics"),
	category: z
		.enum(CATEGORY_VALUES as any)
		.catch("Uncategorized")
		.optional(),
	tools: z.array(z.enum(TOOL_VALUES as any)).default([]),
	production: z.enum(PRODUCTION_STATUS_VALUES as any).optional(),
	client: z
		.array(z.enum(CLIENT_VALUES as any))
		.catch([])
		.default([]),
	tags: z.array(z.string()).default([]),
	// Skipping deep nested objects for speed, focusing on top-level fragility
	heroImage: z.string().optional(),
});

import matter from "gray-matter";

function validateManifests() {
	console.log("🥔 Potato Mode: Running Bulk Manifest Validation (The Jig)...");
	console.log("🛡️  Quality Gate: Active (Trapping 'DEFAULT' and 'placeholders')");

	const projectsDir = path.join(process.cwd(), "src/content/projects");
	const files = globSync(`${projectsDir}/**/*.mdx`);

	let passed = 0;
	let failed = 0;
	let warnings = 0;

	files.forEach((file) => {
		try {
			const content = fs.readFileSync(file, "utf-8");
			const parsed = matter(content);

			// 1. Hard Schema Check (Crash Gate)
			const result = projectSchema.safeParse(parsed.data);

			if (!result.success) {
				console.error(`❌ SCHEMA FAIL: ${path.basename(file)}`);
				console.error(result.error.issues);
				failed++;
				return;
			}

			// 2. Quality Check (Quality Gate)
			const data = result.data;
			let fileWarnings: string[] = [];

			// Recursive function to find "DEFAULT" or placeholders
			function scanForQuality(obj: any, pathStr: string = "") {
				if (typeof obj === "string") {
					if (obj.includes("DEFAULT")) {
						fileWarnings.push(`  ⚠️  Unpolished Content: ${pathStr} = "${obj}"`);
					}
					if (obj.includes("placeholder") || obj.includes("/assets/placeholders")) {
						fileWarnings.push(`  ⚠️  Placeholder Asset: ${pathStr} = "${obj}"`);
					}
				} else if (Array.isArray(obj)) {
					obj.forEach((item, i) => scanForQuality(item, `${pathStr}[${i}]`));
				} else if (typeof obj === "object" && obj !== null) {
					Object.keys(obj).forEach((key) => {
						scanForQuality(obj[key], `${pathStr}.${key}`);
					});
				}
			}

			scanForQuality(data);

			if (fileWarnings.length > 0) {
				console.warn(`⚠️  QUALITY WARNING: ${path.basename(file)}`);
				fileWarnings.forEach((w) => console.warn(w));
				warnings++;
			}

			if (result.success) {
				passed++;
			}
		} catch (e) {
			console.error(`💥 CRASH: ${path.basename(file)}`, e);
			failed++;
		}
	});

	console.log(`\n📊 Report: ${passed} Passed, ${failed} Failed.`);
	if (warnings > 0) {
		console.log(`⚠️  Quality Warnings: ${warnings} (Site is live, but content is unpolished)`);
	}
}

validateManifests();
