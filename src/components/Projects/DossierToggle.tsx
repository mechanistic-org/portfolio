import React from "react";
import { useStore } from "@nanostores/react";
import { isDossierOpen, setDossierOpen } from "../../stores/dossierStore";

const DossierToggle: React.FC = () => {
	const isOpen = useStore(isDossierOpen);

	return (
		<button
			onClick={() => setDossierOpen(!isOpen)}
			className="flex h-6 items-center justify-center rounded border border-emerald-500/30 bg-emerald-500/10 px-2 font-mono text-[10px] font-bold text-emerald-500 transition-colors hover:bg-emerald-500 hover:text-white"
		>
			{isOpen ? "CLOSE_DOSSIER" : "ACCESS_DOSSIER"}
		</button>
	);
};

export default DossierToggle;
