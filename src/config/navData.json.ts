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
		text: "Projects",
		href: "/projects/",
	},
	{
		text: "Specs",
		dropdown: [
			{
				text: "BIO",
				href: "/about/",
			},
			{
				text: "This Site",
				href: "/colophon/",
			},
			{
				text: "Uses / Gear",
				href: "/uses/",
			},
			{
				text: "UI Elements",
				href: "/elements/",
			},
		],
	},
];

export default navConfig;