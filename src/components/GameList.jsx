// src/components/GameList.jsx
import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function GameList() {
    const { 
        releaseGame, 
        clickPower, 
        autoClickPower,
        studioName, 
        setGameImportance, 
        analyzeGamePerformance,
        gameState,
        calculateWorkerContribution,
        developGame
    } = useContext(GameContext);
    const [salesData, setSalesData] = useState({});
    const [gamePrices, setGamePrices] = useState({});
    const [analyzedGames, setAnalyzedGames] = useState({});

    const workers = gameState?.workers || [];
    const games = gameState?.games || [];

    // Filter out released games
    const activeGames = games.filter(game => !game.isReleased);

    const generateRandomStudioName = () => {
        const adjectives = ['Awesome', 'Brilliant', 'Creative', 'Dynamic', 'Eccentric'];
        const nouns = ['Games', 'Studios', 'Interactive', 'Entertainment', 'Creations'];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${randomAdjective} ${randomNoun}`;
    };

    const displayStudioName = studioName || generateRandomStudioName();

    useEffect(() => {
        const interval = setInterval(() => {
            games.forEach(game => {
                if (game.isReleased && game.salesDuration > 0) {
                    setSalesData(prevData => ({
                        ...prevData,
                        [game.id]: [
                            ...(prevData[game.id] || []),
                            { x: 30 - game.salesDuration, y: game.revenue }
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

    const handleImportanceChange = (gameId, importance) => {
        if (setGameImportance) {
            setGameImportance(gameId, importance);
        } else {
            console.error('setGameImportance is not defined');
        }
    };

    const handleAnalyzeGame = (gameId) => {
        const analysis = analyzeGamePerformance(gameId);
        setAnalyzedGames(prev => ({...prev, [gameId]: analysis}));
    };

    return (
        <div className="space-y-8">
            {activeGames.map((game) => (
                <div key={game.id || Math.random().toString(36).substr(2, 9)} className="bg-kb-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h3 className="text-2xl font-bold text-kb-black mb-4">
                        {game.name}{studioName && <span className="text-sm text-kb-grey"> by {studioName}</span>}
                    </h3>
                    <p className="text-kb-grey mb-2">Genre: {game.genre}</p>
                    <p className="text-kb-grey mb-4">Points: {game.points?.toFixed(0) ?? '0'}</p>
                    <div className={`text-center p-3 mb-4 ${getStageColor(game.stage)} text-kb-white rounded-lg font-bold`}>
                        {game.stage}
                    </div>
                    <div className="bg-kb-light-grey rounded-full h-6 overflow-hidden mb-4">
                        <div 
                            className="bg-kb-live-red h-full transition-all duration-300 ease-out" 
                            style={{ width: `${Math.min((game.points / 1000) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-kb-grey mb-2">
                        Workers: {workers.filter(w => w.assignedTo === game.id).length} 
                        (Contribution: +{calculateWorkerContribution(game.id, workers)} points/s)
                    </p>
                    <p className="text-kb-grey mb-2">
                        Auto-Click Power: +{autoClickPower} points/s
                    </p>
                    <p className="text-kb-grey mb-2">
                        Total points per second: {calculateWorkerContribution(game.id, workers) + autoClickPower}
                    </p>
                    <button
                        className="w-full bg-kb-live-red text-kb-black px-6 py-3 rounded-lg font-bold text-lg mb-4 hover:bg-opacity-90 transition-colors"
                        onClick={() => developGame(game.id)}
                    >
                        Develop (+{clickPower} points)
                    </button>
                    <div className="mb-4">
                        <label htmlFor={`importance-${game.id}`} className="block text-sm font-medium kb-live-red text-kb-grey">
                            Project Importance: {game.importance || 5}
                        </label>
                        <input
                            type="range"
                            id={`importance-${game.id}`}
                            min="1"
                            max="10"
                            value={game.importance || 5}
                            onChange={(e) => handleImportanceChange(game.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-kb-grey rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
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
                </div>
            ))}
        </div>
    );
}

export default GameList;
