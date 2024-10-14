import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameContext';

function NewsTicker() {
    const { newsItems } = useContext(GameContext);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [newsItems]);

    return (
        <div className="bg-kb-light-grey text-kb-black p-2 overflow-hidden">
            <p className="whitespace-nowrap animate-marquee text-sm">
                {newsItems[currentNewsIndex]}
            </p>
        </div>
    );
}

export default NewsTicker;
