import React from 'react';
import ScrambleText from '../Effects/ScrambleText';

const RestartButton: React.FC = () => {
    const handleClick = () => {
        window.dispatchEvent(new CustomEvent('system:boot'));
    };

    return (
        <button
            onClick={handleClick}
            className="hover:text-primary cursor-pointer transition-colors uppercase flex items-center gap-2"
            aria-label="Restart System"
        >
            [ <ScrambleText text="RESTART" className="cursor-pointer" /> ]
        </button>
    );
};

export default RestartButton;
