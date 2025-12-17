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
const DecryptionDossier: React.FC = () => {
    const [text, setText] = useState("");
    const [phase, setPhase] = useState(0);
    const [isOpen, setIsOpen] = useState(false); // Minimized by default per user request

    const fullText = `
        CURRENT STATUS
        OPERATIONAL // CLASS 5

        PRIMARY FUNCTION
        FULL STACK ARCHITECTURE

        CORE STACK
        REACT // ASTRO // THREE.JS // TYPESCRIPT

        RECENT DIRECTIVE
        SYSTEM REFACTOR: COMPLETE

        LOCATION
        SECTOR 7G (REMOTE)
    `;

    // Mock Data for "The Brain" - ideally passed in via props
    const intel = [
        { label: "Current Status", value: "OPERATIONAL // CLASS 5" },
        { label: "Primary Function", value: "FULL STACK ARCHITECTURE" },
        { label: "Core Stack", value: "REACT // ASTRO // THREE.JS // TYPESCRIPT" },
        { label: "Recent Directive", value: "SYSTEM REFACTOR: COMPLETE" },
        { label: "Location", value: "SECTOR 7G (REMOTE)" },
    ];

    return (
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-full max-w-md' : 'w-auto'}`}>
            <div
                className={`border border-white/20 bg-black/80 backdrop-blur-md p-4 shadow-2xl ${isOpen ? 'rounded-lg' : 'rounded-full cursor-pointer hover:border-green-500/50'}`}
                onClick={() => !isOpen && setIsOpen(true)}
            >
                {/* Header / Toggle */}
                <div className="flex items-center justify-between mb-2">
                    <h2 className={`font-bold text-white tracking-widest uppercase flex items-center gap-2 ${isOpen ? 'text-xl' : 'text-sm'}`}>
                        {isOpen ? "INTELLIGENCE_DOSSIER" : "DOSSIER // ACCESS"}
                        {!isOpen && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                    </h2>
                    {isOpen && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                            className="text-white/50 hover:text-white px-2 py-1 text-xs font-mono border border-transparent hover:border-white/20 rounded"
                        >
                            MINIMIZE [-]
                        </button>
                    )}
                </div>

                {/* Content (Only when open) */}
                {isOpen && (
                    <>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-green-500 font-mono tracking-[0.2em] uppercase">Live Feed</span>
                        </div>

                        <div className="space-y-6 min-h-[300px] border-t border-white/10 pt-4 font-mono text-sm leading-relaxed text-neutral-300">
                            {text.split('\n').map((line, i) => (
                                <div key={i} className="min-h-[1.5em]">
                                    {line.trim() === "" ? <br /> : (
                                        <div className={line.includes("//") ? "text-white font-bold" : "text-neutral-500 text-xs tracking-widest uppercase mb-1"}>
                                            {line}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-4 border-t border-white/10">
                            <button className="w-full py-3 bg-white text-black font-bold font-mono text-xs hover:bg-neutral-200 transition-colors tracking-widest uppercase">
                                Download Complete File
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DecryptionDossier;
