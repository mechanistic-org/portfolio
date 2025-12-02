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
			{
				text: "IFU",
				href: "/about/ifu/",
			},
			{
				text: "Elements",
				href: "/about/elements/",
			},
		],
	},
	{
		text: "Resume",
		dropdown: [
			{
				text: "PDF",
				href: "https://resume.eriknorris.com/",
				newTab: true,

			},
			{
				text: "3D Resume",
				href: "null",
			},
		],
	},
];

export default navConfig;