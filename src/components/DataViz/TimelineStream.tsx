import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node {
    id: string;
    name: string;
    group: string;
    color: string;
    value: number;
    year: number;
    start_date: string;
    end_date: string;
    category: string;
    img: string;
    x?: number;
    y?: number;
}

interface TimelineStreamProps {
    data: { nodes: Node[] };
}

const TimelineStream: React.FC<TimelineStreamProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

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
        svg.selectAll("*").remove();

        // 1. SCALES
        // X-Axis = Time
        const dates = data.nodes.map(d => new Date(d.start_date));
        const minDate = d3.min(dates) || new Date(2005, 0, 1);
        const maxDate = new Date(); // Present

        const xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([50, width - 50]);

        // Y-Axis = Groups/Categories or just scattered
        // Let's use Category for Y clusters
        const categories = Array.from(new Set(data.nodes.map(d => d.category))).sort();
        const yScale = d3.scalePoint()
            .domain(categories)
            .range([50, height - 50])
            .padding(0.5);

        // 2. PHYSICS
        const simulation = d3.forceSimulation(data.nodes)
            .force("x", d3.forceX((d: any) => xScale(new Date(d.start_date))).strength(0.8)) // Strong Pull to Date
            .force("y", d3.forceY((d: any) => yScale(d.category) ?? height / 2).strength(0.1)) // Gentle Pull to Lane
            .force("collide", d3.forceCollide().radius((d: any) => d.value * 0.8 + 1).iterations(2)) // Less padding than bubbles
            .force("charge", d3.forceManyBody().strength(-5)); // Slight repulsion

        // 3. RENDER
        const g = svg.append("g");

        // AXIS
        const xAxis = d3.axisBottom(xScale).ticks(5);
        g.append("g")
            .attr("transform", `translate(0, ${height - 30})`)
            .attr("class", "text-neutral-500 font-mono text-xs")
            .call(xAxis)
            .select(".domain").remove();

        // NODES
        const node = g.selectAll(".node")
            .data(data.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("cursor", "pointer");

        node.append("circle")
            .attr("r", (d) => d.value * 0.8)
            .attr("fill", (d) => d.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .attr("opacity", 0.7)
            .on("mouseover", function (event, d) {
                d3.select(this).transition().duration(200).attr("r", d.value * 0.8 + 4).attr("opacity", 1);
                setSelectedNode(d);
            })
            .on("mouseout", function (event, d) {
                d3.select(this).transition().duration(200).attr("r", d.value * 0.8).attr("opacity", 0.7);
                setSelectedNode(null);
            })
            .on("click", (event, d) => {
                window.location.href = `/projects/${d.id}`;
            });

        simulation.on("tick", () => {
            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });

    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} className="w-full h-full relative" style={{ minHeight: '600px' }}>
            <svg ref={svgRef} width="100%" height="100%" className="overflow-visible" />
            {selectedNode && (
                <div className="absolute top-4 left-4 pointer-events-none bg-black/80 backdrop-blur p-4 rounded-lg border border-white/10 shadow-xl">
                    <div className="text-white font-bold">{selectedNode.name}</div>
                    <div className="text-xs text-[#2E5CFF] font-mono">{selectedNode.start_date.split('T')[0]}</div>
                </div>
            )}
        </div>
    );
};

export default TimelineStream;
