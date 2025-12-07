import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';

interface SkillProject {
    name: string;
    skills: Record<string, number>;
}

interface ProjectMeta {
    id: string; // Changed from slug to id for Astro Content Collection compatibility
    data: {
        industry: string;
    };
}

interface Props {
    skillsData: SkillProject[];
    projects: ProjectMeta[];
}

interface SkillNode extends d3.SimulationNodeDatum {
    id: string;
    value: number;
    group: string;
    r: number;
}

const SkillsGraph: React.FC<Props> = ({ skillsData, projects }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string; visible: boolean }>({
        x: 0,
        y: 0,
        content: '',
        visible: false,
    });

    // Process Data
    const nodes: SkillNode[] = useMemo(() => {
        const skillMap = new Map<string, { total: number; count: number; maxProject: string; maxScore: number }>();

        skillsData.forEach(p => {
            Object.entries(p.skills).forEach(([skill, score]) => {
                if (!skillMap.has(skill)) {
                    skillMap.set(skill, { total: 0, count: 0, maxProject: p.name, maxScore: 0 });
                }
                const current = skillMap.get(skill)!;
                current.total += score;
                current.count += 1;
                if (score > current.maxScore) {
                    current.maxScore = score;
                    current.maxProject = p.name;
                }
            });
        });

        // Create Nodes
        return Array.from(skillMap.entries()).map(([skill, stats]) => {
            // Normalize project name to slug (e.g. "Acer Aspire" -> "acer-aspire")
            const normalizeSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const maxProjectSlug = normalizeSlug(stats.maxProject);

            // Find project by matching slug to id (stripping extension if present)
            // projects (Astro) use 'id' like 'acer-aspire.mdx'
            const matchedProject = projects.find(p => {
                const pSlug = p.id.split('.')[0]; // remove .mdx or .md
                return pSlug === maxProjectSlug;
            });
            const group = matchedProject ? matchedProject.data.industry : 'General';

            const avg = stats.total / stats.count;
            // Scale value for visuals
            return {
                id: skill,
                value: avg,
                group: group,
                r: Math.sqrt(avg) * 4 + 4, // Radius formula
                x: 0,
                y: 0
            };
        }).filter(n => n.value > 2); // Filter lowest skills if needed
    }, [skillsData, projects]);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

        const width = containerRef.current.clientWidth;
        const height = 500; // Fixed height for now or responsive prop

        const svg = d3.select(svgRef.current)
            .attr("viewBox", [0, 0, width, height]);

        svg.selectAll("*").remove(); // Clear previous

        // Color Scale
        const color = d3.scaleOrdinal(d3.schemeTableau10);

        // Simulation
        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(5))
            .force("collide", d3.forceCollide().radius((d: any) => d.r + 2).iterations(2))
            .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
            .force("x", d3.forceX(width / 2).strength(0.1))
            .force("y", d3.forceY(height / 2).strength(0.1));

        // Drag functions
        const drag = (simulation: any) => {
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

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        };

        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", d => d.r)
            .attr("fill", d => color(d.group) as string)
            .attr("fill-opacity", 0.7)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .attr("stroke-opacity", 0.3)
            .style("cursor", "grab")
            .call(drag(simulation) as any)
            .on("mouseover", (event, d) => {
                setTooltip({
                    x: event.pageX,
                    y: event.pageY,
                    content: `${d.id} (${d.group})`,
                    visible: true
                });
                d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", 2).attr("fill-opacity", 1);
            })
            .on("mouseout", (event) => {
                setTooltip(prev => ({ ...prev, visible: false }));
                d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", 1).attr("fill-opacity", 0.7);
            });

        simulation.on("tick", () => {
            node
                .attr("cx", d => d.x!)
                .attr("cy", d => d.y!);
        });

        return () => {
            simulation.stop();
        };
    }, [nodes]);

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm" style={{ height: '500px' }}>
            <svg ref={svgRef} className="h-full w-full"></svg>

            {/* Legend / Overlay */}
            <div className="pointer-events-none absolute top-4 left-4 text-xs font-mono text-neutral-500">
                Data-Driven Skills Topology
            </div>

            {/* Tooltip */}
            {tooltip.visible && (
                <div
                    className="pointer-events-none fixed z-50 rounded bg-neutral-900 px-3 py-2 text-sm text-white shadow-xl ring-1 ring-white/20 backdrop-blur-md"
                    style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
                >
                    <span className="font-mono font-bold tracking-wider uppercase text-primary">{tooltip.content.split(' (')[0]}</span>
                    <br />
                    <span className="text-xs text-neutral-400">{tooltip.content.split(' (')[1].replace(')', '')}</span>
                </div>
            )}
        </div>
    );
};

export default SkillsGraph;
