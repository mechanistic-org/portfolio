import tokens from "../data/design_tokens.json";

/**
 * SOVEREIGN COLOR REGISTRY
 *
 * This file is the Single Source of Truth (= SSOT) for application color logic.
 * It replaces the legacy `Colors.csv` with a semantic, typed system.
 *
 * TIER 1: IDENTITY (Brand / Employers)
 * TIER 2: PSYCHOLOGY (Hyde Traits)
 * TIER 3: DATA (Categorical Swarms)
 */

export const PALETTES = {
	// The "Corporate" Identity
	identity: {
		primary: tokens.palette.primary.base, // #2E5CFF (YInMn Blue)
		secondary: tokens.palette.secondary.base, // #00C2FF (Electric Cyan)
		neutral: tokens.palette.neutral.steel, // #4B5563
		accent: tokens.palette.neutral.aluminum, // #9CA3AF
	},
	// The "Ouroboros" Psychology (Hyde)
	// Matches the "Lobes" in hydeData.ts
	hyde: {
		anchor: tokens.palette.primary.base, // Core Essence
		main: tokens.palette.secondary.base, // Fundamental Personality
		transition: tokens.palette.neutral.aluminum, // Hard Skills (Bridge)
		deep: tokens.palette.neutral.carbon, // Leadership (Foundation)
	},
	// The "Data" Vis Scales
	// A restricted, high-contrast subset for D3 visualizations
	categorical: [
		tokens.palette.primary.base, // #2E5CFF
		tokens.palette.secondary.base, // #00C2FF
		tokens.palette.neutral.steel, // #4B5563
		tokens.palette.neutral.aluminum, // #9CA3AF
	],
} as const;

// --- TIER 1: EMPLOYER IDENTITY MAPPING ---
// Explicit overrides for known entities using 8-digit Hex (Alpha)
// SSOT provided by User 2026-01-07
export const EMPLOYER_IDENTITY = {
	Mechanistic: "#001BE6E6", // Deep Transparent Blue
	Hyphen: "#50E5B4E6", // Cyan/Teal
	Noon: "#F6BE15F5", // Golden Yellow
	Avegant: "#6F727B7A", // Grayish
	Kaleidescape: "#749ABEB3", // Muted Blue
	Digidesign: "#7224DFDE", // Purple
	frogdesign: "#40BA00BA", // Frog Green
	"Silicon Graphics": "#0084FFAD", // SGI Blue
} as const;

// Combined Resolver Map (Legacy support included)
export const EMPLOYER_MAP: Record<string, string> = {
	...EMPLOYER_IDENTITY,
	// Fallbacks or Aliases if needed
	"EP Technologies": PALETTES.identity.neutral,
};

// --- RESOLVER API ---

import { generatePalette, type PaletteScheme } from "../utils/colorUtils";

/**
 * Resolves the IDENTITY color for a given entity.
 * This is the "Base Frequency" for that entity.
 */
export function getEntityColor(
	name: string,
	type: "EMPLOYER" | "SKILL" | "TRAIT" | "OTHER" = "OTHER",
): string {
	if (!name) return PALETTES.identity.neutral;

	// 1. Check Explicit Employer Identity
	// Normalize checks to handle case-sensitivity if needed, though Maps are sensitive.
	// We check keys directly for speed.
	if ((type === "EMPLOYER" || type === "OTHER") && name in EMPLOYER_MAP) {
		return EMPLOYER_MAP[name];
	}

	// 2. Check Hyde Trait Logic
	if (type === "TRAIT") {
		return PALETTES.hyde.main;
	}

	// 3. Fallback / Skill Hashing
	if (type === "EMPLOYER") return PALETTES.identity.neutral;

	if (type === "SKILL" || type === "OTHER") {
		const hash = simpleHash(name);
		return PALETTES.categorical[hash % PALETTES.categorical.length];
	}

	return PALETTES.identity.neutral;
}

/**
 * Returns a computed harmonious palette for a given entity.
 * Example: Get a complementary color for a chart highlight.
 */
export function getEntityPalette(name: string, scheme: PaletteScheme = "monochromatic"): string[] {
	const base = getEntityColor(name, "EMPLOYER"); // Default to employer logic for base
	return generatePalette(base, scheme);
}

/**
 * Simple deterministic string hash for color assignment
 */
function simpleHash(str: string): number {
	if (!str) return 0;
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return Math.abs(hash);
}
