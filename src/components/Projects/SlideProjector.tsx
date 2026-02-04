import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Type for Development (matching CollectionEntry roughly)
export type ProjectData = {
	id: string;
	data: {
		title: string;
		description?: string;
		heroImage?: string;
		category?: string;
		year?: number;
	};
	slug?: string;
};

interface SlideProjectorProps {
	projects: ProjectData[];
}

export default function SlideProjector({ projects = [] }: SlideProjectorProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	// MECHANIC: THE PIN (Sticky)
	// We create a tall scroll container. As the user scrolls, we map scroll % to activeIndex.

	// MECHANIC: FOLLOW FOCUS (Auto-Scroll List)
	useEffect(() => {
		if (listRef.current) {
			const itemHeight = 40;
			const containerHeight = listRef.current.clientHeight;
			const targetScroll = activeIndex * itemHeight - containerHeight / 2 + itemHeight / 2;

			listRef.current.scrollTo({
				top: targetScroll,
				behavior: "smooth",
			});
		}
	}, [activeIndex]);

	useEffect(() => {
		const container = document.getElementById("hyperspace-container");
		if (!container) return;

		const handleScroll = () => {
			if (!containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			// Calculate progress based on container scroll, not window
			// We can still use rect.top because it's relative to the viewport (which is the scroll window)
			// But we need to ensure we are listening to the right event.
			const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));

			// Map 0-1 progress to 0-(total-1) index
			const rawIndex = Math.floor(progress * projects.length);
			const index = Math.min(projects.length - 1, Math.max(0, rawIndex));

			setActiveIndex(index);
		};

		container.addEventListener("scroll", handleScroll, { passive: true });
		// Initial check
		handleScroll();

		return () => container.removeEventListener("scroll", handleScroll);
	}, [projects.length]);

	// Safety check
	if (!projects || projects.length === 0) return null;
	const activeProject = projects[activeIndex];

	return (
		// STAGE: The "Chamber" (Reduced to 300vh for less scroll friction)
		<div
			ref={containerRef}
			className="relative h-[300vh] bg-neutral-50 transition-colors duration-500 dark:bg-neutral-900"
		>
			{/* THE PIN: Sticky Window */}
			<div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 md:grid md:grid-cols-12 md:gap-8">
					{/* LEFT: THE LIST (High Density Magazine) */}
					<div
						ref={listRef}
						className="md:mask-linear-vertical relative order-1 flex h-[25vh] w-full flex-col overflow-hidden border-b border-neutral-200 pb-4 md:col-span-4 md:h-[60vh] md:border-r md:border-b-0 md:pr-8 md:pb-0 dark:border-white/10"
					>
						{/* Gradient Masks */}
						<div className="pointer-events-none absolute top-0 left-0 z-10 h-20 w-full bg-gradient-to-b from-neutral-50 via-neutral-50/80 to-transparent dark:from-neutral-900 dark:via-neutral-900/80" />
						<div className="pointer-events-none absolute bottom-0 left-0 z-10 h-20 w-full bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-transparent dark:from-neutral-900 dark:via-neutral-900/80" />

						<div className="absolute top-4 left-0 mb-4 font-mono text-[10px] tracking-widest text-neutral-400 uppercase dark:text-neutral-600">
							Index // {String(activeIndex + 1).padStart(2, "0")} / {projects.length}
						</div>

						{/* The Moving Tape -> Converted to Stationary Data Bank */}
						<div className="relative space-y-0">
							{/* THE MECHANICAL SCANNER HEAD */}
							<motion.div
								className="pointer-events-none absolute left-0 z-0 h-[40px] w-full mix-blend-screen"
								animate={{ y: activeIndex * 40 }}
								transition={{ type: "spring", stiffness: 400, damping: 30 }}
							>
								{/* Active Highlight Box */}
								<div className="border-primary-500 bg-primary-500/10 h-full w-full border shadow-[0_0_15px_rgba(46,92,255,0.3)] backdrop-blur-[1px]" />

								{/* The Data Beam (Shoots Right) - Desktop Only */}
								<div className="from-primary-500 via-primary-500/50 absolute top-1/2 left-full hidden h-px w-[50vw] bg-gradient-to-r to-transparent shadow-[0_0_10px_#2E5CFF] md:block">
									<div className="absolute top-0 left-0 h-full w-full animate-pulse bg-white/20 opacity-50" />
								</div>

								{/* Mobile Indicator (Left Bar) */}
								<div className="bg-primary-500 absolute top-0 left-0 h-full w-1 md:hidden" />
							</motion.div>

							{/* Project Items (Stationary) */}
							{projects.map((p, i) => (
								<div
									key={p.id}
									onClick={() => setActiveIndex(i)} // INTERACTION: Click to jump
									style={{ height: 40 }}
									className={`relative z-10 flex w-full cursor-pointer items-center border-l-2 px-3 text-left font-mono text-sm transition-all duration-300 ${
										i === activeIndex
											? "border-primary-500 pl-6 font-bold tracking-widest text-white"
											: "scale-95 border-transparent pl-3 text-neutral-500 hover:text-white dark:text-neutral-600"
									}`}
								>
									<span
										className={`mr-4 text-[10px] tracking-wider transition-colors ${i === activeIndex ? "!text-primary-500" : "opacity-30"}`}
									>
										{String(i + 1).padStart(2, "0")}
									</span>
									{p.data.title}
								</div>
							))}
						</div>

						{/* Mechanical Center Line (Removed, replaced by Scanner Beam) */}
					</div>

					{/* RIGHT: THE DETAIL CARD (Target Coordinate) */}
					<div className="relative order-2 flex h-[50vh] w-full items-center md:col-span-8 md:h-[60vh]">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeProject.id} // Trigger animation on key change
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -50 }}
								transition={{ duration: 0.4, ease: "circOut" }}
								className="relative h-full w-full"
							>
								<a
									href={`/projects/${activeProject.slug}`}
									className="group hover:!border-primary-500 block h-full w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-2xl transition-colors duration-300 dark:border-white/10 dark:bg-black dark:shadow-none"
								>
									{/* Background Image (The Data Visual) */}
									{activeProject.data.heroImage && (
										<div className="absolute inset-0 overflow-hidden">
											<motion.img
												src={activeProject.data.heroImage}
												alt={activeProject.data.title}
												className="mode-aware-img h-full w-full object-cover opacity-20 dark:opacity-60"
												initial={{ scale: 1.1 }}
												animate={{
													scale: 1,
													x: [0, -10, 0], // Subtle drift
												}}
												whileHover={{
													scale: 1.1,
													transition: { duration: 8, ease: "linear" },
												}}
												transition={{
													scale: { duration: 10, ease: "easeOut" },
													x: {
														duration: 20,
														repeat: Infinity,
														repeatType: "reverse",
														ease: "linear",
													},
												}}
											/>
											{/* Tech Scanlines */}
											<div className="pointer-events-none absolute inset-0 bg-[url('/assets/ui/grid-pattern.svg')] bg-repeat opacity-20" />
											<div className="via-primary-500/5 animate-scan-slow pointer-events-none absolute inset-0 h-[200%] w-full bg-gradient-to-b from-transparent to-transparent" />
										</div>
									)}

									{/* Overlay Gradient */}
									<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />

									{/* Content HUD */}
									<div className="absolute bottom-0 left-0 z-10 w-full p-8 text-neutral-900 dark:text-white">
										<div className="relative mb-4 flex items-baseline justify-between border-b border-neutral-200 pb-4 dark:border-white/20">
											{/* Tech Deco Line */}
											<div className="bg-primary-500 absolute bottom-0 left-0 h-px w-1/3 shadow-[0_0_10px_#2E5CFF]" />

											<h2 className="group-hover:!text-primary-500 text-4xl font-bold tracking-tighter uppercase transition-colors">
												{activeProject.data.title}
											</h2>
											<span className="!text-primary-500 font-mono text-xs">
												{activeProject.data.year || "202X"}
											</span>
										</div>

										<div className="grid grid-cols-2 gap-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
											<div>
												<span className="mb-1 block text-neutral-400 dark:text-neutral-600">
													CATEGORY
												</span>
												{activeProject.data.category || "Unclassified"}
											</div>
											<div>
												<span className="mb-1 block text-neutral-400 dark:text-neutral-600">
													STATUS
												</span>
												<span className="flex items-center gap-2">
													<span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
													DEPLOYED
												</span>
											</div>
										</div>
									</div>

									{/* Decorative "Target" Reticle System */}
									<div className="pointer-events-none absolute top-4 right-4 z-20">
										<div className="flex flex-col items-end gap-1">
											<span className="!text-primary-500 font-mono text-[10px] tracking-widest">
												TARGET_LOCKED
											</span>
											<div className="flex items-center gap-1">
												<div className="bg-primary-500 h-1 w-1" />
												<div className="bg-primary-500/50 h-px w-16" />
												<div className="bg-primary-500 h-2 w-px" />
											</div>
										</div>
									</div>

									{/* Corner Brackets */}
									<div className="border-primary-500/30 absolute top-0 left-0 h-4 w-4 border-t border-l" />
									<div className="border-primary-500/30 absolute right-0 bottom-0 h-4 w-4 border-r border-b" />
								</a>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</div>
	);
}
