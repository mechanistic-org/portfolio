import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface HierarchyNode {
    name: string;
    value?: number;
    children?: HierarchyNode[];
    id?: string; // Project Slug
}

interface RadialTaxonomyProps {
    data: HierarchyNode;
}

const RadialTaxonomy: React.FC<RadialTaxonomyProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

    useEffect(() => {
        if (!wrapperRef.current) return;
        const resize = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                // Only update if dimensions actually changed and are valid
                if (width > 0 && height > 0) {
                    setDimensions({ width, height });
                }
            }
        });
        resize.observe(wrapperRef.current);
        return () => resize.disconnect();
    }, []);

    useEffect(() => {
        if (!data || !svgRef.current) return;
        const { width, height } = dimensions;

        // Safety check for layout
        if (width <= 0 || height <= 0) return;

        const radius = Math.min(width, height) / 2;
        const innerRadius = Math.max(10, radius - 150); // Ensure positive radius

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // HIERARCHY
        const root = d3.hierarchy(data)
            .sort((a, b) => d3.ascending(a.data.name, b.data.name));

        // CLUSTER (Dendrogram)
        const cluster = d3.cluster<HierarchyNode>()
            .size([360, innerRadius]);

        cluster(root);

        // LINKS
        g.selectAll(".link")
            .data(root.links())
            .join("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "#333")
            .attr("stroke-width", 1.5)
            .attr("d", (d: any) => {
                const angle = (x: number) => (x - 90) / 180 * Math.PI;
                // Simple radial step for dendrogram
                return `
            M${d.source.y * Math.cos(angle(d.source.x))},${d.source.y * Math.sin(angle(d.source.x))}
            L${d.target.y * Math.cos(angle(d.target.x))},${d.target.y * Math.sin(angle(d.target.x))}
          `;
            });

        // NODES
        const node = g.selectAll(".node")
            .data(root.descendants())
            .join("g")
            .attr("class", (d) => `node ${d.children ? "internal" : "leaf"}`)
            .attr("transform", (d: any) => `rotate(${d.x - 90})translate(${d.y},0)`);

        node.append("circle")
            .attr("r", (d) => d.depth === 0 ? 0 : d.children ? 4 : 6)
            .attr("fill", (d) => d.depth === 0 ? "none" : d.children ? "#444" : "#2E5CFF")
            .attr("cursor", "pointer")
            .on("mouseover", function (event, d: any) {
                if (d.depth !== 0) {
                    d3.select(this).attr("fill", "#fff").attr("r", d.children ? 6 : 8);
                }
            })
            .on("mouseout", function (event, d: any) {
                d3.select(this).attr("fill", d.depth === 0 ? "none" : d.children ? "#444" : "#2E5CFF")
                    .attr("r", d.depth === 0 ? 0 : d.children ? 4 : 6);
            })
            .on("click", (event, d: any) => {
                if (d.data.id) {
                    window.location.href = `/projects/${d.data.id}`;
                } else if (d.depth > 0) {
                    const filterName = d.data.name;
                    let group = "all";
                    if (d.depth === 1) group = "client";
                    if (d.depth === 2) group = "industry";

                    const customEvent = new CustomEvent('radial-filter', {
                        detail: { group, value: filterName }
                    });
                    window.dispatchEvent(customEvent);
                }
            })
            .append("title")
            .text(d => d.data.name);

        // LABELS
        node.append("text")
            .attr("dy", "0.31em")
            .attr("x", (d: any) => d.x < 180 === !d.children ? 10 : -10)
            .attr("text-anchor", (d: any) => d.x < 180 === !d.children ? "start" : "end")
            .attr("transform", (d: any) => d.x >= 180 ? "rotate(180)" : null)
            .text((d) => d.depth === 0 ? "" : d.data.name)
            .style("font-size", "10px")
            .style("fill", "#888")
            .style("pointer-events", "none")
            .style("opacity", (d) => d.depth === 1 ? 1 : 0.7);

    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} className="w-full h-full relative flex items-center justify-center p-8" style={{ minHeight: '800px' }}>
            <svg ref={svgRef} width="100%" height="100%" className="overflow-visible" />
        </div>
    );
};

export default RadialTaxonomy;
