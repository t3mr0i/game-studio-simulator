// src/components/NewGameForm.jsx
import React, { useState, useContext, useCallback } from 'react';
import { GameContext } from '../context/GameContext';
import { genres } from '../data/genres';

// Lists for generating random game names
const adjectives = ['Epic', 'Mystic', 'Cosmic', 'Legendary', 'Infinite', 'Quantum', 'Neon', 'Cyber', 'Retro', 'Hyper'];
const nouns = ['Quest', 'Saga', 'Realm', 'Legacy', 'Chronicles', 'Odyssey', 'Empire', 'Frontier', 'Legends', 'Dimension'];
const suffixes = ['Reborn', 'Unleashed', 'Evolution', 'Revolution', 'Ascension', 'Redemption', 'Resurgence', 'Awakening', 'Dominion', 'Eternity'];

function NewGameForm() {
    const { createGame, funds } = useContext(GameContext);
    const [gameName, setGameName] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');

    const generateRandomName = useCallback(() => {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${randomAdjective} ${randomNoun}: ${randomSuffix}`;
    }, []);

    const selectRandomGenre = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * genres.length);
        return genres[randomIndex].id;
    }, []);

    const handleCreateGame = useCallback(() => {
        const newGameName = gameName || generateRandomName();
        const newGenre = selectedGenre || selectRandomGenre();
        createGame(newGameName, newGenre);
        setGameName('');
        setSelectedGenre('');
    }, [gameName, selectedGenre, createGame, generateRandomName, selectRandomGenre]);

    // Generate a random name and genre when the component mounts
    React.useEffect(() => {
        setGameName(generateRandomName());
        setSelectedGenre(selectRandomGenre());
    }, [generateRandomName, selectRandomGenre]);

    return (
        <div className="bg-kb-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-kb-black">Create New Game</h2>
            <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter game name"
                className="w-full px-3 py-2 mb-2 border border-kb-grey rounded"
            />
            <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 mb-2 border border-kb-grey rounded"
            >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
            <button
                onClick={handleCreateGame}
                disabled={funds < 100}
                className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded font-bold hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed"
            >
                Create New Game (Cost: $100)
            </button>
        </div>
    );
}

export default NewGameForm;
