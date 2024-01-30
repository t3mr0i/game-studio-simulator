// src/components/NewGameForm.jsx
import React, { useState } from 'react';

function NewGameForm({ createGame }) {
    const [gameName, setGameName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (gameName.trim()) {
            createGame(gameName);
            setGameName('');
        } else {
            alert('Please enter a game name.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)} placeholder="Enter Game Name" />
            <button type="submit">Create Game</button>
        </form>
    );
}

export default NewGameForm;
