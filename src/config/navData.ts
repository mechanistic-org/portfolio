export interface navLinkItem {
	text: string;
	href: string;
	newTab?: boolean;
}

export interface navDropdownItem {
	text: string;
	dropdown: navLinkItem[];
}

export type navItem = navLinkItem | navDropdownItem;

// Projects and About were removed here during the HXO consolidation, which left
// the site with a single nav link and stranded /about entirely (no inbound links
// from anywhere). Every page needs a way out and a way to the ask.
const navConfig: navItem[] = [
	{
		text: "Work",
		href: "/projects/",
	},
	{
		text: "About",
		href: "/about/",
	},
	{
		text: "How I Work",
		href: "/how-i-work/",
	},
	{
		text: "Résumé",
		href: "/resume/",
	},
	{
		text: "Contact",
		href: "/contact/",
	},
];

export default navConfig;
