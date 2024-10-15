// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth, database } from '../firebase';
import { ref, set, get, onValue, push, remove } from 'firebase/database';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { customToast } from '../utils/toast';
import { genres } from '../data/genres';
import { generalEvents, genreSpecificEvents } from '../components/GameEvents';

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [currentGame, setCurrentGame] = useState(null);
    const [gameState, setGameState] = useState({
        year: 2023,
        month: 1,
        money: 10000,  // Make sure this is included
        fans: 0,
        gameProgress: 0,
        researchPoints: 0,
        developers: [],
        workers: [],
        upgrades: [],
        genre: '',
        name: '',
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                loadGames(user.uid);
            } else {
                setUser(null);
                setGames([]);
                setCurrentGame(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadGames = (userId) => {
        const gamesRef = ref(database, `users/${userId}/games`);
        onValue(gamesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const gameList = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));
                setGames(gameList);
            } else {
                setGames([]);
            }
        });
    };

    const updateGameState = useCallback((updates) => {
        setGameState((prevState) => ({
            ...prevState,
            ...updates,
        }));
    }, []);

    useEffect(() => {
        const gameLoop = setInterval(() => {
            updateGameState((prevState) => ({
                month: prevState.month % 12 + 1,
                year: prevState.month === 12 ? prevState.year + 1 : prevState.year,
                money: prevState.money + calculateMoneyPerTick(prevState),
                fans: prevState.fans + calculateFansPerTick(prevState),
                gameProgress: prevState.gameProgress + calculateProgressPerTick(prevState),
                researchPoints: prevState.researchPoints + calculateResearchPerTick(prevState),
            }));
        }, 1000); // Tick every second

        return () => clearInterval(gameLoop);
    }, [updateGameState]);

    // Helper functions to calculate per-tick updates
    const calculateMoneyPerTick = (state) => {
        // Implement your logic here based on state
        return state.fans * 0.1 + state.workers.length * 10;
    };

    const calculateFansPerTick = (state) => {
        // Implement your logic here based on state
        return state.gameProgress * 0.01 + state.developers.length;
    };

    const calculateProgressPerTick = (state) => {
        // Implement your logic here based on state
        return state.developers.length * 0.5;
    };

    const calculateResearchPerTick = (state) => {
        // Implement your logic here based on state
        return state.workers.length * 0.2;
    };

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    const signOut = async () => {
        try {
            await auth.signOut();
            setUser(null);
            setGames([]);
            setCurrentGame(null);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const createGame = async (gameName, genre) => {
        if (!user) return;

        const newGame = {
            name: gameName,
            genre: genre,
            year: 2023,
            month: 1,
            money: 10000,
            fans: 0,
            gameProgress: 0,
            researchPoints: 0,
            developers: [],
            workers: [],
            upgrades: [],
        };

        try {
            const gamesRef = ref(database, `users/${user.uid}/games`);
            const newGameRef = push(gamesRef);
            await set(newGameRef, newGame);
            setCurrentGame({ id: newGameRef.key, ...newGame });
            customToast('success', 'New game created successfully!');
        } catch (error) {
            console.error("Error creating new game", error);
            customToast('error', 'Failed to create new game.');
        }
    };

    const selectGame = (gameId) => {
        const selected = games.find(game => game.id === gameId);
        if (selected) {
            setCurrentGame(selected);
            setGameState(selected);
        }
    };

    const deleteGame = async (gameId) => {
        if (!user) return;

        try {
            const gameRef = ref(database, `users/${user.uid}/games/${gameId}`);
            await remove(gameRef);
            if (currentGame && currentGame.id === gameId) {
                setCurrentGame(null);
            }
            customToast('success', 'Game deleted successfully!');
        } catch (error) {
            console.error("Error deleting game", error);
            customToast('error', 'Failed to delete game.');
        }
    };

    const saveGame = async () => {
        if (!user || !currentGame) return;

        try {
            const gameRef = ref(database, `users/${user.uid}/games/${currentGame.id}`);
            await set(gameRef, gameState);
            customToast('success', 'Game saved successfully!');
        } catch (error) {
            console.error("Error saving game", error);
            customToast('error', 'Failed to save game.');
        }
    };

    const hireDeveloper = (developer) => {
        if (gameState.money >= developer.cost) {
            updateGameState({
                developers: [...gameState.developers, developer],
                money: gameState.money - developer.cost
            });
        } else {
            customToast('error', 'Not enough money to hire developer.');
        }
    };

    const hireWorker = (worker) => {
        if (gameState.money >= worker.cost) {
            updateGameState({
                workers: [...gameState.workers, worker],
                money: gameState.money - worker.cost
            });
        } else {
            customToast('error', 'Not enough money to hire worker.');
        }
    };

    const buyUpgrade = (upgrade) => {
        if (gameState.money >= upgrade.cost) {
            updateGameState({
                upgrades: [...gameState.upgrades, upgrade],
                money: gameState.money - upgrade.cost
            });
        } else {
            customToast('error', 'Not enough money to buy upgrade.');
        }
    };

    return (
        <GameContext.Provider value={{
            user,
            games,
            currentGame,
            gameState,
            signIn,
            signOut,
            createGame,
            selectGame,
            deleteGame,
            saveGame,
            hireDeveloper,
            hireWorker,
            buyUpgrade,
            updateGameState
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
