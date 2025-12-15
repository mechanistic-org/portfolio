import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import SkillRadarD3 from './SkillRadarD3';
import PhaseDonutD3 from './PhaseDonutD3';
import ImpactResonance from './ImpactResonance';

interface OuroborosHUDProps {
    data: any;
    width?: number;
    height?: number;
}

export default function OuroborosHUD({ data, width = 300, height = 300 }: OuroborosHUDProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    // Animation State
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(r => (r + 0.2) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    return (
        <div className="relative flex items-center justify-center p-4">

            {/* 1. LAYER 0: BACKGROUND RING (DECORATIVE) */}
            <svg
                width={width}
                height={height}
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#2E5CFF" strokeWidth="2" strokeDasharray="4 4" className="drop-shadow-[0_0_4px_rgba(46,92,255,0.5)]" />
                <circle cx={cx} cy={cy} r={radius - 10} fill="none" stroke="#2E5CFF" strokeWidth="1" className="drop-shadow-[0_0_2px_rgba(46,92,255,0.3)]" />
            </svg>

            {/* 2. LAYER 1: OUTER RING (PHASE DONUT) */}
            {/* We position the PhaseDonut slightly smaller than full width */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none scale-110 opacity-80 mix-blend-screen">
                {data.phases && (
                    <div style={{ width: width * 0.9, height: height * 0.9 }}>
                        <PhaseDonutD3 data={data.phases} width={width * 0.9} height={height * 0.9} />
                    </div>
                )}
            </div>

            {/* 3. LAYER 2: CORE (SKILL RADAR) */}
            <div className="relative z-20 bg-black/50 backdrop-blur-sm rounded-full overflow-hidden shadow-[0_0_30px_rgba(46,92,255,0.2)] border border-white/10">
                {data.skillData ? (
                    <div style={{ width: width * 0.6, height: height * 0.6 }}>
                        <SkillRadarD3 data={data.skillData} width={width * 0.6} height={height * 0.6} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-[10px] text-neutral-500 font-mono" style={{ width: width * 0.6, height: height * 0.6 }}>
                        NO_DATA
                    </div>
                )}
            </div>

            {/* 4. LAYER 3: SATELLITE (IMPACT) */}
            <div className="absolute bottom-0 right-0 z-30 transform translate-x-2 translate-y-2">
                <div className="w-24 h-24 bg-black border border-white/10 rounded-full shadow-xl">
                    <ImpactResonance value={75} width={96} height={96} label="VELOCITY" />
                </div>
            </div>

            {/* DECORATIVE HUD TEXT */}
            <div className="absolute top-2 left-2 font-mono text-[10px] text-[#2E5CFF] opacity-50">
                SYS.MONITOR // V.2.1
            </div>

        </div>
    );
}
