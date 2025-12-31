import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HyperCloud from '../Visualizations/HyperCloud';

interface Props {
    onComplete?: () => void;
}

const DISCIPLINES = [
    "ELECTRONICS", "FIRMWARE", "MECHANISMS", "THERMODYNAMICS",
    "MATERIALS", "SUPPLY CHAIN", "MANUFACTURING", "LOGISTICS", "COMPLIANCE", "COLLABORATION"
];

export default function DisciplineCycler({ onComplete }: Props) {
    const [phase, setPhase] = useState<'prefix' | 'scatter' | 'float' | 'implode' | 'done'>('prefix');

    useEffect(() => {
        // Sequence Timings
        // 1. Prefix: "Hardware is" fades in. (0s)
        // 2. Scatter: Words explode out. (1.5s)
        // 3. Float: Interactive Physic Drift. (2.0s - 5.5s)
        // 4. Implode: The Vacuum. (5.5s)
        // 5. Done: Trigger parent. (6.5s)

        // Start Scatter after prefix reads (1.5s)
        const t1 = setTimeout(() => setPhase('scatter'), 1500);

        // Transition to Float (Drift) quickly after scatter kick
        const t2 = setTimeout(() => setPhase('float'), 2200);

        // Start Implode SOONER (User: "quicker... no micro pause")
        // Was 6000, reducing to 4200s (Float time ~2s)
        const t3 = setTimeout(() => setPhase('implode'), 4200);

        // Fail-safe done trigger
        const t4 = setTimeout(() => {
            if (phase !== 'done') {
                setPhase('done');
                if (onComplete) onComplete();
            }
        }, 6000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center relative z-20 w-full h-full pointer-events-none">

            {/* Prefix */}
            <AnimatePresence>
                {phase !== 'done' && phase !== 'implode' && (
                    <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: -150 }} // Shifted UP EVEN MORE
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute z-30 pointer-events-none mix-blend-difference top-1/2 transform -translate-y-1/2"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                            Hard<span className="opacity-85">ware</span> is
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HyperCloud D3 Simulation */}
            <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
                <HyperCloud
                    words={DISCIPLINES}
                    phase={phase === 'prefix' ? 'idle' : phase as any}
                    // We ignore onComplete from HyperCloud to enforce strict timing from our orchestration
                    onComplete={() => { }}
                />
            </div>
        </div>
    );
}
