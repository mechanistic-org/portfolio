import  { useState } from "react";
import SkillRadarD3 from "../DataViz/SkillRadarD3";
import PhaseDonutD3 from "../DataViz/PhaseDonutD3";
import ImpactResonance from "../DataViz/ImpactResonance";
// import { Area, AreaChart, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'; // Removed
import Assembly from "../DataViz/Assembly";

// Types
export type DashboardVariant = "mini" | "medium" | "mega";

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
	variant = "mini",
	data,
	projectId,
	className = "",
}: UnifiedDashboardProps) {
	const [isHovered, setIsHovered] = useState(false);

	// --- MINI VIEW (Project Detail) ---
	// Compact, non-interactive (or minimal interaction), designed to sit in the grid
	if (variant === "mini") {
		return (
			<div
				className={`group relative ${className}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Visual Container */}
				<div className="grid grid-cols-1 gap-6 p-4 transition-colors md:grid-cols-3">
					{/* Gauge 1: Skill Fingerprint */}
					<div className="flex flex-col items-center justify-center">
						<div className="mb-2 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
							Skill Fingerprint
						</div>
						<div className="pointer-events-none h-[180px] w-full">
							{data.skillData ? (
								<SkillRadarD3 data={data.skillData} />
							) : (
								<div className="dashed-border flex h-full w-full items-center justify-center text-[10px] opacity-50">
									NO_DATA
								</div>
							)}
						</div>
					</div>

					{/* Gauge 2: Phase Breakdown */}
					<div className="flex flex-col items-center justify-center">
						<div className="mb-2 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
							Phase Breakdown
						</div>
						<div className="pointer-events-none h-[180px] w-full">
							{data.phases ? (
								<PhaseDonutD3 data={data.phases} />
							) : (
								<div className="dashed-border flex h-full w-full items-center justify-center text-[10px] opacity-50">
									NO_DATA
								</div>
							)}
						</div>
					</div>

					{/* Gauge 3: System Velocity (Impact Resonance) */}
					<div className="flex flex-col items-center justify-center">
						<div className="mb-2 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
							System Velocity
						</div>
						<div className="pointer-events-none h-[180px] w-full">
							<ImpactResonance value={75} label="HIGH_VELOCITY" />
						</div>
					</div>
				</div>

				{/* Medium View Overlay (The "Expand" Interaction) */}
				<div
					className={`absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-neutral-950/80 backdrop-blur-sm transition-all duration-300 ${isHovered ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"}`}
				>
					<a
						href="/resume/dashboard"
						className="bg-primary flex transform items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-bold text-black transition-colors hover:scale-105 hover:bg-white active:scale-95"
					>
						<span>VIEW COCKPIT</span>
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</a>
				</div>
			</div>
		);
	}

	// --- MEGA VIEW (Resume Page) ---
	// The "Kitchen Sink" - Full interactivity, all charts, layout freedom
	if (variant === "mega") {
		const { history = [], specs = [], globalStats } = data;

		return (
			<div className={`grid w-full grid-cols-1 gap-8 lg:grid-cols-12 ${className}`}>
				{/* 0. Metric Rectifier (Global Counters) */}
				<div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:col-span-12">
					{[
						{ label: "TOTAL PARTS", value: globalStats?.totalParts || 0, unit: "QTY" },
						{ label: "PROJECTS", value: globalStats?.totalProjects || 0, unit: "UNIT" },
						{ label: "ACTIVE STREAMS", value: globalStats?.activeProjects || 0, unit: "ACT" },
						{ label: "TOTAL TIME", value: globalStats?.totalYears || 0, unit: "YRS" },
					].map((stat, i) => (
						<div
							key={i}
							className="group hover:border-primary/50 flex flex-col justify-between rounded-sm border border-neutral-800 bg-neutral-950/50 p-4 transition-colors"
						>
							<div className="mb-2 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
								{stat.label}
							</div>
							<div className="flex items-baseline gap-2">
								<span className="group-hover:text-primary font-mono text-2xl font-bold text-white transition-colors">
									{stat.value}
								</span>
								<span className="font-mono text-[10px] text-neutral-600">{stat.unit}</span>
							</div>
						</div>
					))}
				</div>

				{/* 1. The Skill Streamgraph (Main Feature) */}
				{/* Consumes 8 cols */}
				<div className="group relative overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950 lg:col-span-8">
					<div className="bg-primary/50 absolute top-0 left-0 h-1 w-full"></div>
					<div
						className="relative z-10 flex h-full flex-col bg-neutral-950 p-8"
						style={{
							backgroundImage:
								"linear-gradient(rgba(46,92,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(46,92,255,0.22) 1px, transparent 1px), linear-gradient(rgba(46,92,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(46,92,255,0.1) 1px, transparent 1px)",
							backgroundSize: "48px 48px, 48px 48px, 24px 24px, 24px 24px",
						}}
					>
						<div className="mb-6 flex items-center justify-between border-b border-neutral-800 pb-4">
							<h3 className="font-header text-xl font-bold tracking-widest text-white">
								<span className="text-primary mr-2">///</span> GLOBAL SKILL ARCHITECTURE
							</h3>
							<div className="text-primary flex gap-4 font-mono text-[10px]">
								<span className="animate-pulse">LIVE_STREAM</span>
								<span className="text-neutral-500">v.5.0.0</span>
							</div>
						</div>

						{/* Viz Area (Real Streamgraph) */}
						<div className="relative flex min-h-[300px] flex-1 items-center justify-center rounded border border-dashed border-neutral-800 bg-neutral-900/30 p-1">
							<div className="text-center">
								<div className="mb-2 font-mono text-sm text-neutral-500">STREAMGRAPH OFFLINE</div>
								<div className="text-xs text-neutral-700">[ MIGRATING TO D3 PHYSICS ENGINE ]</div>
							</div>
						</div>
					</div>
				</div>

				{/* 2. Key Performance Indicators (Right Col) */}
				{/* Consumes 4 cols */}
				{/* 2. Key Performance Indicators (Right Col) */}
				{/* Consumes 4 cols */}
				<div className="space-y-6 lg:col-span-4">
					{/* KPI 1: Phase Allocation */}
					<div className="relative overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950 p-6">
						<h3 className="mb-4 border-b border-neutral-800 pb-2 font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
							System Phase Distribution
						</h3>
						{data.phases &&
							data.phases.map((item: any) => (
								<div key={item.phase} className="mb-3 last:mb-0">
									<div className="mb-1 flex justify-between font-mono text-[10px] text-neutral-400">
										<span className="uppercase">{item.phase}</span>
										<span>{item.value}%</span>
									</div>
									<div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-900">
										<div className="bg-primary/80 h-full" style={{ width: `${item.value}%` }}></div>
									</div>
								</div>
							))}
						{!data.phases && (
							<div className="font-mono text-xs text-neutral-600">NO PHASE DATA</div>
						)}
					</div>

					{/* KPI 2: Core Capabilities (Real Data) */}
					<div className="rounded-sm border border-neutral-800 bg-neutral-950 p-6">
						<h3 className="mb-4 border-b border-neutral-800 pb-2 font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
							Core Capabilities
						</h3>
						<div className="space-y-4">
							{/* Sort by value descending and take top 5 */}
							{data.skillData &&
								data.skillData
									.sort((a: any, b: any) => b.value - a.value)
									.slice(0, 5)
									.map((skill: any, i: number) => (
										<div key={skill.name} className="group cursor-default">
											<div className="mb-1 flex items-center justify-between text-[10px] tracking-wider uppercase">
												<span className="max-w-[150px] truncate font-mono text-neutral-400 transition-colors group-hover:text-white">
													{skill.name}
												</span>
												<span className="text-primary font-mono">{skill.value.toFixed(1)}</span>
											</div>
											<div className="h-1 w-full overflow-hidden rounded-full bg-neutral-900">
												<div
													className="group-hover:bg-primary h-full bg-neutral-700 transition-all duration-500 ease-out"
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
				<div
					className="relative overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950 p-1 lg:col-span-12"
					style={{ height: "600px" }}
				>
					<div className="border-primary absolute top-0 right-0 z-10 h-4 w-4 border-t border-r"></div>
					<div className="border-primary absolute bottom-0 left-0 z-10 h-4 w-4 border-b border-l"></div>

					<div className="absolute top-4 left-4 z-10 flex w-full items-center justify-between pr-8">
						<h3 className="bg-neutral-950/80 px-2 font-mono text-xs tracking-widest text-neutral-500 uppercase">
							Multiverse Linkage
						</h3>
						<div className="flex gap-2">
							<span className="bg-primary h-1.5 w-1.5 animate-[ping_2s_linear_infinite] rounded-full"></span>
							<span className="bg-primary h-1.5 w-1.5 rounded-full"></span>
						</div>
					</div>

					{/* Multiverse Graph Integration */}
					{data.multiverseData ? (
						<div className="h-full w-full">
							<Assembly data={data.multiverseData} />
						</div>
					) : (
						<div className="flex h-full w-full items-center justify-center font-mono text-neutral-600">
							// MULTIVERSE OFFLINE
						</div>
					)}
				</div>

				{/* 4. Tenure Timeline (Gantt) */}
				<div className="overflow-x-auto rounded-sm border border-neutral-800 bg-neutral-950 p-6 lg:col-span-12">
					<h3 className="mb-6 flex justify-between border-b border-neutral-800 pb-2 font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
						<span>Tenure Timeline</span>
						<span>[ 1993 - PRESENT ]</span>
					</h3>
					<div className="relative flex h-24 w-full min-w-[800px] items-center">
						{/* Time Axis (Simplified) */}
						<div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-800"></div>
						<div className="absolute top-0 right-0 bottom-0 w-px bg-neutral-800"></div>

						{/* Bars */}
						<div className="flex h-12 w-full gap-0.5">
							{history
								.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
								.map((job, i) => {
									return (
										<div
											key={i}
											className="group relative h-full flex-1 cursor-help border-r border-neutral-950 bg-neutral-900 transition-colors hover:bg-neutral-800"
										>
											<div className="absolute bottom-full left-0 z-20 mb-2 hidden w-48 border border-neutral-700 bg-neutral-900 p-2 text-xs shadow-xl group-hover:block">
												<div className="mb-0.5 font-bold text-white">{job.company}</div>
												<div className="text-primary">{job.title}</div>
												<div className="mt-1 text-[10px] text-neutral-500">
													{job.start} - {job.end}
												</div>
											</div>
											<div
												className="absolute bottom-0 left-0 h-1 w-full"
												style={{ backgroundColor: job.color }}
											></div>
										</div>
									);
								})}
						</div>
					</div>
				</div>

				{/* 5. Spec Ticker (Footer) */}
				<div className="relative flex h-10 items-center overflow-hidden border-t border-b border-neutral-800 bg-neutral-950 lg:col-span-12">
					<div className="absolute top-0 bottom-0 left-0 z-10 w-24 bg-linear-to-r from-neutral-950 to-transparent"></div>
					<div className="absolute top-0 right-0 bottom-0 z-10 w-24 bg-linear-to-l from-neutral-950 to-transparent"></div>
					<div className="animate-scroll flex items-center gap-8 px-4 whitespace-nowrap">
						{specs.concat(specs).map((spec, i) => (
							<div key={i} className="flex items-center gap-2 font-mono text-xs text-neutral-500">
								<span className="text-neutral-700 uppercase">[{spec.category}]</span>
								<span className="text-neutral-400">{spec.parameter}:</span>
								<span className="text-primary">{spec.typical}</span>
								{spec.unit !== "-" && <span className="text-neutral-600">{spec.unit}</span>}
								<span className="mx-2 text-neutral-800">///</span>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return null;
}
