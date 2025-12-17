import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import multiverseRequest from '../../data/timeline/multiverse.json';

// Type Definitions
type ProjectNode = {
    id: string;
    name: string;
    group: string; // Employer
    start_date: string;
    end_date: string;
    skills: string[];
    category: string;
};

// Color Map from Colors.csv
const COLOR_MAP: Record<string, string> = {
    "Mechanistic": "#2E5CFF",
    "Hyphen": "#00C2FF",
    "Noon": "#4B5563",
    "Avegant": "#9CA3AF",
    "Kaleidescape": "#2E5CFF",
    "Digidesign": "#00C2FF",
    "frogdesign": "#2E5CFF",
    "Silicon Graphics": "#00C2FF",
    "EP Technologies": "#4B5563",
};

const DEFAULT_COLOR = "#333";

export default function LivingGantt() {
    // 1. Process Data
    const projects = useMemo(() => {
        // Sort by start date (Oldest -> Newest) for Left -> Right flow
        return (multiverseRequest.nodes as ProjectNode[]).sort((a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );
    }, []);

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
        // Find the scroll container
        const scrollEl = document.getElementById('hyperspace-container');
        if (!scrollEl) return;

        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            // Total Scrollable Height of this component = 400vh
            // Viewport Height
            const vh = window.innerHeight;
            const totalHeight = rect.height - vh;

            // Current scroll into the component
            // when rect.top = vh (just entered), progress = 0
            // when rect.top = 0 (sticky start), progress = ?
            // when rect.bottom = 0 (just left), progress = 1?

            // Sticky logic is tricky to calculate from just rect.top if it's already sticking.
            // Actually, the Outer Div (containerRef, 400vh) scrolls comfortably.
            // The Inner Div (sticky) stays put.
            // So rect.top of the Outer Div goes from 0 to -300vh.

            // Progress = -rect.top / (rect.height - vh)
            // Clamp between 0 and 1
            const rawProgress = -rect.top / totalHeight;
            const progress = Math.max(0, Math.min(1, rawProgress));

            // Map 0-1 to 0% -> -75% (to show 400vw width)
            // If width is 400vw, we show 100vw at a time. Total travel needed is 300vw.
            // So -300vw max offset. Or -75% of total width.

            setXOffset(progress * -75);
        };

        scrollEl.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Init

        return () => scrollEl.removeEventListener('scroll', handleScroll);
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
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">

                {/* HUD Overlay (Fixed relative to viewport) */}
                {/* REMOVED: SPECTRUM_ANALYSIS Header */}

                {/* SOURCE CONSOLE (Right Side Overlay) */}
                <div className="absolute top-24 right-8 z-40 flex flex-col gap-2 w-64 pointer-events-auto">
                    <div className="text-[10px] font-mono text-neutral-500 mb-2 border-b border-neutral-800 pb-1 flex justify-between">
                        <span>SOURCE_FILES</span>
                        <span className="text-green-500">ONLINE</span>
                    </div>

                    <a href="/docs/meta/bio" className="block p-3 bg-neutral-900/80 border-l-2 border-l-neutral-700 border-y border-r border-white/5 hover:border-l-[#2E5CFF] hover:bg-neutral-800 transition-all group backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-300 group-hover:text-white">BIO_LOG.md</span>
                            <span className="text-[8px] px-1 bg-neutral-800 rounded group-hover:bg-[#2E5CFF] group-hover:text-white transition-colors">READ</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1 font-mono group-hover:text-blue-400">The Operator Context</div>
                    </a>

                    <a href="/docs/meta/personal-user-manual" className="block p-3 bg-neutral-900/80 border-l-2 border-l-neutral-700 border-y border-r border-white/5 hover:border-l-[#00C2FF] hover:bg-neutral-800 transition-all group backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-300 group-hover:text-white">USR_MANUAL.sys</span>
                            <span className="text-[8px] px-1 bg-neutral-800 rounded group-hover:bg-[#00C2FF] group-hover:text-black transition-colors">READ</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1 font-mono group-hover:text-cyan-400">Operating Protocols</div>
                    </a>

                    <a href="/docs/meta/manifesto" className="block p-3 bg-neutral-900/80 border-l-2 border-l-neutral-700 border-y border-r border-white/5 hover:border-l-yellow-500 hover:bg-neutral-800 transition-all group backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-300 group-hover:text-white">MANIFESTO.txt</span>
                            <span className="text-[8px] px-1 bg-neutral-800 rounded group-hover:bg-yellow-500 group-hover:text-black transition-colors">CORE</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1 font-mono group-hover:text-yellow-400">System Directives</div>
                    </a>

                    <a href="/ExampleResume.pdf" target="_blank" className="block p-3 bg-neutral-900/80 border-l-2 border-l-neutral-700 border-y border-r border-white/5 hover:border-l-red-500 hover:bg-neutral-800 transition-all group backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-300 group-hover:text-white">RESUME_DUMP.pdf</span>
                            <span className="text-[8px] px-1 bg-neutral-800 rounded group-hover:bg-red-500 group-hover:text-black transition-colors">DL</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1 font-mono group-hover:text-red-400">Export V 1.0</div>
                    </a>
                </div>

                {/* THE TAPE (Moves Left with Scroll) */}
                <motion.div
                    style={{ x: useTransform(xSpring, value => `${value}%`) }}
                    className="relative h-[60vh] min-w-[400vw] flex items-center bg-neutral-950/50 border-y border-white/10"
                >
                    {/* Time Grid (Background) */}
                    <div className="absolute inset-0 flex justify-between px-20 opacity-20 pointer-events-none">
                        {[...Array(totalYears + 1)].map((_, i) => (
                            <div key={i} className="h-full border-l border-white/50 text-[10px] font-mono pl-1 pt-2">
                                {minYear + i}
                            </div>
                        ))}
                    </div>

                    {/* Data Layer */}
                    <div className="relative w-full h-full p-20">
                        {projects.map((p, i) => {
                            const start = getPos(p.start_date);
                            const end = getPos(p.end_date || new Date().toISOString());
                            const width = Math.max(0.5, end - start);
                            const color = COLOR_MAP[p.group] || DEFAULT_COLOR;

                            // Stagger Y position to avoid overlap (simple modulo)
                            const row = i % 8; // 8 Rows
                            const top = `${10 + row * 10}%`;

                            return (
                                <div
                                    key={p.id}
                                    className="absolute h-8 rounded-sm group hover:z-50 transition-all duration-300"
                                    style={{
                                        left: `${start}%`,
                                        width: `${width}%`,
                                        top: top,
                                        backgroundColor: color,
                                    }}
                                >
                                    {/* Hover info */}
                                    <div className="hidden group-hover:block absolute -top-10 left-0 bg-neutral-900 border border-white/20 p-2 z-50 whitespace-nowrap shadow-xl">
                                        <div className="font-bold text-white text-xs">{p.name}</div>
                                        <div className="text-[10px] text-neutral-400">{p.group} // {p.category}</div>
                                    </div>

                                    {/* Label on bar if wide enough */}
                                    {width > 5 && (
                                        <span className="absolute left-2 top-2 text-[8px] font-mono text-white/50 truncate w-full pointer-events-none">
                                            {p.name}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </motion.div>

                {/* Scrubber Needle */}
                <div className="absolute top-0 bottom-0 left-[20%] w-px bg-red-500/50 pointer-events-none z-30">
                    <div className="absolute bottom-4 left-2 font-mono text-[10px] text-red-500">
                        T+{Math.round((2025 - 2007) * 0.2)}Y
                    </div>
                </div>

            </div>
        </div>
    );
}
