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
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    // Resize Observer
    useEffect(() => {
        if (!wrapperRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });
        resizeObserver.observe(wrapperRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!data || !data.nodes || !svgRef.current) return;

        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        // --- PHYSICS ENGINE ---
        // The "Loom" that weaves the nodes together
        const simulation = d3.forceSimulation(data.nodes)
            .force("charge", d3.forceManyBody().strength(-20)) // Repulsion
            .force("center", d3.forceCenter(width / 2, height / 2)) // Gravity Well
            .force("collide", d3.forceCollide().radius((d: any) => d.value * 1.5 + 2).iterations(3)) // Collision
            .force("y", d3.forceY(height / 2).strength(0.05)) // Vertical centering
            .force("x", d3.forceX(width / 2).strength(0.05));

        // --- RENDERING ---
        const g = svg.append("g");

        // NODE GROUPS (Bubbles)
        const node = g.selectAll(".node")
            .data(data.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("cursor", "pointer")
            .call(d3.drag<any, any>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // CIRCLES (The Matter)
        node.append("circle")
            .attr("r", (d) => d.value * 1.5)
            .attr("fill", (d) => d.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .attr("opacity", 0.8)
            .on("mouseover", function (event, d) {
                d3.select(this).transition().duration(200).attr("r", d.value * 1.5 + 5).attr("opacity", 1);
                setSelectedNode(d);
            })
            .on("mouseout", function (event, d) {
                d3.select(this).transition().duration(200).attr("r", d.value * 1.5).attr("opacity", 0.8);
                setSelectedNode(null);
            });

        // LABELS (The Identity)
        // Only show labels for "heavy" items
        node.append("text")
            .attr("dy", ".3em")
            .attr("text-anchor", "middle")
            .text((d) => d.value > 2 ? d.name.substring(0, 10) : "")
            .attr("font-size", (d) => Math.max(8, d.value / 2))
            .attr("fill", "#fff")
            .attr("pointer-events", "none")
            .style("display", (d) => d.value > 15 ? "block" : "none");

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

        // Zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);

    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} className="w-full h-full relative" style={{ minHeight: '600px' }}>
            <svg ref={svgRef} width="100%" height="100%" className="overflow-visible" />

            {/* POPOVER (The Reveal) */}
            {selectedNode && (
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-lg shadow-xl w-64 pointer-events-none transition-opacity duration-200">
                    <h3 className="text-lg font-bold text-white mb-1 font-sans">{selectedNode.name}</h3>
                    <p className="text-sm text-green-400 font-mono mb-2">{selectedNode.group}</p>
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
