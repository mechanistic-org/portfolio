import React, { useState } from 'react';
import ResVizSwarm from '../DataViz/ResVizSwarm';

export default function WorkRealm() {
    const [activeNode, setActiveNode] = useState<any | null>(null);

    return (
        <div className="relative w-full h-full min-h-[300vh]">
            <div className="sticky top-0 h-screen w-full grid grid-cols-1 lg:grid-cols-2">

                {/* LEFT: The Swarm */}
                <div className="relative w-full h-full border-r border-white/10">
                    <ResVizSwarm onNodeSelect={setActiveNode} />
                </div>

                {/* RIGHT: The Data Beam */}
                <div className="hidden lg:flex flex-col h-screen sticky top-0 bg-black/50 backdrop-blur-sm p-8 items-center justify-center border-l border-white/5 relative overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
                    </div>

                    {activeNode ? (
                        <div className="relative z-10 w-full max-w-md p-6 bg-black/80 border border-green-500/30 rounded-lg shadow-2xl backdrop-blur-xl">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-white tracking-tighter uppercase">{activeNode.name}</h2>
                                    <div className="text-xs font-mono text-green-500 mt-1 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        TARGET_LOCKED
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-white/10 font-mono">01</div>
                                </div>
                            </div>

                            {/* Image */}
                            {activeNode.img && activeNode.img.length > 5 && (
                                <div className="w-full h-48 mb-6 rounded border border-white/10 overflow-hidden relative group">
                                    <img src={activeNode.img} alt={activeNode.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay"></div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4 text-sm font-mono text-neutral-400">
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest mb-1 text-neutral-600">GROUP</div>
                                    <div className="text-white">{activeNode.group}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest mb-1 text-neutral-600">YEAR</div>
                                    <div className="text-white">{new Date(activeNode.date).getFullYear()}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center relative pointer-events-none z-10">
                            <div className="text-4xl font-bold text-white mb-2 tracking-tighter">DATA BEAM</div>
                            <div className="text-xs font-mono text-green-500 animate-pulse">AWAITING INPUT...</div>

                            {/* Decorative Beam */}
                            <div className="absolute -inset-10 border border-green-500/20 rounded-full animate-ping opacity-20"></div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
