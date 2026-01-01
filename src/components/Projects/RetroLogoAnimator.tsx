import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = [
    "/assets/r2/c24/bubbles/05_paper_trail/digi_logo_from_scratch_blue.png",
    "/assets/r2/c24/bubbles/05_paper_trail/digi_logo_from_scratch_cyan.png",
    "/assets/r2/c24/bubbles/05_paper_trail/digi_logo_from_scratch_green.png",
    "/assets/r2/c24/bubbles/05_paper_trail/digi_logo_from_scratch_orange.png",
    "/assets/r2/c24/bubbles/05_paper_trail/digi_logo_from_scratch_purple.png",
    "/assets/r2/c24/bubbles/05_paper_trail/digi_logo_from_scratch_grey.png"
];

interface RetroLogoAnimatorProps {
    onClick: () => void;
}

export default function RetroLogoAnimator({ onClick }: RetroLogoAnimatorProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovered) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % variants.length);
            }, 150); // Fast cycle speed for that "holographic" feel
        } else {
            setCurrentIndex(0); // Reset to Blue on mouse leave
        }
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <div
            className="relative w-full h-full cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={variants[currentIndex]}
                    src={variants[currentIndex]}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }} // Smooth crossfade
                    className="w-full h-auto object-cover"
                    alt="DigiME Time Capsule"
                />
            </AnimatePresence>

            {/* Scanline Overlay on Hover */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-10"
                />
            )}
        </div>
    );
}
