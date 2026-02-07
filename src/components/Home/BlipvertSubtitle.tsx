import  { useEffect, useState } from 'react';

const PROPAGANDA = [
    "> INNOVATION DIES AT THE INTERFACE",
    "> MECHANICAL TEAMS SPEAK CAD",
    "> DIGITAL TEAMS SPEAK REACT",
    ">> I SPEAK BOTH",
    "> SUB-PIXEL PERFECTION",
    "> COMPLIANCE IS MANDATORY",
    "> TRUST BUT VERIFY"
];

export default function BlipvertSubtitle() {
    const [text, setText] = useState(PROPAGANDA[0]);
    const [index, setIndex] = useState(0);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

    useEffect(() => {
        // Cycle every 3 seconds
        const cycleInterval = setInterval(() => {
            let nextIndex = (index + 1) % PROPAGANDA.length;
            setIndex(prev => (prev + 1) % PROPAGANDA.length);

            const target = PROPAGANDA[nextIndex];

            // Scramble Transition
            let iteration = 0;
            const scrambleInterval = setInterval(() => {
                setText(prev =>
                    target.split("").map((letter, idx) => {
                        if (idx < iteration) {
                            return target[idx];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join("")
                );

                if (iteration >= target.length) {
                    clearInterval(scrambleInterval);
                }

                iteration += 1; // Faster scramble for blipvert feel
            }, 20);

        }, 3000);

        return () => clearInterval(cycleInterval);
    }, [index]);

    return (
        <span className="font-mono text-xs md:text-sm text-primary-500 tracking-widest uppercase animate-pulse">
            {text}
        </span>
    );
}
