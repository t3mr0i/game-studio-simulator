// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [funds, setFunds] = useState(1000); // Starting funds

    const createGame = useCallback((gameName) => {
        const newGame = {
            id: games.length,
            name: gameName,
            points: 0,
            shipped: false,
            rating: null
        };
        setGames([...games, newGame]);
    }, [games]);

    const hireDeveloper = useCallback((cost) => {
        if (funds >= cost) {
            setDevelopers([...developers, { id: developers.length, costPerMinute: cost }]);
            setFunds(funds - cost);
        } else {
            alert("Not enough funds to hire a developer");
        }
    }, [developers, funds]);

    const shipGame = useCallback((gameId) => {
        setGames(games.map(game => {
            if (game.id === gameId && game.points >= 1000) {
                return { ...game, shipped: true, rating: Math.random() * 100 };
            }
            return game;
        }));
    }, [games]);

    useEffect(() => {
        const interval = setInterval(() => {
            setGames(games.map(game => {
                if (!game.shipped) {
                    return { ...game, points: game.points + developers.length };
                }
                return game;
            }));
            setFunds(funds - developers.reduce((acc, dev) => acc + dev.costPerMinute, 0));
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [games, developers, funds]);

    return (
        <GameContext.Provider value={{ games, developers, funds, createGame, hireDeveloper, shipGame }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
