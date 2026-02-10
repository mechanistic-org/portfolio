import React, { useState, useEffect, useRef } from "react";

// --- SCRAMBLE HOOK ---
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
function useScramble(text: string, active: boolean, speed: number = 2) {
	const [display, setDisplay] = useState(text.replace(/./g, "█")); // Start fully redacted
	const [iteration, setIteration] = useState(0);

	useEffect(() => {
		if (!active) {
			setDisplay(text.replace(/[^\s]/g, "█")); // Reset to redacted if inactive
			setIteration(0);
			return;
		}

		const interval = setInterval(() => {
			setDisplay((prev) => {
				if (iteration >= text.length) {
					clearInterval(interval);
					return text;
				}

				return text
					.split("")
					.map((char, index) => {
						if (index < iteration) return text[index]; // Reveal
						return CHARS[Math.floor(Math.random() * CHARS.length)]; // Scramble remainder
					})
					.join("");
			});
			setIteration((prev) => prev + speed / 3);
		}, 30);

		return () => clearInterval(interval);
	}, [active, text, iteration, speed]);

	return display;
}

// --- MAIN COMPONENT ---
const DecryptionDossier: React.FC = () => {
	const [text] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div
			className={`transition-all duration-300 ease-in-out ${isOpen ? "w-full max-w-md" : "w-auto"}`}
		>
			<div
				className={`border border-white/20 bg-black/80 p-4 shadow-2xl backdrop-blur-md ${isOpen ? "rounded-lg" : "cursor-pointer rounded-full hover:border-green-500/50"}`}
				onClick={() => !isOpen && setIsOpen(true)}
			>
				{/* Header / Toggle */}
				<div className="mb-2 flex items-center justify-between">
					<h2
						className={`flex items-center gap-2 font-bold tracking-widest text-white uppercase ${isOpen ? "text-xl" : "text-sm"}`}
					>
						{isOpen ? "INTELLIGENCE_DOSSIER" : "DOSSIER // ACCESS"}
						{!isOpen && <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>}
					</h2>
					{isOpen && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								setIsOpen(false);
							}}
							className="rounded border border-transparent px-2 py-1 font-mono text-xs text-white/50 hover:border-white/20 hover:text-white"
						>
							MINIMIZE [-]
						</button>
					)}
				</div>

				{/* Content (Only when open) */}
				{isOpen && (
					<>
						<div className="mb-6 flex items-center gap-2">
							<div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
							<span className="font-mono text-[10px] tracking-[0.2em] text-green-500 uppercase">
								Live Feed
							</span>
						</div>

						<div className="min-h-[300px] space-y-6 border-t border-white/10 pt-4 font-mono text-sm leading-relaxed text-neutral-300">
							{text.split("\n").map((line, i) => (
								<div key={i} className="min-h-[1.5em]">
									{line.trim() === "" ? (
										<br />
									) : (
										<div
											className={
												line.includes("//")
													? "font-bold text-white"
													: "mb-1 text-xs tracking-widest text-neutral-500 uppercase"
											}
										>
											{line}
										</div>
									)}
								</div>
							))}
						</div>

						<div className="mt-8 border-t border-white/10 pt-4">
							<button className="w-full bg-white py-3 font-mono text-xs font-bold tracking-widest text-black uppercase transition-colors hover:bg-neutral-200">
								Download Complete File
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default DecryptionDossier;
