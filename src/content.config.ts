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

			// Reality Discriminator (The Simulation Protocol)
			realm: z.enum(["reality", "simulation"]).default("reality"),

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
			metrics: z
				.object({
					quotes: z.array(z.string()).optional(),
					financial: z
						.object({
							toolingBudget: z.number().optional(),
							toolingActual: z.number().optional(),
							costOfGoodsSold: z.array(z.string()).optional(),
							margins: z.array(z.string()).optional(),
							quotes: z.array(z.string()).optional(),
							royaltySaved: z.string().nullable().optional(),
							riskBuy: z.string().nullable().optional(),
							toolingWaived: z.number().optional(),
							value: z.string().nullable().optional(),
							label: z.string().nullable().optional(),
						})
						.optional(),
					process: z
						.object({
							engineeringChangeOrders: z.array(z.string()).optional(),
							yield: z.array(z.string()).optional(),
							yieldCrisis: z.string().nullable().optional(),
							yieldRecovery: z.string().nullable().optional(),
							label: z.string().nullable().optional(),
							value: z.string().nullable().optional(),
						})
						.optional(),
					production: z
						.object({
							label: z.string().nullable().optional(),
							value: z.string().nullable().optional(),
						})
						.optional(),
					quality: z
						.object({
							label: z.string().nullable().optional(),
							value: z.string().nullable().optional(),
						})
						.optional(),
					governance: z
						.object({
							ecos: z.array(z.string()).optional(),
							dcos: z.number().optional(),
							dcdCount: z.number().optional(),
						})
						.optional(),
					interventions: z
						.object({
							count: z.number().optional(),
							label: z.string().nullable().optional(),
							value: z.number().optional(),
						})
						.optional(),
					profitability: z
						.object({
							value: z.string().nullable().optional(),
							label: z.string().nullable().optional(),
						})
						.optional(),
					cogs: z
						.object({
							value: z.string().nullable().optional(),
							label: z.string().nullable().optional(),
						})
						.optional(),
					time_to_market: z
						.object({
							value: z.string().nullable().optional(),
							label: z.string().nullable().optional(),
						})
						.optional(),
				})
				.optional(),

			// Forensic Architecture (injected by hydrate_content.py)
			toolchain: z.array(z.string()).optional(),

			// V2.0 SCHEMA (Feb 2026) - STRICT OBJECT
			// We rejected the Component Union. It must be an object.
			forensic_summary: z
				.object({
					trigger: z.string(),
					intervention: z.string(),
					result: z.string(),
				})
				.optional(),

			bom: z
				.array(
					z.object({
						label: z.string(),
						value: z.string().optional(),
					}),
				)
				.optional(),

			// V2.1: Complexity Vector (Physical Design)
			complexity_vector: z
				.object({
					part_count_growth: z
						.array(
							z.object({
								phase: z.string(),
								count: z.number(),
								date: z.string(),
								note: z.string().optional(),
							}),
						)
						.optional(),
					process_density: z
						.array(
							z.object({
								part_name: z.string(),
								part_number: z.string().optional(),
								material: z.string().optional(),
								steps: z.array(z.string()).optional(),
								complexity_score: z.number().optional(),
								failure_mode: z.string().optional(),
								notes: z.string().optional(),
							}),
						)
						.optional(),
					tooling_chain: z
						.array(
							z.object({
								tool_name: z.string(),
								type: z.string().optional(),
								vendor: z.string().optional(),
								lead_time_weeks: z.number().optional(), // Changed to number to support floats
								cost_impact: z.string().optional(),
								status: z.string().optional(),
								risk: z.string().optional(),
								notes: z.string().optional(),
							}),
						)
						.optional(),
					supply_chain_nodes: z
						.array(
							z.object({
								location: z.string(),
								role: z.string(),
								vendor: z.string().optional(),
								notes: z.string().optional(),
							}),
						)
						.optional(),
					legacy_metrics: z
						.array(
							z.object({
								label: z.string(),
								value: z.string(),
							}),
						)
						.optional(),
				})
				.optional(),

			// V2.2: Structured Content Catch-All (Oddballs)
			// V2.2: Structured Content Catch-All (Oddballs)
			// DEPRECATED: Use forensic_metrics instead. This field is banned.
			forensic_data: z.never().optional(),

			// V2.1: Timeline (Events)
			timeline: z
				.array(
					z.object({
						date: z.string().or(z.date()),
						title: z.string(),
						description: z.string(),
					}),
				)
				.optional(),

			audio_url: z.string().optional(),
			notebook_url: z.string().optional(),
			nlm_url: z.string().nullable().optional(), // NotebookLM "Oracle" Link

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
						linkedin: z.string().optional(), // explicit profile URL; falls back to a name+company search
					}),
				)
				.optional(),
			statusLabel: z.string().optional(),
			job_title: z.enum(ROLE_VALUES as any).optional(),

			// Forensic Narrative (The Scars)
			scars: z
				.array(
					z.union([
						z.number(), // Legacy Ref Support
						z.object({
							label: z.string(),
							value: z.string(),
							description: z.string(),
						}),
					]),
				)
				.optional(),

			// Trust Signals (Isomorphic Narrative)
			isomorphics: z
				.array(
					z.object({
						label: z.string(),
						hardware_point: z.string(),
						software_point: z.string(),
						principle: z.string(),
					}),
				)
				.optional(),

			// Seismograph Events (Entropy Vector)
			events: z
				.array(
					z.object({
						date: z.string(),
						score: z.number(),
						snippet: z.string(),
						source_ref: z.string().optional(),
						type: z.string().optional(),
					}),
				)
				.optional(),

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
		description: z.string().optional(),
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
