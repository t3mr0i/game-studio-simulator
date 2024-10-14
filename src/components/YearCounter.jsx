import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameContext';

const gameHistory = [
    "1972 - Pong released, causes arcades to become the coolest hangouts for 25 cents at a time.",
    "1980 - Pac-Man fever sweeps the globe; ghosts Inky, Blinky, Pinky, and Clyde become household names.",
    // ... (include all the history items here)
    "2024 - Hollow Knight: Silksong anticipation grows as fans await the sequel to one of the best Metroidvania games ever made.",
    "2024 - Roblox surpasses 300 million active users, cementing its place as the most popular game-building platform among kids and creators.",
    "2024 - Elden Ring's DLC 'Shadow of the Erdtree' promises more punishingly difficult bosses, prompting players to stock up on health potions."
];

function YearCounter() {
    const { gameTime } = useContext(GameContext);
    const [currentYear, setCurrentYear] = useState(1972);
    const [currentEvent, setCurrentEvent] = useState(gameHistory[0]);

    useEffect(() => {
        const year = Math.floor(gameTime / 60) + 1972; // Assuming each minute is a year
        setCurrentYear(year);
        const eventIndex = Math.min(year - 1972, gameHistory.length - 1);
        setCurrentEvent(gameHistory[eventIndex]);
    }, [gameTime]);

    return (
        <div className="year-counter">
            <h2>Current Year: {currentYear}</h2>
            <p>{currentEvent}</p>
        </div>
    );
}

export default YearCounter;
