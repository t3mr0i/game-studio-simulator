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
        } else if (funds < 100) {
            alert('Not enough funds to create a new game. You need $100.');
        } else {
            alert('Please enter a game name.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="new-game-form">
            <h2>Create New Game</h2>
            <input 
                type="text" 
                value={gameName} 
                onChange={(e) => setGameName(e.target.value)} 
                placeholder="Enter Game Name" 
            />
            <select value={genreId} onChange={(e) => setGenreId(parseInt(e.target.value))}>
                {genres.map(genre => (
                    <option key={genre.id} value={genre.id} title={genre.description}>
                        {genre.name}
                    </option>
                ))}
            </select>
            <button type="submit">Create Game ($100)</button>
        </form>
    );
}

export default NewGameForm;