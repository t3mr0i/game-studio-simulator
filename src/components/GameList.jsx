// src/components/GameList.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function GameList() {
    const { games, developGame, releaseGame, clickPower } = useContext(GameContext);

    const getStageColor = (stage) => {
        switch(stage) {
            case 'concept': return 'bg-yellow-500';
            case 'pre-production': return 'bg-blue-500';
            case 'production': return 'bg-green-500';
            case 'testing': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
                <div key={game.id} className="bg-game-base-300 p-4 rounded-lg">
                    <h3 className="text-xl font-bold">{game.name}</h3>
                    <p>Genre: {game.genre}</p>
                    <p>Points: {game.points.toFixed(0)}</p>
                    {!game.isReleased ? (
                        <>
                            <div className={`text-center p-2 mb-2 ${getStageColor(game.stage)}`}>
                                {game.stage}
                            </div>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${Math.min((game.points / 1000) * 100, 100)}%` }}></div>
                            </div>
                            <button
                                className="btn btn-primary mt-2 w-full"
                                onClick={() => developGame(game.id)}
                            >
                                Develop (+{clickPower})
                            </button>
                            {game.points >= 1000 && game.stage === 'testing' && (
                                <button
                                    className="btn btn-secondary mt-2 w-full"
                                    onClick={() => releaseGame(game.id)}
                                >
                                    Release Game
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <p>Rating: {game.rating.toFixed(1)}</p>
                            <p>Revenue: ${game.revenue.toFixed(2)}</p>
                            <p>Sales Duration: {game.salesDuration} days</p>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default GameList;
