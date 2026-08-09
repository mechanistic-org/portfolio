import { useStore } from "@nanostores/react";
import ResVizSwarm from "../DataViz/ResVizSwarm";
import { focusId, isInsideConsole, pin, setPreview, unpin } from "../../stores/hxoStore";

interface HXOSwarmContainerProps {
	nodes: any[];
	links?: any[];
}

export default function HXOSwarmContainer({ nodes, links }: HXOSwarmContainerProps) {
	const currentFocusId = useStore(focusId);
	const consoleActive = useStore(isInsideConsole);

	return (
		<div className="h-full w-full" onMouseLeave={() => setPreview(null, "swarm")}>
			<ResVizSwarm
				nodes={nodes}
				links={links}
				externalHoverId={currentFocusId ?? undefined}
				onNodeSelect={(node) => setPreview(node?.id ?? null, "swarm")}
				onNodeClick={(node) => (node ? pin(node.id) : unpin())}
				isConsoleHovered={consoleActive}
			/>
		</div>
	);
}
