import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import multiverseRequest from '../../data/timeline/multiverse.json';

// --- Types ---
interface NodeData extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    group: string;
    start_date: string;
    end_date?: string;
    value: number;
    category?: string;
    img?: string;
    color?: string; // From JSON
    // Simulation properties
    radius: number;
    date: Date;
    x?: number;
    y?: number;
}

interface ResVizSwarmProps {
    onNodeSelect?: (node: any) => void;
}

// --- Color Map (from Colors.csv) ---
const COLOR_MAP: Record<string, string> = {
    // Employers
    "Mechanistic": "#2E5CFF",
    "Kaleidescape": "#2E5CFF",
    "frogdesign": "#2E5CFF",
    "Hyphen": "#00C2FF",
    "Digidesign": "#00C2FF",
    "Silicon Graphics": "#00C2FF",
    "Noon": "#4B5563",
    "EP Technologies": "#4B5563",
    "Avegant": "#9CA3AF",

    // Skills (Fallback)
    "Requirements Analysis": "#9CA3AF",
    "Feasibility Assessment": "#4B5563",
    "Concept Validation": "#2E5CFF",
    "Prototyping": "#00C2FF",
    "High-Level Design": "#2E5CFF",
    "Detailed Design": "#00C2FF", // and Engineering
    "Material Selection": "#9CA3AF",
    "ID Capture": "#2E5CFF",
    "CAD Modeling": "#00C2FF",
    "Structural Analysis": "#4B5563",
    "Tolerance Analysis": "#9CA3AF",
    "DFM": "#2E5CFF",
    "DFA": "#00C2FF",
    "Risk Assessment": "#4B5563",
    "Prototype Testing": "#2E5CFF",
    "Validation Testing": "#00C2FF",
    "Thermal Analysis": "#9CA3AF",
    "Vibration": "#4B5563",
    "Mechanical Testing": "#2E5CFF",
    "FMEA": "#00C2FF",
    "Supply Chain": "#9CA3AF",
    "Tooling Design": "#2E5CFF",
    "Manufacturing Support": "#00C2FF",
    "Quality Control": "#4B5563",
    "Cost Analysis": "#9CA3AF",
    "Documentation": "#4B5563",
    "Regulatory Compliance": "#9CA3AF",
    "IP": "#4B5563",
    "Sustainability": "#2E5CFF",
    "Post-Launch Support": "#00C2FF"
};

const DEFAULT_COLOR = "#666666";

export default function ResVizSwarm() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number, y: number, data: NodeData | null }>({ x: 0, y: 0, data: null });

    // --- Process Data ---
    const nodes = useMemo(() => {
        const now = new Date();
        return (multiverseRequest.nodes as any[]).map(d => {
            const start = new Date(d.start_date);
            const end = d.end_date ? new Date(d.end_date) : now;
            const durationDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);

            // Radius based on duration 
            // MAX DENSITY: Large bubbles
            const r = Math.max(15, Math.sqrt(durationDays) * 1.5);

            return {
                ...d,
                radius: r,
                date: start,
                x: 0,
                y: 0
            };
        }) as NodeData[];
    }, []);

    // Dimensions state to trigger re-render on resize
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0) return;

        const { width, height } = dimensions;

        // --- Scales ---
        // Determine earliest date from nodes for ALL projects
        const minDate = d3.min(nodes, d => d.date) || new Date(2000, 0, 1);

        // VERTICAL: Now (Top) -> Start (Bottom)
        // Increased padding to preventing clipping of large bubbles
        const timeScale = d3.scaleTime()
            .domain([new Date(), minDate])
            .range([400, height - 200]);

        // Dynamic Color Scale (Flourish Style)
        const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

        // --- Simulation ---
        const simulation = d3.forceSimulation<NodeData>(nodes)
            .force("x", d3.forceX(width / 2).strength(0.08)) // Center horizontally
            .force("y", d3.forceY<NodeData>(d => timeScale(d.date as Date)).strength(1)) // Vertical Timeline
            .force("collide", d3.forceCollide<NodeData>(d => (d as any).radius).strength(0.8)) // Allow slight overlap
            .force("charge", d3.forceManyBody().strength(-5))
            .stop();

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // --- Defs for Images ---
        const defs = svg.append("defs");
        nodes.forEach((d: any) => {
            // Strict check for image presence to avoid 404 icons
            if (d.img && d.img.length > 4 && !d.img.includes("placeholder")) {
                defs.append("pattern")
                    .attr("id", `img-${d.id}`)
                    .attr("height", "100%")
                    .attr("width", "100%")
                    .attr("patternContentUnits", "objectBoundingBox")
                    .append("image")
                    .attr("height", 1)
                    .attr("width", 1)
                    .attr("preserveAspectRatio", "xMidYMid slice")
                    .attr("href", d.img);
            }
        });

        // --- Axis (Right Side) ---
        const yAxis = d3.axisRight(timeScale)
            .ticks(height < 600 ? 5 : 10)
            .tickFormat(d3.timeFormat("%Y") as any)
            .tickSize(0)
            .tickPadding(10);

        svg.append("g")
            .attr("transform", `translate(${width - 50}, 0)`)
            .attr("class", "text-neutral-500 font-mono text-xs opacity-50 select-none")
            .call(yAxis as any)
            .select(".domain").remove();

        const g = svg.append("g");

        // --- Nodes ---
        const circle = g.selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", (d: any) => d.radius)
            // If big node + has valid image -> Use Image. Else Dynamic Color.
            .attr("fill", (d: any) => {
                const hasImg = d.radius > 30 && d.img && d.img.length > 4 && !d.img.includes("placeholder");
                if (hasImg) return `url(#img-${d.id})`;
                return colorScale(d.group);
            })
            .attr("stroke", (d: any) => {
                const hasImg = d.radius > 30 && d.img && d.img.length > 4 && !d.img.includes("placeholder");
                if (hasImg) return colorScale(d.group);
                // Basic stroke for colored nodes
                return "rgba(255,255,255,0.1)";
            })
            .attr("stroke-width", (d: any) => {
                const hasImg = d.radius > 30 && d.img && d.img.length > 4 && !d.img.includes("placeholder");
                return hasImg ? 3 : 1;
            })
            .attr("opacity", 0.9)
            .attr("cursor", "crosshair")
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition().duration(200)
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 3)
                    .attr("filter", "drop-shadow(0 0 15px rgba(255,255,255,0.5))");

                const [x, y] = d3.pointer(event, containerRef.current);
                setTooltip({ x, y, data: d });
                if (onNodeSelect) onNodeSelect(d);
            })
            .on("mouseout", function (event, d) {
                // Restore original stroke
                const hasImg = (d as any).radius > 30 && (d as any).img && (d as any).img.length > 4 && !(d as any).img.includes("placeholder");
                const originalStroke = hasImg ? colorScale((d as any).group) : "rgba(255,255,255,0.1)";
                const originalWidth = hasImg ? 3 : 1;

                d3.select(this)
                    .transition().duration(500)
                    .attr("stroke", originalStroke)
                    .attr("stroke-width", originalWidth)
                    .attr("filter", null);

                setTooltip({ x: 0, y: 0, data: null });
            });

        // --- Labels ---
        const label = g.selectAll("text.label")
            .data(nodes.filter((d: any) => d.radius > 20)) // Label all decent sized nodes
            .join("text")
            .text((d: any) => d.name)
            .attr("class", "label pointer-events-none font-bold text-white uppercase shadow-black drop-shadow-md")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("font-size", (d: any) => Math.min(14, d.radius / 2) + "px")
            .style("opacity", 1)
            // Add slight shadow for readability over images
            .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)");

        // --- Tick ---
        simulation.on("tick", () => {
            circle
                .attr("cx", d => d.x!)
                .attr("cy", d => d.y!);

            label
                .attr("x", d => d.x!)
                .attr("y", d => d.y!);
        });

        simulation.alpha(1).restart();

        return () => {
            simulation.stop();
        };
    }, [nodes, dimensions]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden">
            {/* HUD / Label */}
            <div className="sticky top-24 left-8 pointer-events-none z-10 mix-blend-difference">
                <div className="text-[10px] text-neutral-500 font-mono mt-1">
                    SCROLL TO TRAVERSE TIME
                </div>
            </div>

            <svg ref={svgRef} className="w-full h-full block" />

            {/* Tooltip Overlay */}
            {tooltip.data && (
                <div
                    className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-[120%]"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <div className="bg-neutral-900/90 border border-primary-500 p-3 rounded shadow-[0_0_15px_rgba(46,92,255,0.3)] backdrop-blur-sm min-w-[200px]">
                        <div className="text-xs font-mono text-primary-500 mb-1">
                            {tooltip.data.group}
                        </div>
                        <div className="text-white font-bold text-sm mb-1">
                            {tooltip.data.name}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                            {tooltip.data.start_date.split('T')[0]}
                            {tooltip.data.end_date ? ` -> ${tooltip.data.end_date.split('T')[0]}` : " -> Present"}
                        </div>
                    </div>
                    {/* Tick / Arrow */}
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary-500 mx-auto" />
                </div>
            )}
        </div>
    );
}
