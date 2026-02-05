import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface NetworkData {
	top_companies: { name: string; count: number }[];
}

const NetworkBubbleGraph: React.FC<{ data: NetworkData }> = ({ data }) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				setDimensions({
					width: containerRef.current.clientWidth,
					height: containerRef.current.clientHeight || 600,
				});
			}
		};
		window.addEventListener("resize", updateDimensions);
		updateDimensions();
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	useEffect(() => {
		if (!svgRef.current || !data.top_companies.length) return;

		const { width, height } = dimensions;
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove(); // Clear previous

		// Prepare hierarchical data for Pack layout
		const idxData = {
			name: "root",
			children: data.top_companies.map((c) => ({
				name: c.name,
				value: c.count,
			})),
		};

		const root = d3
			.hierarchy(idxData)
			.sum((d: any) => d.value || 0)
			.sort((a, b: any) => (b.value || 0) - (a.value || 0));

		const pack = d3.pack().size([width, height]).padding(5);

		const packedRoot = pack(root) as unknown as d3.HierarchyCircularNode<any>;

		// Color Scale matching EN-OS Neon
		const color = d3.scaleOrdinal().range(["#10B981", "#3B82F6", "#8B5CF6", "#F43F5E", "#F59E0B"]); // Emerald, Blue, Violet, Rose, Amber

		const g = svg.append("g");

		// Tooltip div (hidden by default)
		const tooltip = d3
			.select(containerRef.current)
			.append("div")
			.style("position", "absolute")
			.style("visibility", "hidden")
			.style("background", "rgba(0,0,0,0.8)")
			.style("color", "#fff")
			.style("padding", "8px")
			.style("border-radius", "4px")
			.style("font-family", "monospace")
			.style("pointer-events", "none")
			.style("border", "1px solid #333");

		const node = g
			.selectAll("g")
			.data(packedRoot.leaves())
			.join("g")
			.attr("transform", (d) => `translate(${d.x},${d.y})`);

		// Circles
		node
			.append("circle")
			.attr("r", (d: any) => d.r)
			.attr("fill", (d) => color(d.data.name as string) as string)
			.attr("fill-opacity", 0.2)
			.attr("stroke", (d) => color(d.data.name as string) as string)
			.attr("stroke-width", 2)
			.style("cursor", "pointer")
			.on("mouseover", function (event, d) {
				d3.select(this).attr("fill-opacity", 0.6);
				tooltip
					.style("visibility", "visible")
					.html(`<strong>${d.data.name}</strong><br/>Connections: ${d.data.value}`);
			})
			.on("mousemove", function (event) {
				// Calculate relative position within container
				const [x, y] = d3.pointer(event, containerRef.current);
				tooltip.style("top", y - 10 + "px").style("left", x + 10 + "px");
			})
			.on("mouseout", function () {
				d3.select(this).attr("fill-opacity", 0.2);
				tooltip.style("visibility", "hidden");
			});

		// Labels (only for larger bubbles)
		node
			.filter((d) => d.r > 20)
			.append("text")
			.attr("dy", "0.3em")
			.style("text-anchor", "middle")
			.style("font-family", "monospace")
			.style("font-size", (d: any) => `${Math.min(d.r / 3, 14)}px`) // Dynamic sizing
			.style("fill", "#fff")
			.style("pointer-events", "none")
			.text((d: any) => (d.data.name as string).substring(0, d.r / 3 > 6 ? 15 : 5));
	}, [data, dimensions]);

	return (
		<div ref={containerRef} className="relative h-full w-full">
			<svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
		</div>
	);
};

export default NetworkBubbleGraph;
