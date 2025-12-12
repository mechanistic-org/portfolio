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
		text: "About",
		dropdown: [
			{
				text: "BIO",
				href: "/about/bio/",
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
				href: "/resume/pdf/",
				newTab: true,
			},
			{
				text: "Dashboard",
				href: "/resume/dashboard/",
			},
			{
				text: "3D",
				href: "/resume/3d/",
			},
			{
				text: "1-Pager",
				href: "/resume/one-pager/",
			},
			{
				text: "Infographic",
				href: "/resume/infographic/",
			},
			{
				text: "Timeline",
				href: "/history/",
			},
			{
				text: "Interactive",
				href: "/resume/interactive/",
			},
			{
				text: "KPI",
				href: "/resume/kpi/",
			},
		],
	},
];

export default navConfig;
