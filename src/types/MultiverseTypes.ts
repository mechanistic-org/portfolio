export interface MultiverseNode {
	id: string;
	name: string;
	group: string;
	color: string;
	value: number;
	year: number;
	start_date: string;
	end_date: string;
	category: string;
	industry?: string;
	skills?: string[];
	img?: string;
	tier: "deep_dive" | "lite";
}

export interface MultiverseGraphData {
	nodes: MultiverseNode[];
	links: { source: string; target: string; value: number }[];
}
