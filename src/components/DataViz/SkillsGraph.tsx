import React, { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";

import type { MultiverseNode } from "@/types/MultiverseTypes";

interface Props {
	skillsData?: any[];
	projects?: any[];
	nodes?: MultiverseNode[];
}

interface SkillNode extends d3.SimulationNodeDatum {
	id: string; // Skill Name
	value: number; // Avg/Total Score
	group: string; // Industry
	r: number;
	x?: number;
	y?: number;
	vx?: number;
	vy?: number;
}

const SkillsGraph: React.FC<Props> = ({ skillsData, projects, nodes: rawNodes }) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [tooltip, setTooltip] = useState<{
		x: number;
		y: number;
		content: string;
		visible: boolean;
	}>({
		x: 0,
		y: 0,
		content: "",
		visible: false,
	});

	// Process Data
	const nodes: SkillNode[] = useMemo(() => {
		const skillMap = new Map<
			string,
			{ total: number; count: number; maxProject: string; maxScore: number; industry: string }
		>();

		// Mode A: Legacy Weighted Data (from skills.json via About.astro)
		if (skillsData && projects) {
			// 1. Create a quick lookup for Project Metadata (Industry/Group)
			const projectMeta = new Map<string, string>();
			projects.forEach((p) => {
				if (p.id)
					projectMeta.set(p.id.toLowerCase(), p.data.industry || p.data.category || "General");
				if (p.data.title)
					projectMeta.set(
						p.data.title.toLowerCase(),
						p.data.industry || p.data.category || "General",
					);
			});

			// 2. Iterate over Skills Data
			skillsData.forEach((project) => {
				if (!project.skills || typeof project.skills !== "object") return;

				const projectName = project.name || "Unknown";
				const industry = projectMeta.get(projectName.toLowerCase()) || "General";

				// Skills is an Object: { "Skill Name": Score, ... }
				Object.entries(project.skills).forEach(([skillName, scoreRaw]) => {
					const score = Number(scoreRaw) || 0;
					if (score <= 0) return;

					if (!skillMap.has(skillName)) {
						skillMap.set(skillName, {
							total: 0,
							count: 0,
							maxProject: projectName,
							maxScore: 0,
							industry: industry,
						});
					}

					const entry = skillMap.get(skillName)!;
					entry.total += score;
					entry.count += 1;

					// Update Dominant Industry if this score is higher
					if (score > entry.maxScore) {
						entry.maxScore = score;
						entry.maxProject = projectName;
						entry.industry = industry;
					}
				});
			});
		}
		// Mode B: Multiverse Data (from multiverse.json via Projects/index.astro)
		else if (rawNodes && rawNodes.length > 0) {
			rawNodes.forEach((node) => {
				if (!node.skills || !Array.isArray(node.skills)) return;

				const industry = node.industry || node.category || "General";
				const projectName = node.name;

				node.skills.forEach((skillName) => {
					if (!skillMap.has(skillName)) {
						skillMap.set(skillName, {
							total: 0,
							count: 0,
							maxProject: projectName,
							maxScore: 0,
							industry: industry,
						});
					}

					const entry = skillMap.get(skillName)!;
					entry.total += 5; // Arbitrary weight for frequency counting
					entry.count += 1;

					// Simple industry dominance (last one wins or standard)
					// We'll keep the first one or update if we want "most frequent industry" which is complex.
					// Let's just stick to "first encountered" or overwrite to keep it dynamic.
					// Actually, let's prioritize "Robot & Automation" or "Pro Audio" over "Other".
					// For now, simpler is better: overwrite.
					entry.industry = industry;
				});
			});
		}

		// Create Nodes
		return Array.from(skillMap.entries())
			.map(([skill, stats]) => {
				return {
					id: skill,
					value: stats.total,
					group: stats.industry,
					// Scale radius: Math.sqrt(total)
					r: Math.sqrt(stats.total) * 1.5 + 5, // Adjusted baseline for unweighted data
					x: 0,
					y: 0,
				};
			})
			.filter((n) => n.value > 10); // Filter out very minor skills (e.g. mention < 2 times if weight is 5)
	}, [skillsData, projects, rawNodes]);

	useEffect(() => {
		if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

		const width = containerRef.current.clientWidth;
		const height = containerRef.current.clientHeight;

		const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height]);

		svg.selectAll("*").remove(); // Clear previous

		// Color Scale
		const color = d3.scaleOrdinal([
			"#2E5CFF", // Erik Norris Blue
			"#ffffff", // White
			"#999999", // Light Grey
			"#555555", // Dark Grey
			"#1a3a99", // Deep Blue
			"#4b75ff", // Lighter Blue
			"#333333", // Graphite
			"#cccccc", // Silver
		]);

		// Simulation setup
		const simulation = d3
			.forceSimulation(nodes)
			.force("charge", d3.forceManyBody().strength(15)) // Positive charge for slight repulsion/volume
			.force(
				"collide",
				d3
					.forceCollide()
					.radius((d: any) => d.r + 4)
					.iterations(3),
			) // More padding
			.force("center", d3.forceCenter(width / 2, height / 2).strength(0.08))
			.force("x", d3.forceX(width / 2).strength(0.05))
			.force("y", d3.forceY(height / 2).strength(0.05));

		// Drag functionality
		const drag = (simulation: any) => {
			function dragstarted(event: any, d: any) {
				if (!event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			}

			function dragged(event: any, d: any) {
				d.fx = event.x;
				d.fy = event.y;
			}

			function dragended(event: any, d: any) {
				if (!event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			}

			return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
		};

		const node = svg
			.append("g")
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", (d) => d.r)
			.attr("fill", (d) => color(d.group) as string)
			.attr("fill-opacity", 0.6) // Lower base opacity
			.attr("stroke", "#fff")
			.attr("stroke-width", 1)
			.attr("stroke-opacity", 0.2)
			.style("cursor", "crosshair")
			.call(drag(simulation) as any)
			.on("mouseover", function (event, d) {
				// Physics: JIGGLE - Heat up the node
				// Re-heat simulation slightly to make everything adjust
				simulation.alphaTarget(0.1).restart();

				// Specific node jiggle logic could be in tick, but force modification is cleaner
				// Push neighbor nodes away
				d.fx = d.x;
				d.fy = d.y; // Temporarily lock it to cursor or interaction point if needed? No, just let it vibrate.

				setTooltip({
					x: event.pageX,
					y: event.pageY,
					content: `${d.id} (${d.group})`,
					visible: true,
				});

				d3.select(this)
					.transition()
					.duration(200)
					.attr("r", (d: any) => d.r + 5) // POP
					.attr("fill-opacity", 1)
					.attr("stroke-width", 3)
					.attr("stroke-opacity", 1);
			})
			.on("mousemove", (event) => {
				setTooltip((prev) => ({
					...prev,
					x: event.pageX,
					y: event.pageY,
				}));
			})
			.on("mouseout", function (event, d) {
				d.fx = null;
				d.fy = null;
				simulation.alphaTarget(0);

				setTooltip((prev) => ({ ...prev, visible: false }));

				d3.select(this)
					.transition()
					.duration(500)
					.attr("r", (d: any) => d.r) // Return to size
					.attr("fill-opacity", 0.6)
					.attr("stroke-width", 1)
					.attr("stroke-opacity", 0.2);
			});

		// Add "Pulse" via CSS or repeated transition?
		// Let's do a subtle continuous breathing in the tick loop? Too expensive.
		// Use CSS animation on the circle elements for a "living" feel.
		node.classed("animate-pulse-slow", true); // We'll need to define this custom class if it doesn't exist, or standard animate-pulse

		simulation.on("tick", () => {
			node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
		});

		return () => {
			simulation.stop();
		};
	}, [nodes]);

	return (
		<div
			ref={containerRef}
			id="skills-graph-container"
			className="h-full w-full rounded-xl transition-opacity duration-700"
			// style={{ opacity: 0.2 }} // Handled by ScrollCoordinator parent wrapper
		>
			<svg ref={svgRef} className="h-full w-full overflow-visible"></svg>

			{/* Legend / Overlay */}
			{/* <div className="pointer-events-none absolute top-4 left-4 text-xs font-mono text-neutral-500">
                Data-Driven Skills Topology
            </div> */}
			{/* Note: Moved legend out to parent for cleaner layering */}

			{/* Tooltip */}
			{tooltip.visible && (
				<div
					className="pointer-events-none fixed z-50 rounded bg-neutral-900 px-3 py-2 text-sm text-white shadow-xl ring-1 ring-white/20 backdrop-blur-md"
					style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
				>
					<span className="text-primary font-mono font-bold tracking-wider uppercase">
						{tooltip.content.split(" (")[0]}
					</span>
					<br />
					<span className="text-xs text-neutral-400">
						{tooltip.content.split(" (")[1].replace(")", "")}
					</span>
				</div>
			)}
		</div>
	);
};

export default SkillsGraph;
