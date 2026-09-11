import React from "react";
import { claimCards } from "../../config/claim-presentations";

const ForensicWall: React.FC = () => {
	return (
		<div className="w-full">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{claimCards.map((card) => (
					<article key={card.id} className="flex h-full flex-col border border-neutral-800 bg-neutral-950 p-6">
						<p className="mb-3 font-mono text-xs tracking-widest text-neutral-400 uppercase">{card.projectId}</p>
						<h3 className="mb-4 text-xl leading-tight font-semibold text-white">{card.headline}</h3>
						<p className="mb-6 text-sm leading-relaxed text-neutral-300">{card.context}</p>
						<a className="text-primary mt-auto font-mono text-xs underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4" href={card.href}>Read the project account →</a>
					</article>
				))}
			</div>
		</div>
	);
};

export default ForensicWall;
