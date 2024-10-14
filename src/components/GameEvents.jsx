import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameContext';

function GameEvents() {
    const { games, setGames, funds, setFunds } = useContext(GameContext);
    const [currentEvent, setCurrentEvent] = useState(null);

    const events = [
        {
            title: 'Viral Marketing',
            description: 'A meme about your game has gone viral! Boost popularity or cash in?',
            choices: [
                { text: 'Boost Popularity', effect: (game) => ({ ...game, popularity: game.popularity + 20 }) },
                { text: 'Cash In', effect: () => setFunds(funds + 1000) },
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
        // Add more events as needed
    ];

    useEffect(() => {
        const eventInterval = setInterval(() => {
            if (!currentEvent && Math.random() < 0.1) { // 10% chance of event every interval
                setCurrentEvent(events[Math.floor(Math.random() * events.length)]);
            }
        }, 60000); // Check for events every minute

        return () => clearInterval(eventInterval);
    }, [currentEvent]);

    const handleChoice = (choice) => {
        const affectedGame = games[Math.floor(Math.random() * games.length)];
        setGames(games.map(game => 
            game.id === affectedGame.id ? choice.effect(game) : game
        ));
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