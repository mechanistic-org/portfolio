import React, { useEffect, useRef } from "react";
import TextShimmer from "../Effects/TextShimmer";

import { useStore } from "@nanostores/react";
import {
	focusId,
	pin,
	pinnedId,
	previewId,
	setConsoleHover,
	setPreview,
	unpin,
	viewerId,
} from "../../stores/hxoStore";
import SonicHeartbeat from "../Audio/SonicHeartbeat";

interface ConsoleProject {
	id: string;
	data: {
		title: string;
		date?: string | Date;
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
		tier?: "deep_dive" | "lite" | string;
		category?: string;
	};
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_error: any) {
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
						type="button"
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

const TIER_RANK: Record<string, number> = { deep_dive: 0, lite: 1 };

function sortableDate(value: string | Date | undefined) {
	if (!value) return null;
	const timestamp = new Date(value).getTime();
	return Number.isFinite(timestamp) ? timestamp : null;
}

function isEditableTarget(target: EventTarget | null) {
	if (!(target instanceof HTMLElement)) return false;
	return (
		target.isContentEditable ||
		["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName) ||
		Boolean(target.closest('[contenteditable="true"]'))
	);
}

export default function HXOConsole({ projects }: HXOConsoleProps) {
	const currentPinnedId = useStore(pinnedId);
	const currentFocusId = useStore(focusId);
	const currentViewerId = useStore(viewerId);
	const activeProject = projects.find((project) => project.id === currentViewerId);

	const ledgerProjects = projects
		.map((project, originalIndex) => ({ project, originalIndex }))
		.sort((a, b) => {
			const tierA = TIER_RANK[a.project.data.tier ?? ""] ?? 2;
			const tierB = TIER_RANK[b.project.data.tier ?? ""] ?? 2;
			if (tierA !== tierB) return tierA - tierB;

			const dateA = sortableDate(a.project.data.date);
			const dateB = sortableDate(b.project.data.date);
			if (dateA === null && dateB !== null) return 1;
			if (dateA !== null && dateB === null) return -1;
			if (dateA !== null && dateB !== null && dateA !== dateB) return dateB - dateA;
			return a.originalIndex - b.originalIndex;
		})
		.map(({ project }) => project);

	const ledgerRef = useRef<HTMLDivElement>(null);
	const isInteractingWithLedger = useRef(false);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape" || isEditableTarget(event.target)) return;
			if (previewId.get()) {
				setPreview(null);
			} else if (pinnedId.get()) {
				unpin();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, []);

	useEffect(() => {
		const ledger = ledgerRef.current;
		if (!currentFocusId || !ledger || isInteractingWithLedger.current) return;

		const row = Array.from(ledger.querySelectorAll<HTMLElement>("[data-row-id]")).find(
			(element) => element.dataset.rowId === currentFocusId,
		);
		if (!row) return;

		ledger.scrollTo({
			top: row.offsetTop - (ledger.clientHeight - row.offsetHeight) / 2,
			behavior: "smooth",
		});
	}, [currentFocusId]);

	return (
		<ErrorBoundary>
			<div
				className="flex h-full flex-col border-l border-zinc-900 bg-transparent"
				onMouseEnter={() => setConsoleHover(true)}
				onMouseLeave={() => setConsoleHover(false)}
			>
				<div
					data-viewer-id={activeProject?.id ?? "orientation"}
					className="custom-scrollbar h-[70%] shrink-0 overflow-y-auto border-b border-zinc-800 bg-zinc-900/10 p-6"
				>
					{activeProject ? <ActiveSovereignView project={activeProject} /> : <DefaultSummary />}
				</div>

				<div className="flex flex-1 flex-col overflow-hidden">
					<div
						ref={ledgerRef}
						className="custom-scrollbar flex-1 overflow-y-auto p-2 pb-24"
						onMouseEnter={() => {
							isInteractingWithLedger.current = true;
						}}
						onMouseLeave={() => {
							isInteractingWithLedger.current = false;
						}}
						onFocusCapture={() => {
							isInteractingWithLedger.current = true;
						}}
						onBlurCapture={(event) => {
							if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
								isInteractingWithLedger.current = false;
							}
						}}
					>
						<ul className="m-0 list-none p-0">
							{ledgerProjects.map((project) => {
								const isPinned = project.id === currentPinnedId;
								const isFocused = project.id === currentFocusId;
								const rawDate = project.data.date ? String(project.data.date) : "";

								return (
									<li
										key={project.id}
										data-row-id={project.id}
										className={`group flex items-stretch border-b border-zinc-800/50 transition-colors duration-100 ${
											isFocused
												? "bg-zinc-800/80 text-white shadow-[inset_3px_0_0_#84cc16]"
												: "opacity-60 hover:bg-zinc-900/50 hover:opacity-100 focus-within:opacity-100"
										}`}
									>
										<button
											type="button"
											aria-pressed={isPinned}
											data-id={project.id}
											data-pinned={isPinned}
											data-focused={isFocused}
											data-tier={project.data.tier ?? ""}
											data-date={rawDate}
											onClick={() => pin(project.id)}
											onMouseEnter={() => setPreview(project.id, "index-hover")}
											onMouseLeave={() => setPreview(null, "index-hover")}
											onFocus={() => setPreview(project.id, "index-focus")}
											onBlur={() => setPreview(null, "index-focus")}
											className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lime-400"
										>
											<span
												className={`pointer-events-none w-10 shrink-0 font-mono text-xs ${isFocused ? "text-lime-400" : "text-zinc-600"}`}
											>
												{project.data.date ? new Date(project.data.date).getFullYear() : "####"}
											</span>
											<span
												className={`pointer-events-none min-w-0 flex-1 truncate text-sm font-medium ${isFocused ? "text-white" : "text-zinc-300"}`}
											>
												{project.data.title}
											</span>
											{project.data.tier === "deep_dive" && (
												<span className="pointer-events-none h-1.5 w-1.5 shrink-0 rounded-full bg-lime-500/50" />
											)}
										</button>
										<a
											href={`/projects/${project.id}/`}
											aria-label={`Open ${project.data.title}`}
											className="flex shrink-0 items-center px-3 font-mono text-[10px] tracking-wider text-zinc-500 uppercase transition-colors hover:text-lime-400 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lime-400"
										>
											Open →
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
}

function ActiveSovereignView({ project }: { project: ConsoleProject }) {
	if (!project || !project.data) return <div className="p-4 text-red-500">CORRUPT DATA</div>;

	const { title, date, client, forensic_summary, audio_url, toolchain } = project.data;
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

			<div className="space-y-6">
				{forensic_summary?.result && (
					<div className="objective">
						<h3 className="mb-2 font-mono text-xs tracking-widest text-zinc-500 uppercase">
							Outcome
						</h3>
						<p className="text-sm leading-relaxed font-light text-zinc-300">
							{forensic_summary.result}
						</p>
					</div>
				)}

				{forensic_summary?.objective && !forensic_summary?.result && (
					<div className="objective">
						<h3 className="mb-2 font-mono text-xs tracking-widest text-zinc-500 uppercase">
							Objective
						</h3>
						<p className="text-sm leading-relaxed font-light text-zinc-300">
							{forensic_summary.objective}
						</p>
					</div>
				)}

				{(forensic_summary?.trigger || forensic_summary?.intervention) && (
					<div className="rounded border border-zinc-800 bg-zinc-900/30 p-4 text-sm">
						{forensic_summary.trigger && (
							<div className="mb-2">
								<span className="mr-2 font-mono text-xs text-red-500 uppercase">[TRIGGER]</span>
								<span className="text-zinc-300">{forensic_summary.trigger}</span>
							</div>
						)}
						{forensic_summary.intervention && (
							<div>
								<span className="mr-2 font-mono text-xs text-emerald-400 uppercase">
									[INTERVENTION]
								</span>
								<span className="text-zinc-300">{forensic_summary.intervention}</span>
							</div>
						)}
					</div>
				)}

				{!forensic_summary?.trigger && (forensic_summary?.friction || forensic_summary?.method) && (
					<div className="rounded border border-zinc-800 bg-zinc-900/30 p-4 text-sm">
						{forensic_summary.friction && (
							<div className="mb-2">
								<span className="mr-2 font-mono text-xs text-red-400 uppercase">[FRICTION]</span>
								<span className="text-zinc-300">{forensic_summary.friction}</span>
							</div>
						)}
						{forensic_summary.method && (
							<div>
								<span className="mr-2 font-mono text-xs text-emerald-400 uppercase">[METHOD]</span>
								<span className="text-zinc-300">{forensic_summary.method}</span>
							</div>
						)}
					</div>
				)}

				{toolchain && (
					<div className="flex flex-wrap gap-2 pt-2">
						{toolchain.slice(0, 5).map((tool) => (
							<span
								key={tool}
								className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] tracking-wider text-zinc-500 uppercase"
							>
								{tool}
							</span>
						))}
					</div>
				)}
			</div>

			<div className="mt-8 border-t border-zinc-900 pt-4">
				<a
					href={`/projects/${project.id}/`}
					className="flex items-center gap-2 font-mono text-xs tracking-widest text-lime-400 uppercase transition-colors hover:text-white"
				>
					Open Full Dossier →
				</a>
			</div>
		</article>
	);
}

function DefaultSummary() {
	return (
		<article className="hxo-node animate-in fade-in flex h-full flex-col justify-center duration-500">
			<header className="mb-6">
				<h2 className="font-display mb-4 text-3xl font-bold text-white">
					(Product Reality) <TextShimmer className="font-bold">EN</TextShimmer>gine
				</h2>
			</header>

			<div className="space-y-6">
				<p className="text-sm leading-relaxed font-light text-zinc-300">
					Principal Mechanical Architect specializing in high-fidelity hardware and program rescue. I
					stabilize the entropy of product development: structure the chaos, index the decisions, ship
					the hardware.
				</p>
				<nav aria-label="Portfolio orientation" className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-xs tracking-wider uppercase">
					<a href="/projects/c24/" className="text-lime-400 transition-colors hover:text-white">
						C|24 dossier →
					</a>
					<a href="/resume/" className="text-zinc-400 transition-colors hover:text-white">
						Résumé →
					</a>
					<a href="/projects/" className="text-zinc-400 transition-colors hover:text-white">
						All Work →
					</a>
				</nav>
			</div>
		</article>
	);
}
