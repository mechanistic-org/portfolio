
import React, { useState } from 'react';
import type { PeriodicElement as ElementType } from '../../config/periodicTableData';

interface Props {
    elements: ElementType[];
    title?: string;
}

const PeriodicElement = ({ element, onHover }: { element: ElementType; onHover: (e: ElementType) => void }) => {
    const categoryColors: Record<string, string> = {
        Thinking: "bg-blue-500/20 border-blue-500 text-blue-300",
        Feeling: "bg-purple-500/20 border-purple-500 text-purple-300",
        Doing: "bg-green-500/20 border-green-500 text-green-300",
        Software: "bg-cyan-500/20 border-cyan-500 text-cyan-300",
        Hardware: "bg-orange-500/20 border-orange-500 text-orange-300",
        Management: "bg-red-500/20 border-red-500 text-red-300",
        Unknown: "bg-neutral-500/20 border-neutral-500 text-neutral-300",
    };

    const styleClass = categoryColors[element.category] || categoryColors.Unknown;

    return (
        <div
            className={`relative aspect-square p-2 border hover:border-white transition-all duration-300 hover:scale-110 hover:z-10 bg-neutral-900/80 backdrop-blur-sm cursor-pointer group flex flex-col justify-between ${styleClass}`}
            onMouseEnter={() => onHover(element)}
        >
            <div className="flex justify-between items-start text-[0.6rem] font-mono opacity-70">
                <span>{element.number}</span>
                <span>{element.atomicMass}</span>
            </div>
            <div className="flex flex-col items-center justify-center flex-grow">
                <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter">{element.symbol}</span>
            </div>
            <div className="text-[0.55rem] md:text-[0.65rem] text-center font-medium opacity-90 truncate w-full">
                {element.name}
            </div>
        </div>
    );
};

export default function PeriodicTable({ elements, title = "Periodic Table" }: Props) {
    const [activeElement, setActiveElement] = useState<ElementType | null>(null);

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <h2 className="text-3xl font-bold text-white font-heading">{title}</h2>
                {activeElement && (
                    <div className="text-right animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-2xl font-bold text-primary-400">{activeElement.name}</div>
                        <div className="text-sm text-neutral-400 font-mono">
                            {activeElement.category} • #{activeElement.number} • Mass: {activeElement.atomicMass}
                        </div>
                    </div>
                )}
            </div>

            {/* Grid Layout mimicking Periodic Table Structure (18 columns) */}
            {/* We blindly map for now, but in a 'real' PT we'd need specific grid-column/row assignments */}
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 lg:grid-cols-18 gap-2 p-4 bg-neutral-900/50 rounded-xl border border-white/5 shadow-inner">
                {elements.map((el) => (
                    <PeriodicElement key={el.number} element={el} onHover={setActiveElement} />
                ))}
            </div>

            <div className="flex gap-4 justify-center text-xs font-mono text-neutral-500">
                {["Thinking", "Feeling", "Doing", "Software", "Hardware", "Management"].map(cat => (
                    <div key={cat} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${cat === "Thinking" ? "bg-blue-500" :
                                cat === "Feeling" ? "bg-purple-500" :
                                    cat === "Doing" ? "bg-green-500" :
                                        cat === "Software" ? "bg-cyan-500" :
                                            cat === "Hardware" ? "bg-orange-500" : "bg-red-500"
                            }`} />
                        <span>{cat}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
