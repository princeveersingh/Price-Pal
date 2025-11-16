import React, { useState, useEffect } from 'react';

interface FloatingAssistantProps {
    onClick: () => void;
    status: 'idle' | 'loading' | 'hasItems' | 'error';
}

const PallyIcon: React.FC = () => (
    <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-lg">
        <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: '#D2B48C', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
            </radialGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        {/* Body */}
        <path d="M 20 50 A 30 35 0 1 1 80 50 A 30 35 0 1 1 20 50 Z" fill="url(#grad1)" stroke="#5c3317" strokeWidth="2" />
        {/* Eye */}
        <circle cx="50" cy="50" r="15" fill="#f8fafc" />
        <circle cx="50" cy="50" r="8" fill="#1e293b" />
        <circle cx="52" cy="48" r="3" fill="white" opacity="0.8" />
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="10" stroke="#a3a3a3" strokeWidth="2" />
        <circle cx="50" y1="10" r="3" fill="#CD853F" filter="url(#glow)" />
    </svg>
);


const messages: Record<FloatingAssistantProps['status'], string> = {
    idle: "Hey there! Add a product above to see my magic.",
    loading: "Searching the cosmos for the best deals...",
    hasItems: "Great finds! Click me if you want to compare or find alternatives.",
    error: "Uh oh! We hit a snag. Maybe I can help?",
};

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ onClick, status }) => {
    const [showBubble, setShowBubble] = useState(false);
    const [message, setMessage] = useState(messages[status]);

    useEffect(() => {
        setMessage(messages[status]);
        const showTimer = setTimeout(() => setShowBubble(true), 500); // Delay showing bubble slightly
        const hideTimer = setTimeout(() => setShowBubble(false), 6000); // Hide after 6 seconds

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [status]);

    return (
        <div 
            className="fixed bottom-4 right-4 z-30 cursor-pointer group"
            onClick={onClick}
            aria-label="Open chat assistant"
            role="button"
            onMouseEnter={() => setShowBubble(true)}
            onMouseLeave={() => setShowBubble(false)}
        >
            {showBubble && (
                <div className="absolute bottom-full right-0 mb-2 w-56 bg-neutral-100 dark:bg-neutral-700 p-3 rounded-lg shadow-xl animate-pop-in origin-bottom-right">
                    <p className="text-sm text-neutral-800 dark:text-neutral-200">{message}</p>
                    <div className="absolute bottom-[-8px] right-6 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-neutral-100 dark:border-t-neutral-700"></div>
                </div>
            )}
            <div className="transform group-hover:scale-110 transition-transform duration-300 animate-bobble">
                <PallyIcon />
            </div>
        </div>
    );
};

export default FloatingAssistant;