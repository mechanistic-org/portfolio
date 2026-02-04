import React, { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { selectedProject, hoveredProject, selectProject, setHover } from "../../stores/hxoStore";
import { getEntityColor } from "../../config/color_registry";
import SonicHeartbeat from "../Audio/SonicHeartbeat";

const DEFAULT_COLOR = "#666666";

// Define the shape of the Project Node passed from Assembly
// This wraps the Astro Content entry data
interface ConsoleProject {
	id: string;
	data: {
		title: string;
		date?: string | Date; // Date object or string
		client?: string[];
		audio_url?: string;
		forensic_summary?: {
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

// --- ERROR BOUNDARY (Safety Protocol) ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: any) {
		return { hasError: true };
	}

	componentDidCatch(error: any, errorInfo: any) {
		console.error("HXO Console Crash Protocol:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex h-full flex-col items-center justify-center border-l border-zinc-900 bg-black/90 p-8 text-center">
					<div className="mb-4 font-mono text-xl font-bold text-red-500">SYSTEM FAILURE</div>
					<div className="font-mono text-xs text-zinc-500">Forensic Console Render Crash</div>
					<button
						onClick={() => this.setState({ hasError: false })}
						className="mt-6 border border-red-900/50 px-4 py-2 font-mono text-xs text-red-400 hover:bg-red-900/20"
					>
						ATTEMPT REBOOT
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

interface HXOConsoleProps {
	projects: ConsoleProject[];
}

export default function HXOConsole({ projects }: HXOConsoleProps) {
	const selectedId = useStore(selectedProject);
	const hoveredId = useStore(hoveredProject);

	// Derived state
	const activeId = hoveredId || selectedId;

	const viewportProject = projects.find((p) => p.id === activeId);
	// No fallback default - show Summary if nothing active
	const activeProject = viewportProject;

	// Sort for Ledger (Tier 1 -> Date)
	const ledgerProjects = [...projects].sort((a, b) => {
		const tierA = a.data.tier || 3;
		const tierB = b.data.tier || 3;
		if (tierA !== tierB) return tierA - tierB;
		const dateA = new Date(a.data.date || 0).getTime();
		const dateB = new Date(b.data.date || 0).getTime();
		return dateB - dateA;
	});

	// Auto-scroll Ledger to active item
	const ledgerRef = useRef<HTMLDivElement>(null);
	const isinteractingWithLedger = useRef(false);

	// [FIX] Disabled Auto-Scroll entirely to prevent jitter interaction.
	// useEffect(() => {
	// 	if (activeId && ledgerRef.current) {
	// 		const row = ledgerRef.current.querySelector(`[data-id="${activeId}"]`);
	// 		if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
	// 	}
	// }, [activeId]);

	return (
		<ErrorBoundary>
			<div className="flex h-full flex-col border-l border-zinc-900 bg-transparent">
				{/* 1. VIEWPORT (The Sovereign Card) - FIXED HEIGHT to prevents layout thrashing loop */}
				<div className="custom-scrollbar h-[450px] shrink-0 overflow-y-auto border-b border-zinc-800 bg-zinc-900/10 p-6">
					{activeProject ? <ActiveSovereignView project={activeProject} /> : <DefaultSummary />}
				</div>

				{/* 2. LEDGER (The List) */}
				<div className="flex flex-1 flex-col overflow-hidden">
					{/* Header Removed as Requested */}
					<div
						ref={ledgerRef}
						className="custom-scrollbar flex-1 overflow-y-auto p-2 pb-24"
						onMouseEnter={() => {
							isinteractingWithLedger.current = true;
						}}
						onMouseLeave={() => {
							isinteractingWithLedger.current = false;
						}}
					>
						{ledgerProjects.map((p) => {
							const isSelected = p.id === selectedId;
							const isHovered = p.id === hoveredId;
							const isActive = isSelected || isHovered;

							return (
								<div
									key={p.id}
									data-id={p.id}
									onClick={() => (window.location.href = `/projects/${p.id}`)}
									onMouseEnter={() => setHover(p.id)}
									onMouseLeave={() => setHover(null)}
									className={`group flex cursor-pointer items-center gap-4 border-b border-zinc-800/50 p-3 transition-colors duration-100 ${
										isActive
											? "bg-zinc-800/80 text-white shadow-[inset_3px_0_0_#84cc16]"
											: "opacity-60 hover:bg-zinc-900/50 hover:opacity-100"
									} `}
								>
									<span
										className={`pointer-events-none w-10 shrink-0 font-mono text-xs ${isActive ? "text-lime-400" : "text-zinc-600"}`}
									>
										{p.data.date ? new Date(p.data.date).getFullYear() : "####"}
									</span>
									<h3
										className={`pointer-events-none flex-1 truncate text-sm font-medium ${isActive ? "text-white" : "text-zinc-300"}`}
									>
										{p.data.title}
									</h3>
									{/* Tier Indicator */}
									{p.data.tier === 1 && (
										<span className="pointer-events-none h-1.5 w-1.5 shrink-0 rounded-full bg-lime-500/50" />
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
}

// --- SUB-COMPONENT: Audio Player ---
function AudioPlayer({ url }: { url: string }) {
	const [isPlaying, setIsPlaying] = React.useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);

	const togglePlay = () => {
		if (!audioRef.current) return;
		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
		setIsPlaying(!isPlaying);
	};

	return (
		<div className="audio-mini-player mb-6 flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
			<audio ref={audioRef} src={url} onEnded={() => setIsPlaying(false)} />
			<button
				onClick={togglePlay}
				className="play-btn cursor-pointer rounded-full bg-lime-500 p-2 text-black transition-colors hover:scale-110 hover:bg-lime-400 active:scale-95"
			>
				{isPlaying ? (
					// Pause Icon
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 5h4v14H6zM14 5h4v14h-4z" />
					</svg>
				) : (
					// Sonic Heartbeat Icon (Activity / Pulse)
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M3 12h4.5l1.5 -6l4 6l2 -4l1.5 4h4.5" />
					</svg>
				)}
			</button>
			<div className="flex-1">
				<div className="mb-1 font-mono text-xs tracking-widest text-lime-400 uppercase">
					Forensic Overview
				</div>
				<div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
					<div
						className={`h-full bg-lime-500/50 transition-all duration-300 ${isPlaying ? "w-full animate-pulse" : "w-0"}`}
					/>
				</div>
			</div>
		</div>
	);
}

// --- SUB-COMPONENT: React Port of SovereignNode ---
function ActiveSovereignView({ project }: { project: ConsoleProject }) {
	if (!project || !project.data) return <div className="p-4 text-red-500">CORRUPT DATA</div>;

	const { title, date, client, forensic_summary, metrics, audio_url, toolchain } = project.data;
	const year = date ? new Date(date).getFullYear() : "N/A";

	return (
		<article className="hxo-node animate-in fade-in slide-in-from-bottom-2 duration-300">
			<header className="mb-6">
				<div className="mb-2 flex items-center gap-4">
					<span className="font-mono text-sm tracking-widest text-lime-400">{year}</span>
					{client && client.length > 0 && (
						<span className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
							Client: {client[0]}
						</span>
					)}
				</div>
				<h2 className="font-display mb-4 text-3xl font-bold text-white">{title}</h2>

				{/* Audio Player (Functional) */}
				{audio_url && (
					<div className="mb-6 flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
						<div className="flex-1">
							<div className="mb-1 font-mono text-xs tracking-widest text-lime-400 uppercase">
								Forensic Overview
							</div>
							<div className="text-[10px] text-zinc-500">Audio Brief Available</div>
						</div>
						<SonicHeartbeat audioUrl={audio_url} />
					</div>
				)}
			</header>

			{/* Forensic Grid (Condensed for Viewport) */}
			<div className="space-y-6">
				<div className="objective">
					<h3 className="mb-2 font-mono text-xs tracking-widest text-zinc-500 uppercase">
						Objective
					</h3>
					<p className="text-sm leading-relaxed font-light text-zinc-300">
						{forensic_summary?.objective || "Engineering objective data pending..."}
					</p>
				</div>

				{(forensic_summary?.friction || forensic_summary?.method) && (
					<div className="rounded border border-zinc-800 bg-zinc-900/30 p-4 text-sm">
						<div className="mb-2">
							<span className="mr-2 font-mono text-xs text-red-400 uppercase">[FRICTION]</span>
							<span className="text-zinc-300">{forensic_summary.friction}</span>
						</div>
						<div>
							<span className="mr-2 font-mono text-xs text-emerald-400 uppercase">[METHOD]</span>
							<span className="text-zinc-300">{forensic_summary.method}</span>
						</div>
					</div>
				)}

				{/* Toolchain Pills */}
				{toolchain && (
					<div className="flex flex-wrap gap-2 pt-2">
						{toolchain.slice(0, 5).map((t) => (
							<span
								key={t}
								className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] tracking-wider text-zinc-500 uppercase"
							>
								{t}
							</span>
						))}
					</div>
				)}
			</div>

			{/* CTA */}
			<div className="mt-8 border-t border-zinc-900 pt-4">
				<a
					href={`/projects/${project.id}`}
					className="flex items-center gap-2 font-mono text-xs tracking-widest text-lime-400 uppercase transition-colors hover:text-white"
				>
					Open Full Dossier →
				</a>
			</div>
		</article>
	);
}

// --- SUB-COMPONENT: Default Summary (Index Card) ---
function DefaultSummary() {
	return (
		<article className="hxo-node animate-in fade-in flex h-full flex-col justify-center duration-500">
			<header className="mb-6">
				<div className="mb-2 flex items-center gap-4">
					<span className="font-mono text-sm tracking-widest text-lime-400">INDEX</span>
				</div>
				<h2 className="font-display mb-4 text-3xl font-bold text-white">Forensic Architecture</h2>
			</header>

			<div className="space-y-6">
				<div className="objective">
					<h3 className="mb-2 font-mono text-xs tracking-widest text-zinc-500 uppercase">
						Mission Status
					</h3>
					<p className="text-sm leading-relaxed font-light text-zinc-300">
						Welcome to the archived ledger of Erik Norris. This console provides forensic access to
						over 20 years of engineering, design, and leadership data.
					</p>
					<p className="mt-4 text-sm leading-relaxed font-light text-zinc-300">
						<span className="text-lime-400">HOVER</span> over the Swarm or Ledger to preview
						individual case files.
						<br />
						<span className="text-lime-400">CLICK</span> to access the full dossier.
					</p>
				</div>
			</div>
		</article>
	);
}
