import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ExplodedView() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax/Expansion values
    const yTop = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const yMid = useTransform(scrollYProgress, [0, 1], [0, 0]);
    const yBot = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const rotate = useTransform(scrollYProgress, [0.2, 0.8], [0, 15]);

    return (
        <div ref={containerRef} className="h-[200vh] relative flex items-center justify-center bg-neutral-900 overflow-hidden">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
                <h2 className="text-4xl font-bold text-white mb-4">High-Density Packaging</h2>
                <p className="text-neutral-400">Scroll to explode the assembly</p>
            </div>

            {/* Simulated PCB Layers */}
            <div className="relative w-[300px] h-[400px] perspective-[1000px]">
                <motion.div
                    style={{ y: yTop, rotateX: 60, rotateZ: rotate }}
                    className="absolute inset-0 bg-green-900/80 border-2 border-green-500 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center"
                >
                    <span className="text-green-300 font-mono">TOP PCB</span>
                </motion.div>

                <motion.div
                    style={{ y: yMid, rotateX: 60, rotateZ: rotate }}
                    className="absolute inset-0 bg-blue-900/80 border-2 border-blue-500 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center translate-z-[-50px]"
                >
                    <span className="text-blue-300 font-mono">CHASSIS</span>
                </motion.div>

                <motion.div
                    style={{ y: yBot, rotateX: 60, rotateZ: rotate }}
                    className="absolute inset-0 bg-green-900/80 border-2 border-green-500 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center translate-z-[-100px]"
                >
                    <span className="text-green-300 font-mono">BOT PCB</span>
                </motion.div>
            </div>
        </div>
    );
}
