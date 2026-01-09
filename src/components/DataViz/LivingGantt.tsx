import React, { useMemo, useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { MultiverseNode } from "@/types/MultiverseTypes";

// Type Definitions
// Reusing MultiverseNode for consistency, but mapped locally if needed.
// Actually, let's just use MultiverseNode directly.

import { getEntityColor } from "../../config/color_registry";

const DEFAULT_COLOR = "#333";

interface LivingGanttProps {
	nodes: MultiverseNode[];
}

export default function LivingGantt({ nodes: rawNodes }: LivingGanttProps) {
	// 1. Process Data
	const projects = useMemo(() => {
		if (!rawNodes) return [];
		// Sort by start date (Oldest -> Newest) for Left -> Right flow
		return [...rawNodes].sort(
			(a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
		);
	}, [rawNodes]);

	// Time Range
	const minYear = 2007;
	const maxYear = 2025;
	const totalYears = maxYear - minYear;

	// We Map Time (X) to Width (Px)
	// Manual Scroll Listener Pattern (Matches SlideProjector)

	// State for the horizontal shift
	const [xOffset, setXOffset] = useState(0);

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (!containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			// Total Scrollable Height of this component = 400vh
			// Viewport Height
			const vh = window.innerHeight;
			const totalHeight = rect.height - vh;

			// Rect.top is relative to viewport.
			// When component starts entering, rect.top > 0.
			// When component fully covers, rect.top <= 0.
			// We want progress 0 when rect.top = 0 (top of component hits top of screen)

			const rawProgress = -rect.top / totalHeight;
			const progress = Math.max(0, Math.min(1, rawProgress));

			setXOffset(progress * -75);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll(); // Init

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Spring physics for smooth feeling
	const xSpring = useSpring(0, { stiffness: 100, damping: 30 });

	useEffect(() => {
		xSpring.set(xOffset);
	}, [xOffset, xSpring]);

	// Helper to get % position within the wide tape
	const getPos = (dateStr: string) => {
		const d = new Date(dateStr);
		const year = d.getFullYear() + d.getMonth() / 12;
		return ((year - minYear) / totalYears) * 100;
	};

	return (
		// STAGE: The "Track" (400vh tall to drive the scroll)
		<div ref={containerRef} className="relative h-[400vh] bg-black">
			{/* PIN: The Sticky Window */}
			<div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden">
				{/* HUD Overlay (Fixed relative to viewport) */}
				{/* REMOVED: SPECTRUM_ANALYSIS Header */}

				{/* SOURCE CONSOLE (Right Side Overlay) */}
				<div className="pointer-events-auto absolute top-24 right-8 z-40 flex w-64 flex-col gap-2">
					<div className="mb-2 flex justify-between border-b border-neutral-800 pb-1 font-mono text-[10px] text-neutral-500">
						<span>SOURCE_FILES</span>
						<span className="text-green-500">ONLINE</span>
					</div>

					<a
						href="/docs/meta/bio"
						className="group block border-y border-r border-l-2 border-white/5 border-l-neutral-700 bg-neutral-900/80 p-3 backdrop-blur-sm transition-all hover:border-l-[#2E5CFF] hover:bg-neutral-800"
					>
						<div className="flex items-center justify-between">
							<span className="text-xs font-bold text-neutral-300 group-hover:text-white">
								BIO_LOG.md
							</span>
							<span className="rounded bg-neutral-800 px-1 text-[8px] transition-colors group-hover:bg-[#2E5CFF] group-hover:text-white">
								READ
							</span>
						</div>
						<div className="mt-1 font-mono text-[10px] text-neutral-500 group-hover:text-blue-400">
							The Operator Context
						</div>
					</a>

					<a
						href="/docs/meta/personal-user-manual"
						className="group block border-y border-r border-l-2 border-white/5 border-l-neutral-700 bg-neutral-900/80 p-3 backdrop-blur-sm transition-all hover:border-l-[#00C2FF] hover:bg-neutral-800"
					>
						<div className="flex items-center justify-between">
							<span className="text-xs font-bold text-neutral-300 group-hover:text-white">
								USR_MANUAL.sys
							</span>
							<span className="rounded bg-neutral-800 px-1 text-[8px] transition-colors group-hover:bg-[#00C2FF] group-hover:text-black">
								READ
							</span>
						</div>
						<div className="mt-1 font-mono text-[10px] text-neutral-500 group-hover:text-cyan-400">
							Operating Protocols
						</div>
					</a>

					<a
						href="/docs/meta/manifesto"
						className="group block border-y border-r border-l-2 border-white/5 border-l-neutral-700 bg-neutral-900/80 p-3 backdrop-blur-sm transition-all hover:border-l-yellow-500 hover:bg-neutral-800"
					>
						<div className="flex items-center justify-between">
							<span className="text-xs font-bold text-neutral-300 group-hover:text-white">
								MANIFESTO.txt
							</span>
							<span className="rounded bg-neutral-800 px-1 text-[8px] transition-colors group-hover:bg-yellow-500 group-hover:text-black">
								CORE
							</span>
						</div>
						<div className="mt-1 font-mono text-[10px] text-neutral-500 group-hover:text-yellow-400">
							System Directives
						</div>
					</a>

					<a
						href="/ExampleResume.pdf"
						target="_blank"
						className="group block border-y border-r border-l-2 border-white/5 border-l-neutral-700 bg-neutral-900/80 p-3 backdrop-blur-sm transition-all hover:border-l-red-500 hover:bg-neutral-800"
					>
						<div className="flex items-center justify-between">
							<span className="text-xs font-bold text-neutral-300 group-hover:text-white">
								RESUME_DUMP.pdf
							</span>
							<span className="rounded bg-neutral-800 px-1 text-[8px] transition-colors group-hover:bg-red-500 group-hover:text-black">
								DL
							</span>
						</div>
						<div className="mt-1 font-mono text-[10px] text-neutral-500 group-hover:text-red-400">
							Export V 1.0
						</div>
					</a>
				</div>

				{/* THE TAPE (Moves Left with Scroll) */}
				<motion.div
					style={{ x: useTransform(xSpring, (value) => `${value}%`) }}
					className="relative flex h-[60vh] min-w-[400vw] items-center border-y border-white/10 bg-neutral-950/50"
				>
					{/* Time Grid (Background) */}
					<div className="pointer-events-none absolute inset-0 flex justify-between px-20 opacity-20">
						{[...Array(totalYears + 1)].map((_, i) => (
							<div
								key={i}
								className="h-full border-l border-white/50 pt-2 pl-1 font-mono text-[10px]"
							>
								{minYear + i}
							</div>
						))}
					</div>

					{/* Data Layer */}
					<div className="relative h-full w-full p-20">
						{projects.map((p, i) => {
							const start = getPos(p.start_date);
							const end = getPos(p.end_date || new Date().toISOString());
							const width = Math.max(0.5, end - start);
							const color = getEntityColor(p.group, "EMPLOYER");

							// Stagger Y position to avoid overlap (simple modulo)
							const row = i % 8; // 8 Rows
							const top = `${10 + row * 10}%`;

							return (
								<div
									key={p.id}
									className="group absolute h-8 rounded-sm transition-all duration-300 hover:z-50"
									style={{
										left: `${start}%`,
										width: `${width}%`,
										top: top,
										backgroundColor: color,
									}}
								>
									{/* Hover info */}
									<div className="absolute -top-10 left-0 z-50 hidden border border-white/20 bg-neutral-900 p-2 whitespace-nowrap shadow-xl group-hover:block">
										<div className="text-xs font-bold text-white">{p.name}</div>
										<div className="text-[10px] text-neutral-400">
											{p.group} // {p.category}
										</div>
									</div>

									{/* Label on bar if wide enough */}
									{width > 5 && (
										<span className="pointer-events-none absolute top-2 left-2 w-full truncate font-mono text-[8px] text-white/50">
											{p.name}
										</span>
									)}
								</div>
							);
						})}
					</div>
				</motion.div>

				{/* Scrubber Needle */}
				<div className="pointer-events-none absolute top-0 bottom-0 left-[20%] z-30 w-px bg-red-500/50">
					<div className="absolute bottom-4 left-2 font-mono text-[10px] text-red-500">
						T+{Math.round((2025 - 2007) * 0.2)}Y
					</div>
				</div>
			</div>
		</div>
	);
}
