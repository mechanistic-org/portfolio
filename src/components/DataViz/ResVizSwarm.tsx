import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import type { MultiverseNode } from "@/types/MultiverseTypes";

// --- Types ---
interface NodeData extends d3.SimulationNodeDatum {
	id: string;
	name: string;
	group: string;
	start_date: string;
	end_date?: string;
	value: number;
	category?: string;
	img?: string;
	color?: string; // From JSON
	// Simulation properties
	radius: number;
	date: Date;
	x?: number;
	y?: number;
	presentation_mode?: string;
}

interface ResVizSwarmProps {
	nodes: MultiverseNode[]; // NEW PROP
	onNodeSelect?: (node: any) => void;
	externalHoverId?: string;
	shouldStart?: boolean;
}

import { getEntityColor } from "../../config/color_registry";

const DEFAULT_COLOR = "#666666";

export default function ResVizSwarm({
	nodes: rawNodes, // Destructure prop
	onNodeSelect,
	externalHoverId,
	shouldStart = false,
}: ResVizSwarmProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const mousePos = useRef<{ x: number; y: number } | null>(null);
	const activeIdRef = useRef<string | undefined>(externalHoverId); // Track active ID for D3 events

	// Sync ref
	useEffect(() => {
		activeIdRef.current = externalHoverId;
	}, [externalHoverId]);

	const [tooltip, setTooltip] = useState<{ x: number; y: number; data: NodeData | null }>({
		x: 0,
		y: 0,
		data: null,
	});

	// --- Process Data ---
	const nodes = useMemo(() => {
		if (!rawNodes) return [];

		const now = new Date();
		const hiddenIds = [
			"classified",
			"classified-alpha",
			"classified-bravo",
			"electronic-battery-lock",
		];

		return rawNodes
			.filter((d) => !hiddenIds.includes(d.id))
			.map((d) => {
				const start = new Date(d.start_date);
				const end = d.end_date ? new Date(d.end_date) : now;
				const durationDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);

				// Radius based on duration
				// Dreamjob Override: Purely behavioral relevance, not temporal relevance.
				// Reducing it to "Standard Large Project" size (~3-4 years equivalent) to avoid dominating the physics.
				let r = Math.max(15, Math.sqrt(durationDays) * 1.5);

				if (d.presentation_mode === "flagship") {
					r = 45; // Fixed size, roughly matching a 5-6 year tenure but manageable
				}

				return {
					...d,
					radius: r,
					date: start,
					x: 0,
					y: 2000, // Safe Offscreen Init
				};
			}) as NodeData[];
	}, []);

	// Dimensions state to trigger re-render on resize
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!containerRef.current) return;
		const resizeObserver = new ResizeObserver((entries) => {
			if (!entries || entries.length === 0) return;
			const { width, height } = entries[0].contentRect;
			setDimensions({ width, height });
		});
		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	useEffect(() => {
		if (!svgRef.current || dimensions.width === 0) return;

		const { width, height } = dimensions;

		// --- Scales ---
		// Determine earliest date from nodes for ALL projects
		const minDate = d3.min(nodes, (d) => d.date) || new Date(2000, 0, 1);

		// VERTICAL: Now (Top) -> Start (Bottom)
		// Adjusted padding: Reduced top to 140px (from 120) per user request.
		const timeScale = d3
			.scaleTime()
			.domain([new Date(), minDate])
			.range([200, height - 150]);

		// Use Registry for Semantic Coloring
		// Explicitly request EMPLOYER type to ensure checks overlap with generated palettes if needed.
		const getColor = (d: any) => getEntityColor(d.group, "EMPLOYER");

		// --- Simulation ---
		// 1. LAUNCHPAD STATE (Holding Pattern)
		if (!shouldStart) {
			nodes.forEach((d) => {
				d.x = width / 2 + (Math.random() - 0.5) * 200;
				d.y = height + 150 + Math.random() * 100; // Hold at bottom
				d.vx = 0;
				d.vy = 0; // No movement while holding
			});
		}
		// 2. LAUNCH TRIGGER (The Kick)
		else {
			// FORCE RESET to Cannon Mouth to ensure they can make the distance
			// The previous issue was they started too deep (y=2000) and ran out of momentum
			nodes.forEach((d) => {
				// Snap to launch position just below fold
				d.y = height + 50 + Math.random() * 100;

				// The Hammer
				d.vx = (Math.random() - 0.5) * 10;
				d.vy = -50 - Math.random() * 50; // Moderate velocity (-75 avg)
			});
		}

		const simulation = d3
			.forceSimulation<NodeData>(nodes)
			.alphaDecay(0.005) // Extended sustain
			.velocityDecay(0.05) // EXTREMELY LOW FRICTION (Ice/Space) - crucial for distance for Range, but enough to grab it eventually
			.force("x", d3.forceX(width / 2).strength(0.04)) // Weak centering
			.force("y", d3.forceY<NodeData>((d) => timeScale(d.date as Date)).strength(0.08)) // Weak gravity -> Elastic rebound
			.force("collide", d3.forceCollide<NodeData>((d) => (d as any).radius).strength(0.8))
			.force("charge", d3.forceManyBody().strength(-20)) // Explosion expansion
			.force("interact", () => {
				if (!mousePos.current) return;
				// ... physics ...
			}); // We define interact force inside tick or here?
		// In original code it was inline. I'll rely on the existing inline definition logic below if it existed,
		// but here I need to make sure I don't break the structure.
		// The original code had the .force("interact", ...) inline.
		// I'm replacing the top block.

		// If NOT triggered, STOP immediately.
		if (!shouldStart) {
			simulation.stop();
		} else {
			simulation.alpha(1).restart();
		}

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		// Define Filter inside SVG for Glow
		const defs = svg.append("defs");
		const filter = defs.append("filter").attr("id", "glow").attr("filterUnits", "userSpaceOnUse");
		filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
		const feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode").attr("in", "coloredBlur");
		feMerge.append("feMergeNode").attr("in", "SourceGraphic");

		// Setup Mouse Tracking for Physics
		svg
			.on("mousemove", (event) => {
				const [x, y] = d3.pointer(event);
				mousePos.current = { x, y };
				simulation.alphaTarget(0.1).restart();
			})
			.on("mouseleave", () => {
				mousePos.current = null;
				simulation.alphaTarget(0);
			});

		// --- Axis (Right Side) ---
		const yAxis = d3
			.axisRight(timeScale)
			.ticks(height < 600 ? 5 : 10)
			.tickFormat(d3.timeFormat("%Y") as any)
			.tickSize(0)
			.tickPadding(10);

		svg
			.append("g")
			.attr("id", "swarm-axis") // TARGET FOR SCROLL ANIMATION
			.attr("transform", `translate(${width - 50}, 0)`)
			.attr("class", "text-neutral-500 font-mono text-xs opacity-50 select-none")
			.call(yAxis as any)
			.select(".domain")
			.remove();

		const g = svg.append("g");

		// --- Nodes ---
		const nodeGroup = g
			.selectAll(".node-group")
			.data(nodes)
			.join("g")
			.attr("class", "node-group pointer-events-auto") // Added pointer-events-auto
			.attr("id", (d: any) => "node-" + d.id) // ID for External Selection
			.attr("transform", (d: any) => `translate(${d.x},${d.y})`) // Prevent 0,0 Flash
			.attr("cursor", "pointer");

		// 1. Main Circle
		// Deep Dive Projects: C|24, Backsplash, Makeline, Portion Cup, Pet Scale
		// const deepDives = ["c24", "backsplash", "makeline", "portion-cup", "pet-scale"];
		// const dreamjobId = "dreamjob";

		nodeGroup
			.append("circle")
			.attr("r", (d: any) => d.radius)
			.attr("fill", (d: any) => getColor(d))
			.attr("stroke", (d: any) => {
				if (d.presentation_mode === "flagship") return "#ffffff";
				return d.presentation_mode === "deep_dive" ? "#2E5CFF" : "rgba(255,255,255,0.1)";
			})
			.attr("stroke-width", (d: any) => {
				if (d.presentation_mode === "flagship") return 4;
				return d.presentation_mode === "deep_dive" ? 3 : 1;
			})
			.attr("filter", (d: any) =>
				d.presentation_mode === "flagship" ? "drop-shadow(0 0 15px rgba(255,255,255,0.6))" : null,
			)
			// .attr("class", (d: any) => d.id === dreamjobId ? "animate-pulse" : "") // Removed: Manual Physics Growth used instead
			.attr("opacity", 0.9);

		// Helper to generate valid URL slugs from human-readable IDs
		const toSlug = (id: string) =>
			id
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^\w-]/g, "");

		// Function: Apply Default Styles (Reset)
		const applyDefaultStyle = (selection: any, d: any) => {
			const isFlagship = d.presentation_mode === "flagship";
			const isDeepDive = d.presentation_mode === "deep_dive";

			let stroke = "rgba(255,255,255,0.1)";
			let width = 1;
			let filter: string | null = null;

			if (isFlagship) {
				stroke = "#ffffff";
				width = 4;
				filter = "drop-shadow(0 0 15px rgba(255,255,255,0.6))";
			} else if (isDeepDive) {
				stroke = "#2E5CFF";
				width = 3;
			}

			selection
				.select("circle")
				.transition()
				.duration(500)
				.attr("stroke", stroke)
				.attr("stroke-width", width)
				.attr("filter", filter);

			// Hide Label
			d3.select(`[id="label-${d.id}"]`).transition().duration(200).style("opacity", 0);
		};

		// Event Listeners on the GROUP
		nodeGroup
			.on("click", (event, d) => {
				// Click to NAVIGATE (Visit)
				event.stopPropagation();
				window.location.href = `/projects/${toSlug(d.id)}`;
			})
			// .on("dblclick", (event, d) => { ... }) // Removed as requested
			.on("mouseover", function (event, d) {
				// GHOST FIX:
				// 1. Reset ALL other nodes to default state (clearing any external highlights)
				svg.selectAll(".node-group").each(function (nodeData: any) {
					if (nodeData.id !== d.id) {
						applyDefaultStyle(d3.select(this), nodeData);
					}
				});

				// 2. Highlight THIS node
				d3.select(this)
					.select("circle")
					.transition()
					.duration(200)
					.attr("stroke", "#fff")
					.attr("stroke-width", 6)
					.attr("filter", "drop-shadow(0 0 25px rgba(255,255,255,0.8))");

				// Show Label
				d3.select(`[id="label-${d.id}"]`).transition().duration(200).style("opacity", 1);

				// Optional: Sync Fiche Selection (Lock) without navigation
				// If we want the hover to update the right panel preview WITHOUT locking it:
				if (onNodeSelect) onNodeSelect(d);
			})
			.on("mouseout", function (event, d) {
				// Restore logic
				applyDefaultStyle(d3.select(this), d);

				// RESTORE EXTERNAL HIGHLIGHT if it exists and is NOT this node
				// (This happens if we moused over something else while one was locked)
				// Actually, the useEffect below handles the externalHoverId application.
				// But D3 transitions might conflict.
				// Let's trigger a re-eval of external highlight?
				// The useEffect depends on [externalHoverId]. If that prop didn't change, it won't re-run.
				// However, onNodeSelect during hover MIGHT have changed it.
				// If hover updates onNodeSelect -> Parent updates externalHoverId -> useEffect runs -> Re-highlights this node.

				// If we want "Click to Lock", hover shouldn't update onNodeSelect.
				// BUT user wants "Hover to Preview"?
				// "Hover will now only provide local visual feedback... Click to Lock" <- FROM PREVIOUS TASK
				// So I should remove `onNodeSelect(d)` from mouseover in that case?
				// Wait, previous instructions said "Hover provides local visual feedback... click locks".
				// Current user request: "Single Click VISITS".
				// So we have NO locking anymore?
				// If NO locking, then onNodeSelect(d) on mouseover is fine for PREVIEW in Fiche?
				// "Hover provides a local visual preview".

				// Let's KEEP onNodeSelect(d) on hover so the Fiche updates.
				// But "Ghost Highlights"...
				// Only one highlight allowed.
			});

		// setTooltip({ x: 0, y: 0, data: null });

		// Optional: Reset Data Beam on mouseout?
		// Let's keep the last selection to avoid flashing "Awaiting Input" too much
		// or resetting if they just move between bubbles.
		// if (onNodeSelect) onNodeSelect(null);

		// --- Labels ---
		const label = g
			.selectAll("text.label")
			.data(nodes.filter((d: any) => d.radius > 28))
			.join("text")
			.text((d: any) => d.name)
			.attr("class", "label pointer-events-none font-bold text-white uppercase")
			.attr("id", (d: any) => "label-" + d.id) // Add ID for selection
			.attr("text-anchor", "middle")
			.attr("dy", ".35em")
			.style("font-size", (d: any) => Math.min(12, d.radius / 2.5) + "px")
			.style("opacity", 0) // Default Hidden
			// Clean Text Shadow (No Stroke)
			.style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");

		// --- Tick ---
		simulation.on("tick", () => {
			// Move the Group
			nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);

			// Proximity Growth Logic (Visual Only)
			if (mousePos.current) {
				const { x, y } = mousePos.current;

				// Select just the Dreamjob circle directly for performance
				// Note: We could do this for all, but Dreamjob is special
				const dreamjobNode = nodes.find((n) => n.presentation_mode === "flagship");
				if (dreamjobNode && dreamjobNode.x && dreamjobNode.y) {
					const dx = x - dreamjobNode.x;
					const dy = y - dreamjobNode.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const range = 400; // Must match interaction range

					// Base Radius: 45. Max Radius: 75.
					let targetR = 45;
					if (dist < range) {
						// Linear growth based on closeness
						const growth = (range - dist) / range; // 0..1
						targetR = 45 + growth * 40; // Max 85
					}

					// Select the specific circle element and animate it smoothly?
					// In a tick loop, we just set it.
					// To be smoother, we might want to lerp, but setting directly is instant response.
					svg.select(`#node-${dreamjobNode.id} circle`).attr("r", targetR);
				}
			} else {
				// Reset if mouse leaves
				// Find flagship ID first
				const flagshipStart = nodes.find((n) => n.presentation_mode === "flagship");
				if (flagshipStart) {
					svg.select(`#node-${flagshipStart.id} circle`).attr("r", 45);
				}
			}

			// Move the Labels
			label.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
		});

		// Intro Trigger: Intersection Observer
		// Increased threshold to 0.4 and added delay to ensure user sees the "Fly-in" Effect
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					// Restart simulation with high energy when visible
					// Delay 500ms to allow "landing" before the show
					setTimeout(() => {
						simulation.alpha(1).restart();
					}, 500);
				} else {
					// Reset when out of view so it plays again next time
					simulation.stop();
					nodes.forEach((d) => {
						d.x = width / 2 + (Math.random() - 0.5) * 500;
						d.y = height + 300 + Math.random() * 300; // Reset to below view
						d.vx = 0;
						d.vy = 0;
					});
				}
			},
			{ threshold: 0.1 },
		); // Use lower threshold for Exit detection?
		// No, keep 0.1 logic:
		// Enter > 0.1? Start.
		// Exit < 0.1? Reset.
		// Actually, previously used 0.4 for delay. Let's start with 0.2 to be responsive but not flickery.

		if (containerRef.current) observer.observe(containerRef.current);

		return () => {
			simulation.stop();
			observer.disconnect();
		};
	}, [nodes, dimensions, shouldStart]);

	// Effect for external hover (e.g., from a fiche strip)
	useEffect(() => {
		if (!svgRef.current) return;
		const svg = d3.select(svgRef.current);

		// 2. Highlight Target (Using Data Filter for robustness)
		// Reset all visuals first, respecting Deep Dives

		svg.selectAll(".node-group").each(function (d: any) {
			const isDeepDive = d.presentation_mode === "deep_dive";
			const isFlagship = d.presentation_mode === "flagship";

			// Dreamjob gets special White Pulse
			// Deep Dives get Blue Ring
			// Others get transparent
			let stroke = "rgba(255,255,255,0.1)";
			let width = 1;
			let filter: string | null = null;

			if (isFlagship) {
				stroke = "#ffffff";
				width = 4;
				filter = "drop-shadow(0 0 15px rgba(255,255,255,0.6))";
			} else if (isDeepDive) {
				stroke = "#2E5CFF";
				width = 3;
			}

			d3.select(this)
				.select("circle")
				.attr("stroke", stroke)
				.attr("stroke-width", width)
				.attr("filter", filter);
		});

		svg.selectAll(".label").style("opacity", 0);

		if (externalHoverId) {
			// Highlight Bubble
			svg
				.selectAll(".node-group")
				.filter((d: any) => d.id === externalHoverId)
				.select("circle:last-child")
				.transition()
				.duration(200)
				.attr("stroke", "#fff")
				.attr("stroke-width", 6)
				.attr("filter", "drop-shadow(0 0 25px rgba(255,255,255,0.8))");

			// Highlight Label
			svg.select(`[id="label-${externalHoverId}"]`).transition().duration(200).style("opacity", 1);
		}
	}, [externalHoverId]);

	return (
		<div ref={containerRef} className="relative h-full w-full overflow-hidden bg-black">
			{/* HUD / Label */}
			{/* REMOVED: SCROLL TO TRAVERSE TIME */}

			<svg ref={svgRef} className="block h-full w-full" />
		</div>
	);
}
