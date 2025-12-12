
import React, { useMemo } from 'react';
import { Chrono } from 'react-chrono';
import { parseTimelineMarkdown } from '../../utils/timelineParser';

interface UniversalTimelineProps {
    markdownContent: string;
}

export default function UniversalTimeline({ markdownContent }: UniversalTimelineProps) {
    const items = useMemo(() => parseTimelineMarkdown(markdownContent), [markdownContent]);

    return (
        <div className="w-full h-[800px] font-sans">
            <Chrono
                items={items}
                mode="HORIZONTAL"
                itemWidth={350}
                showSingle
                slideShow
                slideItemDuration={4000}
                contentDetailsHeight={200} // Force content height
                enableOutline

                theme={{
                    primary: '#2E5CFF', // Erik Norris Blue
                    secondary: 'rgba(46, 92, 255, 0.1)',
                    cardBgColor: '#1a1a1a',
                    cardForeColor: '#ffffff',
                    titleColor: '#2E5CFF',
                    titleColorActive: '#ffffff',
                }}
                fontSizes={{
                    cardSubtitle: '0.85rem',
                    cardText: '1rem',
                    cardTitle: '1.2rem',
                    title: '1rem',
                }}
                classNames={{
                    card: 'rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm',
                    cardMedia: 'rounded-t-xl',
                    cardSubTitle: 'text-primary-300 font-mono tracking-wide',
                    cardText: 'text-neutral-300 leading-relaxed whitespace-pre-line',
                    cardTitle: 'text-white font-bold tracking-tight',
                    controls: 'bg-neutral-900 border border-white/10',
                    title: 'text-primary-400 font-mono font-bold',
                }}
                buttonTexts={{
                    first: 'Start',
                    last: 'Latest',
                    next: 'Next',
                    previous: 'Prev',
                }}
            >
                <div className="chrono-icons">
                    {/* Custom icons can be mapped here if we add an icon field to the parser */}
                    {items.map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-primary-500 rounded-full" />
                    ))}
                </div>
            </Chrono>
        </div>
    );
}
