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
}

// Update this file with your site specific information
const siteData: SiteDataProps = {
	name: "Erik Norris' Portfolio",
	// Your website's title and description (meta fields)
	title: "Erik Norris | High-Performance Mechanical Design",
	description:
		"Technical portfolio of Erik Norris, Senior Mechanical Engineer. Specializing in high-performance consumer electronics, medical devices, and precision automation.",
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
		src: "/images/cosmic-themes-logo.jpg",
		alt: "Stellar logo",
	},
	status: {
		type: "under-construction", // "production" | "under-construction" | "maintenance"
		text: "UNDER CONSTRUCTION",
	},
};

export default siteData;
