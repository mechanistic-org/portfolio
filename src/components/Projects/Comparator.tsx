import React, { useState, useRef, useEffect } from "react";
import { motion, useDragControls, useMotionValue, useTransform } from "framer-motion";

interface Props {
    beforeSrc: string;
    afterSrc: string;
    beforeLabel?: string;
    afterLabel?: string;
}

export default function Comparator({ beforeSrc, afterSrc, beforeLabel = "BEFORE", afterLabel = "AFTER" }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const x = useMotionValue(0);

    // Sync x with width/2 initially
    useEffect(() => {
        if (containerRef.current) {
            const w = containerRef.current.offsetWidth;
            setWidth(w);
            x.set(w / 2);
        }
    }, []);

    // Function to update dimensions on resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-full max-h-[80vh] aspect-video bg-neutral-900 border border-white/10 select-none overflow-hidden group">
            {/* AFTER IMAGE (Background) */}
            <img src={afterSrc} alt="After" className="absolute inset-0 w-full h-full object-contain" draggable={false} />
            <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 text-xs font-mono text-green-400 border border-green-500/30 backdrop-blur-md">
                {afterLabel}
            </div>

            {/* BEFORE IMAGE (Foreground - Clipped) */}
            <motion.div
                className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900"
                style={{ width: x }}
            >
                {/* 
                     We need to render the image at FULL width, but contained within a div that is shrinking.
                     But plain width clipping works for <img>? 
                     No, if we shrink the parent, the img might shrink if width=100%.
                     We need the img to perform "object-contain" relative to the FULL container, not this clipped one.
                     Or simpler: specific width/height.
                     
                     Solution: Use Object-Position to keep it locked?
                     Actually, simplest way for generic content is to use a fixed aspect ratio or absolute positioning.
                     Since we don't know AR, "object-contain" is tricky with clipping.
                     
                     Better approach: clip-path?
                     style={{ clipPath: `inset(0 ${width - x.get()}px 0 0)` }}
                     But x is a motion value.
                 */}
                <motion.img
                    src={beforeSrc}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-contain"
                    draggable={false}
                    // This inner image needs to match whatever the outer image is doing layout-wise.
                    // If container is w-full h-full, this img is w-full h-full. But parent motion.div is clipped.
                    // We must ensure the image INSIDE renders at full container width!
                    style={{ width: width }}
                />
                <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 text-xs font-mono text-red-400 border border-red-500/30 backdrop-blur-md z-10">
                    {beforeLabel}
                </div>
            </motion.div>

            {/* HANDLER */}
            <motion.div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center"
                style={{ x }}
                drag="x"
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                onDrag={(event, info) => {
                    // x is automatically updated by drag
                }}
            >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            </motion.div>
        </div>
    );
}
