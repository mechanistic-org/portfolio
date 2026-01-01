import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const C24TitleAnimator: React.FC = () => {
    // Start expanded (false), then collapse (true)
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        // Start animation after a short delay to ensure hydration
        const timer = setTimeout(() => {
            setIsCollapsed(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Animation Config
    const duration = 0.6; // Faster for hover responsiveness
    const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]; // "Out Quint" feel

    return (
        <div
            className="relative z-10 font-heading text-9xl font-bold tracking-tighter text-white mix-blend-difference flex items-center select-none cursor-default group pointer-events-auto"
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
        >
            {/* The "C" (Static Anchor) */}
            <div className="relative z-20">C</div>

            {/* The Collapsible "ontrol" */}
            <motion.div
                initial={{ width: 'auto', opacity: 1, x: 0 }}
                animate={{
                    width: isCollapsed ? 0 : 'auto',
                    opacity: isCollapsed ? 0 : 1,
                    x: isCollapsed ? 10 : 0, // Slight movement for dynamic feel
                }}
                transition={{ duration, ease }}
                className="overflow-hidden whitespace-nowrap origin-left"
            >
                ontrol
            </motion.div>

            {/* The Pipe (The Portal) */}
            {/* FORCE VISIBILITY: Inline styles - Nuclear Option */}
            <div className="mx-4 relative z-20 flex items-center justify-center">
                <span style={{
                    display: 'inline-block',
                    height: '110px', /* Explicit pixel height for text-9xl (~128px) */
                    width: '0px',
                    borderLeft: '6px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '2px',
                    marginTop: '10px'
                }}></span>
            </div>

            {/* The "24" (Static Anchor) */}
            <div className="relative z-20">24</div>
        </div>
    );
};

export default C24TitleAnimator;
