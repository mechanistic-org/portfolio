import { useStore } from "@nanostores/react";
import ResVizSwarm from "../DataViz/ResVizSwarm";
import { focusId, isInsideConsole, lens, pin, setPreview, unpin } from "../../stores/hxoStore";

interface HXOSwarmContainerProps {
	nodes: any[];
}

export default function HXOSwarmContainer({ nodes }: HXOSwarmContainerProps) {
	const currentFocusId = useStore(focusId);
	const consoleActive = useStore(isInsideConsole);
	const currentLens = useStore(lens);

	return (
		<div className="h-full w-full" onMouseLeave={() => setPreview(null, "swarm")}>
			<ResVizSwarm
				nodes={nodes}
				lens={currentLens}
				externalHoverId={currentFocusId ?? undefined}
				onNodeSelect={(node) => setPreview(node?.id ?? null, "swarm")}
				onNodeClick={(node) => (node ? pin(node.id) : unpin())}
				isConsoleHovered={consoleActive}
			/>
		</div>
	);
}
