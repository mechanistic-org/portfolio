import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hydeTraits, type HydeTrait } from '../../config/hydeData';

interface HydeOuroborosProps {
    width?: number;
    height?: number;
    isComplete?: boolean;
}

// Lobe Colors
const lobeColors: Record<string, string> = {
    "Anchor": "#FFFFFF",
    "Main": "#2E5CFF", // Blue
    "Transition": "#10B981", // Green/Teal
    "Deep": "#8B5CF6", // Purple
};

export default function HydeOuroboros({ width = 1000, height = 900, isComplete = false }: HydeOuroborosProps) {
    const [hoveredTrait, setHoveredTrait] = useState<HydeTrait | null>(null);

    // Filter traits by lobe
    const anchorTrait = hydeTraits.find(t => t.lobe === "Anchor");
    const mainTraits = hydeTraits.filter(t => t.lobe === "Main");
    const transTraits = hydeTraits.filter(t => t.lobe === "Transition");
    const deepTraits = hydeTraits.filter(t => t.lobe === "Deep");

    // Geometry Definitions
    // Golden Mean Setup:
    // Lobe Radius (Main/Trans) = 180
    // Geometric Centroid Y = 444
    // Golden Text Radius (ry) = 180 * 1.618 ≈ 291

    const getParametricPos = (lobe: string, index: number, total: number) => {
        const cx = 500;
        const cy = 400; // Shift center up slightly to keep Lobes visual center
        // Note: Text is centered at 444 (Geometric Mean), Lobes at 400/532 visually anchor it.
        const rBase = 150;

        let angleOffset = 0;
        let radius = rBase;

        switch (lobe) {
            case "Main":
                // Right Lobe
                angleOffset = 0;
                radius = 180;
                break;
            case "Transition":
                // Left Lobe
                angleOffset = Math.PI; // 180 deg
                radius = 180;
                break;
            case "Deep":
                // Bottom Lobe
                angleOffset = Math.PI / 2; // 90 deg (Bottom)
                radius = 200;
                break;
        }

        // Calculate position on the specific lobe's perimeter
        const lobeCenterX = cx + Math.cos(angleOffset) * (radius * 0.8);
        const lobeCenterY = cy + Math.sin(angleOffset) * (radius * 0.6);

        const phi = (index / total) * Math.PI * 2 * 2; // 2 loops
        const spiralR = 20 + (index / total) * radius; // Spiraling out

        const x = lobeCenterX + Math.cos(phi) * spiralR;
        const y = lobeCenterY + Math.sin(phi) * spiralR;

        return { x, y };
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-neutral-950 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">


            {/* SVG: Centered at 500, 450 (Matches HTML Center) */}
            <svg viewBox="0 0 1000 900" className="w-full h-full max-h-screen">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id="gradAnchor" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>

                    {/* Paths for Radial Text Labels - GOLDEN MEAN TUNED */}
                    {/* Center: 500, 444 (AVG of centers) */}
                    {/* rx: 340 (Width Constraint) */}
                    {/* ry: 291 (Golden Ratio of Lobe Radius 180 * 1.618) */}

                    {/* TRAITS (Top Right) - Arc from -10 to -80 degrees */}
                    {/* Start (-80): x=500+340*0.17=558, y=444-291*0.98=159 */}
                    {/* End (-10):   x=500+340*0.98=833, y=444-291*0.17=394 */}
                    <path id="pathMain" d="M 558 159 A 340 291 0 0 1 833 394" />

                    {/* SKILLS (Top Left) - Arc from -170 to -100 degrees */}
                    {/* Start (-170): x=500+340*-0.98=167, y=444-291*0.17=394 */}
                    {/* End (-100):   x=500+340*-0.17=442, y=444-291*0.98=159 */}
                    <path id="pathTrans" d="M 167 394 A 340 291 0 0 1 442 159" />

                    {/* VALUES (Bottom) - Arc from 70 to 110 degrees */}
                    {/* Start (110): x=500+340*-0.34=384, y=444+291*0.94=717 */}
                    {/* End (70):    x=500+340*0.34=616,  y=444+291*0.94=717 */}
                    <path id="pathDeep" d="M 384 717 A 340 291 0 0 0 616 717" />
                </defs>

                {/* VISUALIZATION GROUP */}
                <motion.g
                    // User Request: "grow the viz more and quicker"
                    animate={{ scale: isComplete ? 1.25 : 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                >
                    {/* Connecting Lines REMOVED */}


                    {/* Main Lobe (Personality) - Center 660, 400 */}
                    <motion.g
                        initial={{ x: 660, y: 400 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    >
                        {mainTraits.map((t, i) => {
                            const pos = getParametricPos("Main", i, mainTraits.length);
                            const localX = pos.x - 660;
                            const localY = pos.y - 400;

                            const jitterX = (Math.random() - 0.5) * 2;
                            const jitterY = (Math.random() - 0.5) * 2;
                            return (
                                <Node
                                    key={t.name}
                                    x={localX + jitterX}
                                    y={localY + jitterY}
                                    trait={t}
                                    color={lobeColors["Main"]}
                                    setHover={setHoveredTrait}
                                />
                            );
                        })}
                    </motion.g>

                    {/* Transition Lobe (Skills) - Center 340, 400 */}
                    <motion.g
                        initial={{ x: 340, y: 400 }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    >
                        {transTraits.map((t, i) => {
                            const pos = getParametricPos("Transition", i, transTraits.length);
                            const localX = pos.x - 340;
                            const localY = pos.y - 400;
                            return (
                                <Node
                                    key={t.name}
                                    x={localX}
                                    y={localY}
                                    trait={t}
                                    color={lobeColors["Transition"]}
                                    setHover={setHoveredTrait}
                                />
                            );
                        })}
                    </motion.g>

                    {/* Deep Lobe (Values) - Center 500, 532 */}
                    <motion.g
                        initial={{ x: 500, y: 532 }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    >
                        {deepTraits.map((t, i) => {
                            const pos = getParametricPos("Deep", i, deepTraits.length);
                            const localX = pos.x - 500;
                            const localY = pos.y - 532;
                            return (
                                <Node
                                    key={t.name}
                                    x={localX}
                                    y={localY}
                                    trait={t}
                                    color={lobeColors["Deep"]}
                                    setHover={setHoveredTrait}
                                />
                            );
                        })}
                    </motion.g>

                    {/* Radial Labels - Using textPath for curvature */}
                    {/* TRAITS (Right) */}
                    <text fill={lobeColors["Main"]} opacity="0.3" fontSize="24" fontWeight="bold" letterSpacing="0.2em">
                        <textPath href="#pathMain" startOffset="50%" textAnchor="middle">TRAITS</textPath>
                    </text>

                    {/* SKILLS (Left) */}
                    <text fill={lobeColors["Transition"]} opacity="0.3" fontSize="24" fontWeight="bold" letterSpacing="0.2em">
                        <textPath href="#pathTrans" startOffset="50%" textAnchor="middle">SKILLS</textPath>
                    </text>

                    {/* VALUES (Bottom) */}
                    <text fill={lobeColors["Deep"]} opacity="0.3" fontSize="24" fontWeight="bold" letterSpacing="0.2em">
                        <textPath href="#pathDeep" startOffset="50%" textAnchor="middle">VALUES</textPath>
                    </text>
                </motion.g>

                {/* ANCHOR NODE (CREATIVITY / THE SOURCE) */}
                {anchorTrait && (
                    <motion.g
                        className="cursor-pointer"
                        initial={{ x: 500, y: 450, scale: 1, opacity: 1 }}
                        animate={isComplete ? { x: 500, y: 450, scale: 1.5, opacity: 1 } : { x: 500, y: 450, scale: 1, opacity: 1 }}
                        transition={{ duration: 2 }}
                    >
                        {/* THE NEBULA RING (Golden Mean Pulse) */}
                        {/* Matches Text Path: rx=340, ry=291, cy=444 (relative to group 450 -> -6) */}
                        <motion.ellipse
                            cx="0"
                            cy="-6" // 450 - 6 = 444 (Geometric Center)
                            rx={isComplete ? 800 : 340} // Expands on complete
                            ry={isComplete ? 800 : 291}
                            fill="none"
                            stroke="url(#gradAnchor)"
                            strokeWidth="2"
                            animate={{
                                opacity: isComplete ? 0 : [
                                    // MORSE: HARDWARE
                                    // H (....)
                                    0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0,
                                    // A (.-)
                                    0.4, 0.1, 0.4, 0.4, 0.4, 0.1, 0,
                                    // R (.-.)
                                    0.4, 0.1, 0.4, 0.4, 0.4, 0.1, 0.4, 0.1, 0,
                                    // D (-..)
                                    0.4, 0.4, 0.4, 0.1, 0.4, 0.1, 0.4, 0.1, 0,
                                    // W (.--)
                                    0.4, 0.1, 0.4, 0.4, 0.4, 0.1, 0.4, 0.4, 0.4, 0.1, 0,
                                    // A (.-)
                                    0.4, 0.1, 0.4, 0.4, 0.4, 0.1, 0,
                                    // R (.-.)
                                    0.4, 0.1, 0.4, 0.4, 0.4, 0.1, 0.4, 0.1, 0,
                                    // E (.)
                                    0.4, 0.1, 0,
                                    // WORD SPACE
                                    0, 0, 0
                                ],
                                strokeWidth: [1, 4, 1] // Breathing thickness
                            }}
                            transition={{
                                opacity: {
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear",
                                    times: [
                                        0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.14, 0.18, // H
                                        0.20, 0.22, 0.24, 0.28, 0.32, // A
                                        0.34, 0.36, 0.38, 0.42, 0.44, 0.46, 0.50, // R
                                        0.52, 0.56, 0.58, 0.60, 0.62, 0.66, // D
                                        0.68, 0.70, 0.72, 0.76, 0.78, 0.82, 0.86, // W
                                        0.88, 0.90, 0.92, 0.96, 0.98, // A
                                        // R (Truncated loop for fit)
                                        1
                                    ]
                                },
                                strokeWidth: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                        />

                        {/* Core Circle - The "Singularity" */}
                        <motion.circle
                            r="40"
                            fill="url(#gradAnchor)"
                            animate={{ opacity: isComplete ? 0 : 1 }}
                            transition={{ duration: 2 }}
                        />
                    </motion.g>
                )}
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
