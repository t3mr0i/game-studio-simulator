// src/components/GameList.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function GameList() {
    const { games, developGame, shipGame } = useContext(GameContext);

    const renderProgressBar = (points) => {
        const percentage = Math.min((points / 1000) * 100, 100);
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
                    {!game.shipped ? (
                        <>
                            <p>Progress: {game.points} / 1000</p>
                            {renderProgressBar(game.points)}
                            <button onClick={() => developGame(game.id)}>Focus Development</button>
                            {game.points >= 1000 && (
                                <button onClick={() => shipGame(game.id)}>Ship Game</button>
                            )}
                        </>
                    ) : (
                        <>
                            <p>Status: Shipped</p>
                            <p>Rating: {game.rating.toFixed(1)}</p>
                            <p>Revenue: ${game.revenue}</p>
                            <p>Popularity: {game.popularity}</p>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default GameList;