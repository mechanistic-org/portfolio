import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { MultiverseNode } from "@/types/MultiverseTypes";
import { getEntityColor } from "../../config/color_registry";

// TRANSFORMER: Convert Flat Multiverse Data -> D3 Hierarchy
// Hierarchy: Root -> Industry -> Group -> Project
interface HierarchyNode {
	name: string;
	value?: number;
	children?: HierarchyNode[];
	id?: string; // Project Slug
}

const buildHierarchy = (nodes: any[]): HierarchyNode => {
	// 1. Group by Industry -> Group
	const groups = d3.group(
		nodes,
		(d) => d.industry || "Other",
		(d) => d.group || "Unknown",
	);

	// 2. Convert Map to Hierarchy Structure
	const children = Array.from(groups, ([industryName, industryGroups]) => ({
		name: industryName,
		children: Array.from(industryGroups, ([groupName, projects]) => ({
			name: groupName,
			children: projects.map((p) => ({
				name: p.name,
				id: p.id,
				value: p.value,
			})),
		})),
	}));

	return {
		name: "Erik Norris",
		children: children,
	};
};

interface RadialTaxonomyProps {
	data?: HierarchyNode | { nodes: MultiverseNode[] }; // Accept pre-built hierarchy OR raw nodes
}

const RadialTaxonomy: React.FC<RadialTaxonomyProps> = ({ data: inputData }) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

	// Compute Data Once
	const data = React.useMemo(() => {
		if (!inputData) return buildHierarchy([]);
		// Check if inputData is raw nodes (has 'nodes' array)
		if ("nodes" in inputData && Array.isArray(inputData.nodes)) {
			return buildHierarchy(inputData.nodes);
		}
		// Otherwise assume it's already a HierarchyNode
		return inputData as HierarchyNode;
	}, [inputData]);

	useEffect(() => {
		if (!wrapperRef.current) return;
		const resize = new ResizeObserver((entries) => {
			if (entries[0]) {
				const { width, height } = entries[0].contentRect;
				if (width > 0 && height > 0) {
					setDimensions({ width, height });
				}
			}
		});
		resize.observe(wrapperRef.current);
		return () => resize.disconnect();
	}, []);

	useEffect(() => {
		if (!data || !svgRef.current) return;
		const { width, height } = dimensions;

		// Safety check for layout
		if (width <= 0 || height <= 0) return;

		const radius = Math.min(width, height) / 2;
		const innerRadius = Math.max(10, radius - 150); // Ensure positive radius

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

		// HIERARCHY
		const root = d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name));

		// CLUSTER (Dendrogram)
		const cluster = d3.cluster<HierarchyNode>().size([360, innerRadius]);

		cluster(root);

		// LINKS
		g.selectAll(".link")
			.data(root.links())
			.join("path")
			.attr("class", "link")
			.attr("fill", "none")
			.attr("stroke", "#333")
			.attr("stroke-width", 1.5)
			.attr("d", (d: any) => {
				const angle = (x: number) => ((x - 90) / 180) * Math.PI;
				// Simple radial step for dendrogram
				return `
            M${d.source.y * Math.cos(angle(d.source.x))},${d.source.y * Math.sin(angle(d.source.x))}
            L${d.target.y * Math.cos(angle(d.target.x))},${d.target.y * Math.sin(angle(d.target.x))}
          `;
			});

		// NODES
		const node = g
			.selectAll(".node")
			.data(root.descendants())
			.join("g")
			.attr("class", (d) => `node ${d.children ? "internal" : "leaf"}`)
			.attr("transform", (d: any) => `rotate(${d.x - 90})translate(${d.y},0)`);

		node
			.append("circle")
			.attr("r", (d) => (d.depth === 0 ? 0 : d.children ? 4 : 6))
			.attr("fill", (d: any) => {
				if (d.depth === 0) return "none";
				if (d.children) return "#444";
				// Leaf Nodes (Projects) -> Use Parent (Employer) Color
				const employerName = d.parent?.data?.name;
				return getEntityColor(employerName, "EMPLOYER");
			}) // Fix chain breakage
			.attr("cursor", "pointer")
			.on("mouseover", function (event, d: any) {
				if (d.depth !== 0) {
					d3.select(this)
						.attr("fill", "#fff")
						.attr("r", d.children ? 6 : 8);
				}
			})
			.on("mouseout", function (event, d: any) {
				const employerName = d.parent?.data?.name;
				const fill =
					d.depth === 0 ? "none" : d.children ? "#444" : getEntityColor(employerName, "EMPLOYER");

				d3.select(this)
					.attr("fill", fill)
					.attr("r", d.depth === 0 ? 0 : d.children ? 4 : 6);
			})
			.on("click", (event, d: any) => {
				if (d.data.id) {
					window.location.href = `/projects/${d.data.id}`;
				} else if (d.depth > 0) {
					const filterName = d.data.name;
					let group = "all";
					if (d.depth === 1) group = "client";
					if (d.depth === 2) group = "industry";

					const customEvent = new CustomEvent("radial-filter", {
						detail: { group, value: filterName },
					});
					window.dispatchEvent(customEvent);
				}
			})
			.append("title")
			.text((d) => d.data.name);

		// LABELS
		node
			.append("text")
			.attr("dy", "0.31em")
			.attr("x", (d: any) => (d.x < 180 === !d.children ? 10 : -10))
			.attr("text-anchor", (d: any) => (d.x < 180 === !d.children ? "start" : "end"))
			.attr("transform", (d: any) => (d.x >= 180 ? "rotate(180)" : null))
			.text((d) => (d.depth === 0 ? "" : d.data.name))
			.style("font-size", "10px")
			.style("fill", "#888")
			.style("pointer-events", "none")
			.style("opacity", (d) => (d.depth === 1 ? 1 : 0.7));
	}, [data, dimensions]);

	return (
		<div
			ref={wrapperRef}
			className="relative flex h-full w-full items-center justify-center p-8"
			style={{ minHeight: "800px" }}
		>
			<svg ref={svgRef} width="100%" height="100%" className="overflow-visible" />
		</div>
	);
};

export default RadialTaxonomy;
