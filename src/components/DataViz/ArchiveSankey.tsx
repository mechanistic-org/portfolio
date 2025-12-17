import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import multiverseData from '../../data/timeline/multiverse.json';

// --- Types ---
interface Node {
    id: string;
    name: string;
    category?: string;
    color?: string;
    // D3 Sankey props
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
    value?: number;
}

interface Link {
    source: string | Node;
    target: string | Node;
    value: number;
    color?: string;
    gradientId?: string;
    width?: number; // Added by d3-sankey
    y0?: number;
    y1?: number;
}

interface SankeyData {
    nodes: Node[];
    links: Link[];
}

// --- Color Map ---
const COLOR_MAP: Record<string, string> = {
    "Mechanistic": "#2E5CFF",
    "Kaleidescape": "#FFE500", // Yellow for contrast? Or keep blue.
    "Hyphen": "#00C2FF",
    "Digidesign": "#FF00FF",
    "Silicon Graphics": "#00FF66",
    "frogdesign": "#2E5CFF",
    "Avegant": "#9CA3AF",
    "Noon": "#FFFFFF",
    "EP Technologies": "#4B5563",
    "Apple": "#FFFFFF"
};

const CATEGORY_COLORS: Record<string, string> = {
    "Design": "#FF00FF", // Magenta
    "Engineering": "#00FFFF", // Cyan
    "Leadership": "#FFE500", // Yellow
    "Product": "#00FF00", // Green
    "Other": "#888"
};

const ArchiveSankey: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // --- 1. Data Transformation ---
    const data: SankeyData = useMemo(() => {
        const rawNodes = multiverseData.nodes;

        const nodes: Node[] = [];
        const links: Link[] = [];
        const nodeMap = new Map<string, number>();

        const addNode = (name: string, category: string = "Unknown") => {
            if (!nodeMap.has(name)) {
                nodes.push({ id: name, name, category });
                nodeMap.set(name, nodes.length - 1);
            }
            return nodeMap.get(name)!;
        };

        rawNodes.forEach((project: any) => {
            const catName = project.category || "Other";
            const catIdx = addNode(catName, "Category");

            const companyName = project.group?.trim();
            if (!companyName) return;

            const compIdx = addNode(companyName, "Company");

            const start = new Date(project.start_date).getTime();
            const end = project.end_date ? new Date(project.end_date).getTime() : Date.now();
            const duration = Math.max(1, (end - start) / (1000 * 3600 * 24 * 30)); // Months

            const existingLink = links.find(l =>
                (typeof l.source === 'number' ? l.source === catIdx : (l.source as any) === nodes[catIdx].id) &&
                (typeof l.target === 'number' ? l.target === compIdx : (l.target as any) === nodes[compIdx].id)
            );

            if (existingLink) {
                existingLink.value += duration;
            } else {
                links.push({
                    source: nodes[catIdx].id,
                    target: nodes[compIdx].id,
                    value: duration
                });
            }
        });

        // Loop sorting? d3-sankey handles some, but let's ensure order.
        // Or just let D3 do it.

        return { nodes, links };
    }, []);

    // --- 2. Resize Observer ---
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                // Add some debounce or check?
                setDimensions({ width, height });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // --- 3. D3 Render ---
    useEffect(() => {
        if (!dimensions.width || !dimensions.height || !svgRef.current) return;

        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Definitions for Gradients
        const defs = svg.append("defs");

        // GLOW FILTER
        const filter = defs.append("filter").attr("id", "neon-glow");
        filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Layout
        const sankeyGenerator = sankey<Node, Link>()
            .nodeId(d => d.id)
            .nodeAlign(sankeyLeft)
            .nodeWidth(4) // Thinner nodes
            .nodePadding(12) // Slightly tighter
            .extent([[20, 20], [width - 20, height - 20]]) // Padding from edges
            .iterations(32); // Optimize layout

        const graph = sankeyGenerator({
            nodes: data.nodes.map(d => ({ ...d })),
            links: data.links.map(l => ({ ...l }))
        });

        // Create Linear Gradients for each link
        graph.links.forEach((d: any, i) => {
            const gradientId = `link-grad-${i}`;
            const sourceColor = CATEGORY_COLORS[d.source.name] || "#555";
            const targetColor = COLOR_MAP[d.target.name] || "#FFF";

            const gradient = defs.append("linearGradient")
                .attr("id", gradientId)
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", d.source.x1)
                .attr("x2", d.target.x0);

            gradient.append("stop").attr("offset", "0%").attr("stop-color", sourceColor);
            gradient.append("stop").attr("offset", "100%").attr("stop-color", targetColor);

            d.gradientId = gradientId;
        });

        // --- Layers ---
        const linkLayer = svg.append("g").attr("class", "links").style("mix-blend-mode", "screen");
        const nodeLayer = svg.append("g").attr("class", "nodes");
        const labelLayer = svg.append("g").attr("class", "labels");

        // --- LINKS ---
        linkLayer.selectAll("path")
            .data(graph.links)
            .enter().append("path")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke-width", d => Math.max(1, d.width || 1))
            .attr("stroke", (d: any) => `url(#${d.gradientId})`)
            .attr("fill", "none")
            .attr("opacity", 0.3)
            .style("transition", "opacity 0.2s")
            // Hover interaction
            .on("mouseover", function () {
                d3.select(this).attr("opacity", 0.8).attr("stroke-width", (d: any) => Math.max(1, (d.width || 1) + 2));
            })
            .on("mouseout", function () {
                d3.select(this).attr("opacity", 0.3).attr("stroke-width", (d: any) => Math.max(1, d.width || 1));
            });

        // --- NODES ---
        const nodeGroups = nodeLayer.selectAll("g")
            .data(graph.nodes)
            .enter().append("g")
            .attr("transform", d => `translate(${d.x0 || 0},${d.y0 || 0})`);

        // Node Rect
        nodeGroups.append("rect")
            .attr("height", d => Math.max(0, (d.y1 || 0) - (d.y0 || 0)))
            .attr("width", d => Math.max(0, (d.x1 || 0) - (d.x0 || 0)))
            .attr("fill", (d: any) => {
                return COLOR_MAP[d.name] || CATEGORY_COLORS[d.name] || "#fff";
            })
            .attr("rx", 1)
            .attr("opacity", 0.9)
            // Add slight shadow/glow
            .attr("filter", "url(#neon-glow)");

        // --- LABELS ---
        // Separate layer to be on top
        labelLayer.selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("x", d => (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 12 : (d.x0 || 0) - 12)
            .attr("y", d => ((d.y1 || 0) + (d.y0 || 0)) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => (d.x0 || 0) < width / 2 ? "start" : "end")
            .text(d => d.name)
            .attr("fill", "#ddd")
            .attr("font-size", "11px")
            .attr("font-family", "JetBrains Mono, monospace")
            .attr("font-weight", "bold")
            .style("text-transform", "uppercase")
            .style("pointer-events", "none")
            .style("text-shadow", "0 0 5px rgba(0,0,0,0.9)");

    }, [data, dimensions]);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[500px] relative bg-black/0">
            <div className="absolute top-0 left-4 font-mono text-[10px] text-neutral-600 uppercase tracking-[0.2em] opacity-50">
                Data Stream // Career_Flow
            </div>
            {/* Legend/Key could go here */}
            <svg ref={svgRef} width="100%" height="100%" className="overflow-visible" />
        </div>
    );
};

export default ArchiveSankey;
