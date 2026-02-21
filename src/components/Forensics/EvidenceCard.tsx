import React, { useState } from "react";
import {
	IconAlertTriangle,
	IconCash,
	IconTool,
	IconFlame,
	IconCheck,
	IconShare,
	IconCopy,
} from "@tabler/icons-react";

interface Metric {
	label: string;
	value: string;
}

export interface EvidenceCardProps {
	id: string;
	type: "scars" | "financial" | "process" | "governance";
	headline: string;
	context: string;
	impact: string;
	metric: Metric;
	tags: string[];
	projectId: string;
}

const iconMap: Record<string, any> = {
	scars: IconFlame,
	financial: IconCash,
	process: IconTool,
	governance: IconAlertTriangle,
};

const EvidenceCard: React.FC<EvidenceCardProps> = ({
	id,
	type,
	headline,
	context,
	impact,
	metric,
	tags,
	projectId,
}) => {
	const Icon = iconMap[type] || IconTool;
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		const textToCopy = `PROJECT: ${projectId.toUpperCase()}\nTOPIC: ${headline}\n\nCONTEXT:\n${context}\n\nIMPACT:\n${impact}\n\nMETRIC: ${metric.label} = ${metric.value}\n\n#ForensicEngineering #MechanicalEngineering ${tags.join(" ")}`;

		navigator.clipboard.writeText(textToCopy).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<div className="hover:border-primary/50 group relative flex h-full min-h-[280px] w-full flex-col justify-between overflow-hidden border border-neutral-800 bg-neutral-950 p-6 transition-colors">
			{/* Background Grid Effect */}
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] opacity-0 transition-opacity group-hover:opacity-100" />

			{/* Header */}
			<div className="relative z-10 mb-4 flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="text-primary rounded-lg border border-neutral-800 bg-neutral-900 p-2">
						<Icon className="h-5 w-5" stroke={1.5} />
					</div>
					<div>
						<span className="mb-0.5 block font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
							{projectId}
						</span>
						<h3 className="text-lg leading-tight font-bold text-white">{headline}</h3>
					</div>
				</div>

				{/* Shadow Mode Copy Button (Visible on Hover) */}
				<button
					onClick={handleCopy}
					className="rounded-md p-2 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-800 hover:text-white"
					title="Copy for LinkedIn"
				>
					{copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
				</button>
			</div>

			{/* Content */}
			<div className="relative z-10 mb-6 flex-grow">
				<div className="mb-4">
					<span className="mb-1 block text-[10px] tracking-widest text-neutral-600 uppercase">
						Context
					</span>
					<p className="border-l-2 border-neutral-800 pl-3 text-sm leading-relaxed text-neutral-300">
						{context}
					</p>
				</div>
				<div>
					<span className="text-primary/70 mb-1 block text-[10px] tracking-widest uppercase">
						Impact
					</span>
					<p className="text-sm leading-relaxed font-medium text-white">{impact}</p>
				</div>
			</div>

			{/* Footer / Metric */}
			<div className="relative z-10 mt-auto border-t border-neutral-800 pt-4">
				<div className="flex items-end justify-between">
					<div>
						<span className="mb-1 block text-[10px] tracking-widest text-neutral-500 uppercase">
							{metric.label}
						</span>
						<span className="font-mono text-2xl font-bold text-white">{metric.value}</span>
					</div>
					<div className="flex max-w-[50%] flex-wrap justify-end gap-1">
						{tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="rounded border border-neutral-800/50 bg-neutral-900/50 px-1.5 py-0.5 text-[9px] tracking-wider whitespace-nowrap text-neutral-600 uppercase"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EvidenceCard;
