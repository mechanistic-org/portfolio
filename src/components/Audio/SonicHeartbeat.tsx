import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SonicHeartbeatProps {
	audioUrl?: string | null;
}

const SonicHeartbeat: React.FC<SonicHeartbeatProps> = ({ audioUrl }) => {
	if (!audioUrl) return null; // Asystole (Hidden if no audio)

	const [isPlaying, setIsPlaying] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	// Optimistic UI: Assume it exists until proven otherwise?
	// No, Pessimistic is better for "Ghost" avoidance, but might cause pop-in.
	// Let's go Optimistic (true) so it renders immediately for valid files, and vanishes quickly for 404s.
	const [isVisible, setVisible] = useState(true);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Initialize audio
	useEffect(() => {
		const audio = new Audio(audioUrl);

		// Error Handling: If file 404s or fails, we return to Asystole (Hidden)
		const handleError = () => {
			console.warn(`[SonicHeartbeat] Signal Lost: ${audioUrl}`);
			setVisible(false);
		};

		// Success Handling: We confirm visibility (in case we want to animate in)
		const handleCanPlay = () => {
			setVisible(true);
		};

		audio.addEventListener("ended", () => setIsPlaying(false));
		audio.addEventListener("error", handleError);
		audio.addEventListener("canplay", handleCanPlay);

		audioRef.current = audio;

		return () => {
			if (audioRef.current) {
				audioRef.current.removeEventListener("error", handleError);
				audioRef.current.removeEventListener("canplay", handleCanPlay);
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, [audioUrl]);

	if (!isVisible) return null;

	const togglePlay = () => {
		if (!audioRef.current) return;
		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
		setIsPlaying(!isPlaying);
	};

	// --- EINTHOVEN'S TRIANGLE (The P-Q-R-S-T Complex) ---
	// A calibrated path representing a single cardiac cycle.
	// 0,10 (Isoelectric) -> P Wave -> Q dip -> R spike -> S dip -> T Wave -> Isoelectric
	// --- PATHS ---
	// ECG: 11 Points (M + 10 Ls)
	const ecgPath =
		"M 0,10 L 10,10 L 12,8 L 14,10 L 15,11 L 18,-5 L 21,14 L 23,10 L 26,6 L 30,10 L 50,10";

	// Heart Rate Logic
	const beatDuration = isHovered ? 0.6 : 1.2;

	// Animation Cycle Logic (Idle / Ready State)
	// Cycle: Pulse (ECG Only) -> Flash (ECG + EQ Background)
	const [animPhase, setAnimPhase] = useState<"ecg" | "flash">("ecg");

	useEffect(() => {
		// If playing, we stop the cycle.
		if (isPlaying) {
			setAnimPhase("ecg");
			return;
		}

		let timeout: ReturnType<typeof setTimeout>;
		if (animPhase === "ecg") {
			// ECG Phase: ~40bpm = 1.5s
			timeout = setTimeout(() => {
				setAnimPhase("flash");
			}, 1500);
		} else {
			// Flash Phase: ~20bpm hold = 1.5s (Reduced from 3s to clear frame faster)
			timeout = setTimeout(() => {
				setAnimPhase("ecg");
			}, 1500);
		}
		return () => clearTimeout(timeout);
	}, [isPlaying, animPhase]);

	return (
		<div
			className="group relative flex cursor-pointer items-center justify-center p-2"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={togglePlay}
			title={isPlaying ? "Abort Protocol" : "Execute Protocol: Podcast"}
		>
			{/* Container (Phosphor Screen) */}
			<div
				className={`relative h-8 w-16 overflow-hidden rounded-sm border bg-black/40 backdrop-blur-sm transition-colors duration-300 ${isPlaying ? "border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "border-white/10"}`}
			>
				{/* The Grid (Subtle Background) */}
				<div
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage:
							"linear-gradient(#0f0 1px, transparent 1px), linear-gradient(90deg, #0f0 1px, transparent 1px)",
						backgroundSize: "4px 4px",
					}}
				/>

				{/* Headphone Icon (Top Left, No Box) - Idle Only */}
				<AnimatePresence>
					{!isPlaying && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.5 }}
							exit={{ opacity: 0 }}
							className="absolute top-1 left-1 z-10 flex h-3 w-3 items-center justify-center"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="h-2.5 w-2.5 text-white"
							>
								<path d="M11 5L6 9H2v6h4l5 4V5z" />
								<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
								<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
							</svg>
						</motion.div>
					)}
				</AnimatePresence>

				{/* The Trace / Visualization */}
				<svg viewBox="0 -10 50 30" fill="none" className="h-full w-full overflow-visible">
					<AnimatePresence mode="wait">
						{!isPlaying ? (
							/* READY STATE: Cycle (ECG <-> Flash) */
							<>
								{/* Background Flash (EQ) - Only during Flash Phase */}
								<motion.g
									key="idle-flash"
									transform="translate(0, -6)"
									initial={{ opacity: 0 }}
									animate={{ opacity: animPhase === "flash" ? 0.3 : 0 }}
									transition={{ duration: 0.5 }}
								>
									{Array.from({ length: 11 }).map((_, i) => (
										<motion.rect
											key={`flash-${i}`}
											x={i * 4.54}
											y="0"
											width="3.5"
											height="32"
											fill="url(#led-gradient)"
											mask="url(#segment-mask)"
											// Varied heights for "Flash" (Noise pattern)
											animate={{
												scaleY: [0.3, 1.0, 0.3].map(
													(v) => v * (0.2 + (i % 2) * 0.3 + Math.random() * 0.5),
												),
											}}
											transition={{
												duration: 1.5,
												repeat: Infinity,
												ease: "easeInOut",
											}}
										/>
									))}
								</motion.g>

								{/* Dynamic ECG: Draws during 'ecg' phase, Holds then Decays during 'flash' phase */}
								{animPhase === "ecg" ? (
									<motion.path
										key="ecg-draw"
										d={ecgPath}
										stroke="#00ff00"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										fill="none"
										initial={{ pathLength: 0, opacity: 1 }}
										animate={{ pathLength: 1, opacity: 1 }}
										transition={{ duration: 1.5, ease: "linear" }}
									/>
								) : (
									<motion.path
										key="ecg-hold"
										d={ecgPath}
										stroke="#00ff00"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										fill="none"
										initial={{ pathLength: 1, opacity: 1 }}
										animate={{ pathLength: 1, opacity: 0 }} // Decay to empty frame
										transition={{
											opacity: { duration: 0.5, delay: 0.5, ease: "easeOut" },
										}}
									/>
								)}
							</>
						) : (
							/* PLAYING STATE: ONLY EQ (Full Power) */
							<motion.g
								key="eq-active"
								transform="translate(0, -6)"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								{Array.from({ length: 11 }).map((_, i) => (
									<motion.rect
										key={`bar-${i}`}
										x={i * 4.54}
										y="0"
										width="3.5"
										height="32"
										fill="url(#led-gradient)"
										mask="url(#segment-mask)"
										style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
										animate={{
											scaleY: [0.1, 0.9, 0.3, 0.95, 0.2, 0.8, 0.1].map((v) =>
												Math.min(1, Math.max(0.05, v * (0.5 + Math.random()))),
											),
										}}
										transition={{
											// Iambic Cadence: Slower, rhythmic (approx 0.6s - 1.0s)
											duration: 0.6 + Math.random() * 0.4,
											repeat: Infinity,
											repeatType: "mirror",
											ease: "easeInOut", // Organic ease
											delay: i * 0.06, // Slower wave spread
										}}
									/>
								))}
							</motion.g>
						)}
					</AnimatePresence>

					{/* Defs for Gradients/Masks (Inside the SVG) */}
					<defs>
						<linearGradient id="led-gradient" x1="0" x2="0" y1="1" y2="0">
							<stop offset="0%" stopColor="#00ff00" /> {/* Low / Green */}
							<stop offset="70%" stopColor="#ffff00" /> {/* Mid / Yellow (Higher threshold) */}
							<stop offset="95%" stopColor="#ff0000" /> {/* High / Red (Less clipping) */}
						</linearGradient>
						<mask id="segment-mask">
							{/* Visible Area */}
							<rect x="0" y="0" width="100%" height="100%" fill="white" />
							{/* Grid Lines (Black = Hide) */}
							<rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
						</mask>
						<pattern
							id="grid-pattern"
							x="0"
							y="0"
							width="4"
							height="2"
							patternUnits="userSpaceOnUse"
						>
							<rect x="0" y="1.5" width="4" height="0.5" fill="black" />
						</pattern>
					</defs>
				</svg>
			</div>
		</div>
	);
};

export default SonicHeartbeat;
