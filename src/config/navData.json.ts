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
		text: "App Notes", // Renamed from Blog for engineering vibe
		href: "/blog/",
	},
	{
		text: "Specs", // Renamed from About/Pages for datasheet vibe
		dropdown: [
			{
				text: "About Me",
				href: "/about/", // Note: You'll need to create this page or alias it
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