// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [funds, setFunds] = useState(1000);
    const [revenue, setRevenue] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [studioLevel, setStudioLevel] = useState(1);

    const createGame = useCallback((gameName, genre) => {
        const newGame = {
            id: games.length,
            name: gameName,
            genre: genre,
            points: 0,
            shipped: false,
            rating: null,
            revenue: 0,
            popularity: 0,
        };
        setGames([...games, newGame]);
        setFunds(funds - 100); // Cost to start a new game
    }, [games, funds]);

    const hireDeveloper = useCallback((type) => {
        const costs = { junior: 100, senior: 250, expert: 500 };
        const productivity = { junior: 1, senior: 2.5, expert: 5 };
        if (funds >= costs[type]) {
            setDevelopers([...developers, { id: developers.length, type, productivity: productivity[type] }]);
            setFunds(funds - costs[type]);
        } else {
            alert("Not enough funds to hire a developer");
        }
    }, [developers, funds]);

    const developGame = useCallback((gameId) => {
        setGames(games.map(game => {
            if (game.id === gameId && !game.shipped) {
                const progress = developers.reduce((acc, dev) => acc + dev.productivity, 0) * studioLevel;
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
        const cost = studioLevel * 1000;
        if (funds >= cost) {
            setStudioLevel(studioLevel + 1);
            setFunds(funds - cost);
        } else {
            alert("Not enough funds to upgrade studio");
        }
    }, [studioLevel, funds]);

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
                    const gameRevenue = Math.floor(game.rating * (1 + game.popularity / 100));
                    newRevenue += gameRevenue;
                    return { ...game, revenue: game.revenue + gameRevenue };
                }
                return game;
            }));
            setRevenue(revenue => revenue + newRevenue);
            setFunds(funds => funds + newRevenue);

            // Deduct developer salaries
            const salaries = developers.reduce((acc, dev) => {
                const costs = { junior: 10, senior: 25, expert: 50 };
                return acc + costs[dev.type];
            }, 0);
            setFunds(funds => funds - salaries);

        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [games, developers, developGame]);

    return (
        <GameContext.Provider value={{ 
            games, developers, funds, revenue, gameTime, studioLevel,
            createGame, hireDeveloper, shipGame, upgradeStudio
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
