import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface PhaseDonutProps {
    data: { phase: string; value: number }[]; // Array format
    width?: number;
    height?: number;
}

export default function PhaseDonutD3({ data, width = 180, height = 180 }: PhaseDonutProps) {
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6; // Donut thickness

    // Define colors for specific phases
    const colorMap: Record<string, string> = {
        Strategy: '#3b82f6',   // Blue
        Design: '#f59e0b',     // Amber
        Engineering: '#10b981',// Emerald
        Production: '#ef4444'  // Red
    };

    // Data is already an array now
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(d => ({ name: d.phase, value: d.value }));
    }, [data]);

    const pie = useMemo(() => {
        return d3.pie<{ name: string; value: number }>()
            .value(d => d.value)
            .sort(null); // Keep order provided? Or sort? null keeps input order.
    }, []);

    const arcs = useMemo(() => pie(chartData), [pie, chartData]);

    const arcGenerator = d3.arc<any>()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .cornerRadius(2); // Rounded edges for slick look

    if (chartData.length === 0) return (
        <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-600 font-mono">
            NO DATA
        </div>
    );

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible group">
            <g transform={`translate(${width / 2}, ${height / 2})`}>
                {arcs.map((arc, i) => (
                    <g key={i} className="transition-opacity duration-300 hover:opacity-80">
                        {/* Slice */}
                        <path
                            d={arcGenerator(arc) || ""}
                            fill={colorMap[arc.data.name] || '#737373'}
                            stroke="#0a0a0a" // Gap color matched to background
                            strokeWidth="2"
                        />
                        {/* Label (Only if large enough) */}
                        {(arc.endAngle - arc.startAngle > 0.3) && (
                            <text
                                transform={`translate(${arcGenerator.centroid(arc)})`}
                                textAnchor="middle"
                                dy="0.35em"
                                fontSize="8"
                                fill="white"
                                fontWeight="bold"
                                pointerEvents="none"
                            >
                                {Math.round(arc.data.value)}%
                            </text>
                        )}
                    </g>
                ))}

                {/* Center Label */}
                <text textAnchor="middle" dy="-0.5em" fontSize="10" fill="#737373" className="font-mono uppercase">
                    PHASE
                </text>
                <text textAnchor="middle" dy="1em" fontSize="12" fill="white" className="font-mono font-bold">
                    ALLOC
                </text>
            </g>
        </svg>
    );
}
