import React from "react";

interface TextShimmerProps {
	children: React.ReactNode;
	className?: string;
	duration?: number;
}

export const TextShimmer = ({
	children,
	className = "",
	duration = 4, // Slowed down by ~50% (was 2.5)
}: TextShimmerProps) => {
	return (
		<span
			// Gradient: Zinc-500 -> Zinc-400 -> White -> Zinc-400 -> Zinc-500
			// Diffused: Window widened from 10% (45-55) to 30% (35-65) to kill the "sharp line"
			className={`animate-shimmer inline-block bg-size-[250%_100%] bg-clip-text text-transparent ${className}`}
			style={{
				backgroundImage:
					"linear-gradient(110deg, #a1a1aa 35%, #d4d4d8 45%, #ffffff 50%, #d4d4d8 55%, #a1a1aa 65%)",
				animationDuration: `${duration}s`,
				animationTimingFunction: "ease-in-out",
			}}
		>
			{children}
		</span>
	);
};

export default TextShimmer;
