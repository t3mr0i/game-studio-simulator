import React, { useContext, useEffect, useRef, useState } from 'react';
import { GameContext } from '../context/GameContext';

const NewsTicker = () => {
    const { gameState } = useContext(GameContext);
    const [currentNews, setCurrentNews] = useState(null);
    const [tickerPosition, setTickerPosition] = useState(0);
    const tickerRef = useRef(null);

    useEffect(() => {
        if (gameState?.newsItems && gameState.newsItems.length > 0 && !currentNews) {
            setCurrentNews(gameState.newsItems[0]);
        }
    }, [gameState?.newsItems, currentNews]);

    useEffect(() => {
        if (!currentNews || !tickerRef.current) return;

        const tickerWidth = tickerRef.current.offsetWidth;
        const contentWidth = tickerRef.current.scrollWidth;

        let startTime;
        const duration = 10000; // 10 seconds to scroll through

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;

            if (progress < 1) {
                setTickerPosition(-progress * (contentWidth - tickerWidth));
                requestAnimationFrame(animate);
            } else {
                // Move to next news item
                setCurrentNews(gameState.newsItems[gameState.newsItems.indexOf(currentNews) + 1] || gameState.newsItems[0]);
                setTickerPosition(0);
            }
        };

        const animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [currentNews, gameState?.newsItems]);

    if (!currentNews) return null;

    return (
        <div className="bg-gray-800 text-white p-2 overflow-hidden">
            <div
                ref={tickerRef}
                className="whitespace-nowrap"
                style={{ transform: `translateX(${tickerPosition}px)` }}
            >
                {currentNews.text}
            </div>
        </div>
    );
};

export default NewsTicker;
