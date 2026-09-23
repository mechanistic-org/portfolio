import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import * as d3 from "d3";
import type { MultiverseNode } from "@/types/MultiverseTypes";
import { getEntityColor } from "../../config/color_registry";
import { careerMapGeometry, drawCareerBackdrop } from "./CareerMapBackdrop";
import { employerPackingTargets, type Position } from "./EmployerPacking";

interface NodeData extends d3.SimulationNodeDatum {
	id: string;
	name: string;
	group: string;
	start_date: string;
	end_date?: string;
	value: number;
	category?: string;
	img?: string;
	color?: string;
	skills?: string[];
	radius: number;
	date: Date | null;
	tier: "deep_dive" | "lite";
}

interface ResVizSwarmProps {
	nodes: MultiverseNode[];
	onNodeSelect?: (node: NodeData | null) => void;
	onNodeClick?: (node: NodeData | null) => void;
	externalHoverId?: string;
}

const DAY_MS = 1000 * 60 * 60 * 24;
const MIN_RADIUS = 15;
const MAX_RADIUS = 55;
const REST_OPACITY = 0.95;
function clamp(value: number, minimum: number, maximum: number) {
	return Math.min(maximum, Math.max(minimum, value));
}

function getProjectRadius(node: MultiverseNode) {
	const startTime = new Date(node.start_date).getTime();
	const endTime = node.end_date ? new Date(node.end_date).getTime() : startTime;
	const durationDays =
		Number.isFinite(startTime) && Number.isFinite(endTime)
			? Math.max(0, (endTime - startTime) / DAY_MS)
			: 0;
	const radius = Math.sqrt(durationDays) * 1.5;
	return clamp(Number.isFinite(radius) ? radius : MIN_RADIUS, MIN_RADIUS, MAX_RADIUS);
}

function getResponsiveHeight(nodes: NodeData[], width: number) {
	// Allocate room for the busiest five-year interval, not only the average density.
	const areas = new Map<number, number>();
	for (const node of nodes) {
		if (!node.date) continue;
		const epoch = Math.floor(node.date.getUTCFullYear() / 5) * 5;
		areas.set(epoch, (areas.get(epoch) ?? 0) + Math.PI * (node.radius + 3) ** 2);
	}
	const first = Math.min(...areas.keys(), 1985);
	const span = new Date().getUTCFullYear() - first + 1;
	const busiest = Math.max(...areas.values(), 0);
	return Math.ceil(260 + ((busiest / Math.max(100, width) / 0.62) * span) / 5);
}

export default function ResVizSwarm({
	nodes: rawNodes,
	onNodeSelect,
	onNodeClick,
	externalHoverId,
}: ResVizSwarmProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const simulationRef = useRef<d3.Simulation<NodeData, undefined> | null>(null);
	const renderPositionsRef = useRef<() => void>(() => undefined);
	const visualUpdaterRef = useRef<(focusId: string | null) => void>(() => undefined);
	const activeIdRef = useRef<string | null>(externalHoverId ?? null);
	const acquiredNodeIdRef = useRef<string | null>(null);
	const onNodeSelectRef = useRef(onNodeSelect);
	const onNodeClickRef = useRef(onNodeClick);
	const pausedRef = useRef(false);
	const resetPackingRef = useRef<() => void>(() => undefined);
	const packingActiveRef = useRef(false);

	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isReady, setIsReady] = useState(false);

	pausedRef.current = isPaused;
	onNodeSelectRef.current = onNodeSelect;
	onNodeClickRef.current = onNodeClick;

	const nodes = useMemo(() => {
		if (!rawNodes) return [];

		const hiddenIds = new Set([
			"classified",
			"classified-alpha",
			"classified-bravo",
			"electronic-battery-lock",
		]);

		return rawNodes
			.filter((node) => !hiddenIds.has(node.id))
			.map((node) => {
				const parsedStart = new Date(node.start_date);
				const date = Number.isFinite(parsedStart.getTime()) ? parsedStart : null;
				return {
					...node,
					radius: getProjectRadius(node) * (dimensions.width < 600 ? 0.68 : 1),
					date,
					x: 0,
					y: 2000,
				};
			}) as NodeData[];
	}, [rawNodes, dimensions.width < 600]);
	const mapWidth = Math.max(130, dimensions.width - (dimensions.width < 600 ? 176 : 238));
	const responsiveHeight = useMemo(() => getResponsiveHeight(nodes, mapWidth), [nodes, mapWidth]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const applyPreference = (matches: boolean) => {
			setPrefersReducedMotion(matches);
			if (matches) setIsPaused(true);
		};
		applyPreference(mediaQuery.matches);
		const handleChange = (event: MediaQueryListEvent) => applyPreference(event.matches);
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	useEffect(() => {
		if (!containerRef.current) return;
		const resizeObserver = new ResizeObserver((entries) => {
			if (!entries[0]) return;
			const { width, height } = entries[0].contentRect;
			setDimensions({ width, height });
		});
		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	useEffect(() => {
		activeIdRef.current = externalHoverId ?? null;
		visualUpdaterRef.current(activeIdRef.current);
	}, [externalHoverId]);

	useEffect(() => {
		const simulation = simulationRef.current;
		if (!simulation) return;

		if (isPaused) {
			resetPackingRef.current();
			simulation.alphaTarget(0);
			renderPositionsRef.current();
			simulation.stop();
			return;
		}

		if (!packingActiveRef.current)
			simulation.alpha(Math.max(simulation.alpha(), 0.35)).alphaTarget(0).restart();
	}, [isPaused]);

	useEffect(() => {
		if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

		setIsReady(false);
		const { width, height } = dimensions;
		const geometry = careerMapGeometry(width, height, nodes);
		const { timeScale, plotLeft, plotRight } = geometry;
		const centerX = (plotLeft + plotRight) / 2;
		const getColor = (node: NodeData) => getEntityColor(node.group, "EMPLOYER");
		nodes.forEach((node, index) => {
			node.x = clamp(
				centerX + Math.sin(index * 2.4) * mapWidth * 0.3,
				plotLeft + node.radius,
				plotRight - node.radius,
			);
			node.y = node.date ? timeScale(node.date) : height - 70;
			node.vx = 0;
			node.vy = 0;
		});

		const simulation = d3
			.forceSimulation<NodeData>(nodes)
			.alphaDecay(0.001)
			.velocityDecay(0.3)
			.force("x", d3.forceX<NodeData>(centerX).strength(0.025))
			.force(
				"y",
				d3
					.forceY<NodeData>((node) => (node.date ? timeScale(node.date) : height - 70))
					.strength(0.16),
			)
			.force("collide", d3.forceCollide<NodeData>((node) => node.radius + 2).strength(0.8))
			.force("charge", d3.forceManyBody<NodeData>().strength(-15));
		simulationRef.current = simulation;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();
		acquiredNodeIdRef.current = null;
		packingActiveRef.current = false;
		svg.attr("data-packing-state", "rest").attr("data-packing-role", null);

		const backdrop = drawCareerBackdrop(svg, geometry, nodes);
		const nodeLayer = svg.append("g").attr("class", "nodes");
		const labelLayer = svg.append("g").attr("class", "labels");

		const nodeGroup = nodeLayer
			.selectAll<SVGGElement, NodeData>("g.node-group")
			.data(nodes, (node) => node.id)
			.join("g")
			.attr("class", "node-group pointer-events-auto")
			.attr("id", (node) => `node-${node.id}`)
			.attr("data-id", (node) => node.id)
			.attr("role", "button")
			.attr("tabindex", 0)
			.attr("aria-label", (node) => `Explore ${node.name}`)
			.attr("data-employer", (node) => node.group)
			.attr("data-lens-group", (node) =>
				node.date ? `${Math.floor(node.date.getUTCFullYear() / 5) * 5}` : "Undated",
			)
			.attr("data-tier", (node) => node.tier)
			.attr("cursor", "pointer");

		nodeGroup
			.append("circle")
			.attr("class", "project-circle")
			.attr("r", (node) => node.radius)
			.attr("cursor", "pointer")
			.attr("fill", getColor)
			.style("opacity", REST_OPACITY);

		// Selection is independent of the blue ring that identifies a deep dive.
		nodeGroup
			.append("circle")
			.attr("class", "focus-ring")
			.attr("r", (node) => node.radius + 4)
			.attr("fill", "none")
			.attr("stroke-width", 1.25)
			.attr("opacity", 0)
			.attr("pointer-events", "none");

		const label = labelLayer
			.selectAll<SVGTextElement, NodeData>("text.label")
			.data(nodes)
			.join("text")
			.text((node) => node.name)
			.attr("class", "label pointer-events-none font-bold text-white uppercase")
			.attr("fill", "white")
			.attr("id", (node) => `label-${node.id}`)
			.attr("data-persistent-label", "false")
			.attr("text-anchor", "middle")
			.attr("dy", ".35em")
			.style("font-size", (node) => `${Math.min(12, node.radius / 2.5)}px`)
			.style("opacity", 0)
			.style("pointer-events", "none")
			.style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");

		const applyRestCircleStyle = (
			circle: d3.Selection<SVGCircleElement, NodeData, null, undefined>,
			node: NodeData,
		) => {
			const isDeepDive = node.tier === "deep_dive";
			circle
				.attr("stroke", isDeepDive ? "#2E5CFF" : "rgba(255,255,255,0.1)")
				.attr("stroke-width", isDeepDive ? 3 : 1)
				.attr("filter", null)
				.style("opacity", REST_OPACITY);
		};

		const updateVisuals = (requestedFocusId: string | null) => {
			const focusNode = nodes.find((node) => node.id === requestedFocusId) ?? null;
			const focusId = focusNode?.id;
			backdrop.update(focusNode);

			nodeGroup.each(function (node) {
				const group = d3.select<SVGGElement, NodeData>(this);
				const circle = group.select<SVGCircleElement>("circle.project-circle");
				circle.interrupt();
				applyRestCircleStyle(circle, node);

				const isTarget = node.id === focusId;
				circle.style("opacity", isTarget ? 1 : REST_OPACITY);
				group
					.select<SVGCircleElement>("circle.focus-ring")
					.attr("stroke", "rgba(225,232,242,0.7)")
					.attr("opacity", isTarget ? 1 : 0);
			});

			label.style("opacity", (node) => (node.id === focusId ? 1 : 0));
		};
		visualUpdaterRef.current = updateVisuals;

		const constrainNodes = () => {
			for (const node of nodes) {
				node.x = clamp(node.x ?? centerX, plotLeft + node.radius + 4, plotRight - node.radius - 4);
				node.y = clamp(node.y ?? height / 2, geometry.top + node.radius, height - node.radius - 40);
			}
		};

		const renderPositions = () => {
			constrainNodes();
			nodeGroup.attr("transform", (node) => `translate(${node.x},${node.y})`);
			label.attr("x", (node) => node.x ?? 0).attr("y", (node) => node.y ?? 0);
			backdrop.position();
		};
		renderPositionsRef.current = renderPositions;

		// Hover is temporary; the held reading subject is deliberately independent.
		let baseline: Map<string, Position> | null = null;
		let packingRole: string | null = null;
		let packingTimer: d3.Timer | null = null;
		let hoverTimer: ReturnType<typeof setTimeout> | null = null;
		const snapshot = () => new Map(nodes.map((node) => [node.id, { x: node.x!, y: node.y! }]));
		const moveTo = (target: Map<string, Position>, restoring: boolean, immediate = false) => {
			packingTimer?.stop();
			simulation.stop();
			const from = snapshot();
			const draw = (progress: number) => {
				for (const node of nodes) {
					const start = from.get(node.id)!;
					const end = target.get(node.id)!;
					node.x = start.x + (end.x - start.x) * progress;
					node.y = start.y + (end.y - start.y) * progress;
					node.vx = node.vy = 0;
				}
				renderPositions();
			};
			const finish = () => {
				packingTimer?.stop();
				packingTimer = null;
				svg.attr("data-packing-state", restoring ? "rest" : "grouped");
				if (restoring) {
					baseline = null;
					packingActiveRef.current = false;
					if (!pausedRef.current && !prefersReducedMotion) simulation.alpha(0.12).restart();
				}
			};
			if (immediate) {
				draw(1);
				finish();
				return;
			}
			packingTimer = d3.timer((elapsed) => {
				const progress = Math.min(1, elapsed / (restoring ? 480 : 620));
				draw(d3.easeCubicInOut(progress));
				if (progress === 1) finish();
			});
		};
		const restorePacking = (immediate = false) => {
			packingRole = null;
			svg.attr("data-packing-role", null);
			nodeGroup.attr("data-packing-member", null);
			if (baseline) {
				svg.attr("data-packing-state", "returning");
				moveTo(baseline, true, immediate);
			}
		};
		resetPackingRef.current = () => {
			if (hoverTimer) clearTimeout(hoverTimer);
			restorePacking(true);
		};
		const packHovered = (id: string | null) => {
			const node = nodes.find((candidate) => candidate.id === id);
			const period = node ? backdrop.periodFor(node) : undefined;
			if (!node || !period || pausedRef.current || prefersReducedMotion) {
				restorePacking();
				return;
			}
			if (packingRole === period.id) return;
			baseline ??= snapshot();
			const packed = employerPackingTargets<NodeData>(
				nodes,
				baseline,
				node,
				period,
				backdrop.periodFor,
				geometry,
			);
			packingRole = period.id;
			packingActiveRef.current = true;
			svg.attr("data-packing-state", "grouping").attr("data-packing-role", period.id);
			nodeGroup.attr("data-packing-member", (candidate) =>
				String(packed.members.has(candidate.id)),
			);
			moveTo(packed.positions, false);
		};

		const reportCandidate = (nextId: string | null) => {
			if (nextId === acquiredNodeIdRef.current) return;
			acquiredNodeIdRef.current = nextId;
			onNodeSelectRef.current?.(nodes.find((node) => node.id === nextId) ?? null);
			if (hoverTimer) clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => packHovered(nextId), nextId ? 180 : 100);
		};

		svg
			.on("pointermove", (event) => {
				if (event.pointerType === "touch") return;
				const [x, y] = d3.pointer(event);
				let retainedNode = nodes.find((node) => node.id === acquiredNodeIdRef.current) ?? null;
				if (retainedNode) {
					const distance = Math.hypot(x - (retainedNode.x ?? 0), y - (retainedNode.y ?? 0));
					if (distance > retainedNode.radius * 1.3) retainedNode = null;
				}

				if (retainedNode) {
					reportCandidate(retainedNode.id);
					return;
				}

				let nearestNode: NodeData | null = null;
				let nearestDistance = Number.POSITIVE_INFINITY;
				for (const node of nodes) {
					const distance = Math.hypot(x - (node.x ?? 0), y - (node.y ?? 0));
					if (distance <= node.radius && distance < nearestDistance) {
						nearestNode = node;
						nearestDistance = distance;
					}
				}
				reportCandidate(nearestNode?.id ?? null);
			})
			.on("pointerleave", () => reportCandidate(null))
			.on("click", () => onNodeClickRef.current?.(null));

		nodeGroup.on("click", (event, node) => {
			event.stopPropagation();
			onNodeClickRef.current?.(node);
		});
		nodeGroup
			.on("focus", (event, node) => {
				// A tap may focus the SVG button, but only keyboard focus groups it.
				if ((event.currentTarget as Element).matches(":focus-visible")) reportCandidate(node.id);
			})
			.on("blur", () => reportCandidate(null))
			.on("keydown", (event, node) => {
				if (event.key !== "Enter" && event.key !== " ") return;
				event.preventDefault();
				event.stopPropagation();
				onNodeClickRef.current?.(node);
			});

		let readyDeclared = false;
		const declareReadyWhenVisible = () => {
			if (readyDeclared) return;
			const containedCount = nodes.filter(
				(node) =>
					(node.x ?? -Infinity) - node.radius >= 0 &&
					(node.x ?? Infinity) + node.radius <= width &&
					(node.y ?? -Infinity) - node.radius >= 0 &&
					(node.y ?? Infinity) + node.radius <= height,
			).length;
			if (containedCount === nodes.length) {
				readyDeclared = true;
				setIsReady(true);
			}
		};

		simulation.on("tick", () => {
			if (!pausedRef.current) {
				nodes.forEach((node) => {
					node.vx = (node.vx ?? 0) + (Math.random() - 0.5) * 0.15;
					node.vy = (node.vy ?? 0) + (Math.random() - 0.5) * 0.15;
				});
			}
			renderPositions();
			declareReadyWhenVisible();
		});

		updateVisuals(activeIdRef.current);

		let observer: IntersectionObserver | null = null;
		let launchTimer: ReturnType<typeof setTimeout> | null = null;
		if (prefersReducedMotion || pausedRef.current) {
			pausedRef.current = true;
			simulation.stop();
			simulation.alpha(1).tick(300);
			renderPositions();
			readyDeclared = true;
			setIsReady(true);
		} else {
			simulation.alpha(1).restart();
			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0]?.isIntersecting) {
						if (!pausedRef.current) {
							launchTimer = setTimeout(() => {
								if (!pausedRef.current && !packingActiveRef.current) simulation.alpha(1).restart();
							}, 500);
						}
					} else {
						simulation.stop();
					}
				},
				{ threshold: 0.1 },
			);
			if (containerRef.current) observer.observe(containerRef.current);
		}

		return () => {
			if (hoverTimer) clearTimeout(hoverTimer);
			packingTimer?.stop();
			resetPackingRef.current = () => undefined;
			if (launchTimer) clearTimeout(launchTimer);
			observer?.disconnect();
			simulation.stop();
			if (simulationRef.current === simulation) simulationRef.current = null;
			visualUpdaterRef.current = () => undefined;
			renderPositionsRef.current = () => undefined;
		};
	}, [nodes, dimensions, mapWidth, prefersReducedMotion]);

	return (
		<div
			ref={containerRef}
			className="relative h-[max(100svh,var(--swarm-responsive-height))] w-full overflow-hidden bg-transparent lg:h-full"
			style={
				{
					"--swarm-responsive-height": `${responsiveHeight}px`,
				} as CSSProperties
			}
			data-swarm-ready={isReady ? "true" : "false"}
			data-swarm-lens="time"
		>
			<svg ref={svgRef} className="block h-full w-full" />
			<button
				type="button"
				className="absolute bottom-3 left-3 z-10 border border-white/30 bg-black/70 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-white uppercase transition-colors hover:border-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
				data-swarm-motion-control
				data-motion-state={isPaused ? "paused" : "running"}
				aria-label={isPaused ? "Resume swarm motion" : "Pause swarm motion"}
				onClick={() => setIsPaused((paused) => !paused)}
			>
				{isPaused ? "Resume" : "Pause"}
			</button>
		</div>
	);
}
