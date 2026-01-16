import React from "react";
import { motion } from "framer-motion";
import { setDossierOpen } from "../../stores/dossierStore";

interface ForensicMarkerProps {
	id: string;
	label?: string;
	index: number;
}

const ForensicMarker: React.FC<ForensicMarkerProps> = ({ id, label, index }) => {
	return (
		<motion.button
			initial={{ opacity: 0, scale: 0.8 }}
			whileInView={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			onClick={() => setDossierOpen(true)}
			className="group flex flex-col items-start gap-1"
		>
			<div className="flex items-center gap-2">
				{/* RETICLE */}
				<div className="relative flex h-8 w-8 items-center justify-center border border-emerald-500/20 bg-black/50 backdrop-blur-sm transition-all duration-300 group-hover:border-emerald-500 group-hover:bg-emerald-500/10">
					<div className="absolute top-0 left-0 h-1 w-1 border-t border-l border-emerald-500"></div>
					<div className="absolute top-0 right-0 h-1 w-1 border-t border-r border-emerald-500"></div>
					<div className="absolute bottom-0 left-0 h-1 w-1 border-b border-l border-emerald-500"></div>
					<div className="absolute right-0 bottom-0 h-1 w-1 border-r border-b border-emerald-500"></div>

					<span className="font-mono text-[10px] font-bold text-emerald-500 transition-colors group-hover:text-white">
						{String(index + 1).padStart(2, "0")}
					</span>
				</div>

				{/* LINE */}
				<div className="h-px w-12 bg-emerald-500/20 transition-all duration-500 group-hover:w-24 group-hover:bg-emerald-500/50"></div>

				{/* LABEL */}
				<span className="font-mono text-[10px] tracking-widest text-emerald-500/50 transition-colors group-hover:text-emerald-400">
					EVID_{id.toUpperCase().split("_")[0]}
				</span>
			</div>
		</motion.button>
	);
};

export default ForensicMarker;
