import React, { useMemo, useState } from "react";

interface EntropyEvent {
	date: string;
	score: number;
	snippet: string;
	type: string;
}

interface ForensicSeismographProps {
	data: EntropyEvent[];
}

const ForensicSeismograph: React.FC<ForensicSeismographProps> = ({ data }) => {
	const [hoveredEvent, setHoveredEvent] = useState<EntropyEvent | null>(null);

	// Filter and Sort
	const processedData = useMemo(() => {
		if (!data || data.length === 0) return [];
		return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	}, [data]);

	if (processedData.length === 0) return null;

	// Dimensions
	const height = 30; // Compact height for footer
	const width = 200; // Fixed width for now, or percent
	const barWidth = 2;
	const gap = 1;

	// Normalize scores (0-10 scale typically)
	const maxScore = Math.max(...processedData.map((d) => d.score), 10);

	return (
		<div className="flex h-full items-center gap-4 select-none">
			{/* LABEL */}
			<div className="flex h-full flex-col items-end justify-center">
				<span className="font-mono text-[9px] leading-none tracking-widest text-neutral-500 uppercase">
					PROJECT
				</span>
				<span className="font-mono text-[9px] leading-none tracking-widest text-emerald-500 uppercase">
					ENTROPY
				</span>
			</div>

			{/* VIZ */}
			<div
				className="relative flex h-[30px] items-end border-b border-emerald-900/30"
				style={{ width: `${Math.min(processedData.length * (barWidth + gap), 300)}px` }}
				onMouseLeave={() => setHoveredEvent(null)}
			>
				{processedData.map((event, i) => {
					const h = (event.score / maxScore) * 100;
					return (
						<div
							key={i}
							className="group relative cursor-crosshair bg-emerald-700/50 transition-colors duration-200 hover:bg-emerald-400"
							style={{
								width: `${barWidth}px`,
								height: `${Math.max(h, 10)}%`, // Min height for visibility
								marginLeft: i === 0 ? 0 : `${gap}px`,
							}}
							onMouseEnter={() => setHoveredEvent(event)}
						>
							{/* Peak Dot */}
							{event.score > 7 && (
								<div className="absolute -top-1 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-white" />
							)}
						</div>
					);
				})}

				{/* TOOLTIP OVERLAY (Absolute constrained to widget or fixed) */}
				{/* TOOLTIP OVERLAY (Absolute constrained to widget or fixed) */}
				{hoveredEvent && (
					<div className="pointer-events-none absolute top-full left-0 z-[100] mt-4 max-w-[300px] min-w-[200px] border border-white/20 bg-black/95 p-3 text-xs shadow-2xl backdrop-blur-md">
						<div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
							<span className="font-mono font-bold text-emerald-500">{hoveredEvent.date}</span>
							<span className="font-mono text-neutral-500">MAG: {hoveredEvent.score}</span>
						</div>
						<div className="font-mono text-[10px] leading-tight whitespace-pre-wrap text-white/80">
							{hoveredEvent.snippet || "No event data available."}
						</div>
					</div>
				)}
			</div>

			{/* NEW: Audit Rec #2 - Accessible Data Table */}
			<table className="sr-only">
				<caption>Project Entropy Timeline</caption>
				<thead>
					<tr>
						<th>Date</th>
						<th>Magnitude</th>
						<th>Event Description</th>
					</tr>
				</thead>
				<tbody>
					{processedData.map((d, i) => (
						<tr key={i}>
							<td>{d.date}</td>
							<td>{d.score}/10</td>
							<td>{d.snippet}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ForensicSeismograph;
