import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DIGIDESIGN ANIMATED LOGO COMPONENT
 * Restores the classic "WebTV-era" d-animation using Sovereign Assets.
 *
 * ASSET SOURCE: /assets/r2/branding/digi_d/
 * SEQUENCE: Blue -> Cyan -> Green -> Orange -> Purple -> Grey
 */

const SEQUENCE = [
	{
		color: "blue",
		src: "/assets/r2/c24/bubbles/05_paper_trail/digi_d_sequence/digi_logo_from_scratch_blue.png",
	},
	{
		color: "cyan",
		src: "/assets/r2/c24/bubbles/05_paper_trail/digi_d_sequence/digi_logo_from_scratch_cyan.png",
	},
	{
		color: "green",
		src: "/assets/r2/c24/bubbles/05_paper_trail/digi_d_sequence/digi_logo_from_scratch_green.png",
	},
	{
		color: "orange",
		src: "/assets/r2/c24/bubbles/05_paper_trail/digi_d_sequence/digi_logo_from_scratch_orange.png",
	},
	{
		color: "purple",
		src: "/assets/r2/c24/bubbles/05_paper_trail/digi_d_sequence/digi_logo_from_scratch_purple.png",
	},
	{
		color: "grey",
		src: "/assets/r2/c24/bubbles/05_paper_trail/digi_d_sequence/digi_logo_from_scratch_grey.png",
	},
];

interface Props {
	className?: string;
	width?: number;
	interval?: number; // ms per frame (default: 3000ms for slow cycle, or 83ms for animation)
	mode?: "cycle" | "animate" | "static"; // cycle = slow fade / animate = fast cut
}

export default function DigidesignLogo({
	className,
	width = 400,
	interval = 2000,
	mode = "cycle",
}: Props) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (mode === "static") return;

		const timer = setInterval(() => {
			setIndex((prev) => (prev + 1) % SEQUENCE.length);
		}, interval);

		return () => clearInterval(timer);
	}, [interval, mode]);

	const currentFrame = SEQUENCE[index];

	return (
		<div
			className={`relative ${className}`}
			style={{ width, aspectRatio: "1/1" }}
			aria-label="Digidesign Animated Logo"
		>
			<AnimatePresence mode="wait">
				<motion.img
					key={currentFrame.color}
					src={currentFrame.src}
					alt={`Digidesign Logo (${currentFrame.color})`}
					className="absolute inset-0 h-full w-full object-contain"
					initial={{ opacity: mode === "cycle" ? 0 : 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: mode === "cycle" ? 0 : 1 }}
					transition={{ duration: mode === "cycle" ? 0.5 : 0 }}
				/>
			</AnimatePresence>
		</div>
	);
}
