import React, { useState, useEffect } from "react"; // Explicit React import for Astro
import { motion, AnimatePresence } from "framer-motion";
import TimeCapsule from "./TimeCapsule";
import RetroLogoAnimator from "./RetroLogoAnimator";

interface GalleryImage {
    src: string;
    aspectRatio?: number;
    title?: string;
    description?: string;
    trigger?: string;
    href?: string; //  <-- Added for link cards
    category?: string; // <-- Added for Isotope Filtering
}

import Masonry from "react-masonry-css";

interface SharedLayoutGalleryProps {
    images: GalleryImage[];
    id: string; // Unique ID for the gallery instance (to isolate layoutIds)
    columns?: 2 | 3 | 4 | 5 | 6 | 8; // Explicit column count control
    layout?: "grid" | "masonry" | "collage" | "spotlight" | "cards";
    scattered?: boolean;
    featuredIndices?: number[]; // Indices of images to highlight in collage mode
}

// Helper to handle asset URLs
const getAssetUrl = (src: string) => {
    return src;
};

export default function SharedLayoutGallery({ images, id, columns = 3, layout = "grid", scattered = false, featuredIndices = [], showLabels = true }: SharedLayoutGalleryProps & { showLabels?: boolean }) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showTimeCapsule, setShowTimeCapsule] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");

    // Extract Categories
    const categories = React.useMemo(() => {
        const cats = new Set(images.map(img => img.category).filter(Boolean));
        return ["All", ...Array.from(cats)];
    }, [images]);

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
    // Deduplicate images -> THEN Filter
    const uniqueImages = React.useMemo(() => {
        const unique = images.filter((img, index, self) =>
            index === self.findIndex((t) => t.src === img.src)
        );
        if (activeFilter === "All") return unique;
        return unique.filter(img => img.category === activeFilter);
    }, [images, activeFilter]);

    const instanceId = React.useRef(Math.random().toString(36).substr(2, 5));
    useEffect(() => {
        console.log(`[Gallery Debug] Instance: ${instanceId.current} | ID: ${id} | Images: ${images.length}`);
        // DEBUG: Check for categories
        const debugCats = images.map(img => img.category);
        console.log(`[Gallery Debug] Categories found:`, debugCats);

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

    const renderCardLayoutItem = (image: GalleryImage, index: number) => {
        // Card Layout Implementation
        return (
            <motion.a
                key={`${id}-card-${index}`}
                href={image.href}
                target={image.href ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group block bg-neutral-900 border border-white/5 hover:border-accent/40 rounded-sm overflow-hidden transition-colors h-full flex flex-col"
                whileHover={{ y: -4 }}
            >
                {/* Image Top */}
                <div className="relative aspect-video overflow-hidden bg-black/50 border-b border-white/5">
                    <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    {image.href && (
                        <div className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white/70 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </div>
                    )}
                </div>

                {/* Content Details */}
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-mono text-sm uppercase tracking-wider text-accent mb-2 truncate">
                        {image.title || "Resource"}
                    </h3>
                    {image.description && (
                        <p className="text-sm text-neutral-400 leading-snug line-clamp-3">
                            {image.description}
                        </p>
                    )}
                    {image.href && (
                        <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">
                            <span>{new URL(image.href).hostname.replace('www.', '')}</span>
                        </div>
                    )}
                </div>
            </motion.a>
        );
    };

    const renderImageCard = (image: GalleryImage, index: number) => {
        // SPECIAL CASE: Link Card
        if (image.href) {
            return (
                <motion.a
                    key={`${id}-img-${index}`}
                    href={image.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block cursor-pointer group relative overflow-hidden bg-black/20 border border-white/5 hover:border-accent/50 transition-all mb-4 ${getRotation(index)}`}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <img
                        src={image.src}
                        alt={image.title || "External Link"}
                        className="w-full h-auto object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                    />
                    {/* External Link Icon Overlay */}
                    <div className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/70 backdrop-blur-md border-t border-white/10 group-hover:bg-accent/90 transition-colors duration-300">
                        <p className="text-xs font-mono text-white/90 uppercase tracking-widest truncate group-hover:text-black font-bold">
                            {image.title || "External Resource"}
                        </p>
                        <p className="text-[10px] text-white/50 truncate font-sans group-hover:text-black/70">
                            {new URL(image.href).hostname.replace('www.', '')}
                        </p>
                    </div>
                </motion.a>
            );
        }

        // SPECIAL CASE: Time Capsule Trigger
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

        // STANDARD: Lightbox Image
        return (
            <motion.div
                key={`${id}-img-${index}`}
                layoutId={`${id}-img-${index}`}
                onClick={() => handleImageClick(image, index)}
                className={`cursor-pointer group relative overflow-hidden bg-black/20 border border-white/5 hover:border-accent/50 transition-all mb-4 ${getRotation(index)}`}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
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
        <div className="w-full pointer-events-auto relative z-50 h-full overflow-y-auto px-4 py-2 scrollbar-hide flex flex-col pt-24 pb-24">
            {/* FILTER BAR */}
            {categories.length > 2 && (
                <div className="flex flex-wrap justify-center gap-4 mb-8 shrink-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat as string)}
                            className={`px-3 py-1 text-xs font-mono uppercase tracking-widest border transition-all duration-300 ${activeFilter === cat
                                ? "border-accent text-accent bg-accent/10"
                                : "border-transparent text-neutral-500 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Layout Switcher */}
            {layout === "cards" ? (
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-auto w-full max-w-7xl`}>
                    {uniqueImages.map((image, index) => renderCardLayoutItem(image, index))}
                </div>
            ) : layout === "grid" ? (
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
                                drag="y"
                                dragConstraints={{ top: 0, bottom: 0 }}
                                dragElastic={0.7}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipeThreshold = 100;
                                    const velocityThreshold = 500;
                                    if (offset.y > swipeThreshold || velocity.y > velocityThreshold) {
                                        closeModal();
                                    }
                                }}
                                onClick={(e) => {
                                    // Allow clicks on the wrapper (padding area) to close, but stop propagation if we dragged?
                                    // Actually, wrapper clicks should propagate to container (Close).
                                    // But framer motion might block propagation on drag.
                                    // We don't need explicit onClick here if we want bubbling.
                                }}
                            >
                                <img
                                    src={getAssetUrl(uniqueImages[selectedIndex].src)}
                                    alt="Selected"
                                    className="max-w-full max-h-full object-contain shadow-2xl cursor-pointer"
                                    onClick={nextImage}
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


                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
