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
	// Removed Projects/About for HXO Consolidation
	{
		text: "Résumé",
		dropdown: [
			{
				text: "PDF",
				href: "/assets/resume/Erik_Norris_Sr_Staff_Forensic_Architect_2026.pdf",
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
