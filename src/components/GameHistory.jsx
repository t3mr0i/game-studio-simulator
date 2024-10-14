import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function GameHistory() {
    const { historicalGames } = useContext(GameContext);

    return (
        <div className="game-history">
            <h2>Game History</h2>
            {historicalGames.map(game => (
                <div key={game.id} className="historical-game">
                    <h3>{game.name}</h3>
                    <p>Genre: {game.genre}</p>
                    <p>Rating: {game.rating.toFixed(1)}</p>
                    <p>Total Revenue: ${game.revenue.toFixed(2)}</p>
                </div>
            ))}
        </div>
    );
}

export default GameHistory;
