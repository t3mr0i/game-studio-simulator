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
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter Game Name"
                className="input input-bordered"
            />
            <select
                value={genreId}
                onChange={(e) => setGenreId(parseInt(e.target.value))}
                className="select select-bordered"
            >
                {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
            <button type="submit" className="btn btn-primary">
                Create Game ($100)
            </button>
        </form>
    );
}

export default NewGameForm;