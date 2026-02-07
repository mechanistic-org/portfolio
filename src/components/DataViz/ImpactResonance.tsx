import  { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ImpactResonanceProps {
    value?: number; // 0-100
    label?: string;
    width?: number;
    height?: number;
}

export default function ImpactResonance({ value = 50, label = "SYSTEM VELOCITY", width = 180, height = 180 }: ImpactResonanceProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    // Normalize value
    const intensity = Math.max(10, Math.min(100, value));
    const particleCount = Math.floor(intensity / 3) + 5;

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous

        const cx = width / 2;
        const cy = height / 2;
        const coreRadius = 20;

        // Group for content
        const g = svg.append("g");

        // 1. Core (Stable)
        g.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", coreRadius)
            .attr("fill", "none")
            .attr("stroke", "#2E5CFF")
            .attr("stroke-width", 2)
            .attr("class", "drop-shadow-[0_0_8px_rgba(46,92,255,0.5)]");

        // 2. Pulse Rings (Animated)
        const ring = g.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", coreRadius)
            .attr("fill", "none")
            .attr("stroke", "#2E5CFF")
            .attr("stroke-width", 1)
            .attr("opacity", 0.5);

        // Animate Rings
        function pulse() {
            ring.attr("r", coreRadius)
                .attr("opacity", 0.5)
                .transition()
                .duration(2000 - (intensity * 10)) // Faster = Higher Intensity
                .ease(d3.easeLinear)
                .attr("r", coreRadius + (intensity * 0.4))
                .attr("opacity", 0)
                .on("end", pulse);
        }
        pulse();

        // 3. Orbiting Particles (Electrons)
        const orbits = d3.range(3).map(i => ({
            radius: coreRadius + 15 + (i * 10),
            speed: (i % 2 === 0 ? 1 : -1) * (0.02 + (intensity * 0.0005)),
            angle: Math.random() * Math.PI * 2
        }));

        const particles = g.selectAll(".particle")
            .data(orbits)
            .enter()
            .append("circle")
            .attr("r", 2)
            .attr("fill", "#2E5CFF");

        // Animation Loop
        const timer = d3.timer((elapsed) => {
            particles.attr("cx", d => cx + Math.cos(d.angle + elapsed * d.speed) * d.radius)
                .attr("cy", d => cy + Math.sin(d.angle + elapsed * d.speed) * d.radius);
        });

        // 4. Text Label
        g.append("text")
            .attr("x", cx)
            .attr("y", cy + coreRadius + 40)
            .attr("text-anchor", "middle")
            .attr("font-family", "monospace")
            .attr("font-size", "10")
            .attr("fill", "#525252")
            .text(label);

        g.append("text")
            .attr("x", cx)
            .attr("y", cy)
            .attr("dy", "0.3em")
            .attr("text-anchor", "middle")
            .attr("font-family", "monospace")
            .attr("font-size", "12")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .text(`${intensity}%`);

        return () => {
            timer.stop();
        };
    }, [width, height, intensity, label]);

    return (
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible" />
    );
}
