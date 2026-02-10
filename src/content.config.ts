import { defineCollection, z } from "astro:content";
import {
	INDUSTRY_VALUES,
	CATEGORY_VALUES,
	EMPLOYER_VALUES,
	CLIENT_VALUES,
	ROLE_VALUES,
	TOOL_VALUES,
	PRODUCTION_STATUS_VALUES,
	PRODUCTION_SCALE_VALUES,
} from "./config/taxonomy";
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
	schema: () =>
		z.object({
			title: z.string().catch("MISSING TITLE"),
			slug: z.string().optional(),
			date: z.coerce.date().optional(),
			endDate: z.coerce.date().optional(),

			// Trimain Strategy Fields
			targets: z.array(z.enum(["main", "mech", "play"])).default(["main"]),
			primary_home: z.enum(["main", "mech", "play"]).default("main"),
			asset_bucket: z.enum(["main", "mech", "play"]).default("main").optional(),

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
						// Shield Fix: Reverted to z.string() because image() crashes on public assets locally
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

			// Shield Fix: Reverted to z.string() because image() crashes on public assets locally
			heroImage: z.string().optional(),
			draft: z.boolean().default(false),
			description: z.string().optional(),

			// New Fields
			duration: z.string().optional(),
			productionScale: z.enum(PRODUCTION_SCALE_VALUES as any).optional(),
			additionalSkills: z.array(z.string()).default([]),
			skillGraph: z.string().optional(),
			partGraph: z.string().optional(),

			// V4 Scrolly Engine
			cyberspace: z.any().optional(),

			// HUD Intelligence (V4.2 Upgrade)
			metrics: z.any().optional(),

			// Forensic Architecture (injected by hydrate_content.py)
			toolchain: z.array(z.string()).optional(),
			forensic_summary: z.any().optional(), // CHANGED: Allow object or string to prevent crash
			audio_url: z.string().optional(),
			notebook_url: z.string().optional(),

			// NotebookLM Metrics (String-based)
			forensic_metrics: z
				.object({
					financial: z.string().optional(),
					process: z.string().optional(),
					technical: z.string().optional(), // Legacy?
					governance: z.string().optional(), // Added for Heavy 8 alignment
				})
				.optional(),

			transcript: z.string().nullable().optional(), // Added for AEO Audio Bridge

			phase_stats: z.record(z.number()).optional(),
			teamSize: z.coerce.string().optional(),
			cast: z
				.array(
					z.object({
						name: z.string(),
						role: z.string(),
						org: z.string(),
					}),
				)
				.optional(),
			statusLabel: z.string().optional(),
			job_title: z.enum(ROLE_VALUES as any).optional(),
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
			theme: z.string().catch("hyperspace").optional(),
			presentation_mode: z.string().optional(),

			// HXO / Tiering Architecture (V5)
			hydration_status: z.string().optional(), // 'full', 'partial', 'executive'
			tier: z.number().optional(), // 1, 2, 3
			hxo_ready: z.boolean().default(false),

			// Visibility
			listed: z.boolean().default(true),
		}),
});

// 5. DOCS
const docsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
	schema: z.object({
		title: z.string(),
		slug: z.string().optional(),
		sidebar: z
			.object({
				group: z.string().optional(),
				order: z.number().optional(),
				label: z.string().optional(),
			})
			.optional(),
	}),
});

export const collections = {
	otherPages: otherPagesCollection,
	projects: projectsCollection,
	docs: docsCollection,
};
