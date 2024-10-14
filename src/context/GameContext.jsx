// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { genres } from '../data/genres';
import { toast } from 'react-toastify';
import { customToast } from '../utils/toast';

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
    const [completedResearch, setCompletedResearch] = useState([]);

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

    const releaseGame = useCallback((gameId, price) => {
        setGames(prevGames => prevGames.map(game => {
            if (game.id === gameId && !game.isReleased && game.points >= 1000 && game.stage === 'testing') {
                const rating = Math.min(100, Math.max(0, (game.points / 20) + (Math.random() * 20 - 10)));
                const metacriticScore = Math.floor(rating);
                return { 
                    ...game, 
                    isReleased: true, 
                    rating, 
                    salesDuration: 30,
                    metacriticScore,
                    soldUnits: 0,
                    price,
                    isActive: true,
                    salesData: []
                };
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
        customToast.success('Game saved successfully!');
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
            customToast.success('Game loaded successfully!');
        } else {
            customToast.error('No saved game found.');
        }
    }, []);

    useEffect(() => {
        const current = games.filter(game => !game.isReleased || game.salesDuration > 0);
        const historical = games.filter(game => game.isReleased && game.salesDuration <= 0);
        setActiveGames(current);
        setHistoricalGames(historical);
    }, [games]);

    const gameEvents = [
        { text: "A meme about your latest game has gone viral!", effect: () => setFunds(prev => prev + 1000) },
        { text: "Your lead developer found a productivity hack!", effect: () => setClickPower(prev => prev + 1) },
        { text: "A minor bug was discovered in your flagship game.", effect: () => setFunds(prev => prev - 500) },
        { text: "Your studio was featured in a game development magazine!", effect: () => setPrestigePoints(prev => prev + 1) },
        { text: "One of your games unexpectedly topped the charts in a foreign country!", effect: () => setFunds(prev => prev + 2000) },
        { text: "A famous streamer played your game on their channel, boosting sales!", effect: () => setFunds(prev => prev + 1500) },
        { text: "Your team won a 'Best Indie Developer' award at a gaming convention.", effect: () => setPrestigePoints(prev => prev + 2) },
        { text: "A disgruntled ex-employee leaked some of your game's source code online.", effect: () => setFunds(prev => prev - 1000) },
        { text: "Your studio's creative brainstorming session led to an innovative game mechanic!", effect: () => setResearchPoints(prev => prev + 50) },
        { text: "A power outage caused your team to lose a day of work.", effect: () => setGames(prev => prev.map(g => g.isReleased ? g : {...g, points: g.points - 10})) },
        { text: "Your marketing team's new campaign went viral on social media!", effect: () => setFunds(prev => prev + 1200) },
        { text: "A senior developer quit unexpectedly, causing a temporary setback.", effect: () => setClickPower(prev => Math.max(1, prev - 1)) },
        { text: "Your studio's charity livestream event was a huge success!", effect: () => setPrestigePoints(prev => prev + 3) },
        { text: "An industry veteran joined your team, bringing years of experience!", effect: () => setClickPower(prev => prev + 2) },
        { text: "Your game's soundtrack gained popularity and charted on music streaming platforms.", effect: () => setFunds(prev => prev + 800) },
        { text: "A competitor's game release overshadowed your recent launch.", effect: () => setFunds(prev => prev - 700) },
        { text: "Your team successfully optimized the game engine, improving performance!", effect: () => setResearchPoints(prev => prev + 30) },
        { text: "A gaming website published a glowing preview of your upcoming game.", effect: () => setPrestigePoints(prev => prev + 1) },
        { text: "Your studio's internship program discovered an exceptionally talented new developer!", effect: () => setClickPower(prev => prev + 1) },
        { text: "A hardware manufacturer wants to bundle your game with their new device!", effect: () => setFunds(prev => prev + 2500) },
        { text: "Your game's innovative user interface won a design award.", effect: () => setPrestigePoints(prev => prev + 2) },
        { text: "A critical security flaw was found in your game's multiplayer system.", effect: () => setFunds(prev => prev - 1500) },
        { text: "Your studio's game jam produced a promising prototype for a new game!", effect: () => setResearchPoints(prev => prev + 40) },
        { text: "A popular YouTuber made a video essay praising your game's narrative.", effect: () => setFunds(prev => prev + 1000) },
        { text: "Your team successfully ported one of your games to a new platform.", effect: () => setFunds(prev => prev + 1800) },
        { text: "An unexpected server outage temporarily took down your game's online features.", effect: () => setFunds(prev => prev - 800) },
        { text: "Your studio's booth at a major gaming convention was a hit with attendees!", effect: () => setPrestigePoints(prev => prev + 2) },
        { text: "A collaborative project with a well-known IP holder fell through last minute.", effect: () => setFunds(prev => prev - 2000) },
        { text: "Your game's modding community created an impressive total conversion mod!", effect: () => setResearchPoints(prev => prev + 60) },
        { text: "An anonymous donor provided funding for your next project!", effect: () => setFunds(prev => prev + 3000) },
    ];

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
                    const priceImpact = Math.max(0, 1 - (game.price / 100)); // Higher price reduces sales
                    const ratingImpact = game.rating / 100; // Higher rating increases sales
                    const timeFactor = Math.max(0, 1 - (game.salesDuration / 30)); // Sales decrease over time
                    const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2

                    const dailySales = Math.floor(1000 * priceImpact * ratingImpact * (1 - timeFactor) * randomFactor);
                    const dailyRevenue = dailySales * game.price;

                    return {
                        ...game,
                        revenue: game.revenue + dailyRevenue,
                        salesDuration: game.salesDuration - 1,
                        soldUnits: game.soldUnits + dailySales,
                        salesData: [...game.salesData, dailySales],
                        isActive: game.salesDuration > 1
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

            // Random events (now less frequent, about once every 2 minutes on average)
            if (Math.random() < 0.05) { // 0.8% chance each second
                const event = gameEvents[Math.floor(Math.random() * gameEvents.length)];
                addNewsItem({ text: event.text, time: Date.now() });
                event.effect();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [games, workers, autoClickPower, prestigePoints, addNewsItem]);

    // Generate research points based on the number of developers
    useEffect(() => {
        const interval = setInterval(() => {
            setResearchPoints(prevPoints => prevPoints + workers.length * 0.1);
        }, 1000); // Generate points every second

        return () => clearInterval(interval);
    }, [workers]);

    return (
        <GameContext.Provider value={{ 
            games, setGames, workers, funds, totalClicks, clickPower, autoClickPower, 
            gameTime, prestigePoints, newsItems, researchPoints,
            createGame, developGame, hireWorker, releaseGame, upgradeClickPower, upgradeAutoClick, 
            saveGameState, loadGameState,
            activeGames,
            historicalGames,
            completedResearch,
            setCompletedResearch,
            setFunds,
            addNewsItem,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;