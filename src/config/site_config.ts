export type SiteVariant = "main" | "mech" | "play";

export interface SiteConfig {
	domain: string;
	title: string;
	description: string;
	theme: string;
	r2_bucket: string;
}

export const SITE_CONFIG: Record<SiteVariant, SiteConfig> = {
	main: {
		domain: "eriknorris.com",
		title: "Erik Norris | Principal Mechanical Engineer & Systems Architect",
		description: "The Suit: Professional Face & Source of Truth.",
		theme: "theme-suit",
		r2_bucket: "https://assets.eriknorris.com",
	},
	mech: {
		domain: "mechanistic.com",
		title: "Mechanistic | The Lab Coat",
		description: "Deep Dives, Technical Forensics, & Physics.",
		theme: "theme-lab",
		r2_bucket: "https://assets.mechanistic.com",
	},
	play: {
		domain: "moreplay.com",
		title: "MorePlay | The Leather Jacket",
		description: "Chaos, Experiments, and Ouroboros.",
		theme: "theme-play",
		r2_bucket: "https://assets.moreplay.com",
	},
};

// Default to 'main' for safety if env var is missing
export const currentSite: SiteVariant = (import.meta.env.SITE_VARIANT as SiteVariant) || "main"; // v1.11 Fix: Typo in ENV var name
export const site = SITE_CONFIG[currentSite];
