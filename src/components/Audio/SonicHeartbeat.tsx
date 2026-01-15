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
							/* ACTIVE STATE: Digital EQ Visualization */
							/* Segmented LED Bars (Green -> Yellow -> Red) */
							<g transform="translate(4, 5)">
								{/* EQ Container: 8 Bars */}
								{Array.from({ length: 8 }).map((_, i) => (
									<motion.rect
										key={`bar-${i}`}
										x={i * 5.5} // Spacing
										y="0"
										width="4"
										height="20"
										fill="url(#led-gradient)"
										// Mask creates the "segment" look
										mask="url(#segment-mask)"
										style={{
											transformBox: "fill-box",
											transformOrigin: "bottom",
										}}
										animate={{
											// Animate ScaleY to simulate audio levels
											scaleY: [0.2, 0.8, 0.4, 0.9, 0.3, 0.7, 0.2].map((v) =>
												Math.min(1, Math.max(0.1, v * (0.5 + Math.random()))),
											),
										}}
										transition={{
											duration: 0.4 + Math.random() * 0.2,
											repeat: Infinity,
											repeatType: "mirror",
											ease: "linear",
											delay: i * 0.05,
										}}
									/>
								))}
							</g>
						)}
					</AnimatePresence>

					{/* Defs for Gradients/Masks (Inside the SVG) */}
					<defs>
						<linearGradient id="led-gradient" x1="0" x2="0" y1="1" y2="0">
							<stop offset="0%" stopColor="#00ff00" /> {/* Low / Green */}
							<stop offset="60%" stopColor="#ffff00" /> {/* Mid / Yellow */}
							<stop offset="100%" stopColor="#ff0000" /> {/* High / Red */}
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
							{/* 1.5px Visible, 0.5px Gap? No. Pattern fills with what we want to DRAW. */}
							{/* We are drawing on the MASK. White = Show, Black = Hide. */}
							{/* If we want gaps, we need BLACK stripes. */}
							<rect x="0" y="1.5" width="4" height="0.5" fill="black" />
						</pattern>
					</defs>
				</svg>

				{/* Status Text (Tiny) */}
				<div className="absolute top-0.5 right-1 font-mono text-[6px] tracking-tighter text-white/50">
					{isPlaying ? "VOX" : isHovered ? "100" : "60"}
				</div>
			</div>
		</div>
	);
};

export default SonicHeartbeat;
