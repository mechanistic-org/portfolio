import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { z } from "zod";
import {
	TOOL_VALUES,
	EMPLOYER_VALUES,
	INDUSTRY_VALUES,
	CATEGORY_VALUES,
	ROLE_VALUES,
} from "../src/config/taxonomy";

const PROJECTS_DIR = path.resolve("src/content/projects");

// Helper function to format enum arrays for Zod
function formatEnum<T extends string>(arr: T[]): [T, ...T[]] {
	if (arr.length === 0) {
		throw new Error("Enum array cannot be empty.");
	}
	return [arr[0], ...arr.slice(1)];
}

// Replicated Schema from src/content.config.ts (Strict Enums)
const projectSchema = z
	.object({
		title: z.string(),
		slug: z.string().optional(),
		date: z.coerce.date().optional(),
		endDate: z.coerce.date().optional(),

		employer: z.enum(formatEnum(EMPLOYER_VALUES)).optional(),
		industry: z.enum(formatEnum(INDUSTRY_VALUES)).default("consumer_electronics"),
		category: z.enum(formatEnum(CATEGORY_VALUES)).optional(),
		tools: z.array(z.enum(formatEnum(TOOL_VALUES))).default([]),
		production: z.string().optional(),

		client: z.array(z.string()).default([]),
		tags: z.array(z.string()).default([]),

		skillData: z.array(z.any()).default([]),

		gallery: z
			.array(
				z.object({
					src: z.string(),
					width: z.number(),
					height: z.number(),
					aspectRatio: z.number(),
				}),
			)
			.default([]),

		documents: z
			.array(
				z.object({
					name: z.string().optional(),
					url: z.string(),
				}),
			)
			.default([]),
		links: z
			.array(
				z.object({
					name: z.string().optional(),
					url: z.string(),
				}),
			)
			.default([]),

		stats: z
			.object({
				plastic: z.number().default(0),
				metal: z.number().default(0),
				pcb: z.number().default(0),
			})
			.optional(),

		heroImage: z.string().optional(),
		draft: z.boolean().default(false),
		description: z.string().optional(),

		// New fields
		duration: z.string().optional(),
		statusLabel: z.string().optional(),
		additionalSkills: z.array(z.string()).default([]),
		skillGraph: z.string().optional(),
		partGraph: z.string().optional(),

		// V4 Scrolly Engine
		cyberspace: z.any().optional(),

		// HUD Intelligence (V4.2 Upgrade)
		metrics: z
			.object({
				cogs: z.object({ value: z.string(), label: z.string() }).optional(),
				profitability: z.object({ value: z.string(), label: z.string() }).optional(),
				governance: z
					.object({
						ecos: z.array(z.string()),
						dcos: z.number(),
					})
					.optional(),
				interventions: z.object({ count: z.number(), label: z.string() }).optional(),
				financial: z
					.object({
						toolingBudget: z.number().optional(),
						toolingActual: z.number().optional(),
						costOfGoodsSold: z.array(z.any()).optional(),
						margins: z.array(z.any()).optional(),
					})
					.optional(),
				process: z
					.object({
						engineeringChangeOrders: z.array(z.any()).optional(),
						dcdCount: z.number().optional(),
					})
					.optional(),
				scars: z
					.array(
						z.union([
							z.number(),
							z.object({
								label: z.string(),
								value: z.string(),
								description: z.string(),
							}),
						]),
					)
					.optional(),
			})
			.optional(),

		// Forensic Architecture (injected by hydrate_content.py)
		toolchain: z.array(z.string()).optional(),
		forensic_summary: z.string().optional(),
		audio_url: z.string().optional(),

		// NotebookLM Metrics (String-based)
		forensic_metrics: z
			.object({
				financial: z.string().optional(),
				process: z.string().optional(),
				technical: z.string().optional(),
			})
			.optional(),

		phase_stats: z.record(z.number()).optional(),
		teamSize: z.coerce.string().optional(),
		job_title: z.enum(formatEnum(ROLE_VALUES)).optional(),
		scars: z
			.array(
				z.union([
					z.number(),
					z.object({
						label: z.string(),
						value: z.string(),
						description: z.string(),
					}),
				]),
			)
			.optional(),

		// Theme Selector (Core Architecture)
		theme: z.string().optional(),
		presentation_mode: z.string().optional(),

		// Visibility
		listed: z.boolean().default(true),
	})
	.strict();

const otherPagesSchema = z.object({
	title: z.string(),
	description: z.string(),
	draft: z.boolean().optional(),
});

const slugs = new Set<string>();

function validateFile(filePath: string, schema: z.ZodTypeAny) {
	const content = fs.readFileSync(filePath, "utf-8");
	const parts = content.split(/^---$/m); // Split by --- line
	if (parts.length < 3) return; // No FM

	const fm = parts[1];
	let data;
	try {
		data = yaml.load(fm);
	} catch (e: any) {
		console.error(`YAML Error in ${path.basename(filePath)}: ${e.message}`);
		return;
	}

	// Check slug duplication
	let slug = data.slug;
	if (!slug) {
		// Fallback: filename base (simplistic)
		slug = path.basename(filePath, path.extname(filePath));
		if (slug === "index") {
			slug = path.basename(path.dirname(filePath));
		}
	}

	if (slug) {
		if (slugs.has(slug)) {
			console.error(`Duplicate Slug Found: ${slug} in ${filePath}`);
		} else {
			slugs.add(slug);
		}
	}

	const result = schema.safeParse(data);
	if (!result.success) {
		console.error(`Zod Error in ${filePath}:`);
		result.error.errors.forEach((err) => {
			console.error(`  - ${err.path.join(".")}: ${err.message}`);
		});
	}

	// Check Image Existence (Astro strictness)
	// 1. heroImage
	if (data.heroImage) {
		checkImage(data.heroImage, filePath, "heroImage");
	}
	// 2. gallery
	if (data.gallery && Array.isArray(data.gallery)) {
		data.gallery.forEach((item: any, idx: number) => {
			if (item.src) {
				checkImage(item.src, filePath, `gallery[${idx}].src`);
			}
		});
	}
}

function checkImage(imgRelPath: string, contentFilePath: string, fieldName: string) {
	if (!imgRelPath) return;
	// Images are relative to public/ or src/assets/?
	// Usually /assets/... maps to public/assets/... or src/assets/...

	// If starts with /, it is likely public
	let imgPath = "";
	if (imgRelPath.startsWith("/")) {
		imgPath = path.resolve("public" + imgRelPath);
		if (!fs.existsSync(imgPath)) {
			// Try src/assets (Astro sometimes maps /assets to src/assets in aliases, but usually / means public)
			// But eriknorris project seems to put assets in src/assets?
			// Let's check public first.
			// If not in public, check src/
			let imgPath2 = path.resolve("src" + imgRelPath);
			if (!fs.existsSync(imgPath2)) {
				console.error(`Image Missing in ${contentFilePath} (${fieldName}): ${imgRelPath}`);
				console.error(`  Checked: ${imgPath}`);
				console.error(`  Checked: ${imgPath2}`);
			}
		}
	} else {
		// Relative to content file?
		console.warn(
			`Relative image path found in ${contentFilePath} (${fieldName}): ${imgRelPath}. Logic needed.`,
		);
	}
}

function scanDir(dir: string, schema: z.ZodTypeAny) {
	if (!fs.existsSync(dir)) return;
	const files = fs.readdirSync(dir, { recursive: true });
	files.forEach((f) => {
		if (typeof f === "string" && (f.endsWith(".mdx") || f.endsWith(".md"))) {
			validateFile(path.join(dir, f), schema);
		}
	});
}

console.log("Scanning projects...");
scanDir(PROJECTS_DIR, projectSchema);

const OTHER_PAGES_DIR = path.resolve("src/data/otherPages");
console.log("Scanning otherPages...");
scanDir(OTHER_PAGES_DIR, otherPagesSchema);
