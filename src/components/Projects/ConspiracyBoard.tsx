import { useRef } from "react";
import { motion } from "framer-motion";

interface Props {
	images: { src: string; title: string }[];
}

export default function ConspiracyBoard({ images }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={containerRef}
			className="relative h-full w-full cursor-crosshair overflow-hidden bg-neutral-900"
		>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />

			{images.map((img, index) => {
				// Randomize initial position and rotation
				// Randomize initial position and rotation (Deterministic)
				const seed = index * 123.45; // Stable seed
				const randomX = Math.sin(seed) * 0.5 * 60; // -30 to 30 roughly
				const randomY = Math.cos(seed * 0.9) * 0.5 * 60;
				const randomRotate = Math.sin(seed * 0.5) * 10; // -10deg to 10deg

				return (
					<Polaroid
						key={index}
						src={img.src}
						title={img.title}
						initialRotate={randomRotate}
						initialX={randomX}
						initialY={randomY}
						containerRef={containerRef}
					/>
				);
			})}

			<div className="pointer-events-none absolute bottom-8 left-8 border border-red-500/50 bg-black/80 p-4 backdrop-blur-md">
				<h3 className="mb-1 font-mono text-xs tracking-widest text-red-500 uppercase">
					Evidence Locker
				</h3>
				<p className="font-mono text-xs text-neutral-400">
					Drag items to investigate relationships.
				</p>
			</div>
		</div>
	);
}

const Polaroid = ({ src, title, initialRotate, initialX, initialY, containerRef }: any) => {
	return (
		<motion.div
			drag
			dragConstraints={containerRef}
			dragElastic={0.2}
			whileDrag={{ scale: 1.1, zIndex: 100, rotate: 0, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
			initial={{
				rotate: initialRotate,
				x: `${initialX}%`, // Using CSS translate for initial random scattering
				y: `${initialY}%`,
			}}
			className="absolute top-1/2 left-1/2 flex w-64 -translate-x-1/2 -translate-y-1/2 transform flex-col items-center bg-[#f0f0f0] p-3 pb-8 shadow-lg"
			style={{ touchAction: "none" }}
		>
			<div className="group relative mb-2 aspect-square w-full overflow-hidden bg-neutral-800">
				<img
					src={src}
					alt={title}
					className="pointer-events-none h-full w-full object-cover contrast-125 grayscale transition-all duration-500 group-hover:grayscale-0"
				/>
				<div className="pointer-events-none absolute inset-0 bg-red-500/10 opacity-0 mix-blend-multiply transition-opacity group-hover:opacity-100" />
			</div>
			<div
				className="font-handwriting mt-2 rotate-1 skew-x-1 transform text-sm font-bold text-neutral-800"
				style={{ fontFamily: '"Courier New", Courier, monospace' }}
			>
				{title.toUpperCase()}
			</div>

			{/* Tape Effect */}
			<div className="absolute -top-3 left-1/2 h-8 w-16 -translate-x-1/2 rotate-2 border-r border-l border-white/20 bg-yellow-100/30 backdrop-blur-sm" />
		</motion.div>
	);
};
