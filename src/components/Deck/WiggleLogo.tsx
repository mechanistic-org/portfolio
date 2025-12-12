import React from 'react';
import { motion } from 'framer-motion';

export default function WiggleLogo() {
    return (
        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            {/* The "Wiggle" Loop */}
            <motion.div
                animate={{
                    scale: [1, 1.02, 0.98, 1],
                    rotate: [0, 1, -1, 0],
                    filter: [
                        "drop-shadow(0 0 20px rgba(46,92,255,0.2))",
                        "drop-shadow(0 0 40px rgba(46,92,255,0.4))",
                        "drop-shadow(0 0 20px rgba(46,92,255,0.2))"
                    ]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-10"
            >
                <img
                    src="/assets/branding/EN_logo_white_1200.svg"
                    alt="Erik Norris Quantum Logo"
                    className="w-full h-full object-contain"
                />
            </motion.div>

            {/* Anisotropic Flares (Background) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#2E5CFF]/10 to-transparent blur-3xl opacity-50 rounded-full"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-500/10 to-transparent blur-3xl opacity-30 rounded-full scale-75"
            />
        </div>
    );
}
