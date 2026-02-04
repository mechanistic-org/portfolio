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
		href: "/resume/",
	},
];

export default navConfig;
