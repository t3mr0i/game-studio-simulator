// src/components/GameList.jsx
import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function GameList({ games }) {
    const { developGame, releaseGame, clickPower } = useContext(GameContext);
    const [salesData, setSalesData] = useState({});
    const [gamePrices, setGamePrices] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            games.forEach(game => {
                if (game.isReleased && game.salesDuration > 0) {
                    setSalesData(prevData => ({
                        ...prevData,
                        [game.id]: [
                            ...(prevData[game.id] || []),
                            { x: 30 - game.salesDuration, y: game.soldUnits }
                        ]
                    }));
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [games]);

    const getStageColor = (stage) => {
        switch(stage) {
            case 'concept': return 'bg-kb-light-grey';
            case 'pre-production': return 'bg-kb-grey';
            case 'production': return 'bg-kb-dark-grey';
            case 'testing': return 'bg-kb-live-red';
            default: return 'bg-kb-grey';
        }
    };

    const getMetacriticColor = (score) => {
        if (score >= 75) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const handlePriceChange = (gameId, price) => {
        setGamePrices(prevPrices => ({
            ...prevPrices,
            [gameId]: price
        }));
    };

    const handleReleaseGame = (gameId) => {
        const price = gamePrices[gameId] || 29.99; // Default price if not set
        releaseGame(gameId, price);
    };

    return (
        <div className="space-y-8">
            {games.map((game) => (
                <div key={game.id} className="bg-kb-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-2xl font-bold text-kb-black mb-4">{game.name}</h3>
                    <p className="text-kb-grey mb-2">Genre: {game.genre}</p>
                    <p className="text-kb-grey mb-4">Points: {game.points.toFixed(0)}</p>
                    {!game.isReleased ? (
                        <>
                            <div className={`text-center p-3 mb-4 ${getStageColor(game.stage)} text-kb-white rounded-lg font-bold`}>
                                {game.stage}
                            </div>
                            <div className="bg-kb-light-grey rounded-full h-6 overflow-hidden mb-4">
                                <div 
                                    className="bg-kb-live-red h-full transition-all duration-300 ease-out" 
                                    style={{ width: `${Math.min((game.points / 1000) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <button
                                className="w-full bg-kb-live-red text-kb-black px-6 py-3 rounded-lg font-bold text-lg mb-4 hover:bg-opacity-90 transition-colors"
                                onClick={() => developGame(game.id)}
                            >
                                Develop (+{clickPower})
                            </button>
                            {game.points >= 1000 && game.stage === 'testing' && (
                                <>
                                    <input
                                        type="number"
                                        value={gamePrices[game.id] || ''}
                                        onChange={(e) => handlePriceChange(game.id, e.target.value)}
                                        placeholder="Set game price"
                                        className="w-full px-3 py-2 mb-2 border border-kb-grey rounded"
                                    />
                                    <button
                                        className="w-full bg-green-500 text-kb-white px-6 py-4 rounded-lg font-bold text-xl hover:bg-green-600 transition-colors transform hover:scale-105"
                                        onClick={() => handleReleaseGame(game.id)}
                                    >
                                        Release Game
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-kb-grey mb-2">Rating: {game.rating.toFixed(1)}</p>
                            <p className="text-kb-grey mb-2">Revenue: ${game.revenue.toFixed(2)}</p>
                            <p className="text-kb-grey mb-2">Price: ${game.price}</p>
                            <p className="text-kb-grey mb-2">Sales Duration: {game.salesDuration} days</p>
                            <p className={`font-bold ${getMetacriticColor(game.metacriticScore)} mb-2`}>
                                Metacritic Score: {game.metacriticScore}
                            </p>
                            <p className="text-kb-grey mb-4">Units Sold: {game.soldUnits.toLocaleString()}</p>
                            {salesData[game.id] && (
                                <div className="h-60">
                                    <Line
                                        data={{
                                            datasets: [{
                                                label: 'Units Sold',
                                                data: salesData[game.id],
                                                borderColor: '#FF4600',
                                                tension: 0.1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                x: {
                                                    type: 'linear',
                                                    position: 'bottom',
                                                    title: {
                                                        display: true,
                                                        text: 'Days Since Release'
                                                    }
                                                },
                                                y: {
                                                    title: {
                                                        display: true,
                                                        text: 'Units Sold'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default GameList;
