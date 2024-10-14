// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { genres } from '../data/genres';
import { saveGame, loadGame } from '../utils/saveLoad';
import { toast } from 'react-toastify';

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [funds, setFunds] = useState(0);
    const [totalClicks, setTotalClicks] = useState(0);
    const [clickPower, setClickPower] = useState(1);
    const [autoClickPower, setAutoClickPower] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [prestigePoints, setPrestigePoints] = useState(0);
    const [newsItems, setNewsItems] = useState([]);

    const createGame = useCallback((gameName, genreId) => {
        const genre = genres.find(g => g.id === genreId);
        const newGame = {
            id: games.length,
            name: gameName,
            genre: genre.name,
            genreId: genre.id,
            points: 0,
            revenue: 0,
            popularity: 0,
            bonusMultiplier: genre.bonusMultiplier,
        };
        setGames([...games, newGame]);
        addNewsItem(`New game "${gameName}" development started!`);
    }, [games]);

    const clickGame = useCallback((gameId) => {
        setGames(games.map(game => {
            if (game.id === gameId) {
                const newPoints = game.points + clickPower * (1 + prestigePoints / 100);
                return { ...game, points: newPoints };
            }
            return game;
        }));
        setTotalClicks(clicks => clicks + 1);
        setFunds(funds => funds + clickPower * (1 + prestigePoints / 100));
    }, [games, clickPower, prestigePoints]);

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
        saveGame(gameState);
        toast.success('Game saved successfully!');
    }, [games, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, newsItems]);

    const loadGameState = useCallback(() => {
        const loadedState = loadGame();
        if (loadedState) {
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
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGameTime(time => time + 1);
            
            // Auto-click for all games
            setGames(games.map(game => ({
                ...game,
                points: game.points + autoClickPower * (1 + prestigePoints / 100)
            })));
            setFunds(funds => funds + autoClickPower * (1 + prestigePoints / 100));

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
    }, [games, autoClickPower, prestigePoints, addNewsItem]);

    return (
        <GameContext.Provider value={{ 
            games, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, newsItems,
            createGame, clickGame, upgradeClickPower, upgradeAutoClick, prestige,
            saveGameState, loadGameState,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
