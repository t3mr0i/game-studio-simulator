// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { genres } from '../data/genres';
import { toast } from 'react-toastify';

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [funds, setFunds] = useState(10000);
    const [totalClicks, setTotalClicks] = useState(0);
    const [clickPower, setClickPower] = useState(1);
    const [autoClickPower, setAutoClickPower] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [prestigePoints, setPrestigePoints] = useState(0);
    const [newsItems, setNewsItems] = useState([]);
    const [researchPoints, setResearchPoints] = useState(0);
    const [activeGames, setActiveGames] = useState([]);
    const [historicalGames, setHistoricalGames] = useState([]);

    const createGame = useCallback((gameName, genreId) => {
        const genre = genres.find(g => g.id === genreId);
        const newGame = {
            id: games.length,
            name: gameName,
            genre: genre.name,
            genreId: genre.id,
            points: 0,
            stage: 'concept',
            revenue: 0,
            popularity: 0,
            bonusMultiplier: genre.bonusMultiplier,
            isReleased: false,
            rating: 0,
            salesDuration: 0,
        };
        setGames(prevGames => [...prevGames, newGame]);
        addNewsItem(`New game "${gameName}" development started!`);
    }, [games]);

    const developGame = useCallback((gameId, points = clickPower) => {
        setGames(prevGames => prevGames.map(game => {
            if (game.id === gameId && !game.isReleased) {
                const newPoints = game.points + points * (1 + prestigePoints / 100);
                let newStage = game.stage;
                if (newPoints >= 250 && game.stage === 'concept') newStage = 'pre-production';
                if (newPoints >= 500 && game.stage === 'pre-production') newStage = 'production';
                if (newPoints >= 750 && game.stage === 'production') newStage = 'testing';
                return { ...game, points: newPoints, stage: newStage };
            }
            return game;
        }));
        setTotalClicks(clicks => clicks + 1);
    }, [clickPower, prestigePoints]);

    const hireWorker = useCallback((type) => {
        const workerCosts = { junior: 1000, senior: 5000, expert: 10000 };
        const workerProductivity = { junior: 1, senior: 3, expert: 5 };
        if (funds >= workerCosts[type]) {
            setWorkers(prevWorkers => [...prevWorkers, { type, productivity: workerProductivity[type] }]);
            setFunds(prevFunds => prevFunds - workerCosts[type]);
            addNewsItem(`A new ${type} worker joined your team!`);
        } else {
            toast.error(`Not enough funds to hire a ${type} worker.`);
        }
    }, [funds]);

    const releaseGame = useCallback((gameId) => {
        setGames(prevGames => prevGames.map(game => {
            if (game.id === gameId && !game.isReleased && game.points >= 1000 && game.stage === 'testing') {
                const rating = Math.min(100, Math.max(0, (game.points / 20) + (Math.random() * 20 - 10)));
                return { ...game, isReleased: true, rating, salesDuration: 30 };
            }
            return game;
        }));
    }, []);

    const upgradeClickPower = useCallback(() => {
        const cost = Math.floor(100 * Math.pow(1.1, clickPower));
        if (funds >= cost) {
            setClickPower(prevPower => prevPower + 1);
            setFunds(prevFunds => prevFunds - cost);
            addNewsItem("Your clicking efficiency has improved!");
        } else {
            toast.error(`Not enough funds to upgrade click power. You need $${cost}.`);
        }
    }, [clickPower, funds]);

    const upgradeAutoClick = useCallback(() => {
        const cost = Math.floor(200 * Math.pow(1.15, autoClickPower));
        if (funds >= cost) {
            setAutoClickPower(prevPower => prevPower + 1);
            setFunds(prevFunds => prevFunds - cost);
            addNewsItem("Your auto-clicking power has increased!");
        } else {
            toast.error(`Not enough funds to upgrade auto-click power. You need $${cost}.`);
        }
    }, [autoClickPower, funds]);

    const addNewsItem = useCallback((item) => {
        setNewsItems(prevItems => [item, ...prevItems.slice(0, 9)]);
    }, []);

    const saveGameState = useCallback(() => {
        const gameState = {
            games,
            workers,
            funds,
            totalClicks,
            clickPower,
            autoClickPower,
            gameTime,
            prestigePoints,
            researchPoints,
            newsItems,
        };
        localStorage.setItem('gameDevTycoonSave', JSON.stringify(gameState));
        toast.success('Game saved successfully!');
    }, [games, workers, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, researchPoints, newsItems]);

    const loadGameState = useCallback(() => {
        const savedState = localStorage.getItem('gameDevTycoonSave');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            setGames(parsedState.games);
            setWorkers(parsedState.workers);
            setFunds(parsedState.funds);
            setTotalClicks(parsedState.totalClicks);
            setClickPower(parsedState.clickPower);
            setAutoClickPower(parsedState.autoClickPower);
            setGameTime(parsedState.gameTime);
            setPrestigePoints(parsedState.prestigePoints);
            setResearchPoints(parsedState.researchPoints);
            setNewsItems(parsedState.newsItems);
            toast.success('Game loaded successfully!');
        } else {
            toast.error('No saved game found.');
        }
    }, []);

    useEffect(() => {
        const current = games.filter(game => !game.isReleased || game.salesDuration > 0);
        const historical = games.filter(game => game.isReleased && game.salesDuration <= 0);
        setActiveGames(current);
        setHistoricalGames(historical);
    }, [games]);

    useEffect(() => {
        const interval = setInterval(() => {
            setGameTime(prevTime => prevTime + 1);
            
            // Worker and auto-click game development
            setGames(prevGames => prevGames.map(game => {
                if (!game.isReleased) {
                    const workerPoints = workers.reduce((acc, worker) => acc + worker.productivity, 0);
                    const newPoints = game.points + (workerPoints + autoClickPower) * (1 + prestigePoints / 100);
                    let newStage = game.stage;
                    if (newPoints >= 250 && game.stage === 'concept') newStage = 'pre-production';
                    if (newPoints >= 500 && game.stage === 'pre-production') newStage = 'production';
                    if (newPoints >= 750 && game.stage === 'production') newStage = 'testing';
                    return { ...game, points: newPoints, stage: newStage };
                }
                return game;
            }));

            // Handle released games
            setGames(prevGames => prevGames.map(game => {
                if (game.isReleased && game.salesDuration > 0) {
                    const dailyRevenue = (game.rating / 10) * (1 + game.popularity / 100) * 100;
                    return {
                        ...game,
                        revenue: game.revenue + dailyRevenue,
                        salesDuration: game.salesDuration - 1
                    };
                }
                return game;
            }));

            // Update funds from game revenue
            const newRevenue = games.reduce((acc, game) => 
                acc + (game.isReleased && game.salesDuration > 0 ? (game.rating / 10) * (1 + game.popularity / 100) * 100 : 0), 0);
            setFunds(prevFunds => prevFunds + newRevenue);

            // Generate research points
            setResearchPoints(prevPoints => prevPoints + workers.length * 0.1);

            // Random events
            if (Math.random() < 0.05) { // 5% chance each second
                const events = [
                    "A meme about your latest game has gone viral!",
                    "Your lead developer found a productivity hack!",
                    "A minor bug was discovered in your flagship game.",
                    "Your studio was featured in a game development magazine!",
                    "One of your games unexpectedly topped the charts in a foreign country!"
                ];
                addNewsItem(events[Math.floor(Math.random() * events.length)]);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [games, workers, autoClickPower, prestigePoints, addNewsItem]);

    return (
        <GameContext.Provider value={{ 
            games, workers, funds, totalClicks, clickPower, autoClickPower, 
            gameTime, prestigePoints, newsItems, researchPoints,
            createGame, developGame, hireWorker, releaseGame, upgradeClickPower, upgradeAutoClick, 
            saveGameState, loadGameState,
            activeGames,
            historicalGames,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
