import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@nanostores/react";
import { isDossierOpen, setDossierOpen } from "../../stores/dossierStore";

interface CaseTheoryItem {
	title: string;
	star: string;
	fidelity?: string;
}

interface ForensicDrawerProps {
	children: React.ReactNode;
	title?: string;
	metrics?: any;
	caseTheory?: CaseTheoryItem[];
}

const ForensicDrawer: React.FC<ForensicDrawerProps> = ({
	children,
	title = "CONFIDENTIAL",
	metrics,
	caseTheory = [],
}) => {
	const isOpen = useStore(isDossierOpen);

	// Close on Escape key
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setDossierOpen(false);
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, []);

	// Lock Body Scroll
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	return (
		<>
			{/* TOGGLE BUTTON REMOVED (Moved to ProjectManifestHUD) */}

			<AnimatePresence>
				{isOpen && (
					<>
						{/* BACKDROP */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setDossierOpen(false)}
							className="fixed inset-0 z-999 bg-black/60 backdrop-blur-xs"
						/>

						{/* DRAWER */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed top-0 right-0 z-1000 flex h-full w-full flex-col border-l border-emerald-500/20 bg-black/95 shadow-2xl shadow-emerald-900/20 md:w-[650px] lg:w-[800px]"
						>
							{/* HEADER */}
							<div className="flex items-center justify-between border-b border-white/10 bg-linear-to-b from-white/5 to-transparent p-6">
								<div className="flex flex-col">
									<h2 className="font-mono text-xs tracking-[0.2em] text-emerald-500 uppercase">
										Forensic Analysis
									</h2>
									<h1 className="font-heading mt-1 text-2xl font-bold tracking-tighter text-white uppercase">
										{title}
									</h1>
								</div>
								<button
									onClick={() => setDossierOpen(false)}
									className="group flex h-10 w-10 items-center justify-center border border-white/10 transition-colors hover:border-red-500/50 hover:bg-red-500/10"
								>
									<span className="font-mono text-xl text-neutral-400 group-hover:text-red-400">
										×
									</span>
								</button>
							</div>

							{/* SCROLLABLE CONTENT */}
							<div className="scrollbar-thin scrollbar-thumb-emerald-900 scrollbar-track-black flex-1 overflow-y-auto p-8 md:p-12">
								{/* METRICS HEADER (If provided) */}
								{metrics && (
									<div className="mb-12 grid grid-cols-2 gap-4 border border-white/5 bg-white/5 p-6 font-mono text-xs text-neutral-400">
										{Object.entries(metrics).map(([key, value]: [string, any]) => (
											<div key={key} className="flex flex-col">
												<span className="text-neutral-600 uppercase">{key}</span>
												<span className="text-emerald-400">{String(value)}</span>
											</div>
										))}
									</div>
								)}

								{/* CASE THEORY (STAR List) */}
								{caseTheory && caseTheory.length > 0 && (
									<div className="mb-12 border-l-2 border-emerald-500/30 pl-6">
										<h3 className="mb-4 font-mono text-xs tracking-widest text-emerald-500 uppercase">
											Case Theory (Interventions)
										</h3>
										<ul className="space-y-6">
											{caseTheory.map((item, idx) => (
												<li key={idx}>
													<div className="mb-1 font-bold tracking-tight text-white uppercase">
														{idx + 1}. {item.title}
													</div>
													<div className="font-mono text-xs leading-relaxed text-neutral-400">
														{item.star}
													</div>
												</li>
											))}
										</ul>
									</div>
								)}

								{/* MAIN MARKDOWN CONTENT */}
								{/* 
                                    We use the 'prose' class from Tailwind Typography.
                                    We customize it to match the dark/forensic theme.
                                */}
								<div className="prose prose-invert prose-emerald prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-xl prose-h2:text-white prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-p:text-neutral-400 prose-p:leading-relaxed prose-strong:text-white prose-strong:font-bold prose-blockquote:border-l-2 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-900/10 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:text-emerald-100/80 prose-blockquote:not-italic prose-li:text-neutral-400 prose-li:marker:text-emerald-800 min-w-full">
									{children}
								</div>

								<div className="mt-24 border-t border-white/10 pt-8 text-center font-mono text-xs text-neutral-600">
									[ END OF RECORD ]
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default ForensicDrawer;
