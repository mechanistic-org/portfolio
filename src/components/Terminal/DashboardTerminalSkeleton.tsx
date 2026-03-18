import React from "react";
import { useStore } from "@nanostores/react";
import { selectedProject, hoveredProject, setHover } from "../../stores/hxoStore";

// Re-using the Interface from HXOConsole to ensure data compatibility
interface ConsoleProject {
	id: string;
	data: {
		title: string;
		date?: string | Date; // Date object or string
		client?: string[];
		audio_url?: string;
		forensic_summary?: {
			trigger?: string;
			intervention?: string;
			result?: string;
			objective?: string;
			friction?: string;
			method?: string;
		};
		metrics?: Record<string, any>;
		toolchain?: string[];
		tier?: number;
		category?: string;
	};
}

interface DashboardTerminalSkeletonProps {
	projects?: ConsoleProject[]; // Made optional for now so the sandbox doesn't break if not passed yet
}

export default function DashboardTerminalSkeleton({ projects = [] }: DashboardTerminalSkeletonProps) {
	// 1. Subscribe to the Nano Stores (Same as HXOConsole)
	const selectedId = useStore(selectedProject);
	const hoveredId = useStore(hoveredProject);

	// Derived state: prioritize hovered over selected for immediate pipeline feedback
	const activeId = hoveredId || selectedId;
	const activeProject = projects.find((p) => p.id === activeId);

	return (
		<div className="flex h-full w-full flex-row overflow-hidden border-l border-zinc-900 bg-black font-mono text-zinc-300">
			{/* 1. TELEMETRY SIDEBAR (Left Panel - Fixed Width) */}
			<aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-zinc-900 bg-zinc-950 p-6">
				{activeProject ? (
					<>
						<header className="mb-8 border-b border-zinc-900 pb-4">
							<div className="mb-2 text-xs tracking-widest text-lime-400">
								{activeProject.data.date ? new Date(activeProject.data.date).getFullYear() : "YYYY"} // {activeProject.data.category || "SYS_FILE"}
							</div>
							<h2 className="font-display text-2xl leading-tight font-bold text-white uppercase">
								{activeProject.data.title}
							</h2>
							{activeProject.data.client && activeProject.data.client.length > 0 && (
								<div className="mt-2 text-xs text-zinc-500 uppercase">
									{activeProject.data.client.join(", ")}
								</div>
							)}
						</header>

						<div className="flex-1 space-y-6">
							{/* Dynamic Telemetry Blocks */}
							<div className="space-y-2">
								<div className="text-[10px] tracking-widest text-zinc-500 uppercase">Core Telemetry</div>
								<div className="flex justify-between border-b border-zinc-900 pb-1 text-sm">
									<span>TIER</span>
									<span className={activeProject.data.tier === 1 ? "text-lime-400" : "text-white"}>
										{activeProject.data.tier ? `T${activeProject.data.tier}` : "N/A"}
									</span>
								</div>
								
								{/* Render custom metrics if they exist in the YAML */}
								{activeProject.data.metrics && Object.entries(activeProject.data.metrics).map(([key, val]) => (
									<div key={key} className="flex justify-between border-b border-zinc-900 pb-1 text-sm">
										<span className="capitalize">{key.replace(/_/g, " ")}</span>
										<span className="text-zinc-300">{String(val)}</span>
									</div>
								))}

							</div>
						</div>

						<footer className="mt-8 border-t border-zinc-900 pt-4 text-[10px] text-zinc-600 uppercase">
							SYS_STATUS: {activeProject.data.audio_url ? "AUDIO_READY" : "NOMINAL"}
						</footer>
					</>
				) : (
					<div className="flex h-full flex-col items-center justify-center text-center">
						<div className="animate-pulse text-xs tracking-widest text-zinc-600 uppercase">
							AWAITING<br/>DATA STREAM
						</div>
					</div>
				)}
			</aside>

			{/* 2. MAIN CANVAS (Right Panel - Flexible Width) */}
			<main className="relative flex flex-1 flex-col overflow-hidden bg-black bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">
				<header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-900 px-6">
					<div className="text-xs tracking-widest text-zinc-500 uppercase">
						Diagnostic Canvas :: {activeProject ? activeProject.id : "IDLE"}
					</div>
					<div className="flex gap-4">
						<button className="text-xs tracking-widest text-zinc-500 hover:text-white transition-colors">
							TERMINAL V1.0
						</button>
					</div>
				</header>

				{/* Canvas Grid Area */}
				<div className="custom-scrollbar flex-1 overflow-y-auto p-8">
					{activeProject ? (
						<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
							{/* Forensic Summary Cards */}
							{activeProject.data.forensic_summary && (
								<>
									{/* Trigger / Objective */}
									{(activeProject.data.forensic_summary.trigger || activeProject.data.forensic_summary.objective) && (
										<div className="group relative rounded border border-zinc-800 bg-zinc-950 p-6 transition-colors hover:border-lime-500/50">
											<div className="mb-4 flex items-center justify-between">
												<span className="font-mono text-xs text-red-500 uppercase">[TRIGGER]</span>
											</div>
											<p className="text-sm font-light text-zinc-300 leading-relaxed">
												{activeProject.data.forensic_summary.trigger || activeProject.data.forensic_summary.objective}
											</p>
										</div>
									)}

									{/* Intervention / Result */}
									{(activeProject.data.forensic_summary.intervention || activeProject.data.forensic_summary.result) && (
										<div className="group relative rounded border border-zinc-800 bg-zinc-950 p-6 transition-colors hover:border-emerald-500/50">
											<div className="mb-4 flex items-center justify-between">
												<span className="font-mono text-xs text-emerald-400 uppercase">[INTERVENTION]</span>
											</div>
											<p className="text-sm font-light text-zinc-300 leading-relaxed">
												{activeProject.data.forensic_summary.intervention || activeProject.data.forensic_summary.result}
											</p>
										</div>
									)}
								</>
							)}

							{/* Narrative Drawer Trigger Hook (Visual Only for now) */}
							<div className="col-span-full mt-4 flex items-center justify-center rounded border border-dashed border-zinc-800 p-12 opacity-50 transition-opacity hover:opacity-100 cursor-pointer group hover:border-lime-500/50">
								<div className="text-center font-mono">
									<div className="mb-2 text-zinc-500 group-hover:text-lime-400 transition-colors uppercase">[ ACCESS DEEP NARRATIVE ]</div>
									<div className="text-[10px] text-zinc-700">Triggers Scrollytelling Component Drop-in</div>
								</div>
							</div>
						</div>
					) : (
						<div className="flex h-full items-center justify-center">
							<div className="font-mono text-zinc-800 border-l-2 border-zinc-800 pl-4 py-2 text-sm uppercase">
								Select a node in the swarm to initiate telemetry.
							</div>
						</div>
					)}
				</div>

				{/* 3. NARRATIVE DRAWER (Hidden by default) */}
				<div className="pointer-events-none absolute inset-y-0 right-0 w-[600px] translate-x-full border-l border-zinc-900 bg-zinc-950 shadow-2xl transition-transform duration-500">
					{/* Narrative Drawer Content Goes Here */}
				</div>
			</main>
		</div>
	);
}
