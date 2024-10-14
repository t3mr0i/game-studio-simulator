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
        {
            title: 'Game Awards',
            description: 'Your game has been nominated for an award! What do you do?',
            choices: [
                { text: 'Attend the Ceremony (Cost: $800)', effect: (game) => {
                    setFunds(prevFunds => prevFunds - 800);
                    return { ...game, popularity: game.popularity + 25, rating: game.rating + 10 };
                }},
                { text: 'Send a Video Message', effect: (game) => ({ ...game, popularity: game.popularity + 10 }) },
            ],
        },
        {
            title: 'DLC Release',
            description: 'It’s time to release your first DLC. How do you want to approach it?',
            choices: [
                { text: 'Charge Full Price', effect: (game) => ({ ...game, funds: game.funds + 1500 }) },
                { text: 'Offer a Discount', effect: (game) => ({ ...game, funds: game.funds + 1000, popularity: game.popularity + 15 }) },
            ],
        },
        {
            title: 'Game Trailer',
            description: 'You have the chance to create a trailer for your upcoming game. What do you do?',
            choices: [
                { text: 'Go All Out (Cost: $1000)', effect: (game) => {
                    setFunds(prevFunds => prevFunds - 1000);
                    return { ...game, popularity: game.popularity + 30 };
                }},
                { text: 'DIY (Free)', effect: (game) => ({ ...game, popularity: game.popularity + 10 }) },
            ],
        },
        {
            title: 'Player Feedback',
            description: 'Players are providing feedback on your latest game. How do you respond?',
            choices: [
                { text: 'Implement Changes (Cost: $300)', effect: (game) => {
                    setFunds(prevFunds => prevFunds - 300);
                    return { ...game, rating: game.rating + 5, points: Math.max(0, game.points - 100) };
                }},
                { text: 'Thank Them and Move On', effect: (game) => ({ ...game, popularity: game.popularity + 5 }) },
            ],
        },
        {
            title: 'Game Streaming',
            description: 'A popular streamer wants to play your game. What do you do?',
            choices: [
                { text: 'Provide Early Access', effect: (game) => {
                    return { ...game, popularity: game.popularity + 40, rating: game.rating + 5 };
                }},
                { text: 'Charge for Access', effect: (game) => {
                    setFunds(prevFunds => prevFunds + 500);
                    return game;
                }},
            ],
        },
        {
            title: 'Critic Review',
            description: 'A major gaming magazine is reviewing your game. What’s your strategy?',
            choices: [
                { text: 'Prepare a Press Kit (Cost: $200)', effect: (game) => {
                    setFunds(prevFunds => prevFunds - 200);
                    return { ...game, rating: game.rating + 10, popularity: game.popularity + 5 };
                }},
                { text: 'Let the Game Speak for Itself', effect: (game) => ({ ...game, popularity: game.popularity + 10 }) },
            ],
        },
        {
            title: 'Game Update',
            description: 'You can release a patch to fix bugs and add features. How do you proceed?',
            choices: [
                { text: 'Major Update (Cost: $500)', effect: (game) => {
                    setFunds(prevFunds => prevFunds - 500);
                    return { ...game, rating: game.rating + 15, popularity: game.popularity + 20 };
                }},
                { text: 'Minor Fix (Free)', effect: (game) => ({ ...game, rating: game.rating + 5 }) },
            ],
        },
        {
            title: 'Game Jam',
            description: 'A game jam is happening! Do you want to participate?',
            choices: [
                { text: 'Participate (Cost: $200)', effect: (game) => {
                    setFunds(prevFunds => prevFunds - 200);
                    return { ...game, rating: game.rating + 10, popularity: game.popularity + 10 };
                }},
                { text: 'Skip', effect: () => {} },
            ],
        },
        
        {
            title: 'Social Media Buzz',
            description: 'Your game is trending on social media. Do you engage with the community?',
            choices: [
                { text: 'Engage Actively', effect: (game) => ({ ...game, popularity: game.popularity + 25, rating: game.rating + 5 }) },
                { text: 'Stay Silent', effect: (game) => ({ ...game, popularity: game.popularity + 10 }) },
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
