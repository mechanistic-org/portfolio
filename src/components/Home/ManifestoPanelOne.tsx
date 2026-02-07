import React, { useState, useEffect } from "react";
import DisciplineCycler from "./DisciplineCycler";

// DEFINE PURE CSS ANIMATION AT HEAD
// This bypasses React/Framer timing issues entirely
const styles = `
    @keyframes nexusPop {
        0% { transform: scale(0.1); opacity: 0; }
        50% { transform: scale(3.0); opacity: 1; }
        100% { transform: scale(0.85); opacity: 1; }
    }
    .animate-nexus-pop {
        animation: nexusPop 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }
`;

export default function ManifestoPanelOne() {
	const [isSequenceComplete, setIsSequenceComplete] = useState(false);
	const [resetKey, setResetKey] = useState(0);
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [isCompressed, setIsCompressed] = useState(false);

	useEffect(() => {
		// Inject Style Tag
		const styleSheet = document.createElement("style");
		styleSheet.innerText = styles;
		document.head.appendChild(styleSheet);
		return () => {
			document.head.removeChild(styleSheet);
		};
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) {
					// RESET
					setIsSequenceComplete(false);
					setResetKey((p) => p + 1);
				}
			},
			{ threshold: 0 },
		);

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setIsCompressed(entry.contentRect.width < window.innerWidth * 0.6);
			}
		});

		if (containerRef.current) {
			observer.observe(containerRef.current);
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			observer.disconnect();
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black"
		>
			<React.Fragment key={resetKey}>
				{/* Visualizer */}
				<div
					className={`absolute inset-0 z-0 flex items-center justify-center transition-opacity duration-500 ${isCompressed ? "opacity-20" : "opacity-100"}`}
				></div>

				{/* Cycler */}
				{!isSequenceComplete && (
					<div
						className={`relative z-10 flex h-full w-full flex-col items-center justify-center transition-opacity duration-300 ${isCompressed ? "opacity-0" : "opacity-100"}`}
					>
						<DisciplineCycler onComplete={() => setIsSequenceComplete(true)} />
					</div>
				)}

				{/* CREATIVITY - CSS ANIMATION */}
				{isSequenceComplete && (
					<div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
						<div
							// Force Re-render with key
							key={Date.now()}
							// PURE CSS CLASS - NO JS LIBRARY
							className="animate-nexus-pop pointer-events-auto relative z-50 flex items-center justify-center"
						>
							<div
								className={`flex items-center justify-center font-black tracking-tighter text-white ${
									isCompressed
										? "flex-col space-y-[-1vh] opacity-100"
										: "flex-row text-[15vw] md:text-[12vw]"
								} `}
							>
								{isCompressed
									? "CREATIVITY".split("").map((char, i) => (
											<span key={i} className="text-center text-[8vh] leading-none">
												{char}
											</span>
										))
									: "CREATIVITY"}
							</div>
						</div>
					</div>
				)}
			</React.Fragment>
		</div>
	);
}
