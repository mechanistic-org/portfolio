import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import * as d3 from "d3";
import type { MultiverseNode } from "@/types/MultiverseTypes";
import { getEntityColor } from "../../config/color_registry";

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
	date: Date;
	presentation_mode?: string;
}

interface ResVizSwarmProps {
	nodes: MultiverseNode[];
	links?: any[];
	onNodeSelect?: (node: NodeData | null) => void;
	onNodeClick?: (node: NodeData | null) => void;
	externalHoverId?: string;
	isConsoleHovered?: boolean;
}

const DAY_MS = 1000 * 60 * 60 * 24;
const MIN_RADIUS = 15;
const MAX_RADIUS = 55;
const FLAGSHIP_RADIUS = 45;
const REST_OPACITY = 0.9;
const RESPONSIVE_TOP_GUTTER = 240;
const RESPONSIVE_BOTTOM_GUTTER = 80;
const RESPONSIVE_NODE_GAP = 6;

function clamp(value: number, minimum: number, maximum: number) {
	return Math.min(maximum, Math.max(minimum, value));
}

function getProjectRadius(node: MultiverseNode, now: Date) {
	if (node.presentation_mode === "flagship") return FLAGSHIP_RADIUS;

	const startTime = new Date(node.start_date).getTime();
	const endTime = node.end_date ? new Date(node.end_date).getTime() : now.getTime();
	const durationDays =
		Number.isFinite(startTime) && Number.isFinite(endTime)
			? Math.max(0, (endTime - startTime) / DAY_MS)
			: 0;
	const radius = Math.sqrt(durationDays) * 1.5;
	return clamp(Number.isFinite(radius) ? radius : MIN_RADIUS, MIN_RADIUS, MAX_RADIUS);
}

function getResponsivePacking(nodes: NodeData[], width: number) {
	const safeWidth = Math.max(width, MAX_RADIUS * 2 + RESPONSIVE_NODE_GAP * 2);
	const sideGutter = Math.min(20, Math.max(8, safeWidth * 0.025));
	const positions = new Map<string, { x: number; y: number }>();
	let cursorX = sideGutter;
	let rowTop = RESPONSIVE_TOP_GUTTER;
	let rowHeight = 0;

	for (const node of nodes) {
		const diameter = node.radius * 2;
		if (cursorX > sideGutter && cursorX + diameter > safeWidth - sideGutter) {
			rowTop += rowHeight + RESPONSIVE_NODE_GAP;
			cursorX = sideGutter;
			rowHeight = 0;
		}

		positions.set(node.id, {
			x: cursorX + node.radius,
			y: rowTop + node.radius,
		});
		cursorX += diameter + RESPONSIVE_NODE_GAP;
		rowHeight = Math.max(rowHeight, diameter);
	}

	return {
		positions,
		requiredHeight: Math.ceil(rowTop + rowHeight + RESPONSIVE_BOTTOM_GUTTER),
	};
}

export default function ResVizSwarm({
	nodes: rawNodes,
	onNodeSelect,
	onNodeClick,
	externalHoverId,
	isConsoleHovered = false,
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
	const consoleHoveredRef = useRef(isConsoleHovered);
	const pausedRef = useRef(false);

	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isReady, setIsReady] = useState(false);

	pausedRef.current = isPaused;
	onNodeSelectRef.current = onNodeSelect;
	onNodeClickRef.current = onNodeClick;
	consoleHoveredRef.current = isConsoleHovered;

	const nodes = useMemo(() => {
		if (!rawNodes) return [];

		const now = new Date();
		const hiddenIds = new Set([
			"classified",
			"classified-alpha",
			"classified-bravo",
			"electronic-battery-lock",
		]);

		return rawNodes
			.filter((node) => !hiddenIds.has(node.id) && node.presentation_mode !== "hidden")
			.map((node) => {
				const parsedStart = new Date(node.start_date);
				const date = Number.isFinite(parsedStart.getTime()) ? parsedStart : now;
				return {
					...node,
					radius: getProjectRadius(node, now),
					date,
					x: 0,
					y: 2000,
				};
			}) as NodeData[];
	}, [rawNodes]);
	const responsivePacking = useMemo(
		() => getResponsivePacking(nodes, dimensions.width),
		[nodes, dimensions.width],
	);

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
			simulation.alphaTarget(0);
			renderPositionsRef.current();
			simulation.stop();
			return;
		}

		simulation.alpha(Math.max(simulation.alpha(), 0.35)).alphaTarget(0).restart();
	}, [isPaused]);

	useEffect(() => {
		if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

		setIsReady(false);
		const { width, height } = dimensions;
		const minDate = d3.min(nodes, (node) => node.date) || new Date(2000, 0, 1);
		const timeScale = d3
			.scaleTime()
			.domain([new Date(), minDate])
			.range([RESPONSIVE_TOP_GUTTER, height - RESPONSIVE_BOTTOM_GUTTER]);
		const getColor = (node: NodeData) => getEntityColor(node.group, "EMPLOYER");

		if (prefersReducedMotion) {
			nodes.forEach((node) => {
				const position = responsivePacking.positions.get(node.id);
				node.x = position?.x ?? width / 2;
				node.y = position?.y ?? height / 2;
				node.vx = 0;
				node.vy = 0;
			});
		} else {
			nodes.forEach((node) => {
				if (!Number.isFinite(node.x) || !Number.isFinite(node.y) || node.y === 2000) {
					node.x = clamp(width / 2 + (Math.random() - 0.5) * 200, node.radius, width - node.radius);
					node.y = height - node.radius;
					node.vx = (Math.random() - 0.5) * 10;
					node.vy = -50 - Math.random() * 50;
				}
			});
		}

		const simulation = d3
			.forceSimulation<NodeData>(nodes)
			.alphaDecay(0.001)
			.velocityDecay(0.3)
			.force("x", d3.forceX(width / 2).strength(0.02))
			.force("y", d3.forceY<NodeData>((node) => timeScale(node.date)).strength(0.1))
			.force("collide", d3.forceCollide<NodeData>((node) => node.radius + 2).strength(0.8))
			.force("charge", d3.forceManyBody<NodeData>().strength(-15));
		simulationRef.current = simulation;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const defs = svg.append("defs");
		const filter = defs.append("filter").attr("id", "glow").attr("filterUnits", "userSpaceOnUse");
		filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
		const feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode").attr("in", "coloredBlur");
		feMerge.append("feMergeNode").attr("in", "SourceGraphic");

		// Keep the layer order explicit even while the relationship layer is intentionally empty.
		svg.append("g").attr("class", "links");
		const nodeLayer = svg.append("g").attr("class", "nodes");
		const labelLayer = svg.append("g").attr("class", "labels");

		const nodeGroup = nodeLayer
			.selectAll<SVGGElement, NodeData>("g.node-group")
			.data(nodes, (node) => node.id)
			.join("g")
			.attr("class", "node-group pointer-events-auto")
			.attr("id", (node) => `node-${node.id}`)
			.attr("data-id", (node) => node.id)
			.attr("data-presentation-mode", (node) => node.presentation_mode || "")
			.attr("cursor", "pointer");

		nodeGroup
			.append("circle")
			.attr("r", (node) => node.radius)
			.attr("cursor", "pointer")
			.attr("fill", getColor)
			.style("opacity", REST_OPACITY);

		const label = labelLayer
			.selectAll<SVGTextElement, NodeData>("text.label")
			.data(nodes)
			.join("text")
			.text((node) => node.name)
			.attr("class", "label pointer-events-none font-bold text-white uppercase")
			.attr("id", (node) => `label-${node.id}`)
			.attr("data-persistent-label", (node) =>
				node.presentation_mode === "flagship" ? "true" : "false",
			)
			.attr("text-anchor", "middle")
			.attr("dy", ".35em")
			.style("font-size", (node) => `${Math.min(12, node.radius / 2.5)}px`)
			.style("opacity", (node) => (node.presentation_mode === "flagship" ? 1 : 0))
			.style("pointer-events", "none")
			.style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");

		const applyRestCircleStyle = (
			circle: d3.Selection<SVGCircleElement, NodeData, null, undefined>,
			node: NodeData,
		) => {
			const isFlagship = node.presentation_mode === "flagship";
			const isDeepDive = node.presentation_mode === "deep_dive";
			circle
				.attr("stroke", isFlagship ? "#ffffff" : isDeepDive ? "#2E5CFF" : "rgba(255,255,255,0.1)")
				.attr("stroke-width", isFlagship ? 4 : isDeepDive ? 3 : 1)
				.attr("filter", isFlagship ? "drop-shadow(0 0 15px rgba(255,255,255,0.6))" : null)
				.style("opacity", REST_OPACITY);
		};

		const updateVisuals = (requestedFocusId: string | null) => {
			const focusId = nodes.some((node) => node.id === requestedFocusId) ? requestedFocusId : null;

			nodeGroup.each(function (node) {
				const circle = d3.select<SVGGElement, NodeData>(this).select<SVGCircleElement>("circle");
				circle.interrupt();
				if (!focusId) {
					applyRestCircleStyle(circle, node);
					return;
				}

				const isTarget = node.id === focusId;
				circle
					.attr("stroke", isTarget ? "#ffffff" : "rgba(255,255,255,0.1)")
					.attr("stroke-width", isTarget ? 4 : 1)
					.attr("filter", isTarget ? "drop-shadow(0 0 15px rgba(255,255,255,0.8))" : null)
					.style("opacity", isTarget ? 1 : 0.1);
			});

			label.style("opacity", (node) =>
				node.id === focusId || node.presentation_mode === "flagship" ? 1 : 0,
			);
		};
		visualUpdaterRef.current = updateVisuals;

		const constrainNodes = () => {
			for (const node of nodes) {
				node.x = clamp(node.x ?? width / 2, node.radius, width - node.radius);
				node.y = clamp(node.y ?? height / 2, node.radius, height - node.radius);
			}
		};

		const renderPositions = () => {
			constrainNodes();
			nodeGroup.attr("transform", (node) => `translate(${node.x},${node.y})`);
			label.attr("x", (node) => node.x ?? 0).attr("y", (node) => node.y ?? 0);
		};
		renderPositionsRef.current = renderPositions;

		const reportCandidate = (nextId: string | null) => {
			if (nextId === acquiredNodeIdRef.current) return;
			acquiredNodeIdRef.current = nextId;
			onNodeSelectRef.current?.(nodes.find((node) => node.id === nextId) ?? null);
		};

		svg
			.on("mousemove", (event) => {
				if (consoleHoveredRef.current) return;
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
			.on("mouseleave", () => reportCandidate(null))
			.on("click", () => onNodeClickRef.current?.(null));

		nodeGroup.on("click", (event, node) => {
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
		if (prefersReducedMotion) {
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
								if (!pausedRef.current) simulation.alpha(1).restart();
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
			if (launchTimer) clearTimeout(launchTimer);
			observer?.disconnect();
			simulation.stop();
			if (simulationRef.current === simulation) simulationRef.current = null;
			visualUpdaterRef.current = () => undefined;
			renderPositionsRef.current = () => undefined;
		};
	}, [nodes, dimensions, prefersReducedMotion, responsivePacking]);

	return (
		<div
			ref={containerRef}
			className="relative h-[max(100svh,var(--swarm-responsive-height))] w-full overflow-hidden bg-transparent lg:h-full"
			style={
				{
					"--swarm-responsive-height": `${responsivePacking.requiredHeight}px`,
				} as CSSProperties
			}
			data-swarm-ready={isReady ? "true" : "false"}
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
