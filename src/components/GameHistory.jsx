import React, { useState, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { GameContext } from '../context/GameContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function GameHistory({ games }) {
    const { gameState, updateGameState } = useContext(GameContext);
    const [analysisResults, setAnalysisResults] = useState({});

    const getMetacriticColor = (score) => {
        if (score >= 75) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const analyzeGame = (gameId) => {
        const game = games.find(g => g.id === gameId);
        if (!game) return;

        const analysisCost = Math.floor(1000 * Math.pow(1.1, game.metacriticScore / 10));

        if (gameState.money >= analysisCost) {
            updateGameState(prevState => ({
                ...prevState,
                money: prevState.money - analysisCost
            }));

            const analysis = {
                totalSales: game.soldUnits,
                totalRevenue: game.revenue,
                averageDailySales: game.soldUnits / 30,
                salesTrend: Math.random() > 0.5 ? 'Increasing' : 'Decreasing',
                profitMargin: ((game.revenue - (game.soldUnits * 10)) / game.revenue) * 100
            };

            setAnalysisResults(prev => ({...prev, [gameId]: analysis}));
        } else {
            console.log('Not enough funds to analyze the game');
        }
    };

    if (!games || games.length === 0) {
        return <div className="text-kb-white">No historical games available.</div>;
    }

    return (
        <div className="space-y-8">
            {games.map((game) => (
                <div key={game.id} className="bg-kb-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-2xl font-bold text-kb-black mb-4">
                        {game.name} <span className="text-sm text-kb-grey">by {gameState.studioName}</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-kb-grey"><span className="font-semibold">Genre:</span> {game.genre}</p>
                            <p className="text-kb-grey"><span className="font-semibold">Price:</span> ${game.price}</p>
                            <p className="text-kb-grey"><span className="font-semibold">Revenue:</span> ${game.revenue.toFixed(2)}</p>
                            <p className={`font-bold ${getMetacriticColor(game.metacriticScore)}`}>
                                Metacritic Score: {game.metacriticScore}
                            </p>
                            <p className="text-kb-grey"><span className="font-semibold">Total Units Sold:</span> {game.soldUnits.toLocaleString()}</p>
                            <p className={`font-semibold ${game.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                {game.isActive ? 'Actively Selling' : 'No Longer on Shelves'}
                            </p>
                            <button 
                                onClick={() => analyzeGame(game.id)}
                                className="mt-2 bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                            >
                                Analyze Game (${Math.floor(1000 * Math.pow(1.1, game.metacriticScore / 10))})
                            </button>
                            {analysisResults[game.id] && (
                                <div className="mt-4">
                                    <h4 className="font-bold">Analysis Results:</h4>
                                    <div className="text-green-500">
                                        <h5 className="font-semibold">Pros:</h5>
                                        <ul className="list-disc list-inside">
                                            {analysisResults[game.id].pros.map((pro, index) => (
                                                <li key={index}>{pro}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="text-red-500">
                                        <h5 className="font-semibold">Cons:</h5>
                                        <ul className="list-disc list-inside">
                                            {analysisResults[game.id].cons.map((con, index) => (
                                                <li key={index}>{con}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="h-60 bg-kb-light-grey p-4 rounded-lg">
                            {game.salesData && game.salesData.length > 0 ? (
                                <Line
                                    data={{
                                        labels: game.salesData.map((_, index) => index + 1),
                                        datasets: [{
                                            label: 'Daily Sales',
                                            data: game.salesData,
                                            borderColor: '#FF4600',
                                            backgroundColor: 'rgba(255, 70, 0, 0.1)',
                                            tension: 0.1,
                                            fill: true
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            title: {
                                                display: true,
                                                text: 'Sales Over Time',
                                                color: '#131417',
                                                font: {
                                                    size: 16,
                                                    weight: 'bold'
                                                }
                                            }
                                        },
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: 'Days Since Release',
                                                    color: '#131417'
                                                },
                                                ticks: {
                                                    color: '#131417'
                                                }
                                            },
                                            y: {
                                                title: {
                                                    display: true,
                                                    text: 'Units Sold',
                                                    color: '#131417'
                                                },
                                                ticks: {
                                                    color: '#131417'
                                                }
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-kb-grey">
                                    No sales data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GameHistory;
