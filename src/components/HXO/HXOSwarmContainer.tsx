import { useStore } from "@nanostores/react";
import ResVizSwarm from "../DataViz/ResVizSwarm";
import { acquire, clearReading, focusId, setPreview } from "../../stores/hxoStore";

interface HXOSwarmContainerProps {
	nodes: any[];
}

export default function HXOSwarmContainer({ nodes }: HXOSwarmContainerProps) {
	const currentFocusId = useStore(focusId);

	return (
		<div className="h-full w-full" onMouseLeave={() => setPreview(null, "swarm")}>
			<ResVizSwarm
				nodes={nodes}
				externalHoverId={currentFocusId ?? undefined}
				onNodeSelect={(node) => setPreview(node?.id ?? null, "swarm")}
				onNodeClick={(node) => {
					if (!node) {
						clearReading();
						return;
					}
					acquire(node.id);
					if (window.matchMedia("(max-width: 1023px)").matches) {
						requestAnimationFrame(() =>
							document.querySelector(".hxo-console-stage")?.scrollIntoView({ block: "start" }),
						);
					}
				}}
			/>
		</div>
	);
}
