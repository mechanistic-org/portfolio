import React, { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

interface MarqueeProps {
    children: React.ReactNode;
    direction?: 'forward' | 'backward';
    speed?: number;
    pauseOnHover?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({
    children,
    direction = 'forward',
    speed = 1,
    pauseOnHover = false
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, dragFree: true },
        [
            AutoScroll({
                playOnInit: true,
                direction: direction,
                speed: speed,
                stopOnInteraction: true, // Enable native physics
                stopOnMouseEnter: pauseOnHover,
            })
        ]
    );

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
            <div className="flex touch-pan-y">
                {children}
            </div>
        </div>
    );
};

export default Marquee;
