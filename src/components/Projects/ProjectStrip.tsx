import React, { useState } from 'react';
import ProjectModal from './ProjectModal';

interface Project {
    id: string;
    slug?: string;
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
    // Default to the first project for the "Works-Like" preview
    // const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [hoverIndex, setHoverIndex] = useState<number>(0);

    // Modal State
    const [modalIndex, setModalIndex] = useState<number>(-1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (index: number) => {
        setModalIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleNext = () => {
        setModalIndex((prev) => (prev + 1) % projects.length);
    };

    const handlePrev = () => {
        setModalIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    const activeProject = projects[hoverIndex];
    const modalProject = modalIndex >= 0 ? projects[modalIndex] : null;

    return (
        <div className="w-full flex flex-col md:flex-row gap-8 min-h-[500px]">

            {/* Left Column: The Index (Term Sheet) */}
            <div className="flex-1 flex flex-col gap-px bg-white/5 border border-white/10">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 p-3 bg-white/5 text-[10px] font-mono uppercase text-white/40 tracking-wider">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-11 md:col-span-5">Project</div>
                    <div className="hidden md:block col-span-3">Role</div>
                    <div className="hidden md:block col-span-3 text-right">Deploy</div>
                </div>

                {/* Data Rows */}
                {projects.slice(0, 8).map((project, index) => (
                    <div
                        key={project.id}
                        onMouseEnter={() => setHoverIndex(index)}
                        onClick={() => openModal(index)}
                        className={`group cursor-pointer grid grid-cols-12 gap-4 p-3 border-l-2 transition-all duration-100 ${hoverIndex === index
                            ? 'bg-white/10 border-emerald-500 text-white'
                            : 'bg-transparent border-transparent text-white/60 hover:text-white'
                            }`}
                    >
                        <div className="col-span-1 font-mono text-xs opacity-50">
                            {(index + 1).toString().padStart(2, '0')}
                        </div>
                        <div className="col-span-11 md:col-span-5 font-mono font-bold text-sm tracking-tight truncate">
                            {project.data.title.toUpperCase()}
                        </div>
                        <div className="hidden md:block col-span-3 font-mono text-xs opacity-70 truncate">
                            {project.data.role || "ENGINEER"}
                        </div>
                        <div className="hidden md:block col-span-3 font-mono text-xs text-right opacity-50">
                            {new Date(project.data.date || Date.now()).getFullYear()}
                        </div>
                    </div>
                ))}

                <a href="/projects" className="p-3 mt-auto text-center font-mono text-xs text-emerald-500 hover:text-emerald-400 border-t border-white/10 transition-colors">
                    /// VIEW ALL {projects.length} RECORDS
                </a>
            </div>

            {/* Right Column: The "Works-Like" Preview (Mechanism) */}
            <div className="hidden md:block w-[400px] xl:w-[500px] flex-shrink-0 relative border border-white/10 bg-black">
                {activeProject ? (
                    <div className="relative h-full w-full flex flex-col">
                        {/* CRT Screen Effect Container */}
                        <div className="relative flex-grow overflow-hidden">
                            {activeProject.data.heroImage ? (
                                <img
                                    src={activeProject.data.heroImage}
                                    alt={activeProject.data.title}
                                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 border border-white/5">
                                    <span className="font-mono text-xs text-white/20">NO VISUAL SIGNAL</span>
                                </div>
                            )}

                            {/* Scanline Overlay */}
                            <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none"></div>
                        </div>

                        {/* Metadata Footer */}
                        <div className="p-6 border-t border-white/10 bg-black/90 backdrop-blur">
                            <h3 className="text-2xl font-bold font-sans text-white tracking-tighter mb-2">
                                {activeProject.data.title}
                            </h3>
                            <p className="font-mono text-sm text-white/50 line-clamp-2 mb-4">
                                {activeProject.data.description || "Classified engineering data."}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {activeProject.data.tags?.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2 py-1 text-[10px] uppercase font-mono border border-emerald-500/30 text-emerald-500">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <span className="font-mono animate-pulse text-emerald-500">AWAITING INPUT...</span>
                    </div>
                )}
            </div>

            {modalProject && (
                <ProjectModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    project={{
                        ...modalProject.data,
                        id: modalProject.id,
                        date: modalProject.data.date?.toISOString()
                    }}
                />
            )}
        </div>
    );
};

export default ProjectStrip;
