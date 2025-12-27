import { getAssetUrl } from '../../utils/assets';

// ... existing imports
import React, { useState, useMemo, useRef, useEffect } from 'react';
import ResVizSwarm from '../DataViz/ResVizSwarm';
import multiverseData from '../../data/timeline/multiverse.json';
import ProjectModal from '../Projects/ProjectModal';

export default function WorkRealm() {
    const [activeNode, setActiveNode] = useState<any | null>(null);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [isHoveringStrip, setIsHoveringStrip] = useState(false);
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const stripContainerRef = useRef<HTMLDivElement>(null);

    // Helper to generate valid URL slugs from human-readable IDs
    const toSlug = (id: string) => id.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    // Sort nodes manually to match visual timeline (Newest Top)
    // FILTER: Hide Redacted/Hidden Projects from the Gallery
    const hiddenIds = ["classified", "classified-alpha", "classified-bravo", "electronic-battery-lock"];

    const sortedNodes = useMemo(() => {
        return [...multiverseData.nodes]
            .filter(node => !hiddenIds.includes(node.id))
            .sort((a, b) =>
                new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
            );
    }, []);

    // Auto-scroll Fiche Strip when Swarm updates Active Node
    // FIX: Use manual scrollTop to prevent Main Window "Page Jump" caused by scrollIntoView()
    useEffect(() => {
        if (activeNode && !isHoveringStrip && stripContainerRef.current) {
            const container = stripContainerRef.current;
            const card = itemRefs.current[activeNode.id];

            if (card) {
                // simple calc: Try to center the card in the container
                // card.offsetTop is relative to container (if container is position:relative)
                const targetTop = card.offsetTop - (container.clientHeight / 2) + (card.clientHeight / 2);

                container.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });
            }
        }
    }, [activeNode, isHoveringStrip]);

    return (
        <div className="relative w-full h-full min-h-[300vh]">
            <div className="sticky top-0 h-screen w-full grid grid-cols-1 lg:grid-cols-2">

                {/* LEFT: The Swarm */}
                <div className="relative w-full h-full border-r border-white/10">
                    {/* Pass activeNode down so Swarm can highlight bubble when Strip is hovered */}
                    <ResVizSwarm
                        onNodeSelect={setActiveNode}
                        externalHoverId={activeNode?.id}
                    />
                </div>

                {/* RIGHT: The Fiche Strip */}
                <div
                    className="hidden lg:flex flex-col h-screen sticky top-0 bg-black/50 backdrop-blur-sm border-l border-white/5 relative overflow-hidden"
                    onMouseEnter={() => setIsHoveringStrip(true)}
                    onMouseLeave={() => setIsHoveringStrip(false)}
                >
                    {/* Background Grid */}
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
                    </div>

                    {/* Fiche Strip Container with CSS Mask for smooth fade */}
                    <div
                        className="relative w-full h-full overflow-hidden"
                        style={{
                            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                        }}
                    >
                        {/* Scroll Content - Added relative for offsetTop calc */}
                        <div
                            ref={stripContainerRef}
                            className="w-full h-full overflow-y-auto px-8 py-32 space-y-4 no-scrollbar relative pr-16"
                        >
                            {sortedNodes.map((node) => {
                                const isActive = activeNode?.id === node.id;
                                return (
                                    <div
                                        key={node.id}
                                        ref={(el) => { itemRefs.current[node.id] = el; }}
                                        onMouseEnter={() => setActiveNode(node)}
                                        onClick={() => window.location.href = `/projects/${toSlug(node.id)}`}
                                        className={`
                                            relative p-6 border rounded-sm transition-all duration-300 cursor-pointer group
                                            ${isActive
                                                ? 'bg-neutral-900 border-[#2E5090] scale-105 shadow-[0_0_30px_rgba(46,80,144,0.3)] z-10'
                                                : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-neutral-900/80 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`font-bold font-mono uppercase tracking-tight text-xl ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                                                {node.name}
                                            </h3>
                                            {isActive && <div className="text-[10px] text-[#2E5090] font-mono animate-pulse">● LOCKED</div>}
                                        </div>

                                        {/* Minimal Metadata Details */}
                                        <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500 uppercase">
                                            <span>{node.group}</span>
                                            <span>//</span>
                                            <span>{new Date(node.start_date).getFullYear()}</span>
                                        </div>

                                        {/* Active State Expansion: Could show image? */}
                                        {isActive && node.img && !node.img.includes('placeholder') && (
                                            <div className="mt-4 h-32 w-full overflow-hidden rounded border border-white/10">
                                                {/* Using standard img for now, potentially update to optimized image */}
                                                <img src={getAssetUrl(node.img || '')} className="w-full h-full object-cover opacity-80" alt={node.name} />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </div>

                {/* Project Technical Modal Removed (Direct Navigation) */}
            </div>
        </div>
    );
}
