// src/components/NewGameForm.jsx
import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';

function NewGameForm() {
    const [gameName, setGameName] = useState('');
    const [genre, setGenre] = useState('action');
    const { createGame, funds } = useContext(GameContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (gameName.trim() && funds >= 100) {
            createGame(gameName, genre);
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
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="action">Action</option>
                <option value="adventure">Adventure</option>
                <option value="rpg">RPG</option>
                <option value="strategy">Strategy</option>
                <option value="simulation">Simulation</option>
            </select>
            <button type="submit">Create Game ($100)</button>
        </form>
    );
}

export default NewGameForm;
