import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { genres } from '../data/genres';

function GameEvents() {
    const { games, setGames, funds, setFunds } = useContext(GameContext);
    const [currentEvent, setCurrentEvent] = useState(null);

    const generalEvents = [
        {
            title: 'Viral Marketing',
            description: 'A meme about your game has gone viral! Boost popularity or cash in?',
            choices: [
                { text: 'Boost Popularity', effect: (game) => ({ ...game, popularity: game.popularity + 20 }) },
                { text: 'Cash In', effect: () => setFunds(prevFunds => prevFunds + 1000) },
            ],
        },
        {
            title: 'Bug Crisis',
            description: 'A major bug has been found in your latest game. How do you handle it?',
            choices: [
                { text: 'Quick Fix (Might not solve everything)', effect: (game) => ({ ...game, rating: game.rating - 5 }) },
                { text: 'Thorough Fix (Delays other projects)', effect: (game) => ({ ...game, rating: game.rating + 5, points: Math.max(0, game.points - 200) }) },
            ],
        },
        {
            title: 'Industry Conference',
            description: 'An industry conference is coming up. Do you want to attend?',
            choices: [
                { text: 'Attend (Cost: $500)', effect: (game) => {
                    setFunds(prevFunds => prevFunds - 500);
                    return { ...game, popularity: game.popularity + 15 };
                }},
                { text: 'Skip', effect: () => {} },
            ],
        },
    ];

    const genreSpecificEvents = genres.map(genre => ({
        title: `${genre.name} Trend`,
        description: `${genre.name} games are trending! Boost development or start a new ${genre.name} game?`,
        choices: [
            { text: 'Boost Development', effect: (game) => game.genre === genre.name ? { ...game, points: game.points + 200 } : game },
            { text: 'Start New Game', effect: () => {
                if (funds >= 100) {
                    setFunds(prevFunds => prevFunds - 100);
                    return { id: games.length, name: `Trending ${genre.name} Game`, genre: genre.name, genreId: genre.id, points: 0, shipped: false, rating: null, revenue: 0, popularity: 10, bonusMultiplier: genre.bonusMultiplier };
                }
                return null;
            }},
        ],
    }));

    const allEvents = [...generalEvents, ...genreSpecificEvents];

    useEffect(() => {
        const eventInterval = setInterval(() => {
            if (!currentEvent && Math.random() < 0.1) { // 10% chance of event every interval
                setCurrentEvent(allEvents[Math.floor(Math.random() * allEvents.length)]);
            }
        }, 60000); // Check for events every minute

        return () => clearInterval(eventInterval);
    }, [currentEvent]);

    const handleChoice = (choice) => {
        const affectedGame = games[Math.floor(Math.random() * games.length)];
        const result = choice.effect(affectedGame);
        if (result) {
            if (Array.isArray(result)) {
                setGames(prevGames => [...prevGames, ...result]);
            } else {
                setGames(prevGames => prevGames.map(game => game.id === affectedGame.id ? result : game));
            }
        }
        setCurrentEvent(null);
    };

    if (!currentEvent) return null;

    return (
        <div className="game-event">
            <h2>{currentEvent.title}</h2>
            <p>{currentEvent.description}</p>
            {currentEvent.choices.map((choice, index) => (
                <button key={index} onClick={() => handleChoice(choice)}>
                    {choice.text}
                </button>
            ))}
        </div>
    );
}

export default GameEvents;
