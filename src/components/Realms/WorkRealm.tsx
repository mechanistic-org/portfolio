import { getAssetUrl } from "../../utils/assets";

// ... existing imports
import React, { useState, useMemo, useRef, useEffect } from "react";
import ResVizSwarm from "../DataViz/ResVizSwarm";
import ProjectModal from "../Projects/ProjectModal";
import type { MultiverseNode } from "@/types/MultiverseTypes";

interface WorkRealmProps {
	nodes: MultiverseNode[];
}

export default function WorkRealm({ nodes: rawNodes }: WorkRealmProps) {
	const [activeNode, setActiveNode] = useState<any | null>(null);
	const [selectedProject, setSelectedProject] = useState<any | null>(null);
	const [isHoveringStrip, setIsHoveringStrip] = useState(false);
	const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const stripContainerRef = useRef<HTMLDivElement>(null);
	const swarmContainerRef = useRef<HTMLDivElement>(null); // Ref for the Swarm Column
	const [isSwarmActive, setIsSwarmActive] = useState(false);

	// Trigger Swarm Physics when scrolled past the Logo Fade (300px)
	useEffect(() => {
		const handleScroll = () => {
			if (!isSwarmActive && window.scrollY > 300) {
				setIsSwarmActive(true);
			}
		};

		window.addEventListener("scroll", handleScroll);
		// Check initial position in case of refresh
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [isSwarmActive]);

	// Helper to generate valid URL slugs from human-readable IDs
	const toSlug = (id: string) =>
		id
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]/g, "");

	// Sort nodes manually to match visual timeline (Newest Top)
	// FILTER: Hide Redacted/Hidden Projects from the Gallery
	const hiddenIds = [
		"classified",
		"classified-alpha",
		"classified-bravo",
		"electronic-battery-lock",
	];

	const sortedNodes = useMemo(() => {
		if (!rawNodes) return [];
		return [...rawNodes]
			.filter((node) => !hiddenIds.includes(node.id))
			.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
	}, [rawNodes]);

	// Auto-scroll Fiche Strip when Swarm updates Active Node
	// FIX: Use manual scrollTop to prevent Main Window "Page Jump" caused by scrollIntoView()
	useEffect(() => {
		if (activeNode && !isHoveringStrip && stripContainerRef.current) {
			const container = stripContainerRef.current;
			const card = itemRefs.current[activeNode.id];

			if (card) {
				// simple calc: Try to center the card in the container
				// card.offsetTop is relative to container (if container is position:relative)
				const targetTop = card.offsetTop - container.clientHeight / 2 + card.clientHeight / 2;

				container.scrollTo({
					top: targetTop,
					behavior: "smooth",
				});
			}
		}
	}, [activeNode, isHoveringStrip]);

	return (
		<div className="relative h-screen min-h-screen w-full">
			<div className="sticky top-0 grid h-screen w-full grid-cols-1 lg:grid-cols-2">
				{/* LEFT: The Swarm */}
				<div
					id="swarm-col"
					ref={swarmContainerRef}
					className={`relative h-full w-full border-r border-white/10 transition-opacity delay-300 duration-1000 will-change-transform ${
						isSwarmActive ? "opacity-100" : "opacity-0"
					}`}
				>
					{/* Pass activeNode down so Swarm can highlight bubble when Strip is hovered */}
					{/* Trigger physics only when visible */}
					<ResVizSwarm
						nodes={rawNodes}
						onNodeSelect={setActiveNode}
						externalHoverId={activeNode?.id}
						shouldStart={isSwarmActive}
					/>
				</div>

				{/* RIGHT: The Fiche Strip */}
				<div
					id="fiche-col"
					className={`pointer-events-auto relative hidden h-screen flex-col overflow-hidden border-l border-white/5 bg-transparent transition-all delay-500 duration-1000 ease-out will-change-transform lg:flex ${
						isSwarmActive ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
					}`}
					onMouseEnter={() => setIsHoveringStrip(true)}
					onMouseLeave={() => setIsHoveringStrip(false)}
				>
					{/* Background Grid */}
					<div
						className="pointer-events-none absolute inset-0 z-0 opacity-20"
						style={{
							backgroundImage:
								"linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
							backgroundSize: "50px 50px",
						}}
					></div>

					{/* Fiche Strip Container with CSS Mask for smooth fade */}
					<div className="relative h-full w-full overflow-hidden">
						{/* Scroll Content - Added relative for offsetTop calc */}
						<div
							ref={stripContainerRef}
							className="no-scrollbar relative h-full w-full space-y-4 overflow-y-auto px-8 py-32 pr-16"
						>
							{sortedNodes.map((node) => {
								const isActive = activeNode?.id === node.id;
								return (
									<div
										key={node.id}
										ref={(el) => {
											itemRefs.current[node.id] = el;
										}}
										onMouseEnter={() => setActiveNode(node)}
										onClick={() => (window.location.href = `/projects/${toSlug(node.id)}`)}
										className={`group relative cursor-pointer rounded-sm border p-6 transition-all duration-300 ${
											isActive
												? "z-10 scale-105 border-[#2E5090] bg-neutral-900/40 shadow-[0_0_30px_rgba(46,80,144,0.3)] backdrop-blur-md"
												: "border-white/5 bg-transparent opacity-60 grayscale hover:border-white/20 hover:bg-neutral-900/20 hover:opacity-100 hover:grayscale-0 hover:backdrop-blur-sm"
										} `}
									>
										<div className="mb-2 flex items-start justify-between">
											<h3
												className={`font-mono text-xl font-bold tracking-tight uppercase ${isActive ? "text-white" : "text-neutral-400 group-hover:text-white"}`}
											>
												{node.name}
											</h3>
											{isActive && (
												<div className="animate-pulse font-mono text-[10px] text-[#2E5090]">
													● LOCKED
												</div>
											)}
										</div>

										{/* Minimal Metadata Details */}
										<div className="flex items-center gap-4 font-mono text-[10px] text-neutral-500 uppercase">
											<span>{node.group}</span>
											<span>//</span>
											<span>{new Date(node.start_date).getFullYear()}</span>
										</div>

										{/* Active State Expansion: Show image (even if placeholder) */}
										{isActive && node.img && (
											<div className="mt-4 h-32 w-full overflow-hidden rounded border border-white/10">
												{/* Using standard img for now, potentially update to optimized image */}
												<img
													src={getAssetUrl(node.img || "")}
													className="h-full w-full object-cover opacity-80"
													alt={node.name}
												/>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Project Technical Modal Removed (Direct Navigation) */}
			</div>
		</div>
	);
}
