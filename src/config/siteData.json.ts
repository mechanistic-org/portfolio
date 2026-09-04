import { resumeMaster } from "./resume_master.ts";
import { identityMetadata, httpsUrl } from "./resume_projection.ts";
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

const identity = identityMetadata(resumeMaster);
const { contact } = resumeMaster.header;
const siteData: SiteDataProps = {
	...identity,
	useViewTransitions: true,
	useAnimations: true,
	socialLinks: [
		{ platform: "resume", link: httpsUrl(contact.resume) },
		{ platform: "linkedin", link: httpsUrl(contact.linkedin) },
		{ platform: "github", link: httpsUrl(contact.github) },
		{ platform: "email", link: `mailto:${contact.email}` },
	],
	defaultImage: { src: "/assets/branding/logo.png", alt: identity.title },
	status: { type: "under-construction", text: "UNDER CONSTRUCTION" },
};
export default siteData;
