import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node {
    id: string;
    name: string;
    group: string;
    color: string;
    value: number; // Mass/Radius
    year: number;
    category: string;
    img: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface MultiverseGraphProps {
    data: { nodes: Node[] };
}

const MultiverseGraph: React.FC<MultiverseGraphProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // Start at 0 to wait for resize
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    // Resize Observer
    useEffect(() => {
        if (!wrapperRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                if (width > 0 && height > 0) {
                    setDimensions({ width, height });
                }
            }
        });
        resizeObserver.observe(wrapperRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!data || !data.nodes || !svgRef.current) return;
        if (dimensions.width === 0 || dimensions.height === 0) return; // Wait for dimensions

        const { width, height } = dimensions;
        // CRITICAL: Clone nodes to prevent D3 from mutating the original props/state across re-renders.
        // This ensures the simulation starts fresh every time dimensions change.
        const nodes = data.nodes.map(d => ({ ...d, group: d.group?.trim() }));

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        // --- GROUP PACKING LAYOUT ---
        // 1. Prepare hierarchy for packing
        const groupMap = d3.group(nodes, d => d.group);
        const groupHierarchy = {
            name: "root",
            children: Array.from(groupMap, ([key, values]) => ({
                name: key,
                value: d3.sum(values, v => v.value)
            }))
        };

        const root = d3.hierarchy(groupHierarchy)
            .sum(d => (d as any).value)
            .sort((a, b) => (b.value || 0) - (a.value || 0));

        const pack = d3.pack()
            .size([width, height])
            .padding(15); // Increased padding between employer bubbles for cleaner separation

        const packedRoot = pack(root as any);
        const groupNodes = packedRoot.children || [];

        // Map group names to their calculated coordinates
        const groupLayout: Record<string, { x: number, y: number, r: number }> = {};
        groupNodes.forEach((node: any) => {
            groupLayout[node.data.name] = { x: node.x, y: node.y, r: node.r };
        });

        // --- RENDER GROUPS (Background Bubbles) ---
        const groupG = svg.append("g").attr("class", "groups");

        const groupBubbles = groupG.selectAll(".group-bubble")
            .data(groupNodes)
            .enter().append("g")
            .attr("transform", d => `translate(${d.x},${d.y})`);

        // Group Circle
        groupBubbles.append("circle")
            .attr("r", d => d.r)
            .attr("fill", "rgba(255, 255, 255, 0.03)")
            .attr("stroke", "rgba(255, 255, 255, 0.1)")
            .attr("stroke-dasharray", "4 4");

        // Group Label
        groupBubbles.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", d => -d.r + 20)
            .text(d => (d.data as any).name)
            .attr("fill", "rgba(255, 255, 255, 0.5)")
            .attr("font-size", d => Math.min(16, d.r / 5))
            .attr("font-weight", "bold")
            .style("text-transform", "uppercase")
            .style("pointer-events", "none");


        // --- PHYSICS ENGINE ---
        // Nodes are attracted to their Group's center
        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-2))
            .force("collide", d3.forceCollide().radius((d: any) => Math.sqrt(d.value) * 3 + 1).iterations(2))

            // Cluster Gravity: Pull STRICTLY to group center
            .force("x", d3.forceX((d: any) => groupLayout[d.group]?.x || width / 2).strength(0.5))
            .force("y", d3.forceY((d: any) => groupLayout[d.group]?.y || height / 2).strength(0.5));

        // --- RENDERING LEAVES ---
        const g = svg.append("g");

        // NODE GROUPS (Bubbles)
        const node = g.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("cursor", "pointer")
            .call(d3.drag<any, any>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // CIRCLES (The Matter)
        node.append("circle")
            .attr("r", (d) => Math.max(2, Math.sqrt(d.value) * 3))
            .attr("fill", (d) => d.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .attr("opacity", 0.8)
            .on("mouseover", function (event, d) {
                d3.select(this).transition().duration(200).attr("r", Math.max(2, Math.sqrt(d.value) * 3) + 5).attr("opacity", 1);
                setSelectedNode(d);
            })
            .on("mouseout", function (event, d) {
                d3.select(this).transition().duration(200).attr("r", Math.max(2, Math.sqrt(d.value) * 3)).attr("opacity", 0.8);
                setSelectedNode(null);
            });

        // LABELS (The Identity)
        // Only show labels for "heavy" items
        node.append("text")
            .attr("dy", ".3em")
            .attr("text-anchor", "middle")
            .text((d) => d.value > 25 ? d.name.substring(0, 10) : "")
            .attr("font-size", (d) => Math.max(8, Math.sqrt(d.value)))
            .attr("fill", "#fff")
            .attr("pointer-events", "none")
            .style("display", (d) => d.value > 25 ? "block" : "none");

        // --- SIMULATION TICK ---
        simulation.on("tick", () => {
            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });

        // --- DRAG HANDLERS ---
        function dragstarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        // Zoom behavior REMOVED to prevent scroll jacking.
        // The graph is now a fixed layout visual.
        /*
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);
        */

    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} className="w-full h-full relative">
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                className="block overflow-visible"
                style={{ cursor: 'grab' }}
            />

            {/* POPOVER (The Reveal) */}
            {selectedNode && (
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-lg shadow-xl w-64 pointer-events-none transition-opacity duration-200">
                    <h3 className="text-lg font-bold text-white mb-1 font-sans">{selectedNode.name}</h3>
                    <p className="text-sm text-primary-400 font-mono mb-2">{selectedNode.group}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {selectedNode.img && (
                            <img src={selectedNode.img} className="w-full h-32 object-cover rounded mb-2 bg-gray-900" alt={selectedNode.name} />
                        )}
                    </div>

                    {/* Fallback skills display if available in data */}
                    {/* Note: In our current prune_timeline, skills are just strings in a list perhaps, checking definition... */}
                    {/* It is a list of strings: category, skills (list) */}
                </div>
            )}
        </div>
    );
};

export default MultiverseGraph;
