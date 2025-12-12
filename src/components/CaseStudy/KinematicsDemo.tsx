import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function KinematicsDemo() {
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCycle(c => (c + 1) % 100);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    // Simple 4-bar linkage simulation
    const angle = Math.sin(cycle * 0.1) * 20;

    return (
        <div className="w-full h-96 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative">
            <div className="absolute top-4 left-4">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Suspension Kinematics</h3>
                <div className="text-xs font-mono text-neutral-500">Travel: 140mm</div>
            </div>

            <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg">
                {/* Frame Triangle */}
                <path d="M 100 200 L 250 200 L 150 100 Z" fill="none" stroke="currentColor" strokeWidth="4" className="text-neutral-300 dark:text-neutral-700" />

                {/* Swingarm (Moving) */}
                <motion.g
                    style={{ originX: "100px", originY: "200px" }}
                    animate={{ rotate: -angle }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <line x1="100" y1="200" x2="280" y2="200" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                    <circle cx="280" cy="200" r="10" fill="none" stroke="#EF4444" strokeWidth="2" />
                </motion.g>

                {/* Rocker Link */}
                <motion.g
                    style={{ originX: "200px", originY: "150px" }} // Pivot on seat tube
                    animate={{ rotate: angle * 1.5 }}
                >
                    <line x1="200" y1="150" x2="250" y2="120" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />
                </motion.g>

                {/* Shock */}
                <line x1="150" y1="180" x2="250" y2="120" stroke="#10B981" strokeWidth="8" strokeLinecap="round" opacity="0.5" />

            </svg>
        </div>
    );
}
