import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface GalleryImage {
    src: string;
    width: number;
    height: number;
    aspectRatio: number;
}

interface ProjectGalleryProps {
    images: GalleryImage[];
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
    const [index, setIndex] = useState(-1);

    if (!images || images.length === 0) return null;

    // Format slides for Lightbox
    const slides = images.map((img) => ({ src: img.src }));

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
                {images.map((img, i) => {
                    // Bento Logic
                    const isTall = img.aspectRatio < 0.8;
                    const isWide = img.aspectRatio > 1.6;

                    let spanClass = "col-span-1 row-span-1";
                    if (isTall) spanClass = "row-span-2";
                    if (isWide) spanClass = "col-span-2";

                    return (
                        <div
                            key={i}
                            className={`relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-all hover:border-neutral-600 hover:shadow-lg cursor-pointer group ${spanClass}`}
                            onClick={() => setIndex(i)}
                        >
                            <img
                                src={img.src}
                                alt={`Gallery image ${i + 1}`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 block"
                                style={{ objectFit: "cover" }}
                                loading="lazy"
                            />
                        </div>
                    );
                })}
            </div>

            <Lightbox
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                slides={slides}
                plugins={[Zoom, Thumbnails]}
                animation={{ fade: 300 }}
                carousel={{ padding: 0, spacing: 0 }}
                controller={{ closeOnBackdropClick: true }}
                render={{
                    iconClose: () => (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white opacity-80 hover:opacity-100 transition-opacity"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    ),
                    buttonPrev: images.length <= 1 ? () => null : undefined,
                    buttonNext: images.length <= 1 ? () => null : undefined,
                }}
                styles={{
                    container: { backgroundColor: "rgba(0, 0, 0, .95)" },
                    root: { "--yarl__color_button": "#fff" } as any,
                    button: { filter: "none" }
                }}
            />
        </>
    );
}
