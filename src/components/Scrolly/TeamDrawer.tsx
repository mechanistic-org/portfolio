import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@nanostores/react";
import { isTeamOpen, setTeamOpen } from "../../stores/dossierStore";

interface TeamMember {
	name: string;
	role: string;
	org: string;
}

interface WarStory {
	label: string;
	value: string;
	description: string;
}

interface TeamDrawerProps {
	team: TeamMember[];
	warStories?: WarStory[];
	title?: string;
}

const TeamDrawer: React.FC<TeamDrawerProps> = ({
	team = [],
	warStories = [],
	title = "Project Team",
}) => {
	const isOpen = useStore(isTeamOpen);
	const [activeTab, setActiveTab] = useState<"roster" | "forensics">("roster");

	// Close on Escape key
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setTeamOpen(false);
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, []);

	// Auto-switch tab if no team but has stories
	useEffect(() => {
		if (isOpen && team.length === 0 && warStories.length > 0) {
			setActiveTab("forensics");
		}
	}, [isOpen, team, warStories]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* INVISIBLE CLICK-AWAY BACKDROP */}
					<div
						className="fixed inset-0 z-[900] bg-transparent"
						onClick={() => setTeamOpen(false)}
					/>

					{/* POPOVER DRAWER (Positioned under the HUD) */}
					<motion.div
						initial={{ opacity: 0, y: -20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -20, scale: 0.95 }}
						transition={{ type: "spring", damping: 25, stiffness: 400 }}
						className="fixed top-[70px] left-4 z-[1000] flex w-[90vw] flex-col overflow-hidden rounded-xl border border-white/20 bg-neutral-900/95 shadow-2xl backdrop-blur-md md:left-24 md:w-[450px]"
						style={{ maxHeight: "calc(100vh - 100px)" }}
					>
						{/* HOLOGRAPHIC HEADER */}
						<div className="relative overflow-hidden border-b border-white/10 bg-black/40 p-4">
							{/* Scanline Effect */}
							<div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

							<div className="relative z-10 flex items-center justify-between">
								<div>
									<h2 className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-emerald-500 uppercase">
										<span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
										Active Roster
									</h2>
									<h1 className="font-heading mt-1 text-lg font-bold tracking-tight text-white uppercase">
										{title}
									</h1>
								</div>
								<button
									onClick={() => setTeamOpen(false)}
									className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
								>
									✕
								</button>
							</div>
						</div>

						{/* TABS (If War Stories Exist) */}
						{warStories.length > 0 && team.length > 0 && (
							<div className="flex border-b border-white/10 bg-black/20">
								<button
									onClick={() => setActiveTab("roster")}
									className={`flex-1 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${activeTab === "roster" ? "border-b-2 border-emerald-500 bg-emerald-500/10 text-emerald-400" : "text-neutral-500 hover:text-white"}`}
								>
									Personnel ({team.length})
								</button>
								<button
									onClick={() => setActiveTab("forensics")}
									className={`flex-1 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${activeTab === "forensics" ? "border-b-2 border-amber-500 bg-amber-500/10 text-amber-400" : "text-neutral-500 hover:text-white"}`}
								>
									War Stories ({warStories.length})
								</button>
							</div>
						)}

						{/* CONTENT AREA */}
						<div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-700 flex-1 overflow-y-auto p-4">
							{/* ROSTER TAB */}
							{activeTab === "roster" && (
								<div className="space-y-1">
									{team.length > 0 ? (
										team.map((member, idx) => (
											<motion.div
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: idx * 0.05 }}
												key={idx}
												className="group flex flex-col rounded border border-transparent bg-white/5 p-3 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
											>
												<div className="flex items-baseline justify-between">
													<span className="text-sm font-bold tracking-tight text-white transition-colors group-hover:text-emerald-400">
														{member.name}
													</span>
													<span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
														{member.org}
													</span>
												</div>
												<div className="mt-1 font-mono text-[10px] text-neutral-400">
													{member.role}
												</div>
											</motion.div>
										))
									) : (
										<div className="py-8 text-center font-mono text-xs text-neutral-600">
											CLASSIFIED // NO ACCESS
										</div>
									)}
								</div>
							)}

							{/* FORENSICS TAB (WAR STORIES) */}
							{activeTab === "forensics" && (
								<div className="space-y-3">
									{warStories.map((story, idx) => (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: idx * 0.1 }}
											key={idx}
											className="rounded border border-amber-500/20 bg-amber-900/10 p-4"
										>
											<h3 className="mb-1 text-xs font-bold tracking-wider text-amber-500 uppercase">
												{story.label} // {story.value}
											</h3>
											<p className="font-mono text-[11px] leading-relaxed text-amber-100/80">
												{story.description}
											</p>
										</motion.div>
									))}
								</div>
							)}
						</div>

						{/* FOOTER */}
						<div className="flex items-center justify-between border-t border-white/5 bg-black/60 p-2 px-4">
							<span className="font-mono text-[9px] text-neutral-600">
								SECURE CONNECTION ESTABLISHED
							</span>
							<div className="flex gap-1">
								<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
								<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500/50 delay-75" />
								<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500/20 delay-150" />
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default TeamDrawer;
