// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth, database } from '../firebase';
import { ref, set, get, onValue, push, remove, update } from 'firebase/database';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { genres } from '../data/genres';
import { generalEvents, genreSpecificEvents } from '../components/GameEvents';
import { customToast } from '../utils/toast';

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [currentGame, setCurrentGame] = useState(null);
    const [gameState, setGameState] = useState({
        year: 1972,
        month: 1,
        money: 10000,
        fans: 0,
        gameProgress: 0,
        researchPoints: 0,
        developers: [],
        workers: [],
        upgrades: [],
        genre: '',
        name: '',
        newsItems: [],
        clickPower: 1,
        autoClickPower: 0,
        games: [], // Initialize games as an empty array
    });
    const [gameTime, setGameTime] = useState(0);
    const [studioName, setStudioName] = useState("");
    const [studioReputation, setStudioReputation] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                loadGames(user.uid);
            } else {
                setUser(null);
                setGameState(prevState => ({
                    ...prevState,
                    games: []
                }));
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
                setGameState(prevState => ({
                    ...prevState,
                    games: gameList
                }));
            } else {
                setGameState(prevState => ({
                    ...prevState,
                    games: []
                }));
            }
        });

        // Load other game state data
        const gameStateRef = ref(database, `users/${userId}/gameState`);
        onValue(gameStateRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setGameState(prevState => ({
                    ...prevState,
                    ...data
                }));
            }
        });
    };

    const updateGameState = useCallback((updates) => {
        setGameState((prevState) => ({
            ...prevState,
            ...updates,
        }));
    }, []);

    const calculateWorkerContribution = useCallback((gameId, workers) => {
        const assignedWorkers = workers.filter(worker => worker.assignedTo === gameId);
        return assignedWorkers.reduce((sum, worker) => {
            switch(worker.type) {
                case 'junior': return sum + 1;
                case 'senior': return sum + 3;
                case 'expert': return sum + 5;
                case 'manager': return sum + 2;
                case 'director': return sum + 5;
                case 'executive': return sum + 10;
                case 'ceo': return sum + 20;
                case 'founder': return sum + 50;
                default: return sum;
            }
        }, 0);
    }, []);

    useEffect(() => {
        const gameLoop = setInterval(() => {
            setGameTime(prevTime => prevTime + 0.1);
            setGameState((prevState) => {
                const newMonth = prevState.month % 12 + 1;
                const newYear = newMonth === 1 ? prevState.year + 1 : prevState.year;
                
                const updatedGames = prevState.games.map(game => {
                    if (!game.isReleased) {
                        const workerContribution = calculateWorkerContribution(game.id, prevState.workers);
                        const newPoints = game.points + workerContribution + prevState.autoClickPower;
                        return {
                            ...game,
                            points: newPoints,
                            stage: getGameStage(newPoints)
                        };
                    }
                    return game;
                });

                return {
                    ...prevState,
                    month: newMonth,
                    year: newYear,
                    money: prevState.money + calculateMoneyPerTick(prevState),
                    fans: prevState.fans + calculateFansPerTick(prevState),
                    researchPoints: prevState.researchPoints + calculateResearchPerTick(prevState),
                    games: updatedGames
                };
            });
        }, 1000); // Tick every second

        return () => clearInterval(gameLoop);
    }, [calculateWorkerContribution]);

    const getGameStage = (points) => {
        if (points < 250) return 'concept';
        if (points < 500) return 'pre-production';
        if (points < 750) return 'production';
        return 'testing';
    };

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
            id: Date.now().toString(),
            name: gameName,
            genre: genre,
            year: gameState.year,
            month: gameState.month,
            points: 0,
            stage: 'concept',
            isReleased: false,
            importance: 5,
            price: 40, // Default price of 40 euros
        };

        try {
            const gamesRef = ref(database, `users/${user.uid}/games`);
            const newGameRef = push(gamesRef);
            await set(newGameRef, newGame);
            
            const updatedGame = { ...newGame, id: newGameRef.key };
            
            setGameState(prevState => ({
                ...prevState,
                games: [...prevState.games, updatedGame],
                money: prevState.money - 100 // Deduct the cost of creating a new game
            }));
            
            // Save the updated game state
            await saveGame();
            
            console.log('New game created successfully!');
        } catch (error) {
            console.error("Error creating new game", error);
            console.log('Failed to create new game.');
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
            console.log('Game deleted successfully!');
        } catch (error) {
            console.error("Error deleting game", error);
            console.log('Failed to delete game.');
        }
    };

    const saveGame = async () => {
        if (!user) return;

        try {
            const gameStateRef = ref(database, `users/${user.uid}/gameState`);
            await set(gameStateRef, {
                year: gameState.year,
                month: gameState.month,
                money: gameState.money,
                fans: gameState.fans,
                gameProgress: gameState.gameProgress,
                researchPoints: gameState.researchPoints,
                developers: gameState.developers,
                workers: gameState.workers,
                upgrades: gameState.upgrades,
                genre: gameState.genre,
                name: gameState.name,
                newsItems: gameState.newsItems,
                clickPower: gameState.clickPower,
                studioName: studioName,
                studioReputation: studioReputation,
            });

            const gamesRef = ref(database, `users/${user.uid}/games`);
            const gamesObject = gameState.games.reduce((acc, game) => {
                acc[game.id] = game;
                return acc;
            }, {});
            await set(gamesRef, gamesObject);

            console.log('Game saved successfully!');
        } catch (error) {
            console.error("Error saving game", error);
            console.log('Failed to save game.');
        }
    };

    const loadGame = async () => {
        if (!user) return;

        try {
            const gameStateRef = ref(database, `users/${user.uid}/gameState`);
            const gameStateSnapshot = await get(gameStateRef);
            
            if (gameStateSnapshot.exists()) {
                const loadedGameState = gameStateSnapshot.val();
                setGameState(prevState => ({
                    ...prevState,
                    ...loadedGameState
                }));
                setStudioName(loadedGameState.studioName || "");
                setStudioReputation(loadedGameState.studioReputation || 0);
            }

            const gamesRef = ref(database, `users/${user.uid}/games`);
            const gamesSnapshot = await get(gamesRef);

            if (gamesSnapshot.exists()) {
                const loadedGames = Object.values(gamesSnapshot.val());
                setGameState(prevState => ({
                    ...prevState,
                    games: loadedGames
                }));
            }

            console.log('Game loaded successfully!');
        } catch (error) {
            console.error("Error loading game", error);
            console.log('Failed to load game.');
        }
    };

    const saveIndividualGame = async (gameId) => {
        if (!user) return;

        try {
            const game = gameState.games.find(g => g.id === gameId);
            if (!game) {
                console.error("Game not found");
                return;
            }

            const gameRef = ref(database, `users/${user.uid}/games/${gameId}`);
            await set(gameRef, game);

            console.log(`Game ${gameId} saved successfully!`);
        } catch (error) {
            console.error(`Error saving game ${gameId}`, error);
            console.log(`Failed to save game ${gameId}.`);
        }
    };

    const updateGameProgress = (gameId, updates) => {
        setGameState(prevState => ({
            ...prevState,
            games: prevState.games.map(game => 
                game.id === gameId ? { ...game, ...updates } : game
            )
        }));
        saveIndividualGame(gameId);
    };

    const hireDeveloper = (developer) => {
        if (gameState.money >= developer.cost) {
            updateGameState({
                developers: [...gameState.developers, developer],
                money: gameState.money - developer.cost
            });
        } else {
            console.log('error', 'Not enough money to hire developer.');
        }
    };

    const hireWorker = (workerType) => {
        const workerCosts = {
            junior: 1000,
            senior: 5000,
            expert: 10000,
            manager: 20000,
            director: 50000,
            executive: 100000,
            ceo: 200000,
            founder: 500000
        };

        const cost = workerCosts[workerType];

        if (gameState.money >= cost) {
            const newWorker = { type: workerType, assignedTo: null };
            setGameState(prevState => ({
                ...prevState,
                money: prevState.money - cost,
                workers: [...prevState.workers, newWorker]
            }));
            console.log(`Hired a new ${workerType} developer`);
        } else {
            console.log('Not enough money to hire worker.');
        }
    };

    const buyUpgrade = (upgrade) => {
        if (gameState.money >= upgrade.cost) {
            updateGameState({
                upgrades: [...gameState.upgrades, upgrade],
                money: gameState.money - upgrade.cost
            });
        } else {
            console.log('error', 'Not enough money to buy upgrade.');
        }
    };

    const upgradeClickPower = () => {
        const cost = Math.floor(100 * Math.pow(1.5, gameState.clickPower));
        if (gameState.money >= cost) {
            setGameState(prevState => ({
                ...prevState,
                clickPower: prevState.clickPower + 1,
                money: prevState.money - cost
            }));
        } else {
            console.log('Not enough money to upgrade click power');
        }
    };

    const upgradeAutoClickPower = () => {
        const cost = Math.floor(200 * Math.pow(1.5, gameState.autoClickPower));
        if (gameState.money >= cost) {
            setGameState(prevState => ({
                ...prevState,
                autoClickPower: prevState.autoClickPower + 1,
                money: prevState.money - cost
            }));
        } else {
            console.log('Not enough money to upgrade auto click power');
        }
    };

    const developGame = (gameId) => {
        setGames(prevGames => prevGames.map(game => 
            game.id === gameId 
                ? { ...game, points: game.points + gameState.clickPower } 
                : game
        ));
        setGameState(prevState => ({
            ...prevState,
            games: prevState.games.map(game => 
                game.id === gameId 
                    ? { ...game, points: game.points + prevState.clickPower } 
                    : game
            )
        }));
    };

    const updateStudioName = (newName) => {
        setStudioName(newName);
        // You might want to save this to your database as well
    };

    useEffect(() => {
        const saveInterval = setInterval(() => {
            if (user) {
                saveGame();
            }
        }, 60000); // Save every minute

        return () => clearInterval(saveInterval);
    }, [user, gameState]);

    useEffect(() => {
        if (user) {
            loadGame();
        }
    }, [user]);

    // Add this function to the GameContext
    const setGameImportance = (gameId, importance) => {
        setGameState(prevState => ({
            ...prevState,
            games: prevState.games.map(game => 
                game.id === gameId ? { ...game, importance } : game
            )
        }));
    };

    const releaseGame = (gameId, price) => {
        setGameState(prevState => ({
            ...prevState,
            games: prevState.games.map(game => 
                game.id === gameId 
                    ? { ...game, isReleased: true, price: price, salesDuration: 30 } // 30 days of sales
                    : game
            )
        }));
        console.log(`Game ${gameId} released at price $${price}`);
    };

    const setGamePrice = (gameId, price) => {
        setGameState(prevState => ({
            ...prevState,
            games: prevState.games.map(game => 
                game.id === gameId ? { ...game, price: parseFloat(price) } : game
            )
        }));
    };

    return (
        <GameContext.Provider value={{
            user,
            games,
            currentGame,
            gameState,
            gameTime,
            signIn,
            signOut,
            createGame,
            selectGame,
            deleteGame,
            saveGame,
            loadGame,
            updateGameProgress,
            hireDeveloper,
            hireWorker,
            buyUpgrade,
            updateGameState,
            calculateWorkerContribution,
            developGame,
            upgradeClickPower,
            upgradeAutoClickPower,
            studioName,
            updateStudioName,
            studioReputation,
            setStudioReputation,
            setGameImportance,
            releaseGame,
            setGamePrice,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
