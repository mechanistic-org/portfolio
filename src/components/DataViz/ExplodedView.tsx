import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { CareerAssembly, AssemblyNode, AssemblyLink } from "../../utils/mapCareerAssembly";

interface WrapperProps {
	data: CareerAssembly;
}

const ExplodedView: React.FC<WrapperProps> = ({ data }) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// Resize Observer
	useEffect(() => {
		if (!wrapperRef.current) return;
		const resizeObserver = new ResizeObserver((entries) => {
			if (entries[0]) {
				const { width, height } = entries[0].contentRect;
				if (width > 0 && height > 0) setDimensions({ width, height });
			}
		});
		resizeObserver.observe(wrapperRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	// Physics Engine
	useEffect(() => {
		if (!data || !svgRef.current || dimensions.width === 0) return;

		const { width, height } = dimensions;

		// Clone data to prevent mutation issues with StrictMode/Re-renders
		const nodes: AssemblyNode[] = data.nodes.map((d) => ({ ...d }));
		const links: AssemblyLink[] = data.links.map((d) => ({ ...d }));

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		// DEFS: Glow Filter
		const defs = svg.append("defs");
		const filter = defs
			.append("filter")
			.attr("id", "intelligence-glow")
			.attr("x", "-50%")
			.attr("y", "-50%")
			.attr("width", "200%")
			.attr("height", "200%");

		filter.append("feGaussianBlur").attr("stdDeviation", "3.5").attr("result", "coloredBlur");

		const feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode").attr("in", "coloredBlur");
		feMerge.append("feMergeNode").attr("in", "SourceGraphic");

		// LAYERS
		const container = svg.append("g");
		const linkLayer = container.append("g").attr("class", "links");
		const nodeLayer = container.append("g").attr("class", "nodes");

		// ZOOM
		const zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.1, 4])
			.on("zoom", (event) => {
				container.attr("transform", event.transform);
			});
		svg.call(zoom);

		// SIMULATION
		const simulation = d3
			.forceSimulation(nodes)
			.force(
				"link",
				d3
					.forceLink<AssemblyNode, AssemblyLink>(links)
					.id((d: any) => d.id)
					.distance(50),
			)
			.force("charge", d3.forceManyBody().strength(-100))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force(
				"collide",
				d3.forceCollide().radius((d: any) => (d.radius || 10) + 5),
			);

		// RENDER LINKS
		const link = linkLayer
			.selectAll("line")
			.data(links)
			.enter()
			.append("line")
			.attr("stroke", "#334155") // Slate-700
			.attr("stroke-opacity", 0.6)
			.attr("stroke-width", 1);

		// RENDER NODES
		const node = nodeLayer
			.selectAll("g")
			.data(nodes)
			.enter()
			.append("g")
			.attr("class", "node-group")
			.style("cursor", "pointer") // Indicate interactivity
			.on("click", (event, d) => {
				if (d.type === "project") {
					// Strip extension if present (e.g. c24/index.mdx -> c24, or acer.mdx -> acer)
					// Handle index files: c24/index.mdx -> c24
					// Handle flat files: acer.mdx -> acer
					const slug = d.id.replace(/\/index\.mdx$/, "").replace(/\.(mdx|md)$/, "");
					window.location.href = `/projects/${slug}`;
				}
			})
			.call(
				d3
					.drag<SVGGElement, AssemblyNode>()
					.on("start", (event, d) => {
						if (!event.active) simulation.alphaTarget(0.3).restart();
						d.fx = d.x;
						d.fy = d.y;
					})
					.on("drag", (event, d) => {
						d.fx = event.x;
						d.fy = event.y;
					})
					.on("end", (event, d) => {
						if (!event.active) simulation.alphaTarget(0);
						d.fx = null;
						d.fy = null;
					}),
			);

		// Circles
		node
			.append("circle")
			.attr("r", (d) => d.radius || 5)
			.attr("fill", (d) => {
				if (d.type === "project") return "#2E5CFF"; // YInMn Blue
				if (d.type === "skill") return "#475569"; // Slate-600
				return "#ccc";
			})
			.attr("stroke", (d) => {
				if (d.intelligence) return "#22d3ee"; // Cyan-400 (The Glow Color)
				return "#1e293b"; // Slate-800
			})
			.attr("stroke-width", (d) => (d.intelligence ? 2 : 1))
			.style("filter", (d) => (d.intelligence ? "url(#intelligence-glow)" : null));

		// Labels
		node
			.append("text")
			.text((d) => d.id.replace("skill-", ""))
			.attr("x", (d) => (d.radius || 5) + 5)
			.attr("y", 3)
			.attr("font-size", (d) => (d.type === "project" ? "10px" : "8px"))
			.attr("fill", (d) => (d.type === "project" ? "#e2e8f0" : "#94a3b8"))
			.style("pointer-events", "none")
			.style("font-family", "Barlow, sans-serif"); // V7 Aesthetic

		// TICK
		simulation.on("tick", () => {
			link
				.attr("x1", (d: any) => d.source.x)
				.attr("y1", (d: any) => d.source.y)
				.attr("x2", (d: any) => d.target.x)
				.attr("y2", (d: any) => d.target.y);

			node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
		});

		// Cleanup
		// Cleanup
		return () => {
			simulation.stop();
		};
	}, [data, dimensions]);

	return (
		<div ref={wrapperRef} className="relative h-screen w-full overflow-hidden bg-slate-950">
			<div className="pointer-events-none absolute top-4 left-4 z-10 max-w-sm rounded border border-slate-700 bg-slate-900/80 p-4 font-mono text-sm text-slate-200 backdrop-blur-md">
				<h2 className="mb-2 font-bold text-cyan-400">EXPLODED ASSEMBLY (A1730E9)</h2>
				<div className="grid grid-cols-2 gap-x-8 gap-y-1">
					<span>NODES ::</span> <span className="text-right">{data.nodes.length}</span>
					<span>LINKS ::</span> <span className="text-right">{data.links.length}</span>
					<span>INTEL ::</span>{" "}
					<span className="text-right text-cyan-400">
						{data.nodes.filter((n) => n.intelligence).length} BOLUS
					</span>
				</div>
				<div className="mt-3 text-xs text-slate-500">
					<p>BLUE: Project Node</p>
					<p>GRAY: Skill Fastener</p>
					<p className="glow text-cyan-400">CYAN: Intelligence Detected</p>
				</div>
			</div>
			<svg ref={svgRef} className="block h-full w-full" />
		</div>
	);
};

export default ExplodedView;
