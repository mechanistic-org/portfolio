import  { useMemo } from 'react';
import * as d3 from 'd3';

interface SkillPoint {
    name: string;
    value: number; // 0-10 or 0-100
    fullMark?: number;
}

interface SkillRadarProps {
    data: SkillPoint[];
    width?: number;
    height?: number;
}

export default function SkillRadarD3({ data, width = 180, height = 180 }: SkillRadarProps) {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right);

    // Process Data
    const features = useMemo(() => {
        if (!data || data.length < 3) return null;
        return data.slice(0, 6); // Limit to 6 axes for cleanliness
    }, [data]);

    if (!features) return (
        <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-600 font-mono">
            NOT_ENOUGH_DATA
        </div>
    );

    // Scales
    const radialScale = d3.scaleLinear()
        .domain([0, 10]) // Assuming skill values are 0-10 based on earlier observation, or normalize
        .range([0, radius]);

    const ticks = [2, 4, 6, 8, 10];

    // Point Generator
    const angleSlice = (Math.PI * 2) / features.length;

    // Generate Polygon Path
    const pathRef = useMemo(() => {
        const lineGenerator = d3.lineRadial<SkillPoint>()
            .angle((d, i) => i * angleSlice)
            .radius(d => radialScale(Math.min(d.value, 10)))
            .curve(d3.curveLinearClosed);

        return lineGenerator(features) || "";
    }, [features, radialScale, angleSlice]);

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <g transform={`translate(${width / 2}, ${height / 2})`}>

                {/* Grid Lines (Web) */}
                {ticks.map(t => (
                    <circle
                        key={t}
                        r={radialScale(t)}
                        fill="none"
                        stroke="#262626"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                    />
                ))}

                {/* Axes */}
                {features.map((f, i) => {
                    const angle = i * angleSlice - Math.PI / 2; // Adjust for regular cartesian start
                    const x = Math.cos(angle) * (radius + 10);
                    const y = Math.sin(angle) * (radius + 10);

                    const lineX = Math.cos(angle) * radius;
                    const lineY = Math.sin(angle) * radius;

                    return (
                        <g key={i}>
                            <line x1={0} y1={0} x2={lineX} y2={lineY} stroke="#262626" strokeWidth="1" />
                            <text
                                x={x}
                                y={y}
                                dy="0.35em"
                                textAnchor={x > 0 ? "start" : x < 0 ? "end" : "middle"}
                                fontSize="8"
                                fill="#737373"
                                fontFamily="monospace"
                                className="uppercase"
                            >
                                {f.name}
                            </text>
                        </g>
                    );
                })}

                {/* Radar Shape */}
                <path
                    d={pathRef}
                    fill="rgba(46, 92, 255, 0.2)" // brand-primary blue with opacity
                    stroke="#2E5CFF"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(46,92,255,0.3)]"
                />
            </g>
        </svg>
    );
}
