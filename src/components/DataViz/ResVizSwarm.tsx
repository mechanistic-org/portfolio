import { useRef, useEffect, useState, useMemo } from "react";
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
	skills?: string[]; // NEW for Ghost Connections
	// Simulation properties
	radius: number;
	date: Date;
	x?: number;
	y?: number;
	presentation_mode?: string;
}

interface ResVizSwarmProps {
	nodes: MultiverseNode[]; // NEW PROP
	links?: any[]; // NEW PROP (Added for compatibility with index.astro updates)
	onNodeSelect?: (node: any) => void;
	onNodeClick?: (node: any) => void;
	externalHoverId?: string;
	selectedId?: string | null; // NEW: Focus Mode
	shouldStart?: boolean;
	isConsoleHovered?: boolean;
}

import { getEntityColor } from "../../config/color_registry";

const DEFAULT_COLOR = "#666666";

export default function ResVizSwarm({
	nodes: rawNodes, // Destructure prop
	links: rawLinks,
	onNodeSelect,
	onNodeClick,
	externalHoverId,
	selectedId,
	shouldStart = false,
	isConsoleHovered = false,
}: ResVizSwarmProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const mousePos = useRef<{ x: number; y: number } | null>(null);
	const activeIdRef = useRef<string | undefined>(externalHoverId); // Track active ID for D3 events
	// PHYSICS ENGINE STATE (Persistent across renders)
	const physicsStateRef = useRef({
		lastMouseX: 0,
		lastMouseTime: 0,
		activeNodeId: null as string | null,
	});

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
				} else if (d.presentation_mode === "hidden") {
					r = 3; // Keep tiny for skills
				}

				return {
					...d,
					radius: r,
					date: start,
					x: 0,
					y: 2000, // Safe Offscreen Init
				};
			}) as NodeData[];
	}, [rawNodes]);

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

		// --- Links Data (Safe Filter & Object Resolution) ---
		const nodeMap = new Map(nodes.map((n) => [n.id, n]));
		const links = (rawLinks || [])
			.filter((l) => nodeMap.has(l.source) && nodeMap.has(l.target))
			.map((d) => ({
				...d,
				source: nodeMap.get(d.source),
				target: nodeMap.get(d.target),
			}));

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
			nodes.forEach((d) => {
				// Only move if not already positioned (to avoid jumping on resize)
				if (!d.x || d.y === 2000) {
					d.y = height + 50 + Math.random() * 100;
					d.vx = (Math.random() - 0.5) * 10;
					d.vy = -50 - Math.random() * 50; // Moderate velocity (-75 avg)
				}
			});
		}

		/* 
			GOLDEN STATE PHYSICS PARAMETERS (restored from commit a2ae20e)
			Accommodated for Hidden Nodes (Skills) to be inert.
		*/
		const simulation = d3
			.forceSimulation<NodeData>(nodes)
			.alphaDecay(0.001) // Extremely low decay for perpetual motion
			.velocityDecay(0.3) // Higher friction to control the Brownian jitter
			.force("x", d3.forceX(width / 2).strength(0.02)) // Reduced centering to allow drift
			.force(
				"y",
				d3
					.forceY<NodeData>((d) => {
						// SKILLS HAVE NO GRAVITY (They float attached to projects)
						if (d.presentation_mode === "hidden") return timeScale(new Date());
						return timeScale(d.date as Date);
					})
					.strength((d) => (d.presentation_mode === "hidden" ? 0.01 : 0.1)),
			) // Only Projects feel time
			.force(
				"collide",
				d3
					.forceCollide<NodeData>((d) => {
						// Skills collide less
						if (d.presentation_mode === "hidden") return 0; // ZERO COLLISION FOR SKILLS
						return (d as any).radius + 2;
					})
					.strength(0.8),
			)
			.force(
				"charge",
				d3.forceManyBody().strength((d: any) => {
					// SKILLS HAVE ZERO CHARGE (They are ghosts)
					// This ensures they don't push the projects apart
					if (d.presentation_mode === "hidden") return 0;
					return -15; // RESTORED: Weak repulsion for tight packing
				}),
			)
			// REMOVED: force("link") -> Replaced with Manual Unidirectional Tether in tick()
			// This prevents skills from pulling projects (Master-Slave relationship)
			.force("interact", () => {
				if (!mousePos.current) return;
				// ... physics ...
			});

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

		const physicsState = physicsStateRef.current;

		// Helper: Visual Update (Consolidated)
		const updateVisuals = (svgSelection: any, activeId: string | null) => {
			if (!activeId) {
				// Reset ALL to Default
				svgSelection.selectAll(".node-group").each(function (d: any) {
					// Logic duplicated from applyDefaultStyle
					const isFlagship = d.presentation_mode === "flagship";
					const isDeepDive = d.presentation_mode === "deep_dive";

					let stroke = "rgba(255,255,255,0.1)";
					let width = 1;
					let filter: string | null = null;
					const opacity = d.presentation_mode === "hidden" ? 0 : 0.9;

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
						.transition()
						.duration(200) // Fast transition
						.attr("stroke", stroke)
						.attr("stroke-width", width)
						.attr("filter", filter)
						.style("opacity", opacity);
				});
				svgSelection.selectAll(".label").style("opacity", 0);
				// Hide Links
				svgSelection.selectAll(".links line").transition().style("stroke-opacity", 0);
			} else {
				// Highlight Active AND Related

				// 1. Identify Connected Nodes
				const connectedNodeIds = new Set<string>();
				links.forEach((l: any) => {
					if (l.source.id === activeId) connectedNodeIds.add(l.target.id);
					if (l.target.id === activeId) connectedNodeIds.add(l.source.id);
				});

				svgSelection.selectAll(".node-group").each(function (d: any) {
					const isTarget = d.id === activeId;
					const isRelated = connectedNodeIds.has(d.id);

					let opacity = 0.1; // Default Dimmed
					let stroke = "rgba(255,255,255,0.1)";
					let width = 1;
					let filter = ""; // Fixed type mismatch (string vs null)

					if (isTarget) {
						opacity = 1;
						stroke = "#fff";
						width = 4;
						filter = "drop-shadow(0 0 15px rgba(255,255,255,0.8))";
					} else if (isRelated) {
						opacity = 0.8;
						stroke = "#22d3ee"; // Cyan
						width = 1;
						filter = "none";
					}

					d3.select(this)
						.select("circle")
						.attr("stroke", stroke)
						.attr("stroke-width", width)
						.attr("filter", filter === "none" ? null : filter)
						.style("opacity", opacity);
				});

				// Show target label
				svgSelection.select(`#label-${activeId}`).raise().style("opacity", 1);

				// Show related labels (Skills)
				svgSelection
					.selectAll(".label")
					.filter((d: any) => connectedNodeIds.has(d.id))
					.style("opacity", 0.8)
					.style("fill", "#94a3b8");

				// Show Links
				svgSelection
					.selectAll(".links line")
					.transition()
					.style("stroke-opacity", (l: any) => {
						if (l.source.id === activeId || l.target.id === activeId) return 0.4;
						return 0;
					});
			}
		};

		// Setup Mouse Tracking for Physics
		svg
			.on("mousemove", (event) => {
				const [x, y] = d3.pointer(event);
				mousePos.current = { x, y };

				// --- 1. VECTOR LOCK (Velocity Filter) ---
				const now = Date.now();
				const dt = now - physicsState.lastMouseTime;
				const dx = x - physicsState.lastMouseX;
				const velocityX = dt > 0 ? dx / dt : 0; // px/ms

				physicsState.lastMouseX = x;
				physicsState.lastMouseTime = now;

				simulation.alphaTarget(0.1).restart();

				// --- 2. CONSOLE SHIELD ---
				if (isConsoleHovered) {
					return;
				}

				// --- 3. HYSTERESIS LOGIC (Spatial Deadband) ---

				// Interaction Logic
				let nextActiveNodeId = physicsState.activeNodeId;
				let isHolding = false;

				// 1. PRIORITY LOCK CHECK: Can we release the current node?
				if (physicsState.activeNodeId) {
					const activeNode = nodes.find((n) => n.id === physicsState.activeNodeId);

					if (activeNode && typeof activeNode.x === "number" && typeof activeNode.y === "number") {
						const ndx = x - activeNode.x;
						const ndy = y - activeNode.y;
						// Use simple distance (could optimize, but safe)
						const dist = Math.sqrt(ndx * ndx + ndy * ndy);

						// SPATIAL DIODE: Infinite bridge to the right
						const thresholdX = activeNode.x + activeNode.radius * 0.5;
						const isToTheRight = x > thresholdX;

						// HYSTERESIS: Keep if within buffer
						const bufferDist = activeNode.radius * 1.5;
						const isWithinBuffer = dist < bufferDist;

						if (isToTheRight || isWithinBuffer) {
							// LOCKED: Do not search for new targets
							isHolding = true;
							nextActiveNodeId = physicsState.activeNodeId;
						} else {
							isHolding = false;
							nextActiveNodeId = null;
						}
					}
				}

				// 2. ACQUISITION SEARCH: Only if not holding
				if (!isHolding) {
					// Find closest node (Optimization: Start with null)
					let closestNode: NodeData | null = null;
					let minDistance = Infinity;

					nodes.forEach((node) => {
						if (typeof node.x !== "number" || typeof node.y !== "number") return;
						// Skip Hidden Nodes for acquisition
						if (node.presentation_mode === "hidden") return;

						const ndx = x - node.x;
						const ndy = y - node.y;
						const dist = Math.sqrt(ndx * ndx + ndy * ndy);
						if (dist < minDistance) {
							minDistance = dist;
							closestNode = node;
						}
					});

					if (closestNode) {
						const radius = (closestNode as NodeData).radius;
						// ENTRY Condition: Inside 1.0x Radius AND Not Moving Right (Diode)
						const isInside = minDistance < radius * 1.0;
						const isMovingRight = velocityX > 0.1;

						if (isInside && !isMovingRight) {
							nextActiveNodeId = (closestNode as NodeData).id;
						}
					}
				}

				// Commit State Change
				if (nextActiveNodeId !== physicsState.activeNodeId) {
					physicsState.activeNodeId = nextActiveNodeId;

					if (onNodeSelect) {
						const target = nodes.find((n) => n.id === nextActiveNodeId);
						onNodeSelect(target || null);
					}

					// Always update visuals for feedback
					updateVisuals(svg, nextActiveNodeId);
				}
			})
			.on("click", (event) => {
				// CLICK BACKGROUND -> DESELECT
				if (onNodeClick) onNodeClick(null);
			})
			.on("mouseleave", () => {
				mousePos.current = null;
				simulation.alphaTarget(0);
			});

		const g = svg.append("g");

		// --- Layers ---
		const linkLayer = svg.append("g").attr("class", "links");
		const nodeLayer = svg.append("g").attr("class", "nodes");

		// --- Links ---
		const link = linkLayer
			.selectAll("line")
			.data(links)
			.join("line")
			.attr("stroke", "#22d3ee")
			.attr("stroke-width", 1)
			.attr("stroke-opacity", 0); // Hidden default

		// --- Nodes ---
		const nodeGroup = nodeLayer
			.selectAll(".node-group")
			.data(nodes)
			.join("g")
			.attr("class", "node-group pointer-events-auto")
			.attr("id", (d: any) => "node-" + d.id)
			.attr("data-id", (d: any) => d.id)
			.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
			.attr("cursor", "pointer");

		// Event Listeners on the GROUP
		// 1. Main Circle
		nodeGroup
			.append("circle")
			.attr("r", (d: any) => d.radius)
			.attr("cursor", "pointer")
			.attr("fill", (d: any) => {
				if (d.presentation_mode === "hidden") return "#475569";
				return getColor(d);
			})
			.attr("stroke", (d: any) => {
				if (d.presentation_mode === "flagship") return "#ffffff";
				if (d.presentation_mode === "hidden") return "none";
				return d.presentation_mode === "deep_dive" ? "#2E5CFF" : "rgba(255,255,255,0.1)";
			})
			.attr("stroke-width", (d: any) => {
				if (d.presentation_mode === "flagship") return 4;
				if (d.presentation_mode === "hidden") return 0;
				return d.presentation_mode === "deep_dive" ? 3 : 1;
			})
			.attr("filter", (d: any) =>
				d.presentation_mode === "flagship" ? "drop-shadow(0 0 15px rgba(255,255,255,0.6))" : null,
			)
			.attr("opacity", (d: any) => (d.presentation_mode === "hidden" ? 0 : 0.9))
			.style("pointer-events", (d: any) => (d.presentation_mode === "hidden" ? "none" : "auto"));

		const applyDefaultStyle = (selection: any, d: any) => {
			// This is now redundant with updateVisuals(null) but kept for mouseout completeness if needed?
			// Actually let's use the consolidated helper.
			updateVisuals(svg, null);
		};

		// Event Listeners on the GROUP
		nodeGroup
			.on("click", (event, d) => {
				event.stopPropagation();
				if (onNodeClick) onNodeClick(d);
			})
			.on("mouseover", function (event, d) {
				if (d.presentation_mode === "hidden") return;
				// Logic is handled by mousemove vector lock now, but for direct hover:
				// Only if not holding?
				// Mousemove handles everything.
			});

		// --- Labels ---
		const label = g
			.selectAll("text.label")
			.data(nodes.filter((d: any) => d.radius > 10)) // SHOW ALL LABELS (Radius > 10)
			.join("text")
			.text((d: any) => d.name)
			.attr("class", "label pointer-events-none font-bold text-white uppercase")
			.attr("id", (d: any) => "label-" + d.id) // Add ID for selection
			.attr("text-anchor", "middle")
			.attr("dy", ".35em")
			.style("font-size", (d: any) => Math.min(12, d.radius / 2.5) + "px")
			.style("opacity", 0) // Default Hidden
			.style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");

		// --- Tick ---
		simulation.on("tick", () => {
			// 0. AMBIENT MOTION (The Amoeba Effect) - Only for Projects?
			// Let's keep it for all to keep it alive
			nodes.forEach((d: any) => {
				d.vx += (Math.random() - 0.5) * 0.15; // Jitter X
				d.vy += (Math.random() - 0.5) * 0.15; // Jitter Y
			});

			// 1. MANUAL TETHER (Master-Slave Physics)
			// Skills tracks Projects, but Projects IGNORE Skills.
			const k = 0.1; // Tether strength
			links.forEach((l: any) => {
				const source = l.source as NodeData; // Project
				const target = l.target as NodeData; // Skill
				// Only if both have positions
				if (
					source.x !== undefined &&
					source.y !== undefined &&
					target.x !== undefined &&
					target.y !== undefined
				) {
					// Vector from Target(Skill) to Source(Project)
					const dx = source.x - target.x;
					const dy = source.y - target.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const targetDist = 40; // Desired distance

					// Force Magnitude (Elastic)
					// Only pull IF further than target distance? Or always spring?
					// Spring is better for "floaty" feel.
					const force = (dist - targetDist) * k;

					// Apply force ONLY to Target (Skill)
					// Verify velocity exists
					if (target.vx !== undefined) target.vx += (dx / dist) * force;
					if (target.vy !== undefined) target.vy += (dy / dist) * force;

					// Damping for skills to prevent orbit explosion
					if (target.vx !== undefined) target.vx *= 0.9;
					if (target.vy !== undefined) target.vy *= 0.9;
				}
			});

			// Update Link Positions for Rendering
			link
				.attr("x1", (d: any) => d.source.x)
				.attr("y1", (d: any) => d.source.y)
				.attr("x2", (d: any) => d.target.x)
				.attr("y2", (d: any) => d.target.y);

			// Move the Group
			nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);

			// Proximity Growth & Lunge Logic
			if (mousePos.current) {
				const { x, y } = mousePos.current;

				// Target the Flagship (Dreamjob)
				const dreamjobNode = nodes.find((n) => n.presentation_mode === "flagship");
				if (
					dreamjobNode &&
					dreamjobNode.x !== undefined &&
					dreamjobNode.y !== undefined &&
					dreamjobNode.vx !== undefined &&
					dreamjobNode.vy !== undefined
				) {
					const dx = x - dreamjobNode.x;
					const dy = y - dreamjobNode.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const range = 400; // Interaction radius (Increased for smoother approach)

					let targetR = 45; // Default radius

					if (dist < range) {
						// 1. GROWTH: Expand as mouse looks at it
						// Linear growth based on closeness
						const growth = (range - dist) / range; // 0..1
						// easing?
						const easeGrowth = growth * growth; // Quadratic for smoother feel
						targetR = 45 + easeGrowth * 80; // Max 125 (Massive)

						// 2. LUNGE: Pull towards mouse (Magnetic)
						// We manipulate velocity to make it "swim" towards cursor
						const lungeStrength = 0.02 * easeGrowth;
						dreamjobNode.vx += dx * lungeStrength;
						dreamjobNode.vy += dy * lungeStrength;
					}

					// Apply Radius Update
					svg.select(`#node-${dreamjobNode.id} circle`).attr("r", targetR);
				}
			} else {
				// Reset size if mouse leaves
				const flagshipStart = nodes.find((n) => n.presentation_mode === "flagship");
				if (flagshipStart) {
					svg.select(`#node-${flagshipStart.id} circle`).attr("r", 45);
				}
			}

			// Move the Labels
			label.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
		});

		// Intro Trigger
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setTimeout(() => {
						simulation.alpha(1).restart();
					}, 500);
				} else {
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
		);

		if (containerRef.current) observer.observe(containerRef.current);

		return () => {
			simulation.stop();
			observer.disconnect();
		};
	}, [nodes, dimensions, shouldStart]);

	// Effect for external hover (e.g., from a fiche strip)
	useEffect(() => {
		if (!svgRef.current) return;
		// Keep this simple if needed, but updateVisuals handles most now
	}, [externalHoverId]);

	return (
		<div ref={containerRef} className="relative h-full w-full overflow-hidden bg-transparent">
			<svg ref={svgRef} className="block h-full w-full" />
		</div>
	);
}
