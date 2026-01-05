import React, { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";

interface MultiverseNode {
	id: string;
	name: string;
	group: string;
	value: number;
	industry: string;
	skills?: string[];
}

interface Props {
	nodes: MultiverseNode[];
}

interface SkillNode extends d3.SimulationNodeDatum {
	id: string; // Skill Name
	value: number; // Avg/Total Score
	group: string; // Industry
	r: number;
}

const SkillsGraph: React.FC<Props> = ({ nodes: multiverseNodes }) => {
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

		multiverseNodes.forEach((node) => {
			if (!node.skills || !Array.isArray(node.skills)) return;

			// Use node.value (Mass) as the weight for each skill in this project
			const score = node.value || 100;

			node.skills.forEach((skill) => {
				if (!skillMap.has(skill)) {
					skillMap.set(skill, {
						total: 0,
						count: 0,
						maxProject: node.name,
						maxScore: 0,
						industry: node.industry || node.group || "General",
					});
				}
				const current = skillMap.get(skill)!;
				current.total += score;
				current.count += 1;

				// Track dominant project/industry for this skill
				if (score > current.maxScore) {
					current.maxScore = score;
					current.maxProject = node.name;
					current.industry = node.industry || node.group || "General";
				}
			});
		});

		// Create Nodes
		return Array.from(skillMap.entries())
			.map(([skill, stats]) => {
				const avg = stats.total / stats.count; // or just total for magnitude?
				// Let's use Total to show "Cumulative Experience" rather than Average intensity
				// Actually, Average * Count = Total.
				// Let's use Total but scaled down.

				return {
					id: skill,
					value: stats.total,
					group: stats.industry,
					// Scale radius: Math.sqrt(total) is a good starting point for area-proportional sizing
					r: Math.sqrt(stats.total) * 1.5 + 10,
					x: 0,
					y: 0,
				};
			})
			.filter((n) => n.value > 50); // Filter out very minor skills (noise reduction)
	}, [multiverseNodes]);

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
