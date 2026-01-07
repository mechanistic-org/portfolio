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
// Explicit overrides for known entities
export const EMPLOYER_MAP: Record<string, string> = {
	// BLUE (Primary/Secondary) - Creative/Tech
	Mechanistic: PALETTES.identity.primary,
	Kaleidescape: PALETTES.identity.primary,
	frogdesign: PALETTES.identity.primary,
	Hyphen: PALETTES.identity.secondary,
	Digidesign: PALETTES.identity.secondary,
	"Silicon Graphics": PALETTES.identity.secondary,

	// NEUTRAL - Corporate/Hardware
	Noon: PALETTES.identity.neutral,
	"EP Technologies": PALETTES.identity.neutral,
	Avegant: PALETTES.identity.accent,
};

// --- RESOLVER API ---

/**
 * Resolves the color for a given entity based on its type and name.
 */
export function getEntityColor(
	name: string,
	type: "EMPLOYER" | "SKILL" | "TRAIT" | "OTHER" = "OTHER",
): string {
	// 1. Check Explicit Employer Identity (Auto-detect if type is OTHER)
	// This ensures legacy data passing only the name still catches the Brand Identity.
	if ((type === "EMPLOYER" || type === "OTHER") && EMPLOYER_MAP[name]) {
		return EMPLOYER_MAP[name];
	}

	// 2. Check Hyde Trait Logic (Psychology)
	// Note: Ideally we'd look up the 'lobe' from hydeData,
	// but for raw color resolution we default to Main unless specified.
	if (type === "TRAIT") {
		return PALETTES.hyde.main;
	}

	// 3. Fallback / Skill Hashing
	// If it's a known employer but not mapped, default to Neutral
	if (type === "EMPLOYER") return PALETTES.identity.neutral;

	// For skills, we want variety but consistency.
	// We use a simple string hash to pick from the categorical palette.
	if (type === "SKILL" || type === "OTHER") {
		const hash = simpleHash(name);
		return PALETTES.categorical[hash % PALETTES.categorical.length];
	}

	return PALETTES.identity.neutral;
}

/**
 * Simple deterministic string hash for color assignment
 */
function simpleHash(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
}
