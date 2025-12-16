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

    // MECHANIC: THE PIN (Sticky)
    // We create a tall scroll container. As the user scrolls, we map scroll % to activeIndex.

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
        // STAGE: The "Chamber" (300vh tall to allow scrolling time)
        <div ref={containerRef} className="relative h-[400vh] bg-neutral-50 dark:bg-neutral-900 transition-colors duration-500">

            {/* THE PIN: Sticky Window */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                <div className="w-full max-w-7xl mx-auto grid grid-cols-12 gap-8 px-6">

                    {/* LEFT: THE LIST (High Density Magazine) */}
                    <div className="col-span-4 relative h-[60vh] flex flex-col justify-center overflow-hidden border-r border-neutral-200 dark:border-white/10 pr-8 mask-linear-vertical">
                        {/* Gradients needs to handle light/dark too, or be neutral? Let's use generic gradient-to-b from-current-bg */}
                        <div className="absolute top-0 left-0 z-10 w-full bg-gradient-to-b from-neutral-50 via-neutral-50/80 to-transparent dark:from-neutral-900 dark:via-neutral-900/80 h-20 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-transparent dark:from-neutral-900 dark:via-neutral-900/80 h-20 pointer-events-none" />

                        <div className="mb-4 font-mono text-[10px] text-neutral-400 dark:text-neutral-600 uppercase tracking-widest absolute top-4 left-0">
                            Index // {String(activeIndex + 1).padStart(2, '0')} / {projects.length}
                        </div>

                        {/* The Moving Tape */}
                        <motion.div
                            className="space-y-0"
                            animate={{ y: -activeIndex * 40 + 200 }} // 40px item height, + offset to center
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {projects.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    style={{ height: 40 }}
                                    className={`flex items-center w-full text-left font-mono text-sm px-3 border-l-2 transition-all duration-300 ${i === activeIndex
                                        ? "border-green-600 dark:border-green-500 bg-neutral-200 dark:bg-white/5 text-black dark:text-white pl-6 font-bold"
                                        : "border-transparent text-neutral-400 dark:text-neutral-600 pl-3 scale-95 opacity-50"
                                        }`}
                                >
                                    <span className={`mr-4 text-[10px] tracking-wider ${i === activeIndex ? "text-green-600 dark:text-green-500" : "opacity-30"}`}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {p.data.title}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Mechanical Center Line */}
                        <div className="absolute top-1/2 left-0 w-2 h-px bg-green-600 dark:bg-green-500 z-20" />
                    </div>

                    {/* RIGHT: THE DETAIL CARD (Target Coordinate) */}
                    <div className="col-span-8 relative h-[60vh] flex items-center">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeProject.id} // Trigger animation on key change
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                                className="relative w-full h-full bg-white dark:bg-black rounded-lg border border-neutral-200 dark:border-white/10 overflow-hidden group shadow-2xl dark:shadow-none"
                            >
                                {/* Background Image */}
                                {activeProject.data.heroImage && (
                                    <img
                                        src={activeProject.data.heroImage}
                                        alt={activeProject.data.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-50 group-hover:opacity-20 dark:group-hover:opacity-80 transition-opacity duration-700 mode-aware-img"
                                    />
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />

                                {/* Content HUD */}
                                <div className="absolute bottom-0 left-0 w-full p-8 text-neutral-900 dark:text-white">
                                    <div className="flex items-baseline justify-between border-b border-neutral-200 dark:border-white/20 pb-4 mb-4">
                                        <h2 className="text-4xl font-bold uppercase tracking-tighter">
                                            {activeProject.data.title}
                                        </h2>
                                        <span className="font-mono text-xs text-green-600 dark:text-green-500">
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
                                            DEPLOYED
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative "Target" Reticle */}
                                <div className="absolute top-4 right-4 text-xs font-mono text-green-600 dark:text-green-500 border border-green-600/30 dark:border-green-500/30 px-2 py-1">
                                    TGT_LCK
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}
