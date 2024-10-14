// src/components/GameList.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function GameList() {
    const { games, developGame } = useContext(GameContext);

    return (
        <div className="game-list">
            <h2>Your Games</h2>
            {games.map((game) => (
                <div key={game.id} className="game-item">
                    <h3>{game.name}</h3>
                    <p>Genre: {game.genre}</p>
                    <p>Progress: {game.points} / 1000</p>
                    <p>Status: {game.shipped ? 'Shipped' : 'In Development'}</p>
                    {game.shipped && (
                        <>
                            <p>Rating: {game.rating.toFixed(1)}</p>
                            <p>Revenue: ${game.revenue}</p>
                        </>
                    )}
                    {!game.shipped && (
                        <button onClick={() => developGame(game.id)}>Focus Development</button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default GameList;
