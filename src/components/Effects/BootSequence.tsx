import React, { useState, useEffect, useRef } from 'react';

const BootSequence: React.FC = () => {
    const [lines, setLines] = useState<string[]>([]);
    const [phase, setPhase] = useState<'check' | 'rain' | 'boot' | 'exit' | 'complete'>('check');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const phaseRef = useRef(phase);

    useEffect(() => {
        phaseRef.current = phase;
    }, [phase]);

    // Session Check
    useEffect(() => {
        // Check if we've already booted this session
        const hasBooted = sessionStorage.getItem('quantum_booted');
        if (hasBooted) {
            setPhase('complete');
        } else {
            setPhase('rain');
            sessionStorage.setItem('quantum_booted', 'true');
            // Remove the FOUC curtain now that we are ready to render
            document.documentElement.classList.remove('booting');
        }
    }, []);

    // Matrix Rain Effect
    useEffect(() => {
        if (phase === 'check' || phase === 'complete') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charArray = chars.split('');
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        let animationId: number;

        const draw = () => {
            if (phaseRef.current === 'complete') return;

            // Trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationId = requestAnimationFrame(draw);
        };

        draw();

        // Transition to boot phase
        if (phase === 'rain') {
            const timer = setTimeout(() => {
                setPhase('boot');
            }, 1000); // Reduced from 2000ms to 1000ms
            return () => {
                clearTimeout(timer);
                cancelAnimationFrame(animationId);
                window.removeEventListener('resize', resize);
            };
        }

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [phase]);

    // Text Boot Sequence
    useEffect(() => {
        if (phase !== 'boot') return;

        const sequence = [
            "> INITIALIZING QUANTUM CORE...",
            "> ESTABLISHING NEURAL LINK...",
            "> DECRYPTING SECURE ARCHIVES...",
            "> OPTIMIZING REALITY ENGINE...",
            "> SYSTEM READY."
        ];

        let lineIndex = 0;

        const interval = setInterval(() => {
            if (lineIndex >= sequence.length) {
                clearInterval(interval);
                setTimeout(() => setPhase('exit'), 1000);
                return;
            }

            setLines(prev => [...prev, sequence[lineIndex]]);
            lineIndex++;
        }, 600);

        return () => clearInterval(interval);
    }, [phase]);

    // Exit Handler
    useEffect(() => {
        if (phase === 'exit') {
            const timer = setTimeout(() => {
                setPhase('complete');
            }, 1000); // Match CSS transition duration
            return () => clearTimeout(timer);
        }
    }, [phase]);

    if (phase === 'check' || phase === 'complete') return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black font-mono transition-all duration-1000 ${phase === 'exit' ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'
                }`}
        >
            {/* Matrix Rain Canvas */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 z-0 transition-opacity duration-1000 ${phase === 'rain' ? 'opacity-100' : 'opacity-20'
                    }`}
            />

            {/* Aurora Edge Effect */}
            <div
                className="absolute inset-0 z-10 pointer-events-none opacity-50 animate-pulse-slow"
                style={{
                    background: 'radial-gradient(circle at center, transparent 60%, rgba(16, 185, 129, 0.2) 80%, rgba(139, 92, 246, 0.2) 100%)',
                    boxShadow: 'inset 0 0 100px rgba(16, 185, 129, 0.3)'
                }}
            />

            {/* Boot Text Overlay */}
            <div className="relative z-20 flex flex-col items-start justify-center space-y-2 p-4">
                {lines.map((line, i) => (
                    <div
                        key={i}
                        className="text-lg md:text-2xl text-green-500 font-bold animate-pulse-fast drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]"
                    >
                        {line}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BootSequence;
