// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { genres } from '../data/genres';
import { saveGame, loadGame } from '../utils/saveLoad';

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [funds, setFunds] = useState(5000);
    const [revenue, setRevenue] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [studioLevel, setStudioLevel] = useState(1);

    const INITIAL_FUNDS = 5000;
    const NEW_GAME_COST = 500;
    const DEVELOPER_COSTS = { junior: 200, senior: 500, expert: 1000 };
    const DEVELOPER_SALARIES = { junior: 20, senior: 50, expert: 100 };
    const STUDIO_UPGRADE_COST_MULTIPLIER = 2000;

    const createGame = useCallback((gameName, genreId) => {
        const genre = genres.find(g => g.id === genreId);
        const newGame = {
            id: games.length,
            name: gameName,
            genre: genre.name,
            genreId: genre.id,
            points: 0,
            shipped: false,
            rating: null,
            revenue: 0,
            popularity: 0,
            bonusMultiplier: genre.bonusMultiplier,
        };
        setGames([...games, newGame]);
        setFunds(funds - 100); // Cost to start a new game
    }, [games, funds]);

    const hireDeveloper = useCallback((type) => {
        if (funds >= DEVELOPER_COSTS[type]) {
            const productivity = { junior: 1, senior: 2.5, expert: 5 };
            setDevelopers([...developers, { id: developers.length, type, productivity: productivity[type] }]);
            setFunds(funds - DEVELOPER_COSTS[type]);
        } else {
            alert(`Not enough funds to hire a ${type} developer. You need $${DEVELOPER_COSTS[type]}.`);
        }
    }, [developers, funds]);

    const developGame = useCallback((gameId) => {
        setGames(games.map(game => {
            if (game.id === gameId && !game.shipped) {
                const genre = genres.find(g => g.id === game.genreId);
                const baseProgress = developers.reduce((acc, dev) => acc + dev.productivity, 0) * studioLevel;
                const genreBonus = Math.random() < genre.bonusChance ? genre.bonusMultiplier : 1;
                const progress = baseProgress * genreBonus;
                return { ...game, points: game.points + progress };
            }
            return game;
        }));
    }, [games, developers, studioLevel]);

    const shipGame = useCallback((gameId) => {
        setGames(games.map(game => {
            if (game.id === gameId && game.points >= 1000 && !game.shipped) {
                const rating = Math.min(100, Math.max(0, game.points / 20 + (Math.random() * 20 - 10)));
                return { ...game, shipped: true, rating };
            }
            return game;
        }));
    }, [games]);

    const upgradeStudio = useCallback(() => {
        const cost = studioLevel * STUDIO_UPGRADE_COST_MULTIPLIER;
        if (funds >= cost) {
            setStudioLevel(studioLevel + 1);
            setFunds(funds - cost);
        } else {
            alert(`Not enough funds to upgrade studio. You need $${cost}.`);
        }
    }, [studioLevel, funds]);

    const saveGameState = useCallback(() => {
        const gameState = {
            games,
            developers,
            funds,
            revenue,
            gameTime,
            studioLevel,
        };
        saveGame(gameState);
        alert('Game saved successfully!');
    }, [games, developers, funds, revenue, gameTime, studioLevel]);

    const loadGameState = useCallback(() => {
        const loadedState = loadGame();
        if (loadedState) {
            setGames(loadedState.games);
            setDevelopers(loadedState.developers);
            setFunds(loadedState.funds);
            setRevenue(loadedState.revenue);
            setGameTime(loadedState.gameTime);
            setStudioLevel(loadedState.studioLevel);
            alert('Game loaded successfully!');
        } else {
            alert('No saved game found.');
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGameTime(time => time + 1);
            
            // Develop games
            games.forEach(game => {
                if (!game.shipped) {
                    developGame(game.id);
                }
            });

            // Generate revenue from shipped games
            let newRevenue = 0;
            setGames(games.map(game => {
                if (game.shipped) {
                    const gameRevenue = Math.floor(game.rating * (1 + game.popularity / 100) * 10); // Increased revenue
                    newRevenue += gameRevenue;
                    return { ...game, revenue: game.revenue + gameRevenue };
                }
                return game;
            }));
            setRevenue(revenue => revenue + newRevenue);
            setFunds(funds => funds + newRevenue);

            // Deduct developer salaries
            const salaries = developers.reduce((acc, dev) => acc + DEVELOPER_SALARIES[dev.type], 0);
            setFunds(funds => funds - salaries);

        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [games, developers, developGame]);

    return (
        <GameContext.Provider value={{ 
            games, developers, funds, revenue, gameTime, studioLevel,
            createGame, hireDeveloper, shipGame, upgradeStudio,
            saveGameState,
            loadGameState,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;