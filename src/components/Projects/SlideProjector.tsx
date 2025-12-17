import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
            const targetScroll = (activeIndex * itemHeight) - (containerHeight / 2) + (itemHeight / 2);

            listRef.current.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        }
    }, [activeIndex]);

    useEffect(() => {
        const container = document.getElementById('hyperspace-container');
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

        container.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [projects.length]);

    // Safety check
    if (!projects || projects.length === 0) return null;
    const activeProject = projects[activeIndex];

    return (
        // STAGE: The "Chamber" (Reduced to 300vh for less scroll friction)
        <div ref={containerRef} className="relative h-[300vh] bg-neutral-50 dark:bg-neutral-900 transition-colors duration-500">

            {/* THE PIN: Sticky Window */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:grid md:grid-cols-12 md:gap-8 px-6">

                    {/* LEFT: THE LIST (High Density Magazine) */}
                    <div
                        ref={listRef}
                        className="relative w-full h-[25vh] md:h-[60vh] md:col-span-4 flex flex-col overflow-hidden border-b md:border-b-0 md:border-r border-neutral-200 dark:border-white/10 pb-4 md:pb-0 md:pr-8 md:mask-linear-vertical order-1"
                    >
                        {/* Gradient Masks */}
                        <div className="absolute top-0 left-0 z-10 w-full bg-gradient-to-b from-neutral-50 via-neutral-50/80 to-transparent dark:from-neutral-900 dark:via-neutral-900/80 h-20 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-transparent dark:from-neutral-900 dark:via-neutral-900/80 h-20 pointer-events-none" />

                        <div className="mb-4 font-mono text-[10px] text-neutral-400 dark:text-neutral-600 uppercase tracking-widest absolute top-4 left-0">
                            Index // {String(activeIndex + 1).padStart(2, '0')} / {projects.length}
                        </div>

                        {/* The Moving Tape -> Converted to Stationary Data Bank */}
                        <div className="relative space-y-0">
                            {/* THE MECHANICAL SCANNER HEAD */}
                            <motion.div
                                className="absolute left-0 w-full h-[40px] pointer-events-none z-0 mix-blend-screen"
                                animate={{ y: activeIndex * 40 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            >
                                {/* Active Highlight Box */}
                                <div className="w-full h-full border border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(46,92,255,0.3)] backdrop-blur-[1px]" />

                                {/* The Data Beam (Shoots Right) - Desktop Only */}
                                <div className="hidden md:block absolute top-1/2 left-full w-[50vw] h-px bg-gradient-to-r from-primary-500 via-primary-500/50 to-transparent shadow-[0_0_10px_#2E5CFF]">
                                    <div className="absolute top-0 left-0 w-full h-full animate-pulse opacity-50 bg-white/20" />
                                </div>

                                {/* Mobile Indicator (Left Bar) */}
                                <div className="md:hidden absolute top-0 left-0 w-1 h-full bg-primary-500" />
                            </motion.div>

                            {/* Project Items (Stationary) */}
                            {projects.map((p, i) => (
                                <div
                                    key={p.id}
                                    onClick={() => setActiveIndex(i)} // INTERACTION: Click to jump
                                    style={{ height: 40 }}
                                    className={`relative z-10 flex items-center w-full text-left font-mono text-sm px-3 border-l-2 transition-all duration-300 cursor-pointer ${i === activeIndex
                                        ? "border-primary-500 text-white pl-6 font-bold tracking-widest"
                                        : "border-transparent text-neutral-500 dark:text-neutral-600 pl-3 scale-95 hover:text-white"
                                        }`}
                                >
                                    <span className={`mr-4 text-[10px] tracking-wider transition-colors ${i === activeIndex ? "!text-primary-500" : "opacity-30"}`}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {p.data.title}
                                </div>
                            ))}
                        </div>

                        {/* Mechanical Center Line (Removed, replaced by Scanner Beam) */}
                    </div>

                    {/* RIGHT: THE DETAIL CARD (Target Coordinate) */}
                    <div className="relative w-full h-[50vh] md:h-[60vh] md:col-span-8 flex items-center order-2">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeProject.id} // Trigger animation on key change
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                                className="relative w-full h-full"
                            >
                                <a
                                    href={`/projects/${activeProject.slug}`}
                                    className="block w-full h-full bg-white dark:bg-black rounded-lg border border-neutral-200 dark:border-white/10 overflow-hidden group shadow-2xl dark:shadow-none hover:!border-primary-500 transition-colors duration-300"
                                >
                                    {/* Background Image (The Data Visual) */}
                                    {activeProject.data.heroImage && (
                                        <div className="absolute inset-0 overflow-hidden">
                                            <motion.img
                                                src={activeProject.data.heroImage}
                                                alt={activeProject.data.title}
                                                className="w-full h-full object-cover opacity-20 dark:opacity-60 mode-aware-img"
                                                initial={{ scale: 1.1 }}
                                                animate={{
                                                    scale: 1,
                                                    x: [0, -10, 0], // Subtle drift
                                                }}
                                                whileHover={{
                                                    scale: 1.1,
                                                    transition: { duration: 8, ease: "linear" }
                                                }}
                                                transition={{
                                                    scale: { duration: 10, ease: "easeOut" },
                                                    x: { duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }
                                                }}
                                            />
                                            {/* Tech Scanlines */}
                                            <div className="absolute inset-0 bg-[url('/assets/ui/grid-pattern.svg')] opacity-20 bg-repeat pointer-events-none" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent h-[200%] w-full animate-scan-slow pointer-events-none" />
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/50 pointer-events-none" />

                                    {/* Content HUD */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 text-neutral-900 dark:text-white z-10">
                                        <div className="flex items-baseline justify-between border-b border-neutral-200 dark:border-white/20 pb-4 mb-4 relative">
                                            {/* Tech Deco Line */}
                                            <div className="absolute bottom-0 left-0 w-1/3 h-px bg-primary-500 shadow-[0_0_10px_#2E5CFF]" />

                                            <h2 className="text-4xl font-bold uppercase tracking-tighter group-hover:!text-primary-500 transition-colors">
                                                {activeProject.data.title}
                                            </h2>
                                            <span className="font-mono text-xs !text-primary-500">
                                                {activeProject.data.year || '202X'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                                            <div>
                                                <span className="block text-neutral-400 dark:text-neutral-600 mb-1">CATEGORY</span>
                                                {activeProject.data.category || 'Unclassified'}
                                            </div>
                                            <div>
                                                <span className="block text-neutral-400 dark:text-neutral-600 mb-1">STATUS</span>
                                                <span className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    DEPLOYED
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative "Target" Reticle System */}
                                    <div className="absolute top-4 right-4 z-20 pointer-events-none">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-mono !text-primary-500 tracking-widest">TARGET_LOCKED</span>
                                            <div className="flex items-center gap-1">
                                                <div className="w-1 h-1 bg-primary-500" />
                                                <div className="w-16 h-px bg-primary-500/50" />
                                                <div className="w-px h-2 bg-primary-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corner Brackets */}
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary-500/30" />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary-500/30" />
                                </a>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}
