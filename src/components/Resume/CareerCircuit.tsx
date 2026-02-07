import  { useMemo } from 'react';

interface CareerCircuitProps {
    workHistory: any[];
}

export default function CareerCircuit({ workHistory }: CareerCircuitProps) {
    // Reverse to have oldest at bottom or left? Let's go Top-Down (Newest Top) or Bottom-Up?
    // Circuit boards usually have components. Let's treat each job as a "Chip".
    // We'll layout them in a zig-zag pattern.

    const chips = useMemo(() => {
        return workHistory.map((job, index) => ({
            ...job,
            id: `chip-${index}`,
            x: (index % 2 === 0) ? 200 : 600, // Zig-zag x
            y: 100 + (index * 250), // Spacing y
        }));
    }, [workHistory]);

    const height = chips.length * 250 + 200;

    return (
        <div className="w-full overflow-x-auto bg-[#0a192f] rounded-lg border border-[#1e293b] p-8 relative">
            <svg width="800" height={height} className="mx-auto">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                    </pattern>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
                    </marker>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Traces */}
                {chips.map((chip, i) => {
                    if (i === chips.length - 1) return null;
                    const next = chips[i + 1];
                    // Draw trace from current to next
                    // Simple path: Vertical down, then Horizontal, then Vertical
                    const midY = (chip.y + next.y) / 2;
                    return (
                        <path
                            key={`trace-${i}`}
                            d={`M ${chip.x + 100} ${chip.y + 80} 
                  L ${chip.x + 100} ${midY} 
                  L ${next.x + 100} ${midY} 
                  L ${next.x + 100} ${next.y}`}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-pulse-slow"
                            style={{ animationDelay: `${i * 0.5}s` }}
                        />
                    );
                })}

                {/* Components (Chips) */}
                {chips.map((chip, i) => (
                    <g key={chip.id} transform={`translate(${chip.x}, ${chip.y})`}>
                        {/* Chip Body */}
                        <rect x="0" y="0" width="200" height="120" rx="4" fill="#111827" stroke="#374151" strokeWidth="2" />

                        {/* Pins */}
                        {[...Array(8)].map((_, p) => (
                            <line key={`pin-l-${p}`} x1="-10" y1={15 + p * 12} x2="0" y2={15 + p * 12} stroke="#9ca3af" strokeWidth="2" />
                        ))}
                        {[...Array(8)].map((_, p) => (
                            <line key={`pin-r-${p}`} x1="200" y1={15 + p * 12} x2="210" y2={15 + p * 12} stroke="#9ca3af" strokeWidth="2" />
                        ))}

                        {/* Text */}
                        <text x="20" y="30" fill="#10b981" fontFamily="monospace" fontSize="14" fontWeight="bold">{chip.company}</text>
                        <text x="20" y="50" fill="#e5e7eb" fontFamily="sans-serif" fontSize="12">{chip.title}</text>
                        <text x="20" y="70" fill="#9ca3af" fontFamily="monospace" fontSize="10">{chip.start} - {chip.end}</text>

                        {/* Status LED */}
                        <circle cx="180" cy="20" r="4" fill={i === 0 ? "#ef4444" : "#10b981"} className={i === 0 ? "animate-ping" : ""} />
                    </g>
                ))}

            </svg>
        </div>
    );
}
