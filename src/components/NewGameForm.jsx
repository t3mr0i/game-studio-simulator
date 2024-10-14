// src/components/NewGameForm.jsx
import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { genres } from '../data/genres';

function NewGameForm() {
    const [gameName, setGameName] = useState('');
    const [genreId, setGenreId] = useState(1);
    const { createGame, funds } = useContext(GameContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (gameName.trim() && funds >= 100) {
            createGame(gameName, genreId);
            setGameName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-12">
            <h2 className="text-xl font-bold text-kb-white">Create New Game</h2>
            <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter Game Name"
                className="w-full px-3 py-2 bg-kb-white text-kb-black rounded border border-kb-grey focus:outline-none focus:ring-2 focus:ring-kb-live-red"
            />
            <select
                value={genreId}
                onChange={(e) => setGenreId(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-kb-white text-kb-black rounded border border-kb-grey focus:outline-none focus:ring-2 focus:ring-kb-live-red"
            >
                {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
            <button 
                type="submit" 
                className="w-full bg-kb-live-red text-kb-black  rounded hover:bg-opacity-90 transition-colors mr-1"
                disabled={funds < 100}
            >
                Create Game ($100)
            </button>
        </form>
    );
}

export default NewGameForm;
