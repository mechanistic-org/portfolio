import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import ProjectModal from './ProjectModal';

interface Project {
    id: string;
    data: {
        title: string;
        description?: string;
        heroImage?: string;
        employer?: string;
        date?: Date;
        tags?: string[];
        skillData?: { name: string; value: number }[];
    };
}

interface ProjectStripProps {
    projects: Project[];
}

const ProjectStrip: React.FC<ProjectStripProps> = ({ projects }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            dragFree: true,
            containScroll: "trimSnaps",
            align: "start",
            loop: true
        },
        [
            AutoScroll({
                playOnInit: true,
                speed: 1,
                stopOnInteraction: false,
                stopOnMouseEnter: true
            })
        ]
    );

    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Accessibility: Pause/Disable drag on reduced motion
    useEffect(() => {
        if (!emblaApi) return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = () => {
            const autoScroll = emblaApi.plugins().autoScroll;
            if (!autoScroll) return;

            if (mediaQuery.matches) {
                autoScroll.stop();
            } else {
                if (!autoScroll.isPlaying()) autoScroll.play();
            }
        };

        handleMotionChange();
        mediaQuery.addEventListener('change', handleMotionChange);
        return () => mediaQuery.removeEventListener('change', handleMotionChange);
    }, [emblaApi]);

    const openModal = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev + 1) % projects.length);
    };

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    const selectedProject = selectedIndex >= 0 ? projects[selectedIndex] : null;

    return (
        <>
            <div className="embla relative w-full overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className="flex-[0_0_85%] min-w-0 sm:flex-[0_0_45%] md:flex-[0_0_30%]"
                        >
                            <div
                                onClick={() => openModal(index)}
                                className="group flex h-full cursor-pointer flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xl"
                            >
                                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted relative">
                                    {project.data.heroImage ? (
                                        <img
                                            src={project.data.heroImage}
                                            alt={project.data.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    )}

                                    <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                                        <span className="rounded bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                                            Quick View
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-grow flex-col justify-between gap-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                            {project.data.title || "Untitled Project"}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-mono mt-1">
                                            {project.data.employer} • {new Date(project.data.date || Date.now()).getFullYear()}
                                        </p>
                                    </div>

                                    {project.data.tags && project.data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                                            {project.data.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="bg-muted px-2 py-1 rounded">{tag}</span>
                                            ))}
                                            {project.data.tags.length > 3 && <span className="px-1 py-1">+{project.data.tags.length - 3}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedProject && (
                <ProjectModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    project={{
                        ...selectedProject.data,
                        id: selectedProject.id, // Pass ID for slug
                        date: selectedProject.data.date?.toISOString()
                    }}
                />
            )}
        </>
    );
};

export default ProjectStrip;
