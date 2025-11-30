import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ProjectData {
    id?: string; // Added ID for slug
    title: string;
    description?: string;
    heroImage?: string;
    employer?: string;
    client?: string | string[];
    date?: string;
    tags?: string[];
    skillData?: { name: string; value: number }[];
    production?: string; // Added status
    industry?: string;
}

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    project: ProjectData;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onNext, onPrev, project }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, onNext, onPrev]);

    if (!mounted || !isOpen) return null;

    const clients = Array.isArray(project.client) ? project.client.join(', ') : project.client;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-5xl transform overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">

                {/* Navigation Buttons (Absolute) */}
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-primary hover:text-black transition-colors backdrop-blur-md"
                    aria-label="Previous Project"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-primary hover:text-black transition-colors backdrop-blur-md"
                    aria-label="Next Project"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-neutral-400 hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>

                {/* Image Section (Left / Top) */}
                <div className="relative h-64 w-full md:h-auto md:w-1/2 bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-800">
                    {project.heroImage ? (
                        <img
                            src={project.heroImage}
                            alt={project.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-700 font-mono">
                            NO IMAGE DATA
                        </div>
                    )}

                    {/* Overlay Title for Mobile */}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 md:hidden">
                        <h2 className="text-xl font-bold text-white">{project.title}</h2>
                    </div>
                </div>

                {/* Content Section (Right / Bottom) */}
                <div className="flex flex-col w-full md:w-1/2 overflow-y-auto">
                    {/* Header */}
                    <div className="border-b border-neutral-800 bg-neutral-900/50 p-6 hidden md:block">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs text-primary">ID: {project.id?.toUpperCase() || 'UNK'}</span>
                            <span className={`font-mono text-xs px-2 py-0.5 rounded-full border ${project.production === 'Mass Production' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                    project.production === 'Prototyping' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' :
                                        'border-neutral-700 text-neutral-400'
                                }`}>
                                {project.production || 'Concept'}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{project.title}</h2>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-px bg-neutral-800 border-b border-neutral-800">
                        <div className="bg-neutral-950 p-4">
                            <span className="block font-mono text-xs text-neutral-500 uppercase mb-1">Employer</span>
                            <span className="block text-sm text-neutral-300 font-medium">{project.employer || '—'}</span>
                        </div>
                        <div className="bg-neutral-950 p-4">
                            <span className="block font-mono text-xs text-neutral-500 uppercase mb-1">Client</span>
                            <span className="block text-sm text-neutral-300 font-medium">{clients || '—'}</span>
                        </div>
                        <div className="bg-neutral-950 p-4">
                            <span className="block font-mono text-xs text-neutral-500 uppercase mb-1">Year</span>
                            <span className="block text-sm text-neutral-300 font-medium">{project.date ? new Date(project.date).getFullYear() : '—'}</span>
                        </div>
                        <div className="bg-neutral-950 p-4">
                            <span className="block font-mono text-xs text-neutral-500 uppercase mb-1">Sector</span>
                            <span className="block text-sm text-neutral-300 font-medium">{project.industry || '—'}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-6 flex-grow">
                        <h3 className="font-mono text-xs text-neutral-500 uppercase mb-3">Description</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            {project.description || "No description available."}
                        </p>

                        {project.tags && project.tags.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-mono text-xs text-neutral-500 uppercase mb-3">Toolchain</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 font-mono">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Action */}
                    <div className="p-6 border-t border-neutral-800 bg-neutral-900/30 mt-auto">
                        <a
                            href={`/projects/${project.id || ''}/`}
                            className="flex items-center justify-center w-full gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-black hover:bg-primary-400 transition-colors"
                        >
                            <span>View Full Case Study</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectModal;
