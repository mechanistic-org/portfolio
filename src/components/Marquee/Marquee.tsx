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
                {items.map((item, index) => (
                    <MarqueeCard key={`${item.id}-${index}`} item={item} grayscale={grayscale} />
                ))}
            </div>
        </div>
    );
};

const MarqueeCard = ({ item, grayscale }: { item: MarqueeItem; grayscale: boolean }) => {
    const [imgError, setImgError] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);

    // If no image, or if image failed, show text.
    // If 'icon-text' variant, always show text.
    const showText = item.variant === 'icon-text' || !item.image || imgError;

    return (
        <div
            className="flex-none w-auto pl-12"
            style={{ flex: '0 0 auto', display: 'inline-flex' }}
        >
            <a
                href={item.link}
                target={item.link?.startsWith('http') ? '_blank' : undefined}
                rel={item.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                draggable={false}
                className={`flex items-center gap-4 transition-all opacity-80 hover:opacity-100 ${grayscale ? 'grayscale hover:grayscale-0' : ''} ${!item.link ? 'pointer-events-none' : ''}`}
            >
                {item.image && !imgError && (
                    <img
                        src={item.image}
                        alt={item.text}
                        draggable={false}
                        // Added rounded-md for aesthetic fix
                        className={`h-8 w-auto object-contain max-w-[150px] rounded-md transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setImgError(true)}
                    />
                )}

                {showText && (
                    <span className="font-mono text-sm font-bold tracking-widest text-neutral-400 hover:text-white uppercase whitespace-nowrap">
                        {item.text}
                    </span>
                )}
            </a>
        </div>
    );
};

export default Marquee;
