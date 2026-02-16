import React from "react";
import { setTeamOpen } from "../../stores/dossierStore";

interface TeamPipChartProps {
	internal: number;
	external: number;
	core?: number;
}

const TeamPipChart: React.FC<TeamPipChartProps> = ({ internal, external, core = 0 }) => {
	// Config
	const pipWidth = 3;
	const pipGap = 2;

	const renderPips = (count: number, isInternal: boolean) => {
		const rows: React.ReactNode[] = [];
		let remaining = count;
		let rowIdx = 0;

		while (remaining > 0) {
			const rowCount = Math.min(remaining, 25); // Increased to 25 to fit better
			rows.push(
				<div key={`row-${rowIdx}`} className="flex shrink-0 items-center" style={{ height: 6 }}>
					<svg
						width={rowCount * (pipWidth + pipGap)}
						height="6"
						className="overflow-visible"
						shapeRendering="crispEdges"
					>
						{Array.from({ length: rowCount }).map((_, i) => {
							const globalIdx = rowIdx * 25 + i;
							const isCorePip = isInternal && globalIdx < core;
							return (
								<rect
									key={`pip-${globalIdx}`}
									x={i * (pipWidth + pipGap)}
									y={0}
									width={pipWidth}
									height={6}
									fill={isInternal ? (isCorePip ? "#ffffff" : "#737373") : "#F59E0B"}
									className={isCorePip ? "animate-pulse" : ""}
								/>
							);
						})}
					</svg>
				</div>,
			);
			remaining -= rowCount;
			rowIdx++;
		}
		return <div className="flex flex-col gap-1">{rows}</div>;
	};

	return (
		<div
			onClick={() => setTeamOpen(true)}
			className="flex h-full w-full cursor-pointer flex-col justify-center gap-2 transition-opacity hover:opacity-80"
			title="View Team Roster"
		>
			{/* ROW 1: INT */}
			<div className="flex w-full items-start justify-between">
				{renderPips(internal, true)}
				<div className="flex min-w-[50px] items-center justify-end gap-1.5 pt-0.5">
					<span className="font-mono text-[8px] tracking-wider text-neutral-600">INT</span>
					<span className="font-mono text-xs leading-none font-bold text-white">{internal}</span>
				</div>
			</div>

			{/* ROW 2: EXT */}
			<div className="flex w-full items-start justify-between">
				{renderPips(external, false)}
				<div className="flex min-w-[50px] items-center justify-end gap-1.5 pt-0.5">
					<span className="font-mono text-[8px] tracking-wider text-amber-900">EXT</span>
					<span className="font-mono text-xs leading-none font-bold text-amber-500">
						{external}
					</span>
				</div>
			</div>
		</div>
	);
};

export default TeamPipChart;
