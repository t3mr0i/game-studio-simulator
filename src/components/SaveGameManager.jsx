import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameContext';

const SaveGameManager = () => {
    const { saveGame, loadGame, deleteGame } = useContext(GameContext);
    const [savedGames, setSavedGames] = useState([]);

    useEffect(() => {
        // Load saved games from localStorage or your backend
        const loadedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
        setSavedGames(loadedGames);
    }, []);

    const handleSave = () => {
        const newSave = { id: Date.now(), date: new Date().toLocaleString() };
        saveGame(newSave);
        setSavedGames([...savedGames, newSave]);
    };

    const handleLoad = (gameId) => {
        loadGame(gameId);
    };

    const handleDelete = (gameId) => {
        deleteGame(gameId);
        setSavedGames(savedGames.filter(game => game.id !== gameId));
    };

    return (
        <div>
            <button onClick={handleSave}>Save Game</button>
            <h3>Saved Games:</h3>
            <ul>
                {savedGames.map(game => (
                    <li key={game.id}>
                        {game.date}
                        <button onClick={() => handleLoad(game.id)}>Load</button>
                        <button onClick={() => handleDelete(game.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SaveGameManager;
