import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Masonry from "react-masonry-css";

interface ProjectGalleryProps {
    images: string[];
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
    const [index, setIndex] = useState(-1);

    const breakpointColumnsObj = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
    };

    if (!images || images.length === 0) return null;

    // Format slides for Lightbox
    const slides = images.map((src) => ({ src }));

    return (
        <>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid flex w-auto -ml-4"
                columnClassName="my-masonry-grid_column pl-4 bg-clip-padding"
            >
                {images.map((img, i) => (
                    <div
                        key={i}
                        className="mb-4 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-all hover:border-neutral-600 hover:shadow-lg cursor-pointer group"
                        onClick={() => setIndex(i)}
                    >
                        <img
                            src={img}
                            alt={`Gallery image ${i + 1}`}
                            className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                ))}
            </Masonry>

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
