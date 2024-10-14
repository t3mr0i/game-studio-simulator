// src/components/GameList.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function GameList() {
    const { games, clickGame, clickPower, autoClickPower } = useContext(GameContext);

    const renderProgressBar = (points) => {
        const percentage = Math.min((points / 1000000) * 100, 100);
        return (
            <div className="progress-bar">
                <div className="progress" style={{ width: `${percentage}%` }}></div>
            </div>
        );
    };

    return (
        <div className="game-list">
            <h2>Your Games</h2>
            {games.map((game) => (
                <div key={game.id} className="game-item">
                    <h3>{game.name}</h3>
                    <p>Genre: {game.genre}</p>
                    <p>Points: {game.points.toFixed(0)}</p>
                    {renderProgressBar(game.points)}
                    <button onClick={() => clickGame(game.id)}>Develop Game (+{clickPower})</button>
                    <p>Auto-click power: +{autoClickPower} per second</p>
                </div>
            ))}
        </div>
    );
}

export default GameList;
