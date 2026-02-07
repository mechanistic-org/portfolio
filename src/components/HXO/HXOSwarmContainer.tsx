import React from "react";
import { useStore } from "@nanostores/react";
import ResVizSwarm from "../DataViz/ResVizSwarm";
import {
	selectedProject,
	hoveredProject,
	selectProject,
	setHover,
	clearSelection,
	isInsideConsole,
} from "../../stores/hxoStore";

interface HXOSwarmContainerProps {
	nodes: any[];
}

export default function HXOSwarmContainer({ nodes }: HXOSwarmContainerProps) {
	// Subscribe to store state
	const currentHover = useStore(hoveredProject);
	const currentSelection = useStore(selectedProject);
	const consoleActive = useStore(isInsideConsole);

	// Handle events from the Swarm

	// Bridge Hover events?
	// ResVizSwarm doesn't explicitly emit "onHover" in its props interface yet,
	// but it has `onNodeSelect` which is called on mouseover in the current implementation (Line 320 of ResVizSwarm).
	// "If onNodeSelect, onNodeSelect(d)" is called on mouseover.
	// So `onNodeSelect` acts as a "Preview" trigger.

	// We need to differentiate Hover (Preview) vs Click (Lock).
	// ResVizSwarm needs an update to support `onNodeClick` vs `onNodeHover`.
	// For now, let's map `onNodeSelect` to `setHover` (Transient)
	// And we might need to modify ResVizSwarm to support explicit clicks if we want locking.

	return (
		<div className="h-full w-full">
			<ResVizSwarm
				nodes={nodes}
				externalHoverId={currentHover || currentSelection || undefined}
				selectedId={currentSelection}
				onNodeSelect={(node) => setHover(node ? node.id : null)}
				onNodeClick={(node) => selectProject(node ? node.id : "")}
				shouldStart={true}
				isConsoleHovered={consoleActive}
			/>
		</div>
	);
}
