import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

export interface MarqueeItem {
    id: string;
    text: string;
    image?: string | null;
    link?: string;
    variant?: 'logo-only' | 'icon-text';
}

interface MarqueeProps {
    items: MarqueeItem[];
    direction?: 'forward' | 'backward';
    speed?: number;
    pauseOnHover?: boolean;
    grayscale?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({
    items,
    direction = 'forward',
    speed = 1,
    pauseOnHover = false,
    grayscale = true
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, dragFree: true },
        [
            AutoScroll({
                playOnInit: true,
                direction: direction,
                speed: speed,
                stopOnInteraction: true,
                stopOnMouseEnter: pauseOnHover,
            })
        ]
    );

    // Accessibility: Pause on reduced motion
    useEffect(() => {
        if (!emblaApi) return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = () => {
            const autoScroll = emblaApi.plugins().autoScroll;
            if (!autoScroll) return;

            if (mediaQuery.matches) {
                autoScroll.stop();
            } else {
                autoScroll.play();
            }
        };

        // Initial check
        handleMotionChange();

        // Listen for changes
        mediaQuery.addEventListener('change', handleMotionChange);
        return () => mediaQuery.removeEventListener('change', handleMotionChange);
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const onSettle = () => {
            const autoScroll = emblaApi.plugins().autoScroll;
            if (autoScroll && !autoScroll.isPlaying()) {
                autoScroll.play();
            }
        };

        emblaApi.on('settle', onSettle);

        return () => {
            emblaApi.off('settle', onSettle);
        };
    }, [emblaApi]);

    return (
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex flex-row touch-pan-y" style={{ display: 'flex', flexDirection: 'row', whiteSpace: 'nowrap' }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex-none w-auto pl-12"
                        style={{ flex: '0 0 auto', display: 'inline-flex' }}
                    >
                        <a
                            href={item.link}
                            target={item.link?.startsWith('http') ? '_blank' : undefined}
                            rel={item.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            draggable={false}
                            className={`flex items-center gap-4 transition-all ${grayscale ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : ''} ${!item.link ? 'pointer-events-none' : ''}`}
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.text}
                                    draggable={false}
                                    className="h-8 w-auto object-contain max-w-[150px]"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        // If image fails, we rely on the text span.
                                    }}
                                />
                            )}
                            {/* Show text if variant is icon-text OR if it's logo-only (default) but no image exists */}
                            {(item.variant === 'icon-text' || (!item.image && item.variant !== 'icon-text')) && (
                                <span className="text-xl font-bold tracking-widest text-base-500 dark:text-base-400 uppercase whitespace-nowrap">
                                    {item.text}
                                </span>
                            )}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marquee;
