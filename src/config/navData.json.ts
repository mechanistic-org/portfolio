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
		text: "Home",
		href: "/",
	},
	{
		text: "Projects",
		href: "/projects/",
	},
	{
		text: "Specs",
		dropdown: [
			{
				text: "About Me",
				href: "/about/",
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