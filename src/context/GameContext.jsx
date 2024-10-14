// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { genres } from '../data/genres';
import { saveGame, loadGame } from '../utils/saveLoad';
import { toast } from 'react-toastify';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDU5CvUlbiPoxSGXdzq3q6-ZaBv0pN_kSg",
  authDomain: "videodevtycoon.firebaseapp.com",
  databaseURL: "https://videodevtycoon-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "videodevtycoon",
  storageBucket: "videodevtycoon.appspot.com",
  messagingSenderId: "283130645061",
  appId: "1:283130645061:web:8ac58669a9d1a0cc39b12c",
  measurementId: "G-5BP22KR7BS"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [funds, setFunds] = useState(10000); // Starting budget
    const [totalClicks, setTotalClicks] = useState(0);
    const [clickPower, setClickPower] = useState(1);
    const [autoClickPower, setAutoClickPower] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [prestigePoints, setPrestigePoints] = useState(0);
    const [newsItems, setNewsItems] = useState([]);
    const [researchPoints, setResearchPoints] = useState(0);

    const createGame = useCallback((gameName, genreId) => {
        const genre = genres.find(g => g.id === genreId);
        const newGame = {
            id: games.length,
            name: gameName,
            genre: genre.name,
            genreId: genre.id,
            points: 0,
            stage: 'concept', // New: game development stages
            revenue: 0,
            popularity: 0,
            bonusMultiplier: genre.bonusMultiplier,
            isReleased: false,
            rating: 0,
            salesDuration: 0,
        };
        setGames([...games, newGame]);
        addNewsItem(`New game "${gameName}" development started!`);
    }, [games]);

    const developGame = useCallback((gameId) => {
        setGames(games.map(game => {
            if (game.id === gameId && !game.isReleased) {
                const newPoints = game.points + clickPower * (1 + prestigePoints / 100);
                let newStage = game.stage;
                if (newPoints >= 250 && game.stage === 'concept') newStage = 'pre-production';
                if (newPoints >= 500 && game.stage === 'pre-production') newStage = 'production';
                if (newPoints >= 750 && game.stage === 'production') newStage = 'testing';
                return { ...game, points: newPoints, stage: newStage };
            }
            return game;
        }));
        setTotalClicks(clicks => clicks + 1);
    }, [games, clickPower, prestigePoints]);

    const hireWorker = useCallback((type) => {
        const workerCosts = { junior: 1000, senior: 5000, expert: 10000 };
        const workerProductivity = { junior: 1, senior: 3, expert: 5 };
        if (funds >= workerCosts[type]) {
            setWorkers([...workers, { type, productivity: workerProductivity[type] }]);
            setFunds(funds => funds - workerCosts[type]);
            addNewsItem(`A new ${type} worker joined your team!`);
        } else {
            toast.error(`Not enough funds to hire a ${type} worker.`);
        }
    }, [workers, funds]);

    const releaseGame = useCallback((gameId) => {
        setGames(games.map(game => {
            if (game.id === gameId && !game.isReleased && game.points >= 1000 && game.stage === 'testing') {
                const rating = Math.min(100, Math.max(0, (game.points / 20) + (Math.random() * 20 - 10)));
                return { ...game, isReleased: true, rating, salesDuration: 30 };
            }
            return game;
        }));
    }, [games]);

    const upgradeClickPower = useCallback(() => {
        const cost = Math.floor(10 * Math.pow(1.1, clickPower));
        if (funds >= cost) {
            setClickPower(power => power + 1);
            setFunds(funds => funds - cost);
            addNewsItem("Your clicking efficiency has improved!");
        } else {
            toast.error(`Not enough funds to upgrade click power. You need $${cost}.`);
        }
    }, [clickPower, funds]);

    const upgradeAutoClick = useCallback(() => {
        const cost = Math.floor(50 * Math.pow(1.15, autoClickPower));
        if (funds >= cost) {
            setAutoClickPower(power => power + 1);
            setFunds(funds => funds - cost);
            addNewsItem("You've hired a new auto-clicker!");
        } else {
            toast.error(`Not enough funds to hire an auto-clicker. You need $${cost}.`);
        }
    }, [autoClickPower, funds]);

    const prestige = useCallback(() => {
        const newPrestigePoints = Math.floor(Math.sqrt(funds / 1000000));
        setPrestigePoints(points => points + newPrestigePoints);
        setGames([]);
        setFunds(0);
        setTotalClicks(0);
        setClickPower(1);
        setAutoClickPower(0);
        setGameTime(0);
        addNewsItem("You've started a new game company with your accumulated experience!");
    }, [funds]);

    const addNewsItem = useCallback((item) => {
        setNewsItems(news => [item, ...news.slice(0, 4)]);
    }, []);

    const saveGameState = useCallback(() => {
        const gameState = {
            games,
            funds,
            totalClicks,
            clickPower,
            autoClickPower,
            gameTime,
            prestigePoints,
            newsItems,
        };
        set(ref(database, 'gameState'), gameState);
        toast.success('Game saved successfully!');
    }, [games, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, newsItems]);

    const loadGameState = useCallback(() => {
        get(ref(database, 'gameState')).then((snapshot) => {
            if (snapshot.exists()) {
                const loadedState = snapshot.val();
                setGames(loadedState.games);
                setFunds(loadedState.funds);
                setTotalClicks(loadedState.totalClicks);
                setClickPower(loadedState.clickPower);
                setAutoClickPower(loadedState.autoClickPower);
                setGameTime(loadedState.gameTime);
                setPrestigePoints(loadedState.prestigePoints);
                setNewsItems(loadedState.newsItems);
                toast.success('Game loaded successfully!');
            } else {
                toast.error('No saved game found.');
            }
        }).catch((error) => {
            console.error(error);
            toast.error('Error loading game.');
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGameTime(time => time + 1);
            
            // Worker and auto-click game development
            setGames(games.map(game => {
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
            setGames(games.map(game => {
                if (game.isReleased) {
                    if (game.salesDuration > 0) {
                        const dailyRevenue = (game.rating / 10) * (1 + game.popularity / 100) * 100;
                        return {
                            ...game,
                            revenue: game.revenue + dailyRevenue,
                            salesDuration: game.salesDuration - 1
                        };
                    }
                }
                return game;
            }));

            // Update funds from game revenue
            const newRevenue = games.reduce((acc, game) => acc + (game.isReleased && game.salesDuration > 0 ? (game.rating / 10) * (1 + game.popularity / 100) * 100 : 0), 0);
            setFunds(funds => funds + newRevenue);

            // Generate research points
            setResearchPoints(points => points + workers.length * 0.1);

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

        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [games, workers, autoClickPower, prestigePoints, addNewsItem]);

    return (
        <GameContext.Provider value={{ 
            games, workers, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, newsItems, researchPoints,
            createGame, developGame, hireWorker, releaseGame, upgradeClickPower, upgradeAutoClick, prestige,
            saveGameState, loadGameState,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
