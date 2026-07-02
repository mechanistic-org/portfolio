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
// ── CONTRACT v2 (frozen 2026-07-01, portfolio#109 K7) ──────────────────────
// Change discipline: no field additions/removals without a PR that updates
// canon SCHEMA.md and scripts/project_pipeline.py in the same change.
// Kill-list dispositions + rulings: canon/queries/k2-stranded-data-decision-sheet.md
export const PROJECT_SCHEMA_VERSION = "2.0.0";
const projectsCollection = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
	schema: () =>
		z.object({
			title: z.string(), // fail loud — 121/121 populated; no silent "MISSING TITLE"
			slug: z.string().optional(),
			date: z.coerce.date().optional(),
			endDate: z.coerce.date().optional(),

			// Trimain Strategy Fields
			targets: z.array(z.enum(["main", "mech", "play"])).default(["main"]),
			primary_home: z.enum(["main", "mech", "play"]).default("main"),

			// Reality Discriminator (The Simulation Protocol)
			realm: z.enum(["reality", "simulation"]).default("reality"),

			// Taxonomy — .catch() silent-defaults removed at freeze: invalid enum
			// values now fail the build instead of masking taxonomy drift.
			employer: z.enum(EMPLOYER_VALUES as any).optional(),
			industry: z.enum(INDUSTRY_VALUES as any).default("consumer_electronics"),
			category: z.enum(CATEGORY_VALUES as any).optional(),
			tools: z.array(z.enum(TOOL_VALUES as any)).default([]),
			production: z.enum(PRODUCTION_STATUS_VALUES as any).optional(),
			client: z.array(z.enum(CLIENT_VALUES as any)).default([]),
			tags: z.array(z.string()).default([]),

			// Shield Fix: Reverted to z.string() because image() crashes on public assets locally
			heroImage: z.string().optional(),
			draft: z.boolean().default(false),
			description: z.string().optional(),

			duration: z.string().optional(),
			productionScale: z.enum(PRODUCTION_SCALE_VALUES as any).optional(),

			// V4 Scrolly Engine
			// #69 hardening: was z.any() (zero validation, the next meltdown vector). Typed to the
			// known top-level shape with .passthrough() so heterogeneous sticky internals are
			// preserved (not silently stripped); `stickies` stays z.any()[] so the Hyperspace /
			// ProjectArticle consumers keep `any` access. Full per-sticky type is a #69 follow-up.
			cyberspace: z
				.object({
					enable: z.boolean().optional(),
					layout: z.string().optional(),
					narrative: z.array(z.any()).optional(),
					stickies: z.array(z.any()).optional(),
				})
				.passthrough()
				.nullable()
				.optional(),

			// Sidecar Law: structured `metrics` and `complexity_vector` live in the
			// data.json sidecar (project_pipeline.py DATA_JSON_FIELDS), never in
			// frontmatter. The sidecar glob stays disabled until a sidecar validator
			// exists ([...slug].astro, disabled 2026-06-15).

			// Forensic Architecture (written by the canon generator, scripts/project_pipeline.py)
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

			// BANNED (meltdown 2 scar): the z.never() guard stays until the legacy
			// theme components that still reference forensic_data retire at propagation.
			forensic_data: z.never().optional(),

			audio_url: z.string().optional(), // P5 audio-studio target

			// NotebookLM Metrics (String-based, display layer for the HUD)
			forensic_metrics: z
				.object({
					financial: z.string().optional(),
					process: z.string().optional(),
					governance: z.string().optional(),
				})
				.optional(),

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
			job_title: z.enum(ROLE_VALUES as any).optional(),

			// Forensic Narrative (The Scars) — legacy z.number() ref arm removed at
			// freeze (migration long complete; c24 is the only producer, object form)
			scars: z
				.array(
					z.object({
						label: z.string(),
						value: z.string().optional(),
						description: z.string().optional(),
						// V8 scar-instrument fields (the heat-timeline)
						severity: z.enum(["critical", "major", "minor"]).optional(),
						phase: z.string().optional(), // timeline band: concept|design|pilot|fcs
						anchor: z.string().optional(), // heading id to scroll/cross-highlight (omit if no prose)
						trigger: z.string().optional(),
						intervention: z.string().optional(),
						result: z.string().optional(),
						evidence: z.array(z.string()).optional(), // gallery image alts this scar spotlights
					}),
				)
				.optional(),

			// Disambiguation / scope note (Wikipedia hatnote)
			hatnote: z.string().optional(),

			// Trust Signals (Isomorphic Narrative) — operator lean-in ruling 2026-07-01:
			// first-class feature alongside scars. Pipeline-owned from canon
			// (canon/concepts/isomorphics archive); hand-edits will be overwritten.
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

			// Entropy/seismograph events live in the _entropy.json sidecar
			// (Sidecar Law) — the frontmatter `events` field was removed at freeze.

			// Theme Selector (Core Architecture)
			theme: z.string().default("hyperspace"),
			presentation_mode: z.string().optional(), // retires after propagation flips pages to `tier`

			// Tiering (contract v2): binary, pipeline-computed (compute_tier).
			// Replaces hydration_status / numeric tier / hxo_ready.
			tier: z.enum(["flagship", "lite"]).optional(),

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
