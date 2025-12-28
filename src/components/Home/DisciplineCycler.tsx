import React, { useEffect, useState } from 'react';

const DISCIPLINES = [
    "HARDWARE", "ELECTRONICS", "FIRMWARE", "MECHANISMS", "THERMODYNAMICS",
    "MATERIALS", "SUPPLY CHAIN", "MANUFACTURING", "LOGISTICS", "COMPLIANCE", "COLLABORATION"
];

export default function DisciplineCycler() {
    const [text, setText] = useState("hard.");
    const [phase, setPhase] = useState<'hard' | 'morph' | 'cycling' | 'final'>('hard');
    const [showPrefix, setShowPrefix] = useState(true); // "Hardware is"

    // Scramble logic helper
    const scramble = (target: string, duration: number, callback?: () => void) => {
        let iteration = 0;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        const interval = setInterval(() => {
            setText(target.split("").map((letter, idx) => {
                if (idx < iteration) return target[idx];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));

            if (iteration >= target.length) {
                clearInterval(interval);
                if (callback) callback();
            }
            iteration += 1 / 2; // Speed
        }, 30);
        return interval;
    };

    useEffect(() => {
        // TIMELINE

        // 1. Start with "hard." (Pre-resolved or scrambling in?)
        // Let's assume it starts resolved or quickly resolves. 
        // User said: "from full size fully resolved hard."

        // 2. Wait 2s, then morph.
        const t1 = setTimeout(() => {
            setPhase('morph');
            setShowPrefix(false); // Hide "Hardware is"
            // Scramble to "HARDWARE"
            scramble("HARDWARE", 500, () => {
                setPhase('cycling');
            });
        }, 3000); // 3s delay reading "Hardware is hard."

        return () => clearTimeout(t1);
    }, []);

    useEffect(() => {
        if (phase === 'cycling') {
            // Slot Machine Effect
            let cycles = 0;
            const maxCycles = 20;
            const interval = setInterval(() => {
                const randomWord = DISCIPLINES[Math.floor(Math.random() * (DISCIPLINES.length - 1))]; // Exclude final momentarily
                setText(randomWord);
                cycles++;

                if (cycles > maxCycles) {
                    clearInterval(interval);
                    setPhase('final');
                    setText("COLLABORATION"); // Snap to final
                }
            }, 100); // Fast cycle
            return () => clearInterval(interval);
        }
    }, [phase]);

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Prefix: "Hardware is" - Fades out */}
            <h2
                className={`text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4 transition-opacity duration-1000 ${showPrefix ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
            >
                Hardware is
            </h2>

            {/* The Main Word */}
            <div className="text-[18vw] leading-[0.8] font-black tracking-tighter text-white mix-blend-overlay opacity-90 break-all transition-all duration-500">
                {text}
            </div>
        </div>
    );
}
