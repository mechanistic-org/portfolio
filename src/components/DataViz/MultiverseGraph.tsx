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
    start_date: string;
    end_date?: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    // Calculated
    radius?: number;
}

interface MultiverseGraphProps {
    data: { nodes: Node[] };
}

const MultiverseGraph: React.FC<MultiverseGraphProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef<{ x: number, y: number } | null>(null); // Physics Mouse Calc
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
        if (dimensions.width === 0 || dimensions.height === 0) return;

        const { width, height } = dimensions;

        // --- 1. PREP DATA ---
        // A. NODES (The Travelers)
        const nodes = data.nodes.map(d => {
            const start = new Date(d.start_date);
            const end = d.end_date ? new Date(d.end_date) : new Date();
            const durationDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
            const r = Math.max(15, Math.sqrt(durationDays) * 1.5);

            return {
                ...d,
                group: d.group?.trim(),
                radius: r,
                // Initial State: Exploded off-screen (Bottom)
                x: width / 2 + (Math.random() - 0.5) * 500,
                y: height + 500 + Math.random() * 500
            };
        });

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // B. GROUPS (The Tectonic Plates)
        // 1. Calculate Hierarchy to get sizes
        const groupMap = d3.group(nodes, d => d.group);
        const groupHierarchy = {
            name: "root",
            children: Array.from(groupMap, ([key, values]) => ({
                name: key,
                value: d3.sum(values, v => v.radius! * v.radius!) // Area-based
            }))
        };
        const root = d3.hierarchy(groupHierarchy).sum(d => (d as any).value);
        // Pack just to get initial radii (we won't use the x/y for locking)
        // Pack just to get initial radii (we won't use the x/y for locking)
        const pack = d3.pack().size([width * 0.7, height * 0.7]).padding(10); // Tighter padding
        const packedRoot = pack(root as any);

        // Center the pack
        const packOffsetX = (width - width * 0.7) / 2;
        const packOffsetY = (height - height * 0.7) / 2;

        const groupNodes = (packedRoot.children || []).map((d: any) => ({
            ...d,
            // Start at the packed position (Good initial layout)
            x: d.x + packOffsetX,
            y: d.y + packOffsetY,
            vx: 0,
            vy: 0
        }));

        // Map for fast lookup
        const groupLookup: Record<string, any> = {};
        groupNodes.forEach(g => { groupLookup[g.data.name] = g; });

        // --- 2. PHYSICS ENGINES (Defined Early for Referencing) ---

        // A. TECTONIC SIM (The Groups)
        // Drifts slowly, keeps containers apart
        // A. TECTONIC SIM (The Groups)
        // Drifts slowly, keeps containers apart
        const groupSim = d3.forceSimulation(groupNodes)
            .alphaDecay(0) // Never stop completely (Drift mode)
            .velocityDecay(0.02) // Very Slippery (Fluid movement)
            .force("collide", d3.forceCollide().radius((d: any) => d.r + 2).strength(1)) // Rigid collision
            .force("charge", d3.forceManyBody().strength(10)) // Slight ATTRACTION
            .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01)) // Gentle centering
            .force("wander", () => {
                // Persistent Drift
                groupNodes.forEach((d: any) => {
                    d.vx += (Math.random() - 0.5) * 0.5; // Random Impulse
                    d.vy += (Math.random() - 0.5) * 0.5;
                });
            })
            .force("bounds", () => {
                // Hard bounds with padding to keep them away from edges
                groupNodes.forEach((d: any) => {
                    const r = d.r + 50; // Keep 50px from edge
                    d.x = Math.max(r, Math.min(width - r, d.x));
                    d.y = Math.max(r, Math.min(height - r, d.y));
                });
            })
            .stop();

        // B. SWARM SIM (The Nodes)
        // Chases the groups
        const nodeSim = d3.forceSimulation(nodes)
            .alphaDecay(0) // Persistent (Never sleep) to sync with Groups
            .velocityDecay(0.55) // Heavy friction to stop "Froth/Jitter"
            .force("charge", d3.forceManyBody().strength(-15))
            .force("collide", d3.forceCollide().radius((d: any) => d.radius + 2).strength(0.5)) // Softer collision
            // The "Home" Force: Pulls towards the Dynamic Group position
            .force("home", (alpha) => {
                nodes.forEach((d: any) => {
                    const group = groupLookup[d.group];
                    if (group) {
                        // Gentle tow rope to group center
                        d.vx += (group.x - d.x) * 0.05 * alpha;
                        d.vy += (group.y - d.y) * 0.05 * alpha;
                    }
                });
            })
            // Interactive Gravity (Mouse)
            .force("mouse", () => {
                if (!mousePos.current) return;
                const { x, y } = mousePos.current;
                nodes.forEach((d: any) => {
                    const dx = x - d.x!;
                    const dy = y - d.y!;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 300) {
                        const force = (300 - dist) / 300;
                        d.vx! += (dx / dist) * force * 1.5 * nodeSim.alpha();
                        d.vy! += (dy / dist) * force * 1.5 * nodeSim.alpha();
                    }
                });
            })
            .stop();


        // --- 3. LAYERS ---
        const groupLayer = svg.append("g").attr("class", "groups").attr("opacity", 0);
        const linkLayer = svg.append("g").attr("class", "links"); // Optional: links between nodes?
        const nodeLayer = svg.append("g").attr("class", "nodes");


        // --- 4. RENDER GROUPS (The Continents) ---
        const groupCircles = groupLayer.selectAll(".group-bubble")
            .data(groupNodes)
            .enter().append("g")
            .attr("class", "group-bubble"); // Position updated in tick

        groupCircles.append("circle")
            .attr("r", (d: any) => d.r)
            .attr("fill", "rgba(255, 255, 255, 0.015)")
            .attr("stroke", "rgba(255, 255, 255, 0.06)")
            .attr("stroke-dasharray", "4 4");

        groupCircles.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", (d: any) => -d.r + 20)
            .text((d: any) => d.data.name)
            .attr("fill", "rgba(255, 255, 255, 0.4)")
            .attr("font-size", (d: any) => Math.min(14, d.r / 6))
            .attr("font-weight", "bold")
            .style("text-transform", "uppercase")
            .style("pointer-events", "none");


        // --- 5. RENDER NODES (The Population) ---
        const nodeCircles = nodeLayer.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("cursor", "pointer")
            .on("click", (event, d) => window.location.href = `/projects/${d.id}`)
            .call(d3.drag<any, any>()
                .on("start", (event, d) => {
                    if (!event.active) nodeSim.alphaTarget(0.3).restart();
                    d.fx = d.x; d.fy = d.y;
                })
                .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
                .on("end", (event, d) => {
                    if (!event.active) nodeSim.alphaTarget(0);
                    d.fx = null; d.fy = null;
                })
            );

        nodeCircles.append("circle")
            .attr("r", (d: any) => d.radius)
            .attr("fill", (d) => d.color)
            .attr("stroke", "rgba(255,255,255,0.2)")
            .attr("opacity", 0.9)
            .on("mouseover", function (event, d) {
                // Ghost Fix: Reset ALL other nodes immediately to prevent 'trail'
                nodeCircles.select("circle")
                    .transition().duration(100)
                    .attr("stroke", "rgba(255,255,255,0.2)")
                    .attr("stroke-width", 1)
                    .attr("filter", null)
                    .style("opacity", 0.9);

                d3.select(this)
                    .transition().duration(200)
                    .attr("stroke", "#fff").attr("stroke-width", 3)
                    .attr("filter", "drop-shadow(0 0 10px rgba(255,255,255,0.5))")
                    .style("opacity", 1);

                // Hide all other labels
                d3.selectAll(".node text").transition().style("opacity", 0);

                // Show this label
                d3.select(this.parentNode as Element).select("text").transition().style("opacity", 1);
                setSelectedNode(d);
                // Heat up physics slightly
                nodeSim.alphaTarget(0.1).restart();
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .transition().duration(500)
                    .attr("stroke", "rgba(255,255,255,0.2)").attr("stroke-width", 1)
                    .attr("filter", null);
                d3.select(this.parentNode as Element).select("text").transition().style("opacity", 0);
                setSelectedNode(null);
            });

        nodeCircles.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(d => d.name)
            .attr("font-size", (d: any) => Math.max(9, d.radius / 3))
            .attr("fill", "#fff")
            .attr("pointer-events", "none")
            .style("opacity", 0)
            .style("text-shadow", "0 1px 4px black");


        // --- 6. TICK HANDLERS ---
        // We sync them: Run group sim, then node sim, then render
        const tick = () => {
            groupSim.tick();
            nodeSim.tick();

            // Render Groups
            groupCircles.attr("transform", (d: any) => `translate(${d.x},${d.y})`);

            // Render Nodes
            nodeCircles.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        }

        // Use a standard D3 timer or loop?
        // Let's use requestAnimationFrame loop managed by effect to keep them in sync
        let animationFrameId: number;
        const loop = () => {
            tick();
            animationFrameId = requestAnimationFrame(loop);
        };

        // --- 7. INTERACTION LISTENERS ---
        svg.on("mousemove", (event) => {
            const [x, y] = d3.pointer(event);
            mousePos.current = { x, y };
            nodeSim.alphaTarget(0.3).restart(); // Wake up nodes
        }).on("mouseleave", () => {
            mousePos.current = null;
            nodeSim.alphaTarget(0);
        });

        // --- 8. OBSERVER ---
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // ENTER
                // 1. Fade in Groups
                groupLayer.transition().duration(2000).attr("opacity", 1);
                nodeLayer.transition().duration(2000).attr("opacity", 1); // Fix: fade nodes back in

                // 2. Start Loops
                loop(); // Start physical time

                // 3. Reset Node Sim energy (Explosion)
                nodeSim.alpha(1).restart();

            } else {
                // EXIT
                cancelAnimationFrame(animationFrameId);
                // Fade out BOTH layers
                groupLayer.transition().duration(500).attr("opacity", 0);
                nodeLayer.transition().duration(500).attr("opacity", 0); // Fix: fade out nodes too

                // Reset positions for next time - but don't push them down!
                // Just stop them. When we re-enter, alpha(1).restart() will explode them from center or new random pos.
                nodeSim.stop();
            }
        }, { threshold: 0.1 }); // Lower threshold to trigger exit sooner

        if (wrapperRef.current) observer.observe(wrapperRef.current);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
            groupSim.stop();
            nodeSim.stop();
        };

    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} className="w-full h-full relative">
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                className="block overflow-visible"
                style={{ cursor: 'crosshair' }}
            />
            {/* Popover Logic Maintained if needed, or relying on HUD */}
        </div>
    );
};

export default MultiverseGraph;
