import React from "react";
import EvidenceCard from "./EvidenceCard";
import registry from "../../data/forensic_registry.json";

const ForensicWall: React.FC = () => {
	// Flatten the registry into a single list of cards
	const allCards = registry.flatMap((project) =>
		project.cards.map((card) => ({
			...card,
			projectId: project.projectId,
			// Ensure type matches the union
			type: card.type as "scars" | "financial" | "process" | "governance",
		})),
	);

	return (
		<div className="w-full">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{allCards.map((card) => (
					<div key={card.id}>
						<EvidenceCard {...card} />
					</div>
				))}
			</div>
		</div>
	);
};

export default ForensicWall;
