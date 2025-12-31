import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Props {
    words: string[];
    phase: 'scatter' | 'implode' | 'float' | 'idle';
    onComplete?: () => void;
}

interface Node extends d3.SimulationNodeDatum {
    id: string;
    text: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    level: number;
}

export default function HyperCloud({ words, phase, onComplete }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const simulationRef = useRef<d3.Simulation<Node, undefined> | null>(null);
    const nodesRef = useRef<Node[]>([]);

    // Fallback dimensions
    const [dimensions, setDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1000,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    // 1. Resize Observer
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    setDimensions({
                        width: entry.contentRect.width,
                        height: entry.contentRect.height
                    });
                }
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // 2. Initialize Simulation
    useEffect(() => {
        if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

        const { width, height } = dimensions;
        const center = { x: width / 2, y: height / 2 };

        // Force init nodes if empty
        if (nodesRef.current.length === 0) {
            nodesRef.current = words.map((word) => ({
                id: word,
                text: word,
                x: center.x,
                y: center.y,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                level: Math.random()
            }));
        }

        const canvas = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const context = canvas.getContext('2d');
        if (!context) return;
        context.scale(dpr, dpr);

        if (simulationRef.current) simulationRef.current.stop();

        // Base Physics Setup
        const simulation = d3.forceSimulation(nodesRef.current)
            .alphaDecay(0.02)
            .velocityDecay(0.15)
            .force("collision", d3.forceCollide().radius(30).strength(0.8))
            .force("charge", d3.forceManyBody().strength(-50))
            .force("center", d3.forceCenter(center.x, center.y).strength(0.05));

        simulationRef.current = simulation;

        // Render Loop
        simulation.on('tick', () => {
            context.clearRect(0, 0, width, height);

            context.textAlign = 'center';
            context.textBaseline = 'middle';

            nodesRef.current.forEach(node => {
                const padding = 60;
                if (node.x < padding) { node.x = padding; node.vx! *= -0.5; }
                if (node.x > width - padding) { node.x = width - padding; node.vx! *= -0.5; }
                if (node.y < padding) { node.y = padding; node.vy! *= -0.5; }
                if (node.y > height - padding) { node.y = height - padding; node.vy! *= -0.5; }

                const fontSize = 16 + (node.level * 24);
                const opacity = 0.5 + (node.level * 0.5);

                context.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
                context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                context.fillText(node.text, node.x, node.y);
            });
        });

        return () => {
            simulation.stop();
        };

    }, [dimensions, words]);

    // 3. Phase Logic Update
    useEffect(() => {
        if (!simulationRef.current || dimensions.width === 0) return;
        const sim = simulationRef.current;
        const { width, height } = dimensions;
        const center = { x: width / 2, y: height / 2 };

        console.log("HyperCloud Phase:", phase);

        if (phase === 'scatter') {
            sim.alpha(1).restart();
            sim.velocityDecay(0.15); // Normal friction
            sim.force("x", null);
            sim.force("y", null);
            sim.force("charge", d3.forceManyBody().strength(-600));
            sim.force("center", d3.forceCenter(center.x, center.y).strength(0.05));
            sim.force("r", d3.forceRadial(Math.min(width, height) * 0.35, center.x, center.y).strength(0.1));
        }
        else if (phase === 'float') {
            sim.alphaTarget(0.1).restart();
            sim.velocityDecay(0.15); // Normal friction
            sim.force("x", null);
            sim.force("y", null);
            sim.force("charge", d3.forceManyBody().strength(-80));
            sim.force("r", d3.forceRadial(Math.min(width, height) * 0.3, center.x, center.y).strength(0.05));
            sim.force("center", d3.forceCenter(center.x, center.y).strength(0.02));
        }
        else if (phase === 'implode') {
            sim.alpha(1).restart();
            // BREAKING CHANGE: Switch to High Friction + Direct Targeting
            sim.velocityDecay(0.6); // Heavy drag prevents overshoot

            sim.force("charge", d3.forceManyBody().strength(-20));
            sim.force("collide", null);
            sim.force("r", null);
            sim.force("center", null);

            // Direct Target Forces
            sim.force("x", d3.forceX(center.x).strength(0.8));
            sim.force("y", d3.forceY(center.y).strength(0.8));

            // Check Convergence
            const check = setInterval(() => {
                const allIn = nodesRef.current.every(n => {
                    const dx = n.x - center.x;
                    const dy = n.y - center.y;
                    return (dx * dx + dy * dy) < 3600; // 60px radius
                });

                // Only trigger if we haven't already
                if (allIn && onComplete) {
                    clearInterval(check);
                    // Let the parent (DisciplineCycler) decide when to finish based on timing
                    // We just stop the physics here.
                    simulationRef.current?.stop();
                }
            }, 300);
            return () => clearInterval(check);
        }

    }, [phase, dimensions, onComplete]);

    // Mouse Interaction
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!simulationRef.current || !canvasRef.current || phase === 'implode') return;

        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        nodesRef.current.forEach(node => {
            const dx = node.x - mx;
            const dy = node.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 180) { // Interaction Radius
                const force = (180 - dist) / 180;
                node.vx! += (dx / dist) * force * 1.5;
                node.vy! += (dy / dist) * force * 1.5;
            }
        });

        simulationRef.current.alpha(0.3).restart();
    };

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden bg-transparent" onMouseMove={handleMouseMove}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
