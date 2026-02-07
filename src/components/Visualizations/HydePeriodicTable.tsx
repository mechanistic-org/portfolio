import  { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { periodicTraits, type TraitItem } from "../../config/traitsData";

interface HydePeriodicTableProps {
	width?: number;
	height?: number;
}

// Color mapping for categories
const categoryColors: Record<string, string> = {
	Core: "#2E5CFF", // Blue
	Intellectual: "#00C8FF", // Cyan
	Social: "#8B5CF6", // Purple
	Emotional: "#F472B6", // Pink
	Drive: "#10B981", // Green
};

export default function HydePeriodicTable({ width = 800, height = 800 }: HydePeriodicTableProps) {
	const [hoveredTrait, setHoveredTrait] = useState<TraitItem | null>(null);

	// Calculate Spiral Positions
	interface PeriodicNode extends TraitItem {
		x: number;
		y: number;
		r: number;
	}

	const nodes = useMemo<PeriodicNode[]>(() => {
		const spiralData: PeriodicNode[] = [];
		const centerX = width / 2;
		const centerY = height / 2;

		// Spiral parameters
		const a = 20; // Initial radius/offset
		const b = 6; // Spacing between loops

		for (let i = 0; i < periodicTraits.length; i++) {
			// Angle calculation: Sqrt ensures even spacing along the spiral (distributes area)
			const angle = 0.5 * Math.sqrt(i * 100);

			const r = a + b * angle;
			const x = centerX + r * Math.cos(angle);
			const y = centerY + r * Math.sin(angle);

			spiralData.push({
				...periodicTraits[i],
				x,
				y,
				r: Math.max(8, 20 - i * 0.1), // Shrink slightly as we go out? Or keep consistent? Let's keep consistent size roughly.
			});
		}
		return spiralData;
	}, [width, height]);

	// Generate Path Data to connect the nodes (The "Ribbon")
	const ribbonPath = useMemo(() => {
		if (nodes.length === 0) return "";
		let path = `M ${nodes[0].x} ${nodes[0].y}`;
		for (let i = 1; i < nodes.length; i++) {
			// Simple line connection for now, maybe curve later
			path += ` L ${nodes[i].x} ${nodes[i].y}`;
		}
		return path;
	}, [nodes]);

	return (
		<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-neutral-950 shadow-2xl">
			{/* Background Grid/Glow */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,92,255,0.1)_0%,rgba(0,0,0,0)_70%)]" />

			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				className="z-10 h-full max-h-[800px] w-full max-w-[800px]"
			>
				{/* The Ribbon Connector */}
				<path
					d={ribbonPath}
					fill="none"
					stroke="rgba(255,255,255,0.1)"
					strokeWidth="20"
					strokeLinecap="round"
					className="blur-sm"
				/>
				<path
					d={ribbonPath}
					fill="none"
					stroke="rgba(46,92,255,0.2)"
					strokeWidth="2"
					strokeLinecap="round"
				/>

				{/* Nodes */}
				{nodes.map((node, i) => (
					<g
						key={node.name}
						transform={`translate(${node.x}, ${node.y})`}
						onMouseEnter={() => setHoveredTrait(node)}
						onMouseLeave={() => setHoveredTrait(null)}
						className="group cursor-pointer"
					>
						{/* Outer Ring */}
						<circle
							r={18}
							fill={categoryColors[node.category] || "#fff"}
							fillOpacity="0.1"
							stroke={categoryColors[node.category]}
							strokeWidth="1"
							className="group-hover:fill-opacity-100 transition-all duration-300 group-hover:scale-125"
						/>

						{/* Core Dot */}
						<circle r={4} fill="white" />

						{/* Label (Only show for first few or hovered) */}
						{(i < 10 || hoveredTrait?.name === node.name) && (
							<text
								y={-24}
								textAnchor="middle"
								fill="white"
								fontSize="10"
								fontWeight="bold"
								className="pointer-events-none tracking-wider uppercase drop-shadow-md"
							>
								{node.name}
							</text>
						)}

						{/* Periodic Number */}
						<text
							y={12}
							textAnchor="middle"
							fill="rgba(255,255,255,0.5)"
							fontSize="8"
							className="pointer-events-none font-mono"
						>
							{i + 1}
						</text>
					</g>
				))}
			</svg>

			{/* Float HUD for Detail */}
			<AnimatePresence>
				{hoveredTrait && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="absolute right-8 bottom-8 z-20 min-w-[200px] rounded-xl border border-white/10 bg-neutral-900/90 p-4 shadow-2xl backdrop-blur-md"
					>
						<div className="mb-1 font-mono text-xs text-neutral-500">{hoveredTrait.category}</div>
						<div className="mb-2 text-xl font-bold text-white">{hoveredTrait.name}</div>
						<div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
							<div
								className="h-full"
								style={{ width: "75%", backgroundColor: categoryColors[hoveredTrait.category] }}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
