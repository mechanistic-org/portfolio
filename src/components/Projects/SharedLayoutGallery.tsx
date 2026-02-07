import React, { useState, useEffect } from "react"; // Explicit React import for Astro
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

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

import { getAssetUrl } from "../../utils/assets";

export default function SharedLayoutGallery({
	images,
	id,
	columns = 3,
	layout = "grid",
	scattered = false,
	featuredIndices = [],
	showLabels = true,
}: SharedLayoutGalleryProps & { showLabels?: boolean }) {
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const [activeFilter, setActiveFilter] = useState("All");

	// Extract Categories
	const categories = React.useMemo(() => {
		const cats = new Set(images.map((img) => img.category).filter(Boolean));
		return ["All", ...Array.from(cats)];
	}, [images]);

	// Handle image click - intercept "time-capsule" trigger
	const handleImageClick = (_: GalleryImage, index: number) => {
		// @ts-ignore - trigger property exists in data but not strictly typed yet
		// Normal lightbox
		setSelectedId(`${id}-img-${index}`);
	};

	// Deduplicate images to prevent rendering issues
	// Deduplicate images -> THEN Filter
	const uniqueImages = React.useMemo(() => {
		const unique = images.filter(
			(img, index, self) => index === self.findIndex((t) => t.src === img.src),
		);
		if (activeFilter === "All") return unique;
		return unique.filter((img) => img.category === activeFilter);
	}, [images, activeFilter]);

	useEffect(() => {
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
	const gridClass =
		{
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
		500: 2,
	};

	// Tighter gap for higher density
	const gapClass = columns > 4 ? "gap-2" : "gap-4";

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
				className="group hover:border-accent/40 pointer-events-auto flex h-full flex-col overflow-hidden rounded-sm border border-white/5 bg-neutral-900 transition-colors"
				whileHover={{ y: -4 }}
			>
				{/* Image Top */}
				<div className="relative aspect-video overflow-hidden border-b border-white/5 bg-black/50">
					<img
						src={getAssetUrl(image.src) || ""}
						alt={image.title}
						className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
					/>
					{image.href && (
						<div className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white/70 backdrop-blur-md transition-colors group-hover:text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
								<polyline points="15 3 21 3 21 9"></polyline>
								<line x1="10" y1="14" x2="21" y2="3"></line>
							</svg>
						</div>
					)}
				</div>

				{/* Content Details */}
				<div className="flex grow flex-col p-4">
					<h3 className="text-accent mb-2 truncate font-mono text-sm tracking-wider uppercase">
						{image.title || "Resource"}
					</h3>
					{image.description && (
						<p className="line-clamp-3 text-sm leading-snug text-neutral-400">
							{image.description}
						</p>
					)}
					{image.href && (
						<div className="mt-auto flex items-center gap-2 pt-4 text-[10px] tracking-widest text-neutral-600 uppercase transition-colors group-hover:text-neutral-400">
							<span>
								{(() => {
									try {
										return new URL(image.href).hostname.replace("www.", "");
									} catch {
										return "INTERNAL";
									}
								})()}
							</span>
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
					className={`group hover:border-accent/50 pointer-events-auto relative mb-4 block cursor-pointer overflow-hidden border border-white/5 bg-black/20 transition-all ${getRotation(index)}`}
					whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
				>
					<img
						src={getAssetUrl(image.src)}
						alt={image.title || "External Link"}
						className="h-auto w-full object-cover transition-opacity duration-500 group-hover:opacity-100"
					/>
					{/* External Link Icon Overlay */}
					<div className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 opacity-60 backdrop-blur-sm transition-opacity group-hover:opacity-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-white"
						>
							<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
							<polyline points="15 3 21 3 21 9"></polyline>
							<line x1="10" y1="14" x2="21" y2="3"></line>
						</svg>
					</div>

					{/* Title Overlay */}
					<div className="group-hover:bg-accent/90 absolute right-0 bottom-0 left-0 border-t border-white/10 bg-black/70 p-3 backdrop-blur-md transition-colors duration-300">
						<p className="truncate font-mono text-xs font-bold tracking-widest text-white/90 uppercase group-hover:text-black">
							{image.title || "External Resource"}
						</p>
						<p className="truncate font-sans text-[10px] text-white/50 group-hover:text-black/70">
							{(() => {
								try {
									return new URL(image.href).hostname.replace("www.", "");
								} catch {
									return "INTERNAL";
								}
							})()}
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
					className={`relative mb-4 ${getRotation(index)} pointer-events-auto z-20`}
				>
					<img
						src="/digiME/images/digi_logo_grey_200.gif"
						alt="DigiME Intranet"
						className="cursor-pointer"
						onClick={() => handleImageClick(image, index)}
					/>
					{/* Visual cue label */}
					<div className="absolute right-0 bottom-0 left-0 translate-y-full bg-black/60 p-2 transition-transform duration-300 group-hover:translate-y-0">
						<p className="text-accent text-center font-mono text-[10px] tracking-wider uppercase">
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
				className={`group hover:border-accent/50 pointer-events-auto relative mb-4 cursor-pointer overflow-hidden border border-white/5 bg-black/20 transition-all ${getRotation(index)}`}
				whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
			>
				<img
					src={getAssetUrl(image.src)}
					alt={`Gallery Image ${index + 1}`}
					className="h-auto w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100" // h-auto for masonry
				/>
				{/* Thumbnail Overlay (Optional title on hover) */}
				{showLabels && image.title && (
					<div className="absolute right-0 bottom-0 left-0 translate-y-full bg-black/60 p-2 transition-transform duration-300 group-hover:translate-y-0">
						<p className="truncate font-mono text-[10px] tracking-wider text-white/80 uppercase">
							{image.title}
						</p>
					</div>
				)}
			</motion.div>
		);
	};

	return (
		<div className="no-scrollbar pointer-events-none relative z-50 flex h-full w-full flex-col overflow-hidden px-4 py-2 pt-24 pb-24">
			{/* FILTER BAR */}
			{categories.length > 2 && (
				<div className="pointer-events-auto mb-8 flex shrink-0 flex-wrap justify-center gap-4">
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => setActiveFilter(cat as string)}
							className={`border px-3 py-1 font-mono text-xs tracking-widest uppercase transition-all duration-300 ${
								activeFilter === cat
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
				<div
					className={`m-auto grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`}
				>
					{uniqueImages.map((image, index) => renderCardLayoutItem(image, index))}
				</div>
			) : layout === "grid" ? (
				<div className={`grid grid-cols-2 ${gridClass} ${gapClass} m-auto w-full max-w-7xl`}>
					{uniqueImages.map((image, index) => (
						<div key={index}>{renderImageCard(image, index)}</div>
					))}
				</div>
			) : layout === "collage" ? (
				<div className="relative m-auto flex h-[85vh] w-full max-w-7xl items-center justify-center p-0">
					{/* Background Texture (Contained "Wall") */}
					<div className="pointer-events-none absolute inset-0 z-0 grid grid-cols-2 gap-0.5 overflow-hidden border border-white/5 opacity-30 blur-[0px] grayscale-100">
						{uniqueImages
							.filter((_, i) => !featuredIndices.includes(i))
							.map((image, index) => (
								<div key={`bg-${index}`} className="h-full w-full bg-neutral-900">
									<img
										src={getAssetUrl(image.src)}
										className="h-full w-full object-cover opacity-50 mix-blend-screen"
									/>
								</div>
							))}
					</div>

					{/* Foreground Heroes (Split to sides, padding to clear dots) */}
					<div className="relative z-10 -mt-16 flex w-full flex-col items-center justify-between px-4 md:flex-row md:px-24">
						{uniqueImages
							.filter((_, i) => featuredIndices.includes(i))
							.map((image, index) => (
								<motion.div
									key={`hero-${index}`}
									layoutId={`${id}-hero-${index}`}
									onClick={() =>
										setSelectedId(`${id}-img-${uniqueImages.findIndex((u) => u.src === image.src)}`)
									}
									className={`relative w-full max-w-[400px] cursor-pointer border border-white/20 bg-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300 lg:max-w-[650px] ${index === 0 ? "origin-bottom-right -rotate-6 hover:-rotate-2" : "origin-bottom-left rotate-6 hover:rotate-2"}`}
									initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
									whileInView={{ x: 0, opacity: 1 }}
									viewport={{ once: true }}
								>
									<img src={getAssetUrl(image.src)} className="h-auto w-full" />
									<div className="absolute right-0 bottom-0 left-0 border-t border-white/10 bg-black/90 p-3 backdrop-blur-md">
										<p className="text-accent font-mono text-xs tracking-widest uppercase">
											{image.title}
										</p>
									</div>
								</motion.div>
							))}
					</div>
				</div>
			) : layout === "spotlight" ? (
				<div className="m-auto grid h-auto w-full max-w-7xl grid-cols-1 gap-4 p-4 md:h-[85vh] md:grid-cols-[1.6fr_1fr] md:gap-8 md:p-8">
					{/* Spotlight Hero (Index 0) */}
					<motion.div
						layoutId={`${id}-hero-${0}`}
						onClick={() =>
							setSelectedId(
								`${id}-img-${uniqueImages.findIndex((u) => u.src === uniqueImages[0].src)}`,
							)
						}
						className="group relative h-[400px] w-full cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-black/20 md:h-full"
						whileHover={{ scale: 1.01 }}
					>
						<img
							src={getAssetUrl(uniqueImages[0]?.src)}
							className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
						/>
						<div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 to-transparent p-4">
							<span className="text-accent border-accent border-l-2 pl-3 font-mono text-sm tracking-widest uppercase">
								{uniqueImages[0]?.title}
							</span>
						</div>
					</motion.div>

					{/* Evidence Stack (Rest of images) */}
					<div className="custom-scrollbar flex h-full flex-col gap-4 overflow-y-auto pr-2">
						{uniqueImages.slice(1).map((image, index) => (
							<motion.div
								key={`${id}-stack-${index}`}
								layoutId={`${id}-img-${index + 1}`}
								onClick={() =>
									setSelectedId(`${id}-img-${uniqueImages.findIndex((u) => u.src === image.src)}`)
								}
								className="group hover:border-accent/50 relative h-[33%] min-h-[150px] cursor-pointer overflow-hidden rounded-sm border border-white/5 bg-black/20 transition-colors"
							>
								<img
									src={getAssetUrl(image.src)}
									className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-100"
								/>
								<div className="absolute right-2 bottom-2 bg-black/80 px-2 py-1 font-mono text-[11px] text-white/70 uppercase">
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
						className="-ml-4 flex w-auto [&>div:nth-child(3)]:mt-32 [&>div:nth-child(even)]:mt-16" // Jagged top effect
						columnClassName="pl-4 bg-clip-padding" // Columns gap
					>
						{uniqueImages.map((image, index) => renderImageCard(image, index))}
					</Masonry>
				</div>
			)}

			{/* Fullscreen Overlay - Portaled to Body to escape Stacking Context */}
			{typeof document !== "undefined" &&
				createPortal(
					<AnimatePresence>
						{selectedId && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 z-10001 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl md:p-8"
								onClick={closeModal}
							>
								{/* Navigation Buttons */}
								<button
									onClick={(e) => {
										e.stopPropagation();
										prevImage(e);
									}}
									className="absolute top-1/2 left-4 z-10002 hidden -translate-y-1/2 p-4 text-white/50 transition-colors hover:text-white md:block"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m15 18-6-6 6-6" />
									</svg>
								</button>

								<button
									onClick={(e) => {
										e.stopPropagation();
										nextImage(e);
									}}
									className="absolute top-1/2 right-4 z-10002 hidden -translate-y-1/2 p-4 text-white/50 transition-colors hover:text-white md:block"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m9 18 6-6-6-6" />
									</svg>
								</button>

								{/* Selected Image Container*/}
								<div className="pointer-events-none relative flex h-full w-full max-w-7xl flex-col items-center justify-center">
									<motion.div
										layoutId={selectedId}
										className="pointer-events-auto relative flex h-full max-h-[85vh] w-full items-center justify-center"
										drag="y"
										dragConstraints={{ top: 0, bottom: 0 }}
										dragElastic={0.7}
										onDragEnd={(_, { offset, velocity }) => {
											const swipeThreshold = 100;
											const velocityThreshold = 500;
											if (offset.y > swipeThreshold || velocity.y > velocityThreshold) {
												closeModal();
											}
										}}
									>
										<img
											src={getAssetUrl(uniqueImages[selectedIndex].src)}
											alt="Selected"
											className="max-h-full max-w-full cursor-pointer object-contain shadow-2xl"
											onClick={(e) => {
												e.stopPropagation();
												nextImage(e);
											}}
										/>
									</motion.div>

									{/* Metadata Pane */}
									{currentImage && (currentImage.title || currentImage.description) && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.2 }}
											className="pointer-events-auto mt-4 w-full max-w-2xl rounded-sm border-t border-white/10 bg-black/80 p-6 backdrop-blur-md"
											onClick={(e) => e.stopPropagation()}
										>
											<div className="flex flex-col gap-2">
												{currentImage.title && (
													<h3 className="text-accent mb-1 border-b border-white/10 pb-2 font-mono text-sm tracking-widest uppercase">
														{currentImage.title}
													</h3>
												)}
												{currentImage.description && (
													<p className="font-sans text-base leading-relaxed text-white/80">
														{currentImage.description}
													</p>
												)}
											</div>
										</motion.div>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</div>
	);
}
