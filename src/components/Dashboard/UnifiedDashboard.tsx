import React, { useState } from 'react';
import SkillRadarD3 from '../DataViz/SkillRadarD3';
import PhaseDonutD3 from '../DataViz/PhaseDonutD3';
import ImpactResonance from '../DataViz/ImpactResonance';
// import { Area, AreaChart, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'; // Removed
import MultiverseGraph from '../DataViz/MultiverseGraph';


// Types
export type DashboardVariant = 'mini' | 'medium' | 'mega';

export interface DashboardData {
    skillData?: any;
    phases?: { phase: string; value: number }[];
    title?: string;
    // Data God Extensions
    history?: any[];
    specs?: any[];
    multiverseData?: any; // Added for Graph
    globalStats?: {
        totalParts: number;
        totalProjects: number;
        activeProjects: number;
        totalYears: number;
    };
    [key: string]: any;
}

interface UnifiedDashboardProps {
    variant?: DashboardVariant;
    data: DashboardData;
    projectId?: string; // For linking
    className?: string;
}

export default function UnifiedDashboard({
    variant = 'mini',
    data,
    projectId,
    className = ''
}: UnifiedDashboardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // --- MINI VIEW (Project Detail) ---
    // Compact, non-interactive (or minimal interaction), designed to sit in the grid
    if (variant === 'mini') {
        return (
            <div
                className={`relative group ${className}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Visual Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 transition-colors">

                    {/* Gauge 1: Skill Fingerprint */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                            Skill Fingerprint
                        </div>
                        <div className="w-full h-[180px] pointer-events-none">
                            {data.skillData ? (
                                <SkillRadarD3 data={data.skillData} />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center dashed-border opacity-50 text-[10px]">NO_DATA</div>
                            )}
                        </div>
                    </div>

                    {/* Gauge 2: Phase Breakdown */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                            Phase Breakdown
                        </div>
                        <div className="w-full h-[180px] pointer-events-none">
                            {data.phases ? (
                                <PhaseDonutD3 data={data.phases} />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center dashed-border opacity-50 text-[10px]">NO_DATA</div>
                            )}
                        </div>
                    </div>

                    {/* Gauge 3: System Velocity (Impact Resonance) */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                            System Velocity
                        </div>
                        <div className="w-full h-[180px] pointer-events-none">
                            <ImpactResonance value={75} label="HIGH_VELOCITY" />
                        </div>
                    </div>
                </div>

                {/* Medium View Overlay (The "Expand" Interaction) */}
                <div
                    className={`absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm rounded-xl transition-all duration-300 ${isHovered ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
                >
                    <a
                        href="/resume/dashboard"
                        className="px-6 py-3 font-mono text-sm font-bold text-black bg-primary rounded-full hover:bg-white transition-colors flex items-center gap-2 transform hover:scale-105 active:scale-95"
                    >
                        <span>VIEW COCKPIT</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        );
    }

    // --- MEGA VIEW (Resume Page) ---
    // The "Kitchen Sink" - Full interactivity, all charts, layout freedom
    if (variant === 'mega') {
        const { history = [], specs = [], globalStats } = data;

        return (
            <div className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-8 ${className}`}>

                {/* 0. Metric Rectifier (Global Counters) */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                        { label: 'TOTAL PARTS', value: globalStats?.totalParts || 0, unit: 'QTY' },
                        { label: 'PROJECTS', value: globalStats?.totalProjects || 0, unit: 'UNIT' },
                        { label: 'ACTIVE STREAMS', value: globalStats?.activeProjects || 0, unit: 'ACT' },
                        { label: 'TOTAL TIME', value: globalStats?.totalYears || 0, unit: 'YRS' },
                    ].map((stat, i) => (
                        <div key={i} className="border border-neutral-800 bg-neutral-950/50 p-4 rounded-sm flex flex-col justify-between group hover:border-primary/50 transition-colors">
                            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">{stat.label}</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white font-mono group-hover:text-primary transition-colors">{stat.value}</span>
                                <span className="text-[10px] text-neutral-600 font-mono">{stat.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 1. The Skill Streamgraph (Main Feature) */}
                {/* Consumes 8 cols */}
                <div className="lg:col-span-8 group relative overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950">
                    <div className="absolute top-0 left-0 h-1 w-full bg-primary/50"></div>
                    <div className="relative z-10 flex h-full flex-col p-8 bg-[url('/assets/grid-pattern.svg')] bg-cover">
                        <div className="mb-6 flex items-center justify-between border-b border-neutral-800 pb-4">
                            <h3 className="font-header text-xl font-bold text-white tracking-widest">
                                <span className="text-primary mr-2">///</span> GLOBAL SKILL ARCHITECTURE
                            </h3>
                            <div className="flex gap-4 font-mono text-[10px] text-primary">
                                <span className="animate-pulse">LIVE_STREAM</span>
                                <span className="text-neutral-500">v.5.0.0</span>
                            </div>
                        </div>

                        {/* Viz Area (Real Streamgraph) */}
                        <div className="flex-1 rounded border border-dashed border-neutral-800 bg-neutral-900/30 p-1 relative min-h-[300px] flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-neutral-500 font-mono text-sm mb-2">STREAMGRAPH OFFLINE</div>
                                <div className="text-neutral-700 text-xs">[ MIGRATING TO D3 PHYSICS ENGINE ]</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Key Performance Indicators (Right Col) */}
                {/* Consumes 4 cols */}
                {/* 2. Key Performance Indicators (Right Col) */}
                {/* Consumes 4 cols */}
                <div className="lg:col-span-4 space-y-6">
                    {/* KPI 1: Phase Allocation */}
                    <div className="relative overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950 p-6">
                        <h3 className="mb-4 text-xs font-bold text-neutral-500 font-mono uppercase tracking-widest border-b border-neutral-800 pb-2">
                            System Phase Distribution
                        </h3>
                        {data.phases && data.phases.map((item: any) => (
                            <div key={item.phase} className="mb-3 last:mb-0">
                                <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1">
                                    <span className="uppercase">{item.phase}</span>
                                    <span>{item.value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary/80"
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {!data.phases && <div className="text-xs font-mono text-neutral-600">NO PHASE DATA</div>}
                    </div>

                    {/* KPI 2: Core Capabilities (Real Data) */}
                    <div className="rounded-sm border border-neutral-800 bg-neutral-950 p-6">
                        <h3 className="mb-4 text-xs font-bold text-neutral-500 font-mono uppercase tracking-widest border-b border-neutral-800 pb-2">
                            Core Capabilities
                        </h3>
                        <div className="space-y-4">
                            {/* Sort by value descending and take top 5 */}
                            {data.skillData && data.skillData
                                .sort((a: any, b: any) => b.value - a.value)
                                .slice(0, 5)
                                .map((skill: any, i: number) => (
                                    <div key={skill.name} className="group cursor-default">
                                        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider">
                                            <span className="text-neutral-400 font-mono group-hover:text-white transition-colors truncate max-w-[150px]">{skill.name}</span>
                                            <span className="font-mono text-primary">{skill.value.toFixed(1)}</span>
                                        </div>
                                        <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-900">
                                            <div
                                                className="h-full bg-neutral-700 group-hover:bg-primary transition-all duration-500 ease-out"
                                                style={{ width: `${Math.min(skill.value * 10, 100)}%` }} // Assuming skill value is 0-10 or 0-100? Data shows ~10. So *10.
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* 3. The Multiverse (Full Width) */}
                {/* Reuse existing Multiverse, maybe wrap it */}
                {/* 3. The Multiverse (Full Width) */}
                {/* Reuse existing Multiverse, maybe wrap it */}
                <div className="lg:col-span-12 relative overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950 p-1" style={{ height: '600px' }}>
                    <div className="absolute top-0 right-0 h-4 w-4 border-t border-r border-primary z-10"></div>
                    <div className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-primary z-10"></div>

                    <div className="absolute top-4 left-4 z-10 flex items-center justify-between w-full pr-8">
                        <h3 className="font-mono text-xs text-neutral-500 uppercase tracking-widest bg-neutral-950/80 px-2">
                            Multiverse Linkage
                        </h3>
                        <div className="flex gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-[ping_2s_linear_infinite]"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        </div>
                    </div>

                    {/* Multiverse Graph Integration */}
                    {data.multiverseData ? (
                        <div className="w-full h-full">
                            <MultiverseGraph data={data.multiverseData} />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono">
                            // MULTIVERSE OFFLINE
                        </div>
                    )}
                </div>


                {/* 4. Tenure Timeline (Gantt) */}
                <div className="lg:col-span-12 rounded-sm border border-neutral-800 bg-neutral-950 p-6 overflow-x-auto">
                    <h3 className="mb-6 text-xs font-bold text-neutral-500 font-mono uppercase tracking-widest border-b border-neutral-800 pb-2 flex justify-between">
                        <span>Tenure Timeline</span>
                        <span>[ 1993 - PRESENT ]</span>
                    </h3>
                    <div className="relative h-24 w-full min-w-[800px] flex items-center">
                        {/* Time Axis (Simplified) */}
                        <div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-800"></div>
                        <div className="absolute top-0 bottom-0 right-0 w-px bg-neutral-800"></div>

                        {/* Bars */}
                        <div className="flex w-full h-12 gap-0.5">
                            {history.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((job, i) => {
                                return (
                                    <div key={i} className="h-full relative group flex-1 bg-neutral-900 border-r border-neutral-950 hover:bg-neutral-800 transition-colors cursor-help">
                                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-20 bg-neutral-900 border border-neutral-700 p-2 text-xs w-48 shadow-xl">
                                            <div className="font-bold text-white mb-0.5">{job.company}</div>
                                            <div className="text-primary">{job.title}</div>
                                            <div className="text-neutral-500 text-[10px] mt-1">{job.start} - {job.end}</div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: job.color }}></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* 5. Spec Ticker (Footer) */}
                <div className="lg:col-span-12 h-10 overflow-hidden bg-neutral-950 border-t border-b border-neutral-800 flex items-center relative">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent z-10"></div>
                    <div className="animate-scroll whitespace-nowrap flex gap-8 items-center px-4">
                        {specs.concat(specs).map((spec, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                                <span className="text-neutral-700 uppercase">[{spec.category}]</span>
                                <span className="text-neutral-400">{spec.parameter}:</span>
                                <span className="text-primary">{spec.typical}</span>
                                {spec.unit !== '-' && <span className="text-neutral-600">{spec.unit}</span>}
                                <span className="mx-2 text-neutral-800">///</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        );
    }

    return null;
}
