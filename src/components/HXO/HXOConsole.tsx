import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextShimmer from "../Effects/TextShimmer";

import { useStore } from "@nanostores/react";
import {
	exitTour,
	focusId,
	lens,
	mode,
	pin,
	pinTourStep,
	pinnedId,
	previewId,
	setConsoleHover,
	setLens,
	setPreview,
	unpin,
	viewerId,
	type HxoLens,
} from "../../stores/hxoStore";
import { HXO_TOUR_STEPS, type HxoTourStep } from "../../config/hxoTour";
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
const LENSES: Array<{ id: HxoLens; label: string }> = [
	{ id: "time", label: "Time" },
	{ id: "employer", label: "Employer" },
	{ id: "category", label: "Category" },
];
const VALID_LENSES = new Set<HxoLens>(LENSES.map(({ id }) => id));

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

function formatGroupLabel(value: string) {
	return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function getProjectLensGroup(project: ConsoleProject, currentLens: HxoLens) {
	if (currentLens === "employer") return project.data.employer || "unassigned";
	if (currentLens === "category") return project.data.category || "uncategorized";
	return "timeline";
}

function sortProjects(projects: ConsoleProject[]) {
	return projects
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
}

export default function HXOConsole({ projects }: HXOConsoleProps) {
	const currentPinnedId = useStore(pinnedId);
	const currentFocusId = useStore(focusId);
	const currentViewerId = useStore(viewerId);
	const currentLens = useStore(lens);
	const currentMode = useStore(mode);
	const [isHydrated, setIsHydrated] = useState(false);
	const [urlStateReady, setUrlStateReady] = useState(false);
	const activeProject = projects.find((project) => project.id === currentViewerId);
	const tourSteps = useMemo<readonly HxoTourStep[]>(() => {
		const projectIds = new Set(projects.map((project) => project.id));
		const stepIds = new Set(HXO_TOUR_STEPS.map((step) => step.id));
		const tourProjectIds = new Set(HXO_TOUR_STEPS.map((step) => step.projectId));
		return stepIds.size === HXO_TOUR_STEPS.length &&
			tourProjectIds.size === HXO_TOUR_STEPS.length &&
			HXO_TOUR_STEPS.every((step) => projectIds.has(step.projectId))
			? HXO_TOUR_STEPS
			: [];
	}, [projects]);
	const currentTourIndex =
		currentMode === "tour" ? tourSteps.findIndex((step) => step.projectId === currentPinnedId) : -1;
	const currentTourStep = currentTourIndex >= 0 ? tourSteps[currentTourIndex] : null;

	const activateTourStep = useCallback(
		(index: number) => {
			const step = tourSteps[index];
			if (!step) {
				exitTour();
				return;
			}
			setPreview(null);
			setLens(step.lens);
			pinTourStep(step.projectId);
		},
		[tourSteps],
	);

	const ledgerProjects = useMemo(() => sortProjects(projects), [projects]);
	const ledgerSections = useMemo(() => {
		if (currentLens === "time") {
			return [{ id: "timeline", label: "Timeline", projects: ledgerProjects }];
		}

		const groups = new Map<string, ConsoleProject[]>();
		for (const project of ledgerProjects) {
			const group = getProjectLensGroup(project, currentLens);
			const entries = groups.get(group) ?? [];
			entries.push(project);
			groups.set(group, entries);
		}

		return [...groups.entries()]
			.map(([id, groupedProjects]) => ({
				id,
				label: formatGroupLabel(id),
				projects: groupedProjects,
			}))
			.sort((a, b) => {
				if (a.id === "uncategorized" || a.id === "unassigned") return 1;
				if (b.id === "uncategorized" || b.id === "unassigned") return -1;
				return a.label.localeCompare(b.label);
			});
	}, [currentLens, ledgerProjects]);

	const ledgerRef = useRef<HTMLDivElement>(null);
	const isInteractingWithLedger = useRef(false);
	const managedHashRef = useRef(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		const projectIds = new Set(projects.map((project) => project.id));
		const applyUrlState = () => {
			const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
			const hasManagedState = params.has("lens") || params.has("pin") || params.has("tour");
			managedHashRef.current = hasManagedState;
			if (hasManagedState) {
				const requestedLens = params.get("lens") as HxoLens | null;
				const validLens = requestedLens && VALID_LENSES.has(requestedLens) ? requestedLens : null;
				const requestedTour = params.get("tour");
				const tourStep = requestedTour ? tourSteps.find((step) => step.id === requestedTour) : null;
				if (requestedTour) {
					if (tourStep) {
						setLens(validLens ?? tourStep.lens);
						pinTourStep(tourStep.projectId);
					} else {
						setLens("time");
						unpin();
					}
					setUrlStateReady(true);
					return;
				}

				setLens(validLens ?? "time");
				const requestedPin = params.get("pin");
				if (requestedPin && projectIds.has(requestedPin)) pin(requestedPin);
				else unpin();
			}
			setUrlStateReady(true);
		};

		applyUrlState();
		window.addEventListener("hashchange", applyUrlState);
		return () => window.removeEventListener("hashchange", applyUrlState);
	}, [projects, tourSteps]);

	useEffect(() => {
		if (!urlStateReady) return;
		const hasState = currentLens !== "time" || Boolean(currentPinnedId);
		const hasTour = currentMode === "tour" && Boolean(currentTourStep);
		if (!hasState && !hasTour && !managedHashRef.current) return;

		const params = new URLSearchParams();
		if (hasState || hasTour) params.set("lens", currentLens);
		if (currentPinnedId) params.set("pin", currentPinnedId);
		if (hasTour && currentTourStep) params.set("tour", currentTourStep.id);
		const nextHash = params.size > 0 ? `#${params.toString()}` : "";
		const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
		window.history.replaceState(window.history.state, "", nextUrl);
		managedHashRef.current = params.size > 0;
	}, [currentLens, currentMode, currentPinnedId, currentTourStep, urlStateReady]);

	useEffect(() => {
		if (currentMode === "tour" && currentTourIndex < 0) exitTour();
	}, [currentMode, currentTourIndex]);

	useEffect(() => {
		const handleKeyboard = (event: KeyboardEvent) => {
			if (isEditableTarget(event.target)) return;
			if (event.key === "Escape") {
				if (previewId.get()) setPreview(null);
				else if (mode.get() === "tour") exitTour();
				else if (pinnedId.get()) unpin();
				return;
			}

			if (mode.get() !== "tour" || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
			const index = tourSteps.findIndex((step) => step.projectId === pinnedId.get());
			const nextIndex = index + (event.key === "ArrowRight" ? 1 : -1);
			if (!tourSteps[nextIndex]) return;
			event.preventDefault();
			activateTourStep(nextIndex);
		};

		window.addEventListener("keydown", handleKeyboard);
		return () => window.removeEventListener("keydown", handleKeyboard);
	}, [activateTourStep, tourSteps]);

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
				data-current-lens={currentLens}
				data-current-mode={currentMode}
				data-hxo-hydrated={isHydrated ? "true" : "false"}
				onMouseEnter={() => setConsoleHover(true)}
				onMouseLeave={() => setConsoleHover(false)}
			>
				<nav
					aria-label="Career map lenses"
					className="sticky top-16 z-20 flex shrink-0 flex-wrap items-center gap-1 border-b border-zinc-800 bg-black/90 px-3 py-2 font-mono backdrop-blur"
					data-lens-bar
				>
					<span className="mr-2 text-[9px] tracking-[0.2em] text-zinc-600 uppercase">View</span>
					{LENSES.map(({ id, label }) => {
						const active = id === currentLens;
						return (
							<button
								key={id}
								type="button"
								data-lens-control={id}
								aria-pressed={active}
								disabled={!isHydrated}
								onClick={() => setLens(id)}
								className={`rounded-sm border px-2.5 py-1 text-[10px] tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 disabled:cursor-default ${
									active
										? "border-lime-500/60 bg-lime-500/10 text-lime-300"
										: "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 disabled:hover:border-zinc-800 disabled:hover:text-zinc-500"
								}`}
							>
								{label}
							</button>
						);
					})}
					<button
						type="button"
						data-tour-control="start"
						data-tour-count={tourSteps.length}
						aria-pressed={currentMode === "tour"}
						disabled={!isHydrated || tourSteps.length !== HXO_TOUR_STEPS.length}
						onClick={() => activateTourStep(0)}
						className={`ml-auto rounded-sm border px-2.5 py-1 text-[10px] tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 disabled:cursor-default ${
							currentMode === "tour"
								? "border-cyan-500/60 bg-cyan-500/10 text-cyan-300"
								: "border-zinc-700 text-zinc-400 hover:border-cyan-600 hover:text-cyan-300 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400"
						}`}
					>
						{currentMode === "tour" ? "Restart tour" : "Tour"}
					</button>
				</nav>

				{currentTourStep && (
					<TourChapter
						step={currentTourStep}
						index={currentTourIndex}
						count={tourSteps.length}
						onPrevious={() => activateTourStep(currentTourIndex - 1)}
						onNext={() => activateTourStep(currentTourIndex + 1)}
						onExit={exitTour}
					/>
				)}

				<div
					data-viewer-id={activeProject?.id ?? "orientation"}
					className={`custom-scrollbar shrink-0 overflow-y-auto border-b border-zinc-800 bg-zinc-900/10 p-6 ${currentTourStep ? "h-[48%] pt-[5.5rem] lg:pt-6" : "h-[62%]"}`}
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
						{ledgerSections.map((section) => (
							<section
								key={section.id}
								data-lens-section={section.id}
								data-section-count={section.projects.length}
							>
								<h3 className="sticky top-0 z-10 flex items-center justify-between border-y border-zinc-800 bg-black/95 px-3 py-1.5 font-mono text-[9px] tracking-[0.18em] text-zinc-500 uppercase backdrop-blur">
									<span>{section.label}</span>
									<span>{section.projects.length}</span>
								</h3>
								<ul className="m-0 list-none p-0">
									{section.projects.map((project) => {
										const isPinned = project.id === currentPinnedId;
										const isFocused = project.id === currentFocusId;
										const rawDate = project.data.date ? String(project.data.date) : "";
										const lensGroup = getProjectLensGroup(project, currentLens);

										return (
											<li
												key={project.id}
												data-row-id={project.id}
												className={`group flex items-stretch border-b border-zinc-800/50 transition-colors duration-100 ${
													isFocused
														? "bg-zinc-800/80 text-white shadow-[inset_3px_0_0_#84cc16]"
														: "opacity-60 focus-within:opacity-100 hover:bg-zinc-900/50 hover:opacity-100"
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
													data-lens-group={lensGroup}
													disabled={!isHydrated}
													onClick={() => pin(project.id)}
													onMouseEnter={() => setPreview(project.id, "index-hover")}
													onMouseLeave={() => setPreview(null, "index-hover")}
													onFocus={() => setPreview(project.id, "index-focus")}
													onBlur={() => setPreview(null, "index-focus")}
													className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lime-400 disabled:cursor-default"
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
							</section>
						))}
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
}

function TourChapter({
	step,
	index,
	count,
	onPrevious,
	onNext,
	onExit,
}: {
	step: HxoTourStep;
	index: number;
	count: number;
	onPrevious: () => void;
	onNext: () => void;
	onExit: () => void;
}) {
	return (
		<section
			aria-label={`Guided tour chapter ${index + 1} of ${count}`}
			aria-live="polite"
			className="sticky top-[6.5625rem] z-10 shrink-0 border-b border-cyan-900/50 bg-black/95 px-4 py-3 shadow-lg backdrop-blur lg:static"
			data-tour-panel
			data-tour-step={step.id}
			data-tour-index={index}
			data-tour-count={count}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<p className="font-mono text-[9px] tracking-[0.2em] text-cyan-500 uppercase">
						Guided tour · {index + 1}/{count}
					</p>
					<h2 className="mt-1 text-sm font-semibold text-white">{step.title}</h2>
					<p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-400">{step.narration}</p>
				</div>
				<button
					type="button"
					data-tour-control="exit"
					onClick={onExit}
					className="shrink-0 rounded-sm border border-zinc-700 px-2.5 py-1.5 font-mono text-[9px] tracking-wider text-zinc-400 uppercase hover:border-zinc-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
				>
					Exit
				</button>
			</div>
			<div className="mt-3 flex items-center gap-2 font-mono">
				<button
					type="button"
					data-tour-control="previous"
					disabled={index === 0}
					onClick={onPrevious}
					className="rounded-sm border border-zinc-700 px-3 py-1.5 text-[9px] tracking-wider text-zinc-300 uppercase hover:border-cyan-600 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-default disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300"
				>
					← Previous
				</button>
				<div className="flex gap-1" aria-hidden="true">
					{Array.from({ length: count }, (_, dotIndex) => (
						<span
							key={dotIndex}
							className={`h-1 w-4 rounded-full ${dotIndex === index ? "bg-cyan-400" : "bg-zinc-800"}`}
						/>
					))}
				</div>
				<button
					type="button"
					data-tour-control="next"
					disabled={index === count - 1}
					onClick={onNext}
					className="rounded-sm border border-zinc-700 px-3 py-1.5 text-[9px] tracking-wider text-zinc-300 uppercase hover:border-cyan-600 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-default disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300"
				>
					Next →
				</button>
			</div>
		</section>
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
					Principal Mechanical Architect specializing in high-fidelity hardware and program rescue.
					I stabilize the entropy of product development: structure the chaos, index the decisions,
					ship the hardware.
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
