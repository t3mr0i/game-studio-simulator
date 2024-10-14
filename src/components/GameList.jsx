// src/components/GameList.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function GameList({ games }) {
    const { developGame, releaseGame, clickPower } = useContext(GameContext);

    const getStageColor = (stage) => {
        switch(stage) {
            case 'concept': return 'bg-kb-light-grey';
            case 'pre-production': return 'bg-kb-grey';
            case 'production': return 'bg-kb-dark-grey';
            case 'testing': return 'bg-kb-live-red';
            default: return 'bg-kb-grey';
        }
    };

    return (
        <div className="space-y-4">
            {games.map((game) => (
                <div key={game.id} className="bg-kb-white p-4 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-kb-black mb-2">{game.name}</h3>
                    <p className="text-kb-grey mb-1">Genre: {game.genre}</p>
                    <p className="text-kb-grey mb-2">Points: {game.points.toFixed(0)}</p>
                    {!game.isReleased ? (
                        <>
                            <div className={`text-center p-2 mb-2 ${getStageColor(game.stage)} text-kb-white rounded`}>
                                {game.stage}
                            </div>
                            <div className="bg-kb-light-grey rounded-full h-4 overflow-hidden mb-2">
                                <div 
                                    className="bg-kb-live-red h-full transition-all duration-300 ease-out" 
                                    style={{ width: `${Math.min((game.points / 1000) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <button
                                className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded mt-2 hover:bg-opacity-90 transition-colors"
                                onClick={() => developGame(game.id)}
                            >
                                Develop (+{clickPower})
                            </button>
                            {game.points >= 1000 && game.stage === 'testing' && (
                                <button
                                    className="w-full bg-kb-grey text-kb-white px-4 py-2 rounded mt-2 hover:bg-opacity-90 transition-colors"
                                    onClick={() => releaseGame(game.id)}
                                >
                                    Release Game
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-kb-grey mb-1">Rating: {game.rating.toFixed(1)}</p>
                            <p className="text-kb-grey mb-1">Revenue: ${game.revenue.toFixed(2)}</p>
                            <p className="text-kb-grey">Sales Duration: {game.salesDuration} days</p>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default GameList;
