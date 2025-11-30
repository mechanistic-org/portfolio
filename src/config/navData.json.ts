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

const navConfig: navItem[] = [
	{
		text: "Work",
		href: "/projects/",
	},
	{
		text: "Log",
		href: "/blog/",
	},
	{
		text: "About",
		dropdown: [
			{
				text: "BIO",
				href: "/about/",
			},
			{
				text: "This Site",
				href: "/colophon/",
			},
		],
	},
];

export default navConfig;