export interface SocialLinkProps {
	platform:
		| "github"
		| "twitter"
		| "mastodon"
		| "linkedin"
		| "instagram"
		| "threads"
		| "facebook"
		| "youtube"
		| "twitch"
		| "tiktok"
		| "snapchat"
		| "reddit"
		| "pinterest"
		| "medium"
		| "dev"
		| "dribbble"
		| "behance"
		| "codepen"
		| "producthunt"
		| "discord"
		| "slack"
		| "whatsapp"
		| "telegram"
		| "email" // you should always at least have an email
		| "resume";
	link: string;
}

export interface SiteDataProps {
	name: string;
	title: string;
	description: string;
	useViewTransitions?: boolean;
	useAnimations?: boolean;
	socialLinks: SocialLinkProps[];
	author: {
		// used for blog post purposes
		name: string;
		email: string;
		twitter?: string; // used for twitter cards when sharing a blog post on twitter
	};
	defaultImage: {
		src: string;
		alt: string;
	};
	status?: {
		type: "production" | "under-construction" | "maintenance";
		text?: string;
	};
	skills: string[];
	sameAs: string[];
	employers: string[];
}

// Update this file with your site specific information
const siteData: SiteDataProps = {
	name: "Erik Norris' Portfolio",
	// Your website's title and description (meta fields)
	title: "Erik Norris | Principal Mechanical Architect",
	description:
		"The archived ledger of Erik Norris, Principal Mechanical Architect. A sovereign engine providing forensic access to over 30 years of high-fidelity hardware design. You have accessed a headless, agentic data pipeline that compiles digital exhaust into data stories.",
	useViewTransitions: true,
	useAnimations: true,

	socialLinks: [
		{
			platform: "resume",
			link: "https://resume.eriknorris.com",
		},
		{
			platform: "linkedin",
			link: "https://www.linkedin.com/in/eriknorris/",
		},
		{
			platform: "github",
			link: "https://github.com/eriknorris",
		},
		{
			// you should always at least have an email
			platform: "email",
			link: "mailto:erik@mechanistic.com",
		},
	],

	// Your information for blog post purposes
	author: {
		name: "Erik Norris",
		email: "erik@mechanistic.com",
		// twitter: "BowTiedWebReapr",
	},

	// default image for meta tags if the page doesn't have an image already
	defaultImage: {
		src: "/assets/branding/logo.png",
		alt: "Erik Norris - Principal Mechanical Architect",
	},
	status: {
		type: "under-construction", // "production" | "under-construction" | "maintenance"
		text: "UNDER CONSTRUCTION",
	},
	skills: [
		"Mechanical Architecture",
		"Forensic Engineering",
		"Consumer Product Design", // Unambiguous hardware focus
		"High-Fidelity Hardware",
		"Program Rescue",
		"Consumer Electronics",
		"Wearable AR",
		"MCAD", // Renamed from CAD
		"SolidWorks",
		"Onshape",
		"PTC Creo",
		"Rapid Prototyping", // Promoted
		"Manufacturing Strategy",
		"Plastic Injection Molding",
		"Sheet Metal Architecture",
		"Mechanism Design",
		"Thermal Management",
		"Electromechanical Integration", // Replaces "Electronics"
		"Design Verification Testing (DVT)",
		"Product Lifecycle Management (PLM)",
		"Team Leadership",
	],
	sameAs: [
		"https://www.linkedin.com/in/eriknorris/",
		"https://github.com/eriknorris",
		"https://mechanistic.com",
		"https://moreplay.com",
	],
	employers: [
		"Hyphen",
		"Noon",
		"Avegant",
		"Kaleidescape",
		"Digidesign",
		"frogdesign",
		"Silicon Graphics",
		"EP Technologies",
	],
};

export default siteData;
