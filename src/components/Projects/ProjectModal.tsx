import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ProjectData {
    title: string;
    description?: string;
    heroImage?: string;
    employer?: string;
    date?: string;
    tags?: string[];
    skillData?: { name: string; value: number }[];
}

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: ProjectData;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl border border-border bg-card p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>

                <div className="flex flex-col gap-6">
                    {project.heroImage && (
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <img
                                src={project.heroImage}
                                alt={project.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}

                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                            <span>{project.employer}</span>
                            <span>•</span>
                            <span>{project.date ? new Date(project.date).getFullYear() : ''}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
                    </div>

                    {project.description && (
                        <p className="text-muted-foreground">{project.description}</p>
                    )}

                    {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map(tag => (
                                <span key={tag} className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 flex justify-end">
                        <a
                            href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}/`} // Simple slug approximation, ideally pass real slug
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            View Full Case Study
                        </a>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectModal;
