import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ConstructionGaugeProps {
    value?: number; // 0-100
    label?: string;
    width?: number;
    height?: number;
}

export default function ConstructionGauge({ value = 98, label = "UNDER CONSTRUCTION", width = 180, height = 180 }: ConstructionGaugeProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    // Normalize value
    const intensity = Math.max(10, Math.min(100, value));

    // Theme Colors (Construction Orange)
    const PRIMARY_COLOR = "#f59e0b"; // Amber-500
    const GLOW_COLOR = "rgba(245, 158, 11, 0.5)"; // Amber-500 at 50%

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
            .attr("stroke", PRIMARY_COLOR)
            .attr("stroke-width", 2)
            .attr("class", `drop-shadow-[0_0_8px_${GLOW_COLOR}]`);

        // 2. Pulse Rings (Calmer Animation)
        const ring = g.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", coreRadius)
            .attr("fill", "none")
            .attr("stroke", PRIMARY_COLOR)
            .attr("stroke-width", 1)
            .attr("opacity", 0.5);

        // Animate Rings - Slower pulse
        // Original was 2000 - (intensity * 10). Let's make it much slower.
        // Base 3000ms.
        function pulse() {
            ring.attr("r", coreRadius)
                .attr("opacity", 0.5)
                .transition()
                .duration(3000) // Fixed slower duration for "calm" effect
                .ease(d3.easeLinear)
                .attr("r", coreRadius + (intensity * 0.3)) // Reduced expansion slightly
                .attr("opacity", 0)
                .on("end", pulse);
        }
        pulse();

        // 3. Orbiting Particles (Electrons)
        // Reduced speed for calmer feel
        const orbits = d3.range(3).map(i => ({
            radius: coreRadius + 15 + (i * 10),
            speed: (i % 2 === 0 ? 1 : -1) * (0.01), // Half speed of original (0.02)
            angle: Math.random() * Math.PI * 2
        }));

        const particles = g.selectAll(".particle")
            .data(orbits)
            .enter()
            .append("circle")
            .attr("r", 2)
            .attr("fill", "#fbbf24"); // Amber-400 (Slightly lighter)

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
            .attr("fill", "#737373") // Neutral-500
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
