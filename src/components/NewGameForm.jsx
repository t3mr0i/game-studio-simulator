// src/components/NewGameForm.jsx
import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { genres } from '../data/genres';

function NewGameForm() {
    const { createGame } = useContext(GameContext);
    const [gameName, setGameName] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (gameName && selectedGenre) {
            createGame(gameName, selectedGenre);
            setGameName('');
            setSelectedGenre('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter game name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
                <option value="">Select a genre</option>
                {genres && genres.length > 0 ? (
                    genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))
                ) : (
                    <option disabled>No genres available</option>
                )}
            </select>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Create Game
            </button>
        </form>
    );
}

export default NewGameForm;
