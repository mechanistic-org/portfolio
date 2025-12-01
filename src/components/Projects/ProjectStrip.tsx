import React, { useState, useEffect, useRef } from 'react';
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
        client?: string[];
        role?: string;
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

    // Swarm Effect Logic
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        card.style.setProperty('--opacity', '1');
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        card.style.setProperty('--opacity', '0');
    };

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
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                className="group relative flex aspect-video cursor-pointer flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition-all hover:border-primary/50 hover:shadow-2xl"
                                style={{
                                    '--x': '50%',
                                    '--y': '50%',
                                    '--opacity': '0'
                                } as React.CSSProperties}
                            >
                                {/* Swarm Spotlight Background */}
                                <div
                                    className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
                                    style={{
                                        background: `radial-gradient(600px circle at var(--x) var(--y), rgba(16, 185, 129, 0.35), transparent 40%)`,
                                        opacity: 'var(--opacity)'
                                    }}
                                />

                                {/* Image Layer */}
                                <div className="absolute inset-0 z-10">
                                    {project.data.heroImage ? (
                                        <img
                                            src={project.data.heroImage}
                                            alt={project.data.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-700">
                                            <span className="text-xs font-mono">NO_SIGNAL</span>
                                        </div>
                                    )}
                                </div>

                                {/* Data Overlay (Technical HUD) */}
                                <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    {/* Top: ID/Role */}
                                    <div className="flex items-start justify-between">
                                        <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 backdrop-blur-sm">
                                            {project.data.role || "ENGINEER"}
                                        </span>
                                        <span className="font-mono text-xs text-neutral-400">
                                            {new Date(project.data.date || Date.now()).getFullYear()}
                                        </span>
                                    </div>

                                    {/* Bottom: Title & Tech */}
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-mono text-xl font-bold text-white tracking-tight">
                                            {project.data.title.toUpperCase()}
                                        </h3>
                                        <div className="h-px w-full bg-gradient-to-r from-primary/50 to-transparent" />
                                        <div className="flex flex-wrap gap-2">
                                            {project.data.tags?.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-[10px] font-mono text-neutral-300 bg-black/50 px-1.5 py-0.5 rounded border border-neutral-800">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
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
