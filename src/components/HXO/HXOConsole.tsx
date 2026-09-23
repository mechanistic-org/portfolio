import React, { useEffect, useMemo, useRef, useState } from "react";
import CareerTimeline from "../DataViz/CareerTimeline";
import type { CareerNode } from "../../utils/contextRibbon";
import { projectPeriod } from "../../utils/projectDates";
import { getAssetUrl } from "../../utils/assets";

import { useStore } from "@nanostores/react";
import { acquire, clearReading, setPreview, viewerId } from "../../stores/hxoStore";
import SonicHeartbeat from "../Audio/SonicHeartbeat";

interface ConsoleProject {
	id: string;
	data: {
		title: string;
		heroImage?: string;
		description?: string;
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
		employer?: string;
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
					<p className="mb-4 text-zinc-300">Project details could not load.</p>
					<a href="/projects/" className="text-lime-400 underline">
						Browse all projects →
					</a>
					<button
						type="button"
						onClick={() => this.setState({ hasError: false })}
						className="mt-6 border border-red-900/50 px-4 py-2 font-mono text-xs text-red-400 hover:bg-red-900/20"
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

interface HXOConsoleProps {
	careerNodes: CareerNode[];
	projects: ConsoleProject[];
	projectAliases: Readonly<Record<string, string>>;
}

function isEditableTarget(target: EventTarget | null) {
	if (!(target instanceof HTMLElement)) return false;
	return (
		target.isContentEditable ||
		["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName) ||
		Boolean(target.closest('[contenteditable="true"]'))
	);
}

export default function HXOConsole({ projects, careerNodes, projectAliases }: HXOConsoleProps) {
	const storedViewerId = useStore(viewerId);
	const [isHydrated, setIsHydrated] = useState(false);
	// ClientRouter retains module stores between pages. Match the prerendered
	// orientation first, then restore the held subject from this entry's URL.
	const currentViewerId = isHydrated ? storedViewerId : null;
	const [urlStateReady, setUrlStateReady] = useState(false);
	const activeProject = projects.find((project) => project.id === currentViewerId);
	const projectById = useMemo(
		() => new Map(projects.map((project) => [project.id, project])),
		[projects],
	);
	const viewerRef = useRef<HTMLDivElement>(null);
	const managedHash = useRef(false);

	useEffect(() => {
		setIsHydrated(true);
		const restore = () => {
			const params = new URLSearchParams(window.location.hash.slice(1));
			if (
				!params.has("lens") &&
				!params.has("project") &&
				!params.has("pin") &&
				!params.has("tour")
			) {
				managedHash.current = !window.location.hash;
				clearReading();
				return;
			}
			managedHash.current = true;
			// Old pin URLs select the same single reading subject; there is no saved reference.
			const legacy = params.get("project") ?? params.get("pin");
			const requested = legacy ? (projectAliases[legacy] ?? legacy) : null;
			setPreview(null);
			const selected = requested && projectById.has(requested) ? requested : null;
			acquire(selected);
			const canonical = new URLSearchParams();
			if (selected) canonical.set("project", selected);
			window.history.replaceState(
				window.history.state,
				"",
				`${window.location.pathname}${window.location.search}${canonical.size ? `#${canonical}` : ""}`,
			);
		};
		restore();
		setUrlStateReady(true);
		window.addEventListener("hashchange", restore);
		window.addEventListener("popstate", restore);
		return () => {
			window.removeEventListener("hashchange", restore);
			window.removeEventListener("popstate", restore);
			setPreview(null);
		};
	}, [projectById, projectAliases]);

	useEffect(() => {
		if (!urlStateReady) return;
		if (!managedHash.current && !currentViewerId) return;
		managedHash.current = true;
		const params = new URLSearchParams();
		if (currentViewerId) params.set("project", currentViewerId);
		const hash = params.size ? `#${params}` : "";
		window.history.replaceState(
			window.history.state,
			"",
			`${window.location.pathname}${window.location.search}${hash}`,
		);
	}, [currentViewerId, urlStateReady]);

	useEffect(() => {
		const handleKeyboard = (event: KeyboardEvent) => {
			if (isEditableTarget(event.target) || event.key !== "Escape") return;
			setPreview(null);
			clearReading();
		};
		window.addEventListener("keydown", handleKeyboard);
		return () => window.removeEventListener("keydown", handleKeyboard);
	}, []);

	useEffect(() => {
		if (viewerRef.current) viewerRef.current.scrollTop = 0;
	}, [currentViewerId]);

	return (
		<ErrorBoundary>
			<div
				className="flex h-full min-h-0 flex-col border-l border-zinc-900 bg-transparent"
				data-current-lens="time"
				data-hxo-hydrated={isHydrated ? "true" : "false"}
			>
				<button
					type="button"
					onClick={() => document.getElementById("career-map")?.scrollIntoView({ block: "start" })}
					className="border-b border-zinc-800 px-5 py-3 text-left font-mono text-xs text-zinc-400 lg:hidden"
				>
					← Back to map
				</button>

				<div
					ref={viewerRef}
					data-viewer-id={activeProject?.id ?? "orientation"}
					className="custom-scrollbar min-h-0 flex-[1_1_55%] overflow-y-auto bg-zinc-900/10 p-5"
				>
					{activeProject ? <ActiveSovereignView project={activeProject} /> : <DefaultSummary />}
				</div>

				<div
					className="custom-scrollbar min-h-0 flex-[1_1_45%] overflow-y-auto"
					data-timeline-panel
				>
					<CareerTimeline nodes={careerNodes} currentId={currentViewerId} onSelect={acquire} />
				</div>
			</div>
		</ErrorBoundary>
	);
}

function ActiveSovereignView({ project }: { project: ConsoleProject }) {
	if (!project || !project.data) return <div className="p-4 text-red-500">CORRUPT DATA</div>;

	const { title, client, forensic_summary, audio_url, toolchain, heroImage, description } =
		project.data;
	const chronology = projectPeriod(project.id, project.data);

	return (
		<article className="hxo-node">
			<header className="mb-6">
				<div className="mb-2 flex items-center gap-4">
					<span className="font-mono text-sm tracking-widest text-lime-400">
						{chronology.period}
						{chronology.context ? ` · ${chronology.context}` : ""}
					</span>
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

			{heroImage && (
				<a href={`/projects/${project.id}/`} className="mb-5 block">
					<img
						src={getAssetUrl(heroImage)}
						alt={title}
						className="max-h-56 w-full object-contain"
					/>
				</a>
			)}
			{description && !forensic_summary?.result && !forensic_summary?.objective && (
				<p className="mb-5 text-sm leading-relaxed text-zinc-300">{description}</p>
			)}
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

				<div className="mt-8 border-t border-zinc-900 pt-4">
					<a
						href={`/projects/${project.id}/`}
						className="flex items-center gap-2 font-mono text-xs tracking-widest text-lime-400 uppercase transition-colors hover:text-white"
					>
						Open project →
					</a>
				</div>
			</div>
		</article>
	);
}

function DefaultSummary() {
	return (
		<article className="hxo-node animate-in fade-in flex h-full flex-col justify-center duration-500">
			<div className="space-y-6">
				<p className="text-sm leading-relaxed font-light text-zinc-300">
					Principal Mechanical Architect specializing in high-fidelity hardware and program rescue.
					I stabilize the entropy of product development: structure the chaos, index the decisions,
					ship the hardware.
				</p>
				<p className="font-mono text-xs text-zinc-500">
					Pause over a project to explore. Its details stay open as you move across to read.
				</p>
				<nav
					aria-label="Portfolio orientation"
					className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-xs tracking-wider uppercase"
				>
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
