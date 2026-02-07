import  {  useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hydeTraits, type HydeTrait } from '../../config/hydeData';

interface HydeAuthenticProps {
    width?: number;
    height?: number;
}

// Lobe Colors (Matching the Reference roughly)
const lobeColors: Record<string, string> = {
    "Anchor": "#FFFFFF",
    "Main": "#2E5CFF", // Blue (s/p block)
    "Transition": "#F59E0B", // Orange/Yellow (d block)
    "Deep": "#10B981", // Green (f block)
};

export default function HydeAuthentic({ width = 1000, height = 800 }: HydeAuthenticProps) {
    const [hoveredTrait, setHoveredTrait] = useState<HydeTrait | null>(null);

    // Filter traits
    const anchorTrait = hydeTraits.find(t => t.lobe === "Anchor");
    const mainTraits = hydeTraits.filter(t => t.lobe === "Main"); // The Right Loop
    const transTraits = hydeTraits.filter(t => t.lobe === "Transition"); // The Left Loop
    const deepTraits = hydeTraits.filter(t => t.lobe === "Deep"); // The Top Loop

    // --- Geometry --- 
    // We define "Ribbon Paths" (Stroke width ~60px)
    // The nodes sit ALONG these paths.

    // Center is 500, 500

    // Right Loop (Main/Personality): Starts Center, Curles Right and down, loops back up
    const mainPath = "M 530 500 C 650 500, 900 300, 900 600 C 900 850, 600 850, 530 530";

    // Left Loop (Transition/Skills): Starts Center, Curles Left and down
    const transPath = "M 470 500 C 350 500, 100 300, 100 600 C 100 850, 400 850, 470 530";

    // Top Loop (Deep/Values): Starts from the "Neck", curls Up and around
    // In Hyde chart, it connects to the Transition loop actually, but let's sprout from center for simplicity
    const deepPath = "M 500 470 C 500 350, 300 100, 500 100 C 700 100, 700 350, 500 430";


    // Helper to get point on generic parametric curve (Cubic Bezier approx)
    // Since SVG paths are hard to sample in SSR without getPointAtLength, we use a manual Bezier function

    function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
        return Math.pow(1 - t, 3) * p0 +
            3 * Math.pow(1 - t, 2) * t * p1 +
            3 * (1 - t) * Math.pow(t, 2) * p2 +
            Math.pow(t, 3) * p3;
    }

    const getPosOnPath = (lobe: string, t: number) => {
        // approximate control points from the path strings above
        if (lobe === "Main") {
            // M 530 500 C 650 500, 900 300, 900 600 ... 
            // We only simulate the first half of the loop for placement usually, or full loop?
            // Let's break it into segments if needed. 
            // For simplicity, let's map t (0..1) to the curve coordinates manually derived
            const px = cubicBezier(t, 530, 650, 900, 900);
            const py = cubicBezier(t, 500, 500, 300, 600);
            return { x: px, y: py };
        }
        if (lobe === "Transition") {
            // M 470 500 C 350 500, 100 300, 100 600
            const px = cubicBezier(t, 470, 350, 100, 100);
            const py = cubicBezier(t, 500, 500, 300, 600);
            return { x: px, y: py };
        }
        if (lobe === "Deep") {
            // M 500 470 C 500 350, 300 100, 500 100
            const px = cubicBezier(t, 500, 500, 300, 500);
            const py = cubicBezier(t, 470, 350, 100, 100);
            return { x: px, y: py };
        }
        return { x: 500, y: 500 };
    };

    return (
        <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-[#EDE9E4] rounded-3xl overflow-hidden border border-neutral-200 shadow-2xl text-neutral-900">
            {/* Paper Texture Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50" />

            <svg viewBox="0 0 1000 800" className="w-full h-full relative z-10">
                <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                        <feOffset dx="2" dy="2" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.2" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode in="offsetblur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* --- RIBBONS --- */}
                {/* Drawn manually to match reference thickness */}

                {/* Right Ribbon (Personality) */}
                <path
                    d={mainPath}
                    stroke={lobeColors["Main"]}
                    strokeWidth="80"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#shadow)"
                    opacity="0.9"
                />

                {/* Left Ribbon (Skills) */}
                <path
                    d={transPath}
                    stroke={lobeColors["Transition"]}
                    strokeWidth="80"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#shadow)"
                    opacity="0.9"
                />

                {/* Top Ribbon (Values) */}
                <path
                    d={deepPath}
                    stroke={lobeColors["Deep"]}
                    strokeWidth="80"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#shadow)"
                    opacity="0.9"
                />

                {/* Center Core */}
                <circle cx="500" cy="500" r="60" fill="white" filter="url(#shadow)" />


                {/* --- NODES --- */}
                {/* Calculate positions along the Bezier curves */}

                {mainTraits.map((t, i) => {
                    const progress = 0.1 + (i / mainTraits.length) * 0.8; // Avoid ends
                    const pos = getPosOnPath("Main", progress);
                    return <Node key={t.name} x={pos.x} y={pos.y} trait={t} setHover={setHoveredTrait} darkText />;
                })}

                {transTraits.map((t, i) => {
                    const progress = 0.1 + (i / transTraits.length) * 0.8;
                    const pos = getPosOnPath("Transition", progress);
                    return <Node key={t.name} x={pos.x} y={pos.y} trait={t} setHover={setHoveredTrait} darkText />;
                })}

                {deepTraits.map((t, i) => {
                    const progress = 0.1 + (i / deepTraits.length) * 0.8;
                    const pos = getPosOnPath("Deep", progress);
                    return <Node key={t.name} x={pos.x} y={pos.y} trait={t} setHover={setHoveredTrait} darkText />;
                })}

                {/* Anchor Node */}
                {anchorTrait && (
                    <g transform="translate(500, 500)" className="cursor-pointer">
                        <text y="5" textAnchor="middle" fill="#333" fontWeight="900" fontSize="16" style={{ textTransform: 'uppercase' }}>
                            {anchorTrait.name.substring(0, 2)}
                        </text>
                        <text y="20" textAnchor="middle" fill="#666" fontSize="10">{anchorTrait.name}</text>
                    </g>
                )}

            </svg>

            {/* Hover HUD (Light Mode for Authentic Feel) */}
            <AnimatePresence>
                {hoveredTrait && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-4 right-4 bg-white/95 backdrop-blur border border-neutral-300 p-4 rounded-lg shadow-xl z-20 min-w-[240px]"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold uppercase text-neutral-500">{hoveredTrait.lobe} SERIES</span>
                            <span className="text-xs font-mono text-neutral-400">Ar: {hoveredTrait.rank}</span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-neutral-900">{hoveredTrait.name}</h3>
                        <div className="mt-2 h-1 w-full bg-neutral-200 rounded-full">
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${Math.max(10, 100 - hoveredTrait.rank)}%`, backgroundColor: lobeColors[hoveredTrait.lobe] }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const Node = ({ x, y, trait, setHover, darkText }: { x: number, y: number, trait: HydeTrait, setHover: any, darkText?: boolean }) => (
    <g
        transform={`translate(${x}, ${y})`}
        onMouseEnter={() => setHover(trait)}
        onMouseLeave={() => setHover(null)}
        className="cursor-pointer group"
    >
        <circle
            r={5}
            fill="white"
            stroke="rgba(0,0,0,0.1)"
            className="group-hover:scale-150 transition-transform"
        />
        {trait.rank < 30 && (
            <text
                y="-10"
                textAnchor="middle"
                fill={darkText ? "#000" : "#fff"}
                fontSize="10"
                fontWeight="bold"
                className="pointer-events-none opacity-50 group-hover:opacity-100"
            >
                {trait.name}
            </text>
        )}
    </g>
);
