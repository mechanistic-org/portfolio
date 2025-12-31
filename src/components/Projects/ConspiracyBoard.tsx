import React, { useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";

interface Props {
    images: { src: string; title: string }[];
}

export default function ConspiracyBoard({ images }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-neutral-900 overflow-hidden cursor-crosshair">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20 pointer-events-none" />

            {images.map((img, index) => {
                // Randomize initial position and rotation
                const randomX = Math.random() * 60 - 30; // -30% to 30%
                const randomY = Math.random() * 60 - 30;
                const randomRotate = Math.random() * 20 - 10; // -10deg to 10deg

                return (
                    <Polaroid
                        key={index}
                        src={img.src}
                        title={img.title}
                        initialRotate={randomRotate}
                        initialX={randomX}
                        initialY={randomY}
                        containerRef={containerRef}
                    />
                );
            })}

            <div className="absolute bottom-8 left-8 bg-black/80 p-4 border border-red-500/50 backdrop-blur-md pointer-events-none">
                <h3 className="text-red-500 font-mono text-xs uppercase tracking-widest mb-1">Evidence Locker</h3>
                <p className="text-neutral-400 text-xs font-mono">Drag items to investigate relationships.</p>
            </div>
        </div>
    );
}

const Polaroid = ({ src, title, initialRotate, initialX, initialY, containerRef }: any) => {
    return (
        <motion.div
            drag
            dragConstraints={containerRef}
            dragElastic={0.2}
            whileDrag={{ scale: 1.1, zIndex: 100, rotate: 0, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
            initial={{
                rotate: initialRotate,
                x: `${initialX}%`,   // Using CSS translate for initial random scattering
                y: `${initialY}%`
            }}
            className="absolute top-1/2 left-1/2 w-64 bg-[#f0f0f0] p-3 pb-8 shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ touchAction: "none" }}
        >
            <div className="w-full aspect-square bg-neutral-800 overflow-hidden mb-2 relative group">
                <img src={src} alt={title} className="w-full h-full object-cover pointer-events-none grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-red-500/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <div className="font-handwriting text-neutral-800 text-sm rotate-1 font-bold mt-2 transform skew-x-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                {title.toUpperCase()}
            </div>

            {/* Tape Effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-yellow-100/30 rotate-2 backdrop-blur-sm border-l border-r border-white/20" />
        </motion.div>
    );
};
