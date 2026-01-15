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
	const ecgPath =
		"M 0,10 L 10,10 L 12,8 L 14,10 L 15,11 L 18,-5 L 21,14 L 23,10 L 26,6 L 30,10 L 50,10";

	// Heart Rate Logic
	// Resting: 60 BPM (1s duration)
	// Tachycardia (Hover): 100 BPM (0.6s duration)
	// Perturbation (Playing): Random jitter handled via transform
	const beatDuration = isHovered ? 0.6 : 1.2;

	return (
		<div
			className="group relative flex cursor-pointer items-center justify-center p-2"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={togglePlay}
			title={isPlaying ? "Abort Protocol" : "Execute Protocol: Podcast"}
		>
			{/* Container (Phosphor Screen) */}
			<div className="relative h-8 w-16 overflow-hidden rounded-sm border border-white/10 bg-black/40 backdrop-blur-sm">
				{/* The Grid (Subtle Background) */}
				<div
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage:
							"linear-gradient(#0f0 1px, transparent 1px), linear-gradient(90deg, #0f0 1px, transparent 1px)",
						backgroundSize: "4px 4px",
					}}
				/>

				{/* The Trace */}
				<svg viewBox="0 -10 50 30" fill="none" className="h-full w-full overflow-visible">
					{/* Shadow Trace (Phosphor Decay) */}
					<motion.path
						d={ecgPath}
						stroke="#00ff00"
						strokeWidth="1"
						strokeOpacity="0.2"
						fill="none"
						initial={{ pathLength: 0, x: -10 }}
						animate={{
							pathLength: [0, 1, 1],
							opacity: [0, 0.5, 0],
							x: 0,
						}}
						transition={{
							duration: beatDuration,
							repeat: Infinity,
							ease: "linear",
							delay: 0.1, // Slight lag for "ghost" effect
						}}
					/>

					{/* The Trace */}
					<svg viewBox="0 -10 50 30" fill="none" className="h-full w-full overflow-visible">
						<AnimatePresence mode="wait">
							{!isPlaying ? (
								/* IDLE STATE: The Einthoven ECG (Green) */
								<motion.path
									key="ecg"
									d={ecgPath}
									stroke="#00ff00"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="none"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1, pathLength: [0, 1] }}
									exit={{ opacity: 0 }}
									transition={{
										pathLength: { duration: 1.2, repeat: Infinity, ease: "linear" },
										opacity: { duration: 0.3 },
									}}
								/>
							) : (
								/* ACTIVE STATE: NotebookLM Dual-Voice Visualization */
								/* Two overlapping sine waves (Blue & Green) simulating conversation */
								<>
									{/* Voice A (Blue/Purple) - The "Host" */}
									<motion.path
										key="voice-a"
										// A smooth sine-like curve
										d="M 0,10 Q 12.5,0 25,10 T 50,10"
										stroke="#8AB4F8" // NotebookLM Blue-ish
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										fill="none"
										animate={{
											// Scale Y to simulate amplitude modulation (Active Talking)
											scaleY: [1, 1.8, 0.5, 1.5, 0.8, 1.2, 1],
											// Slight horizontal shift for flow
											x: [-2, 0, 2, 0, -2]
										}}
										transition={{
											scaleY: { duration: 2.1, repeat: Infinity, ease: "easeInOut" },
											x: { duration: 4, repeat: Infinity, ease: "linear" }
										}}
										style={{ transformOrigin: "center" }}
									/>

									{/* Voice B (Green) - The "Guest" (Offset phase) */}
									<motion.path
										key="voice-b"
										d="M 0,10 Q 12.5,20 25,10 T 50,10" // Inverted starting phase
										stroke="#81C995" // NotebookLM Green-ish
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										fill="none"
										animate={{
											scaleY: [1, 0.6, 1.4, 0.7, 1.3, 0.9, 1], // Counter-phase modulation
											x: [2, 0, -2, 0, 2]
										}}
										transition={{
											scaleY: { duration: 1.7, repeat: Infinity, ease: "easeInOut" },
											x: { duration: 3.5, repeat: Infinity, ease: "linear" }
										}}
										style={{ transformOrigin: "center" }}
									/>
								</>
							)}
						</AnimatePresence>
					</svg>

					{/* Status Text (Tiny) */}
					<div className="absolute top-0.5 right-1 font-mono text-[6px] tracking-tighter text-white/50">
						{isPlaying ? "VOX" : isHovered ? "100" : "60"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SonicHeartbeat;
