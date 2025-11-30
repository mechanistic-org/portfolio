import React, { useState, useEffect } from 'react';

interface ScrambleTextProps {
    text: string;
    className?: string;
    scrambleSpeed?: number;
    revealSpeed?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

const ScrambleText: React.FC<ScrambleTextProps> = ({
    text,
    className = "",
    scrambleSpeed = 30,
    revealSpeed = 50
}) => {
    const [displayText, setDisplayText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    // Glitch Effect
    const triggerGlitch = () => {
        setIsComplete(false);
        let counter = 0;
        const interval = setInterval(() => {
            if (counter >= text.length) {
                clearInterval(interval);
                setIsComplete(true);
                setDisplayText(text);
                return;
            }

            setDisplayText(prev => {
                return text.split("").map((char, index) => {
                    if (index < counter) {
                        return text[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join("");
            });

            counter += 1 / 2; // Faster reveal for glitch
        }, scrambleSpeed);
    };

    useEffect(() => {
        triggerGlitch();

        // Randomly glitch every 10-20 seconds
        const randomInterval = Math.random() * 10000 + 10000;
        const glitchTimer = setInterval(() => {
            if (Math.random() > 0.7) triggerGlitch(); // 30% chance to glitch
        }, randomInterval);

        return () => clearInterval(glitchTimer);
    }, [text, scrambleSpeed]);

    return (
        <span
            className={`${className} ${isComplete ? '' : 'font-mono'} cursor-default`}
            onMouseEnter={triggerGlitch}
        >
            {displayText}
        </span>
    );
};

export default ScrambleText;
