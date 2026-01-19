import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// 3. OTHER PAGES
const otherPagesCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/otherPages" }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			draft: z.boolean().optional(),
		}),
});

// 4. PROJECTS
const projectsCollection = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
	schema: z.object({
		title: z.string(),
		slug: z.string().optional(),
		date: z.coerce.date().optional(),
		endDate: z.coerce.date().optional(),

		employer: z.string().optional(),
		industry: z.string().default("Other"),
		category: z.string().optional(),
		tools: z.array(z.string()).default([]),
		production: z.string().optional(),

		client: z.array(z.string()).default([]),
		tags: z.array(z.string()).default([]),

		skillData: z
			.array(
				z.object({
					name: z.string(),
					value: z.number(),
				}),
			)
			.default([]),

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
					name: z.string(),
					url: z.string(),
				}),
			)
			.default([]),

		links: z
			.array(
				z.object({
					name: z.string(),
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
				war_stories: z
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
		job_title: z.string().optional(),
		war_stories: z
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
			.optional(), // Legacy fallback

		// Theme Selector (Core Architecture)
		theme: z.string().optional(),
		presentation_mode: z.string().optional(),

		// Visibility
		listed: z.boolean().default(true),
	}),
});

export const collections = {
	otherPages: otherPagesCollection,
	projects: projectsCollection,
};
