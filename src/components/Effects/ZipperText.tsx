import  { useRef, useEffect } from 'react';

interface Props {
    lines: string[];
    className?: string;
    lineClassName?: string;
}

// INJECTED CSS FOR MACHINE GUN ANIMATION
// "Boing... like a carnival hammer bell"
const styles = `
@keyframes hammer-slam {
    0% { transform: translateY(150%) scale(0.2); opacity: 0; }
    70% { transform: translateY(-10%) scale(1.1); opacity: 1; }
    100% { transform: translateY(0) scale(1.0); opacity: 1; }
}

/* 
   We want them to appear efficiently.
   Since layout is 'justify-end', elements are naturally at the bottom?
   Actually, flex-col means they stack downwards.
   We want the FIRST word to hit the bottom? Or the Chart?
   If Chart is above Text, Text stack pushes Chart up.
*/

.hammer-word {
    /* Hidden initially until animation starts */
    opacity: 0; 
    animation: hammer-slam 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
`;

export default function ZipperText({ lines, className = "", lineClassName = "" }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Inject styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        return () => { document.head.removeChild(styleSheet); };
    }, []);

    // TRIGGER logic: Simple delay loop
    useEffect(() => {
        if (!containerRef.current) return;

        const children = containerRef.current.children;
        // We trigger them fast.
        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            // Stagger: 40ms
            child.style.animationDelay = `${i * 0.04}s`;
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={`flex flex-col gap-0 ${className}`}
        >
            {/* Limit to ~10 words if the user provided too many? No, user wanted "enough words" */}
            {lines.map((line, i) => (
                <div
                    key={i}
                    className={`hammer-word ${lineClassName} ${i % 2 === 0 ? 'text-left origin-left' : 'text-right origin-right'} w-full tracking-tighter`}
                >
                    {line}
                </div>
            ))}
        </div>
    );
}
