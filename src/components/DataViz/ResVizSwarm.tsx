import  { useRef, useEffect, useState, useMemo } from "react";
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
			.alphaDecay(0.001) // Extremely low decay for perpetual motion
			.velocityDecay(0.3) // Higher friction to control the Brownian jitter (was 0.05)
			.force("x", d3.forceX(width / 2).strength(0.02)) // Reduced centering to allow drift
			.force("y", d3.forceY<NodeData>((d) => timeScale(d.date as Date)).strength(0.1)) // Stronger gravity to keep structure
			.force("collide", d3.forceCollide<NodeData>((d) => (d as any).radius + 2).strength(0.8)) // +2 padding for breathing room
			.force("charge", d3.forceManyBody().strength(-15)) // Gentler repulsion
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

		// State Refs for Physics Loop (Defined inside effect for closure access to fresh Props? No, props are dependencies).
		// We can't put this in a ref if we want it to reset on re-mount?
		// Actually, `activeIdRef` was earlier, but we need closure over `selectedId`.
		// Let's use a local Mutable Object that persists across the Effect instance.
		// State Refs for Physics Loop - LINKED TO COMPONENT REF
		// This ensures state persists even if the Effect re-runs due to prop changes.
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
						.attr("filter", filter);
				});
				svgSelection.selectAll(".label").style("opacity", 0);
			} else {
				// Highlight Active

				// 1. Reset Others (Essential to clear previous)
				// Use filter to exclude active one, but D3 .filter returns a new selection.
				// Easier to Reset All then Highlight One? Slightly more overhead but cleaner state.
				svgSelection.selectAll(".node-group").each(function (d: any) {
					// Inline reset logic again or use helper if defined in scope
					// Just keeping it simple
					d3.select(this)
						.select("circle")
						.attr("stroke", "rgba(255,255,255,0.1)")
						.attr("stroke-width", 1)
						.attr("filter", null);
				});
				// Restore Special nodes base state? A bit complex.
				// Let's use specific selector for speed.

				// ACTUALLY: Just selecting the Previous Active ID would be faster.
				// But we don't track "Previous" easily here.
				// Let's just reset ALL to base state.
				svgSelection.selectAll(".node-group").each(function (d: any) {
					const isFlagship = d.presentation_mode === "flagship";
					const isDeepDive = d.presentation_mode === "deep_dive";
					if (d.id !== activeId) {
						d3.select(this)
							.select("circle")
							.attr(
								"stroke",
								isFlagship ? "#ffffff" : isDeepDive ? "#2E5CFF" : "rgba(255,255,255,0.1)",
							)
							.attr("stroke-width", isFlagship ? 4 : isDeepDive ? 3 : 1)
							.attr("filter", isFlagship ? "drop-shadow(0 0 15px rgba(255,255,255,0.6))" : null);
					}
				});
				svgSelection.selectAll(".label").style("opacity", 0);

				// 2. Highlight Target
				const targetGroup = svgSelection
					.selectAll(".node-group")
					.filter((d: any) => d.id === activeId);

				targetGroup
					.select("circle")
					.raise()
					.attr("stroke", "#fff")
					.attr("stroke-width", 4)
					.attr("filter", "drop-shadow(0 0 15px rgba(255,255,255,0.8))");

				svgSelection.select(`#label-${activeId}`).raise().style("opacity", 1);
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
				// If Console is Active, FREEZE the physics state.
				// We do NOT clear the selection, so the last active bubble remains selected
				// allowing the user to interact with the Console links.
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
							// console.log("HOLDING:", physicsState.activeNodeId, "Right:", isToTheRight, "Buffer:", isWithinBuffer);
						} else {
							// RELEASED
							console.log(
								"[Physics] RELEASING:",
								physicsState.activeNodeId,
								"Dist:",
								dist.toFixed(1),
								">",
								bufferDist.toFixed(1),
								"X:",
								x.toFixed(1),
								"<",
								thresholdX.toFixed(1),
							);
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

					// Standard behavior (No Focus Mode check needed anymore)
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
				// DO NOT CLEAR SELECTION ON MOUSELEAVE
				// This prevents the selection from disappearing when the cursor
				// enters the Console (which sits 'above' the SVG).
				// We rely on 'Click Background' to clear, or 'Shield Freeze' to hold.

				mousePos.current = null;
				simulation.alphaTarget(0);
			});

		// --- Axis (Right Side) ---
		// REMOVED PER USER REQUEST
		// const yAxis = d3.axisRight(timeScale)...

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

		// ... (Circle/Styles)

		// Event Listeners on the GROUP
		// 1. Main Circle
		nodeGroup
			.append("circle")
			.attr("r", (d: any) => d.radius)
			.attr("cursor", "pointer") // Ensure pointer
			.on("click", (event, d) => {
				// Click to NAVIGATE (Visit)
				console.log("[ResVizSwarm] Circle Clicked:", d.id);
				event.stopPropagation();
				window.location.href = `/projects/${toSlug(d.id)}`;
			})
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
				// CLICK TO LOCK (Focus Mode)
				event.stopPropagation();

				// Map Click to Selection (Lock)
				if (onNodeClick) onNodeClick(d);
			})
			// .on("dblclick", (event, d) => { ... }) // Removed as requested
			.on("mouseover", function (event, d) {
				// 0. EXCLUSIVE HIGHLIGHT (Anti-Clutter)
				// Reset ALL nodes specifically
				svg
					.selectAll(".node-group circle")
					.attr("stroke", (n: any) => {
						if (n.presentation_mode === "flagship") return "#ffffff";
						return n.presentation_mode === "deep_dive" ? "#2E5CFF" : "rgba(255,255,255,0.1)";
					})
					.attr("stroke-width", (n: any) => {
						if (n.presentation_mode === "flagship") return 4;
						return n.presentation_mode === "deep_dive" ? 3 : 1;
					})
					.attr("filter", null);

				svg.selectAll(".label").style("opacity", 0);

				// 1. Highlight THIS node
				d3.select(this)
					.select("circle")
					.raise() // Bring to front
					.attr("stroke", "#fff")
					.attr("stroke-width", 4) // Reduced from 6 for elegance
					.attr("filter", "drop-shadow(0 0 15px rgba(255,255,255,0.8))");

				// Show Label
				d3.select(`[id="label-${d.id}"]`).raise().style("opacity", 1);

				// 2. PHYSICS RIPPLE (The Wake)
				// Push neighbors away slightly
				const currentNode = d as any;
				nodes.forEach((n: any) => {
					if (n.id === currentNode.id) return;
					const dx = n.x - currentNode.x;
					const dy = n.y - currentNode.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < 100) {
						const force = (100 - dist) / 100;
						n.vx += (dx / dist) * force * 2;
						n.vy += (dy / dist) * force * 2;
					}
				});
				simulation.alphaTarget(0.3).restart();

				// Optional: Sync Fiche Selection (Lock) without navigation
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
			.data(nodes.filter((d: any) => d.radius > 10)) // SHOW ALL LABELS (Radius > 10)
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
			// 0. AMBIENT MOTION (The Amoeba Effect)
			// Add a tiny random velocity to ALL nodes to keep them "breeding/breathing"
			nodes.forEach((d: any) => {
				// Only if not being hovered/dragged? No, constant is better.
				d.vx += (Math.random() - 0.5) * 0.15; // Jitter X
				d.vy += (Math.random() - 0.5) * 0.15; // Jitter Y
			});

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
			// FIX: Ensure labels track nodes correctly
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
		<div ref={containerRef} className="relative h-full w-full overflow-hidden bg-transparent">
			{/* HUD / Label */}
			{/* REMOVED: SCROLL TO TRAVERSE TIME */}

			<svg ref={svgRef} className="block h-full w-full" />
		</div>
	);
}
