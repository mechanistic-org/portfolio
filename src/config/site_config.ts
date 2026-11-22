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
		title: "Erik Norris | Product architecture and technical direction",
		description: "Erik Norris is an engineer working on product architecture, systems integration and the tools used to develop products.",
		theme: "theme-suit",
		r2_bucket: "https://assets.eriknorris.com",
	},
	mech: {
		domain: "mechanistic.com",
		title: "Mechanistic | Product architecture, development methods and tools",
		description: "Erik Norris's independent engineering practice: product architecture, systems integration and development methods, from concept through testing and manufacturing.",
		theme: "theme-lab",
		r2_bucket: "https://assets.mechanistic.com",
	},
	play: {
		domain: "moreplay.com",
		title: "Moreplay | Family, photographs and the longer story",
		description: "Family stories, photographs and memories from Erik Norris: the British Columbia coast, the repair shop, cars and tools.",
		theme: "theme-play",
		r2_bucket: "https://assets.moreplay.com",
	},
};

// Default to 'main' for safety if env var is missing
export const currentSite: SiteVariant = (import.meta.env.SITE_VARIANT as SiteVariant) || "main"; // v1.11 Fix: Typo in ENV var name
export const site = SITE_CONFIG[currentSite];
