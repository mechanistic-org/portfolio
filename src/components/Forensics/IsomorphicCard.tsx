import React, { useState } from "react";
import { IconCpu, IconCode, IconCopy, IconCheck, IconScale, IconLink } from "@tabler/icons-react";

export interface IsomorphicCardProps {
	label: string;
	hardware_point: string;
	software_point: string;
	principle: string;
}

const IsomorphicCard: React.FC<IsomorphicCardProps> = ({
	label,
	hardware_point,
	software_point,
	principle,
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		const textToCopy = `ISOMORPHIC PRINCIPLE: ${label}\n\nHARDWARE:\n${hardware_point}\n\nSOFTWARE:\n${software_point}\n\nLAW:\n${principle}`;
		navigator.clipboard.writeText(textToCopy).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<div className="group relative flex w-full flex-col overflow-hidden border border-neutral-800 bg-neutral-950/50 p-6 transition-all hover:border-orange-500/30 hover:bg-neutral-950">
			{/* Scanline/Grid Effect */}
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[length:24px_24px]" />

			{/* Header */}
			<div className="relative z-10 mb-6 flex items-start justify-between border-b border-neutral-800 pb-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 p-2 text-orange-500">
						<IconScale className="h-5 w-5" stroke={1.5} />
					</div>
					<div>
						<span className="mb-0.5 block font-mono text-[10px] tracking-widest text-orange-500/60 uppercase">
							Structural Isomorphism
						</span>
						<h3 className="text-lg leading-tight font-bold text-white">{label}</h3>
					</div>
				</div>

				{/* Copy Button */}
				<button
					onClick={handleCopy}
					className="rounded-md p-2 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-800 hover:text-white"
					title="Copy Trust Signal"
				>
					{copied ? <IconCheck size={16} className="text-green-500" /> : <IconCopy size={16} />}
				</button>
			</div>

			{/* The Isomorphic Bridge (Split View) */}
			<div className="relative z-10 grid gap-6 md:grid-cols-2">
				{/* Hardware Side */}
				<div className="relative">
					<div className="mb-2 flex items-center gap-2">
						<IconCpu size={14} className="text-neutral-500" />
						<span className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
							Physical Domain
						</span>
					</div>
					<p className="border-l border-neutral-800 pl-3 text-sm leading-relaxed text-neutral-300">
						{hardware_point}
					</p>
				</div>

				{/* Software Side (The Mirror) */}
				<div className="relative md:border-l md:border-neutral-800/50 md:pl-6">
					<div className="mb-2 flex items-center gap-2">
						<IconCode size={14} className="text-blue-500/70" />
						<span className="font-mono text-[10px] tracking-wider text-blue-500/70 uppercase">
							Digital Domain
						</span>
					</div>
					<p className="text-sm leading-relaxed text-blue-100/80">{software_point}</p>
				</div>
			</div>

			{/* The Principle (Footer) */}
			<div className="relative z-10 mt-8 rounded border border-neutral-800 bg-neutral-900/50 p-3">
				<div className="flex gap-2">
					<IconLink size={14} className="mt-0.5 shrink-0 text-orange-500" />
					<p className="font-mono text-xs leading-relaxed text-orange-100/80">
						<span className="mr-2 font-bold text-orange-500">THE LAW:</span>
						{principle}
					</p>
				</div>
			</div>
		</div>
	);
};

export default IsomorphicCard;
