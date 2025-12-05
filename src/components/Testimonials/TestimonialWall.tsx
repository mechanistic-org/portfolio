import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import TestimonialCard from './TestimonialCard';
import testimonials from '../../data/testimonials.json';

const TestimonialWall: React.FC = () => {
    const [emblaRef] = useEmblaCarousel(
        { loop: true, dragFree: true },
        [AutoScroll({ playOnInit: true, speed: 0.8, stopOnInteraction: false })]
    );

    return (
        <div className="w-full overflow-hidden py-12 border-y border-neutral-800 bg-neutral-950/50" ref={emblaRef}>
            <div className="flex touch-pan-y gap-6 pl-6">
                {testimonials.map((t) => (
                    <div key={t.id} className="flex-[0_0_auto]">
                        <TestimonialCard {...t} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialWall;
