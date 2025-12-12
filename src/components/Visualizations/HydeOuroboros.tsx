import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hydeTraits, type HydeTrait } from '../../config/hydeData';

interface HydeOuroborosProps {
    width?: number;
    height?: number;
}

// Lobe Colors
const lobeColors: Record<string, string> = {
    "Anchor": "#FFFFFF",
    "Main": "#2E5CFF", // Blue
    "Transition": "#10B981", // Green/Teal
    "Deep": "#8B5CF6", // Purple
};

export default function HydeOuroboros({ width = 1000, height = 800 }: HydeOuroborosProps) {
    const [hoveredTrait, setHoveredTrait] = useState<HydeTrait | null>(null);

    // Filter traits by lobe
    const anchorTrait = hydeTraits.find(t => t.lobe === "Anchor");
    const mainTraits = hydeTraits.filter(t => t.lobe === "Main");
    const transTraits = hydeTraits.filter(t => t.lobe === "Transition");
    const deepTraits = hydeTraits.filter(t => t.lobe === "Deep");

    // Geometry Definitions
    // We define SVG paths for each Loop relative to a 1000x1000 ViewBox centered at 500,500
    // These paths mimic the "Hyde" multi-lobed structure

    // Main Loop (Personality): Large horizontal figure-8ish / orbit
    const mainPathD = "M 500 500 C 700 300, 900 500, 700 700 S 300 700, 500 500";
    // Wait, simpler spiral: Start center, loop right, loop down, loop left

    // Let's define clearer orbital paths.
    // Loop 1 (Main): Top-Right quadrant loop
    const mainLoopD = "M 500 500 C 600 400, 800 400, 800 600 C 800 800, 600 800, 500 500";

    // Loop 2 (Transition): Top-Left quadrant loop (Hard Skills)
    const transLoopD = "M 500 500 C 400 400, 200 400, 200 600 C 200 800, 400 800, 500 500";

    // Loop 3 (Deep): Bottom loop (Leadership) - or maybe a surrounding big loop?
    // Let's make it a bottom lobe to complete a clover shape
    const deepLoopD = "M 500 500 C 400 600, 400 850, 600 850 C 800 850, 800 600, 500 500";


    // Helper to sample points along a path (Approximation)
    // In a real SVG DOM we'd use getPointAtLength, but in SSR/React we simulate or use CSS motion path
    // For now, let's use a parametric approximation for the "Clover" layout
    // Actually, simple parametric circles are safer for React rendering without DOM measurement

    const getParametricPos = (lobe: string, index: number, total: number) => {
        const cx = 500;
        const cy = 400; // Shift center up slightly
        const rBase = 150;

        let angleOffset = 0;
        let radius = rBase;

        switch (lobe) {
            case "Main":
                // Right Lobe
                angleOffset = 0;
                radius = 200;
                break;
            case "Transition":
                // Left Lobe
                angleOffset = Math.PI; // 180 deg
                radius = 200;
                break;
            case "Deep":
                // Bottom Lobe
                angleOffset = Math.PI / 2; // 90 deg (Bottom)
                radius = 220;
                break;
        }

        // Calculate position on the specific lobe's perimeter
        // We simulate the lobe as an ellipse offset from center
        const lobeCenterX = cx + Math.cos(angleOffset) * (radius * 0.8);
        const lobeCenterY = cy + Math.sin(angleOffset) * (radius * 0.6);

        // Spread items along the lobe perimeter
        // We want them to connect back to center?
        // Let's just place them in a spiral around the Lobe Center for now
        // This creates "Galaxies" of traits

        const phi = (index / total) * Math.PI * 2 * 2; // 2 loops
        const spiralR = 20 + (index / total) * radius; // Spiraling out

        const x = lobeCenterX + Math.cos(phi) * spiralR;
        const y = lobeCenterY + Math.sin(phi) * spiralR;

        return { x, y };
    };

    return (
        <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-neutral-950 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(46,92,255,0.05)_0%,rgba(0,0,0,0)_60%)]" />

            <svg viewBox="0 0 1000 800" className="w-full h-full">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Connecting Lines (The Ouroboros Ribbon - Simulated) */}
                {/* We draw curves from Center to each Lobe Center to signify connection */}
                <path d="M 500 400 Q 700 400, 700 400" stroke={lobeColors["Main"]} strokeWidth="2" fill="none" opacity="0.2" />
                <path d="M 500 400 Q 300 400, 300 400" stroke={lobeColors["Transition"]} strokeWidth="2" fill="none" opacity="0.2" />
                <path d="M 500 400 Q 500 700, 500 650" stroke={lobeColors["Deep"]} strokeWidth="2" fill="none" opacity="0.2" />


                {/* Main Lobe Render */}
                {mainTraits.map((t, i) => {
                    const pos = getParametricPos("Main", i, mainTraits.length);
                    // Add slight random jitter for organic feel
                    const jitterX = (Math.random() - 0.5) * 10;
                    const jitterY = (Math.random() - 0.5) * 10;
                    return (
                        <Node
                            key={t.name}
                            x={pos.x + jitterX}
                            y={pos.y + jitterY}
                            trait={t}
                            color={lobeColors["Main"]}
                            setHover={setHoveredTrait}
                        />
                    );
                })}

                {/* Transition Lobe Render */}
                {transTraits.map((t, i) => {
                    const pos = getParametricPos("Transition", i, transTraits.length);
                    return (
                        <Node
                            key={t.name}
                            x={pos.x}
                            y={pos.y}
                            trait={t}
                            color={lobeColors["Transition"]}
                            setHover={setHoveredTrait}
                        />
                    );
                })}

                {/* Deep Lobe Render */}
                {deepTraits.map((t, i) => {
                    const pos = getParametricPos("Deep", i, deepTraits.length);
                    return (
                        <Node
                            key={t.name}
                            x={pos.x}
                            y={pos.y}
                            trait={t}
                            color={lobeColors["Deep"]}
                            setHover={setHoveredTrait}
                        />
                    );
                })}

                {/* Anchor Node (Center) */}
                {anchorTrait && (
                    <g transform="translate(500, 400)" className="cursor-pointer hover:scale-110 transition-transform">
                        <circle r="40" fill="url(#gradAnchor)" className="animate-pulse" />
                        <circle r="40" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                        <text y="5" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14" style={{ textTransform: 'uppercase' }}>
                            {anchorTrait.name}
                        </text>
                        {/* Atomic Number */}
                        <text y="-20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">1</text>
                    </g>
                )}

                {/* Radial Labels for Lobes */}
                <text x="800" y="300" fill={lobeColors["Main"]} opacity="0.5" fontSize="24" fontWeight="bold" textAnchor="middle">PERSONALITY</text>
                <text x="200" y="300" fill={lobeColors["Transition"]} opacity="0.5" fontSize="24" fontWeight="bold" textAnchor="middle">SKILLS</text>
                <text x="500" y="750" fill={lobeColors["Deep"]} opacity="0.5" fontSize="24" fontWeight="bold" textAnchor="middle">VALUES</text>

            </svg>

            {/* Hover HUD */}
            <AnimatePresence>
                {hoveredTrait && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-auto md:top-4 bg-neutral-900/95 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl z-20 min-w-[280px]"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">{hoveredTrait.lobe} ORBITAL</span>
                            <span className="text-xs font-mono text-primary-400">#{hoveredTrait.rank}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{hoveredTrait.name}</h3>
                        <p className="text-sm text-neutral-400 italic">
                            {hoveredTrait.description || "A fundamental element of the professional composition."}
                        </p>
                        <div className="mt-4 h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className="h-full"
                                style={{ width: `${Math.max(10, 100 - hoveredTrait.rank)}%`, backgroundColor: lobeColors[hoveredTrait.lobe] }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const Node = ({ x, y, trait, color, setHover }: { x: number, y: number, trait: HydeTrait, color: string, setHover: (t: HydeTrait | null) => void }) => (
    <g
        transform={`translate(${x}, ${y})`}
        onMouseEnter={() => setHover(trait)}
        onMouseLeave={() => setHover(null)}
        className="cursor-pointer group"
    >
        <circle
            r={trait.rank < 20 ? 12 : 6}
            fill={color}
            fillOpacity="0.2"
            stroke={color}
            strokeWidth={trait.rank < 20 ? 2 : 1}
            className="transition-all duration-300 group-hover:scale-150 group-hover:fill-opacity-80"
        />
        {trait.rank < 20 && (
            <text y="4" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" className="pointer-events-none group-hover:opacity-0 transition-opacity">
                {trait.name.substring(0, 2)}
            </text>
        )}
    </g>
);
