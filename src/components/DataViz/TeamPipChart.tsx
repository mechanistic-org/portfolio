import React from "react";

interface TeamPipChartProps {
	internal: number;
	external: number;
	core?: number;
}

const TeamPipChart: React.FC<TeamPipChartProps> = ({ internal, external, core = 0 }) => {
	// Config
	const pipWidth = 3;
	const pipGap = 2;

	return (
		<div className="flex h-full w-full flex-col justify-center">
			{/* HEADER */}
			<div className="mb-1 flex w-full items-center justify-between">
				<span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
					Team
				</span>
			</div>

			{/* ROWS CONTAINER */}
			<div className="flex w-full flex-col gap-0.5">
				{/* ROW 1: INT */}
				<div className="flex w-full items-center justify-between">
					{/* PIPS */}
					<svg width="70%" height="6" className="overflow-visible" shapeRendering="crispEdges">
						{Array.from({ length: internal }).map((_, i) => {
							const isCore = i < core;
							return (
								<rect
									key={`int-${i}`}
									x={i * (pipWidth + pipGap)}
									y={0}
									width={pipWidth}
									height={6}
									fill={isCore ? "#ffffff" : "#454545"} // Solid White vs Solid Grey
									opacity={1}
									className={isCore ? "animate-pulse" : ""}
								/>
							);
						})}
					</svg>
					{/* METRIC */}
					<div className="flex min-w-[50px] items-center justify-end gap-1.5">
						<span className="font-mono text-[8px] tracking-wider text-neutral-600">INT</span>
						<span className="font-mono text-xs leading-none font-bold text-white">{internal}</span>
					</div>
				</div>

				{/* ROW 2: EXT */}
				<div className="flex w-full items-center justify-between">
					{/* PIPS */}
					<svg width="70%" height="6" className="overflow-visible" shapeRendering="crispEdges">
						{Array.from({ length: external }).map((_, i) => (
							<rect
								key={`ext-${i}`}
								x={i * (pipWidth + pipGap)}
								y={0}
								width={pipWidth}
								height={6}
								fill="#F59E0B"
								opacity={1}
							/>
						))}
					</svg>
					{/* METRIC */}
					<div className="flex min-w-[50px] items-center justify-end gap-1.5">
						<span className="font-mono text-[8px] tracking-wider text-amber-900">EXT</span>
						<span className="font-mono text-xs leading-none font-bold text-amber-500">
							{external}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeamPipChart;
