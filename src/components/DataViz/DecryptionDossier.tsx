import React, { useState, useEffect, useRef } from 'react';

// --- SCRAMBLE HOOK ---
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
function useScramble(text: string, active: boolean, speed: number = 2) {
    const [display, setDisplay] = useState(text.replace(/./g, '█')); // Start fully redacted
    const [iteration, setIteration] = useState(0);

    useEffect(() => {
        if (!active) {
            setDisplay(text.replace(/[^\s]/g, '█')); // Reset to redacted if inactive
            setIteration(0);
            return;
        }

        const interval = setInterval(() => {
            setDisplay(prev => {
                if (iteration >= text.length) {
                    clearInterval(interval);
                    return text;
                }

                return text.split('').map((char, index) => {
                    if (index < iteration) return text[index]; // Reveal
                    return CHARS[Math.floor(Math.random() * CHARS.length)]; // Scramble remainder
                }).join('');
            });
            setIteration(prev => prev + speed / 3);
        }, 30);

        return () => clearInterval(interval);
    }, [active, text, iteration, speed]);

    return display;
}

// --- ITEM COMPONENT ---
const DossierItem = ({ label, value, delay }: { label: string; value: string; delay: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Simple intersection observer for "Is in View"
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setTimeout(() => setIsVisible(true), delay);
            }
        }, { threshold: 0.5 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    const scrambledLabel = useScramble(label, isVisible, 1);
    const scrambledValue = useScramble(value, isVisible, 2);

    return (
        <div ref={ref} className="border-l-2 border-green-900/50 pl-4 py-2 my-4 transition-colors hover:border-green-500 hover:bg-green-900/10 group">
            <div className="font-mono text-[10px] text-green-700 uppercase tracking-widest mb-1 group-hover:text-green-500">
                {scrambledLabel}
            </div>
            <div className={`font-mono text-sm md:text-lg text-neutral-400 group-hover:text-white transition-colors ${isVisible ? '' : 'blur-sm'}`}>
                {scrambledValue}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function DecryptionDossier() {
    // Mock Data for "The Brain" - ideally passed in via props
    const intel = [
        { label: "Current Status", value: "OPERATIONAL // CLASS 5" },
        { label: "Primary Function", value: "FULL STACK ARCHITECTURE" },
        { label: "Core Stack", value: "REACT // ASTRO // THREE.JS // TYPESCRIPT" },
        { label: "Recent Directive", value: "SYSTEM REFACTOR: COMPLETE" },
        { label: "Location", value: "SECTOR 7G (REMOTE)" },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto p-8 border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Decoration: Scanline */}
            <div className="absolute inset-0 pointer-events-none bg-[url('/assets/scanline.png')] opacity-10 mix-blend-overlay"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-end border-b border-white/20 pb-4 mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tighter">INTELLIGENCE_DOSSIER</h2>
                    <span className="text-xs font-mono text-green-500 animate-pulse">● LIVE FEED</span>
                </div>

                <div className="space-y-2">
                    {intel.map((item, i) => (
                        <DossierItem key={i} {...item} delay={i * 200} />
                    ))}
                </div>

                <div className="mt-12 flex gap-4 border-t border-white/10 pt-8">
                    <a href="/resume/pdf" className="flex-1 text-center bg-white text-black py-3 font-mono text-sm font-bold uppercase hover:bg-green-400 transition-colors">
                        Download Complete File
                    </a>
                </div>
            </div>
        </div>
    );
}
