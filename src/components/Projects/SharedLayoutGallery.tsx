import React, { useState, useEffect } from "react"; // Explicit React import for Astro
import { motion, AnimatePresence } from "framer-motion";
import TimeCapsule from "./TimeCapsule";
import RetroLogoAnimator from "./RetroLogoAnimator";

interface GalleryImage {
    src: string;
    aspectRatio?: number;
    title?: string;
    description?: string;
}

import Masonry from "react-masonry-css";

interface SharedLayoutGalleryProps {
    images: GalleryImage[];
    id: string; // Unique ID for the gallery instance (to isolate layoutIds)
    columns?: 2 | 3 | 4 | 5 | 6 | 8; // Explicit column count control
    layout?: "grid" | "masonry" | "collage" | "spotlight";
    scattered?: boolean;
    featuredIndices?: number[]; // Indices of images to highlight in collage mode
}

export default function SharedLayoutGallery({ images, id, columns = 3, layout = "grid", scattered = false, featuredIndices = [], showLabels = true }: SharedLayoutGalleryProps & { showLabels?: boolean }) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showTimeCapsule, setShowTimeCapsule] = useState(false);

    // Handle image click - intercept "time-capsule" trigger
    const handleImageClick = (image: GalleryImage, index: number) => {
        // @ts-ignore - trigger property exists in data but not strictly typed yet
        if (image.trigger === "time-capsule") {
            setShowTimeCapsule(true);
        } else {
            setSelectedId(`${id}-img-${index}`);
        }
    };

    // Deduplicate images to prevent rendering issues
    const uniqueImages = React.useMemo(() => {
        return images.filter((img, index, self) =>
            index === self.findIndex((t) => t.src === img.src)
        );
    }, [images]);

    const instanceId = React.useRef(Math.random().toString(36).substr(2, 5));
    useEffect(() => {
        console.log(`[Gallery Debug] Instance: ${instanceId.current} | ID: ${id} | Images: ${images.length} | Unique: ${uniqueImages.length}`);
        console.table(images.map(img => ({ src: img.src, title: img.title }))); // Dump the data
        if (images.length !== uniqueImages.length) {
            console.warn(`[Gallery Debug] Duplicates in ${id}:`, images);
        }
    }, [images, uniqueImages, id]);

    // Find index of currently selected image
    const selectedIndex = uniqueImages.findIndex((_, i) => `${id}-img-${i}` === selectedId);

    const closeModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedId(null);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex < uniqueImages.length - 1) {
            setSelectedId(`${id}-img-${selectedIndex + 1}`);
        } else {
            setSelectedId(`${id}-img-0`); // Loop
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex > 0) {
            setSelectedId(`${id}-img-${selectedIndex - 1}`);
        } else {
            setSelectedId(`${id}-img-${uniqueImages.length - 1}`); // Loop
        }
    };

    // Keyboard navigation
    useEffect(() => {
        if (!selectedId) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") {
                if (selectedIndex < uniqueImages.length - 1) {
                    setSelectedId(`${id}-img-${selectedIndex + 1}`);
                } else {
                    setSelectedId(`${id}-img-0`);
                }
            }
            if (e.key === "ArrowLeft") {
                if (selectedIndex > 0) {
                    setSelectedId(`${id}-img-${selectedIndex - 1}`);
                } else {
                    setSelectedId(`${id}-img-${uniqueImages.length - 1}`);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId, selectedIndex, uniqueImages.length, id]); // Re-bind when index changes

    // Get current image for metadata display
    const currentImage = selectedIndex !== -1 ? uniqueImages[selectedIndex] : null;

    // Map column count to Tailwind classes
    const gridClass = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-4",
        5: "md:grid-cols-5",
        6: "md:grid-cols-6",
        8: "md:grid-cols-8",
    }[columns] || "md:grid-cols-3";

    // Masonry Breakpoints
    const masonryBreakpoints = {
        default: columns,
        1100: Math.max(1, columns - 1),
        700: Math.max(1, columns - 2),
        500: 2
    };

    // Tighter gap for higher density
    const gapClass = columns > 4 ? "gap-2" : "gap-4";
    const masonryGap = columns > 4 ? "8px" : "16px"; // Pixel values for Masonry lib

    // Deterministic Rotation for "Scattered" look
    const getRotation = (index: number) => {
        if (!scattered) return "";
        const rotations = ["rotate-1", "-rotate-2", "rotate-3", "-rotate-1", "rotate-2", "-rotate-3"];
        return rotations[index % rotations.length];
    };

    const renderImageCard = (image: GalleryImage, index: number) => {
        // @ts-ignore
        if (image.trigger === "time-capsule") {
            return (
                <motion.div
                    key={`${id}-img-${index}`}
                    layoutId={`${id}-img-${index}`}
                    className={`relative mb-4 ${getRotation(index)} z-20`}
                >
                    <RetroLogoAnimator onClick={() => handleImageClick(image, index)} />
                    {/* Visual cue label */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-[10px] font-mono text-accent uppercase tracking-wider text-center">
                            {image.title}
                        </p>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                key={`${id}-img-${index}`}
                layoutId={`${id}-img-${index}`}
                onClick={() => handleImageClick(image, index)}
                className={`cursor-pointer group relative overflow-hidden bg-black/20 border border-white/5 hover:border-accent/50 transition-all mb-4 ${getRotation(index)}`} // Added transition-all and rotation
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }} // Pop up and straighten on hover
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <img
                    src={image.src}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" // h-auto for masonry
                />
                {/* Thumbnail Overlay (Optional title on hover) */}
                {showLabels && image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-[10px] font-mono text-white/80 uppercase tracking-wider truncate">
                            {image.title}
                        </p>
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div className="w-full pointer-events-auto relative z-50 h-full overflow-y-auto px-4 py-2 scrollbar-hide flex flex-col justify-center">
            {/* Layout Switcher */}
            {layout === "grid" ? (
                <div className={`grid grid-cols-2 ${gridClass} ${gapClass} m-auto w-full max-w-7xl`}>
                    {uniqueImages.map((image, index) => (
                        <div key={index}>
                            {renderImageCard(image, index)}
                        </div>
                    ))}
                </div>
            ) : layout === "collage" ? (
                <div className="relative w-full max-w-7xl m-auto h-[85vh] flex items-center justify-center p-0">
                    {/* Background Texture (Contained "Wall") */}
                    <div className="absolute inset-0 grid grid-cols-2 gap-0.5 opacity-30 blur-[0px] grayscale-[100%] z-0 pointer-events-none border border-white/5 overflow-hidden">
                        {uniqueImages.filter((_, i) => !featuredIndices.includes(i)).map((image, index) => (
                            <div key={`bg-${index}`} className="w-full h-full bg-neutral-900">
                                <img src={image.src} className="w-full h-full object-cover opacity-50 mix-blend-screen" />
                            </div>
                        ))}
                    </div>

                    {/* Foreground Heroes (Split to sides, padding to clear dots) */}
                    <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center px-4 md:px-24 -mt-16">
                        {uniqueImages.filter((_, i) => featuredIndices.includes(i)).map((image, index) => (
                            <motion.div
                                key={`hero-${index}`}
                                layoutId={`${id}-hero-${index}`}
                                onClick={() => setSelectedId(`${id}-img-${uniqueImages.findIndex(u => u.src === image.src)}`)}
                                className={`cursor-pointer relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/20 bg-neutral-900 w-full max-w-[400px] lg:max-w-[650px] transition-all duration-300 ${index === 0 ? '-rotate-6 hover:-rotate-2 origin-bottom-right' : 'rotate-6 hover:rotate-2 origin-bottom-left'}`}
                                initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                <img src={image.src} className="w-full h-auto" />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/90 backdrop-blur-md border-t border-white/10">
                                    <p className="text-xs font-mono text-accent uppercase tracking-widest">{image.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : layout === "spotlight" ? (
                <div className="w-full max-w-7xl m-auto h-auto md:h-[85vh] grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 md:gap-8 p-4 md:p-8">
                    {/* Spotlight Hero (Index 0) */}
                    <motion.div
                        layoutId={`${id}-hero-${0}`}
                        onClick={() => setSelectedId(`${id}-img-${uniqueImages.findIndex(u => u.src === uniqueImages[0].src)}`)}
                        className="cursor-pointer relative w-full h-[400px] md:h-full rounded-sm overflow-hidden border border-white/10 bg-black/20 group"
                        whileHover={{ scale: 1.01 }}
                    >
                        <img src={uniqueImages[0]?.src} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/90 to-transparent w-full">
                            <span className="text-accent font-mono text-sm uppercase tracking-widest border-l-2 border-accent pl-3">
                                {uniqueImages[0]?.title}
                            </span>
                        </div>
                    </motion.div>

                    {/* Evidence Stack (Rest of images) */}
                    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar">
                        {uniqueImages.slice(1).map((image, index) => (
                            <motion.div
                                key={`${id}-stack-${index}`}
                                layoutId={`${id}-img-${index + 1}`}
                                onClick={() => setSelectedId(`${id}-img-${uniqueImages.findIndex(u => u.src === image.src)}`)}
                                className="cursor-pointer relative h-[33%] min-h-[150px] rounded-sm overflow-hidden border border-white/5 bg-black/20 group hover:border-accent/50 transition-colors"
                            >
                                <img src={image.src} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-[11px] font-mono text-white/70 uppercase">
                                    {image.title}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`m-auto w-full max-w-7xl`}>
                    <Masonry
                        breakpointCols={masonryBreakpoints}
                        className="flex w-auto -ml-4 [&>div:nth-child(even)]:mt-16 [&>div:nth-child(3)]:mt-32" // Jagged top effect
                        columnClassName="pl-4 bg-clip-padding" // Columns gap
                    >
                        {uniqueImages.map((image, index) => renderImageCard(image, index))}
                    </Masonry>
                </div>
            )}

            <TimeCapsule isOpen={showTimeCapsule} onClose={() => setShowTimeCapsule(false)} />

            {/* Fullscreen Overlay */}
            <AnimatePresence>
                {selectedId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
                        onClick={closeModal}
                    >
                        {/* Navigation Buttons */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-[210] hidden md:block" // increased z-index
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-[210] hidden md:block" // increased z-index
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>



                        {/* Selected Image Container*/}
                        <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center pointer-events-none">
                            <motion.div
                                layoutId={selectedId}
                                className="relative w-full h-full flex items-center justify-center max-h-[85vh] pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={uniqueImages[selectedIndex].src}
                                    alt="Selected"
                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                />
                            </motion.div>

                            {/* Metadata Pane */}
                            {currentImage && (currentImage.title || currentImage.description) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full max-w-2xl bg-black/80 border-t border-white/10 mt-4 p-6 pointer-events-auto backdrop-blur-md rounded-sm"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex flex-col gap-2">
                                        {currentImage.title && (
                                            <h3 className="text-sm font-mono text-accent uppercase tracking-widest border-b border-white/10 pb-2 mb-1">
                                                {currentImage.title}
                                            </h3>
                                        )}
                                        {currentImage.description && (
                                            <p className="text-base text-white/80 font-sans leading-relaxed">
                                                {currentImage.description}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Close Button (Moved to end for Z-stacking safety) */}
                        <button
                            onClick={(e) => closeModal(e)}
                            className="absolute top-24 right-4 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/80 hover:text-white transition-all z-[10002] group"
                        >
                            <span className="text-xs font-mono uppercase tracking-widest hidden md:block">Grid View</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
