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
		"Principal Mechanical Architect specializing in high-fidelity hardware and program rescue. I stabilize the entropy of product development: structure the chaos, index the decisions, ship the hardware.",
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
			link: "mailto:erik@eriknorris.com",
		},
	],

	// Your information for blog post purposes
	author: {
		name: "Erik Norris",
		// Single contact address across the site. resume_master.ts is the identity
		// source of truth; this matches it. Two addresses were in circulation
		// (erik@mechanistic.com in the nav, erik@eriknorris.com on the resume).
		email: "erik@eriknorris.com",
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
		"Forensic System Architecture",
		"Root Cause Analysis (RCA)",
		"Advanced Surface Class-A",
		"Precision Sheet Metal Topology",
		"Haptic & Kinematic Tuning",
		"Thermal-Acoustic Optimization",
		"Plastic Injection Molding",
		"Sovereign Assembly Strategies",
		"Yield Recovery (0% to 100%)",
		"Dual-Source Supply Chain",
		"DFx for Automated Assembly",
		"Die Casting & CNC Machining",
		"Rapid Tooling Qualification",
		"Thermal Simulation (CFD)",
		"Regulatory Compliance (UL 1472 / FCC)",
		"Tolerance Analysis",
		"Class III Medical Standards",
		"High-Velocity Airflow Systems",
	],
	sameAs: [
		"https://www.linkedin.com/in/eriknorris/",
		"https://github.com/eriknorris",
		"https://mechanistic.com",
		"https://moreplay.com",
		"https://resume.eriknorris.com",
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
