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

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let counter = 0;

        // Initial padding to match length
        setDisplayText(Array(text.length).fill("0").map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(""));

        const animate = () => {
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

            counter += 1 / 3; // Slow down the reveal
        };

        interval = setInterval(animate, scrambleSpeed);

        return () => clearInterval(interval);
    }, [text, scrambleSpeed]);

    return (
        <span className={`${className} ${isComplete ? '' : 'font-mono'}`}>
            {displayText}
        </span>
    );
};

export default ScrambleText;
