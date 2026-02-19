import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { CareerAssembly, AssemblyNode, AssemblyLink } from "../../utils/mapCareerAssembly";
import { getEntityColor } from "../../config/color_registry";

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
		// TIME SCALE
		// Determine range
		const dates = nodes
			.map((d: any) => (d.date ? new Date(d.date) : null))
			.filter((d) => d) as Date[];
		const minDate = d3.min(dates) || new Date(2000, 0, 1);
		const maxDate = new Date(); // Top is Now

		// Map Time to Y-Axis (Top=Now, Bottom=Past)
		const timeScale = d3
			.scaleTime()
			.domain([maxDate, minDate])
			.range([100, height - 100]); // Padding

		// SKILL TAXONOMY (The Circuit Board Lanes)
		const LANE_LEFT = width * 0.25; // Hard Skills (Tools, Tech)
		const LANE_CENTER = width * 0.5; // Projects (Time Spine)
		const LANE_RIGHT = width * 0.75; // Soft Skills (Management, Process)

		const HARD_SKILLS = new Set([
			"solidworks",
			"pro/e",
			"onshape",
			"cad",
			"autocad",
			"keyshot",
			"mechanical engineering",
			"product design",
			"industrial design",
			"mechanism",
			"plastic",
			"steel",
			"aluminum",
			"materials",
			"electronics",
			"pcb",
			"hardware architecture",
			"mechatronics",
			"injection molding",
			"die casting",
			"sheet metal",
			"machining",
			"dfm",
			"manufacturing",
			"thermal",
			"rf",
			"emi",
			"audio",
			"testing",
			"rapid prototyping",
		]);

		const SOFT_SKILLS = new Set([
			"leadership",
			"management",
			"engineering management",
			"team lead",
			"cross-functional",
			"strategy",
			"product management",
			"program management",
			"process",
			"agile",
			"research",
			"r&d",
			"crisis",
			"yield",
			"cost_down",
		]);

		const simulation = d3
			.forceSimulation(nodes)
			.force(
				"link",
				d3
					.forceLink<AssemblyNode, AssemblyLink>(links)
					.id((d: any) => d.id)
					.distance(50),
			)
			.force("charge", d3.forceManyBody().strength(-150))
			.force(
				"x",
				d3
					.forceX<AssemblyNode>((d: any) => {
						if (d.type === "project") return LANE_CENTER;

						// Skill Partitioning
						const name = d.id.toLowerCase();
						if (HARD_SKILLS.has(name) || Array.from(HARD_SKILLS).some((k) => name.includes(k)))
							return LANE_LEFT;
						if (SOFT_SKILLS.has(name) || Array.from(SOFT_SKILLS).some((k) => name.includes(k)))
							return LANE_RIGHT;

						return LANE_LEFT; // Default to Left (Hard) for unlabeled tech info
					})
					.strength((d: any) => (d.type === "project" ? 0.5 : 0.3)), // Strict lanes
			)
			.force(
				"y",
				d3
					.forceY<AssemblyNode>((d: any) => {
						if (d.type === "project" && d.date) {
							return timeScale(new Date(d.date));
						}
						return height / 2;
					})
					.strength((d: any) => (d.type === "project" ? 0.9 : 0.05)), // Vertical sorting for projects
			)
			.force(
				"collide",
				d3.forceCollide().radius((d: any) => (d.radius || 10) + 8),
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
				event.stopPropagation(); // Prevent background click
				if (d.type === "project") {
					// Strip extension if present (e.g. c24/index.mdx -> c24, or acer.mdx -> acer)
					// Handle index files: c24/index.mdx -> c24
					// Handle flat files: acer.mdx -> acer
					const slug = d.id.replace(/\/index\.mdx$/, "").replace(/\.(mdx|md)$/, "");
					window.location.href = `/projects/${slug}`;
				} else if (d.type === "skill") {
					// Normalize tag to slug (must match logic in [tag].astro)
					const slug = d.id
						.replace("skill-", "")
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/^-|-$/g, "");
					window.location.href = `/tags/${slug}`;
				}
			})
			.on("mouseenter", (event, d) => {
				// Dim all nodes and links
				node.style("opacity", 0.1);
				link.style("opacity", 0.1);

				// Highlight selected node
				d3.select(event.currentTarget).style("opacity", 1);

				// Highlight connected links
				link
					.filter((l: any) => l.source.id === d.id || l.target.id === d.id)
					.style("opacity", 1)
					.attr("stroke", "#22d3ee")
					.attr("stroke-width", 2);

				// Highlight connected nodes
				const connectedNodeIds = new Set();
				links.forEach((l: any) => {
					if (l.source.id === d.id) connectedNodeIds.add(l.target.id);
					if (l.target.id === d.id) connectedNodeIds.add(l.source.id);
				});

				node.filter((n: any) => connectedNodeIds.has(n.id)).style("opacity", 1);
			})
			.on("mouseleave", () => {
				// Reset all nodes and links
				node.style("opacity", 1);
				link.style("opacity", 1).attr("stroke", "#334155").attr("stroke-width", 1);
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
				if (d.type === "project") {
					// Use Color Registry
					// Group is usually the employer slug or name
					return getEntityColor(d.group || "", "EMPLOYER");
				}
				if (d.type === "skill") return "#475569"; // Slate-600
				return "#ccc";
			})
			.attr("stroke", (d) => {
				if (d.hasIntelligence) return "#22d3ee"; // Cyan-400 (The Glow Color)
				return "#1e293b"; // Slate-800
			})
			.attr("stroke-width", (d) => (d.hasIntelligence ? 2 : 1))
			.style("filter", (d) => (d.hasIntelligence ? "url(#intelligence-glow)" : null));

		// Labels
		node
			.append("text")
			.text((d) => d.id.replace("skill-", ""))
			.attr("x", (d) => (d.radius || 5) + 5)
			.attr("y", 3)
			.attr("font-size", (d) => (d.type === "project" ? "10px" : "8px"))
			.attr("fill", (d) => (d.type === "project" ? "#e2e8f0" : "#94a3b8"))
			.style("pointer-events", "none")
			.style("font-family", "Barlow, sans-serif") // V7 Aesthetic
			.style("paint-order", "stroke")
			.style("stroke", "#020617") // Slate-950 (Background Color)
			.style("stroke-width", "3px")
			.style("stroke-linecap", "round")
			.style("stroke-linejoin", "round");

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
						{data.nodes.filter((n) => n.hasIntelligence).length} BOLUS
					</span>
				</div>
				<div className="mt-3 text-xs text-slate-500">
					<p>PHYSICS: Mass = Duration | Gravity = Time</p>
					<p>LINKS: Shared Skills & Tags</p>
					<p className="glow text-cyan-400">CYAN: Intelligence Detected</p>
				</div>
			</div>
			<svg ref={svgRef} className="block h-full w-full" />
		</div>
	);
};

export default ExplodedView;
