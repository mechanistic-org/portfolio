import React from 'react';
import { IconCode, IconCpu, IconBuildingArch, IconBug, IconPalette, IconHistory, IconRobot, IconQuote, IconFlame, IconBriefcase, IconSunglasses, IconDatabase } from '@tabler/icons-react';

const iconMap: Record<string, any> = {
    linter: IconCode,
    kernel: IconCpu,
    architect: IconBuildingArch,
    debugger: IconBug,
    designer: IconPalette,
    historian: IconHistory,
    agent: IconRobot,
    hater: IconFlame,
    recruiter: IconBriefcase,
    cool: IconSunglasses,
    datagod: IconDatabase,
};

interface TestimonialCardProps {
    author: string;
    role: string;
    avatar: string;
    text: string;
    tags: string[];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ author, role, avatar, text, tags }) => {
    const Icon = iconMap[avatar] || IconQuote;

    return (
        <div className="flex flex-col justify-between p-6 w-[400px] h-[220px] bg-neutral-950 border border-neutral-800 hover:border-primary/50 transition-colors group relative overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative z-10">
                <Icon className="w-8 h-8 text-neutral-600 group-hover:text-primary mb-4 transition-colors" stroke={1.5} />
                <p className="text-neutral-300 font-mono text-sm leading-relaxed mb-4 line-clamp-3">
                    "{text}"
                </p>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-neutral-800 pt-4 mt-auto">
                <div>
                    <h4 className="text-neutral-200 font-bold text-sm uppercase tracking-wider">{author}</h4>
                    <span className="text-neutral-500 text-xs font-mono">{role}</span>
                </div>
                <div className="flex gap-2">
                    {tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider text-neutral-600 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
