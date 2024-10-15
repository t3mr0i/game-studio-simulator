// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth, database } from '../firebase';
import { ref, set, get, onValue, push, remove } from 'firebase/database';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { customToast } from '../utils/toast';
import { genres } from '../data/genres';

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
    const [researchPoints, setResearchPoints] = useState(0);
    const [newsItems, setNewsItems] = useState([]);
    const [studioName, setStudioName] = useState('New Studio');
    const [studioReputation, setStudioReputation] = useState(0);
    const [completedResearch, setCompletedResearch] = useState([]);

    const [user, setUser] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isOnlineMode, setIsOnlineMode] = useState(true);
    const [conflicts, setConflicts] = useState([]);

    const [marketTrends, setMarketTrends] = useState({});
    const [events, setEvents] = useState([]);

    const [savedGames, setSavedGames] = useState([]);

    const saveGameState = useCallback(() => {
        if (user) {
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
                studioName,
                studioReputation,
                completedResearch,
                marketTrends,
                events,
            };
            set(ref(database, `users/${user.uid}/gameState`), gameState)
                .then(() => console.log('Game saved successfully!'))
                .catch((error) => console.error('Error saving game:', error.message));
        }
    }, [user, games, workers, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, researchPoints, studioName, studioReputation, completedResearch, marketTrends, events]);

    useEffect(() => {
        const saveInterval = setInterval(() => {
            saveGameState();
        }, 10000); // Save every 10 seconds

        return () => clearInterval(saveInterval);
    }, [saveGameState]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                loadGameState(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const toggleOnlineMode = () => {
        setIsOnlineMode(prev => !prev);
        if (!isOnlineMode && user) {
            loadGameState(user.uid);
        }
    };

    const loadGameState = useCallback((userId) => {
        const gameStateRef = ref(database, `users/${userId}/gameState`);
        get(gameStateRef).then((snapshot) => {
            if (snapshot.exists()) {
                const gameState = snapshot.val();
                setGames(gameState.games || []);
                setWorkers(gameState.workers || []);
                setFunds(gameState.funds || 10000);
                setTotalClicks(gameState.totalClicks || 0);
                setClickPower(gameState.clickPower || 1);
                setAutoClickPower(gameState.autoClickPower || 0);
                setGameTime(gameState.gameTime || 0);
                setPrestigePoints(gameState.prestigePoints || 0);
                setResearchPoints(gameState.researchPoints || 0);
                setStudioName(gameState.studioName || 'New Studio');
                setStudioReputation(gameState.studioReputation || 0);
                setCompletedResearch(gameState.completedResearch || []);
                setMarketTrends(gameState.marketTrends || {});
                setEvents(gameState.events || []);
                customToast.success('Game state loaded successfully!');
            } else {
                customToast.info('No saved game state found. Starting a new game.');
            }
        }).catch((error) => {
            console.error("Error loading game state:", error);
            customToast.error('Error loading game state.');
        });
    }, []);

    const manualSync = useCallback(() => {
        if (user && isOnline) {
            const localState = {
                games,
                workers,
                funds,
                totalClicks,
                clickPower,
                autoClickPower,
                gameTime,
                prestigePoints,
                researchPoints,
                studioName,
                studioReputation,
                completedResearch
            };

            get(ref(database, `users/${user.uid}/gameState`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const serverState = snapshot.val();
                    const identifiedConflicts = [];

                    Object.keys(localState).forEach(key => {
                        if (JSON.stringify(localState[key]) !== JSON.stringify(serverState[key])) {
                            identifiedConflicts.push({
                                key,
                                local: localState[key],
                                server: serverState[key]
                            });
                        }
                    });

                    setConflicts(identifiedConflicts);
                }
            }).catch((error) => {
                console.error("Error during manual sync:", error);
                customToast.error("Error during manual sync. Please try again.");
            });
        }
    }, [user, isOnline, games, workers, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, researchPoints, studioName, studioReputation, completedResearch]);

    const resolveConflict = useCallback((key, choice) => {
        if (choice === 'local') {
            // Keep the local state
            // No action needed as we're already using the local state
        } else if (choice === 'server') {
            // Use the server state
            get(ref(database, `users/${user.uid}/gameState/${key}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const serverValue = snapshot.val();
                    // Update the local state with the server value
                    switch(key) {
                        case 'games':
                            setGames(serverValue);
                            break;
                        case 'workers':
                            setWorkers(serverValue);
                            break;
                        case 'funds':
                            setFunds(serverValue);
                            break;
                        // ... add cases for other state variables
                        default:
                            console.warn(`Unhandled state key in conflict resolution: ${key}`);
                    }
                }
            }).catch((error) => {
                console.error("Error resolving conflict:", error);
                customToast.error("Error resolving conflict. Please try again.");
            });
        }
        
        // Remove the resolved conflict from the list
        setConflicts(prevConflicts => prevConflicts.filter(conflict => conflict.key !== key));
    }, [user]);

    const createGame = useCallback((gameName, genreId) => {
        if (funds >= 100) {
            const newGame = {
                id: games.length,
                name: gameName,
                genreId: genreId,
                points: 0,
                stage: 'concept',
                isReleased: false,
                rating: 0,
                revenue: 0,
                popularity: 0,
                salesDuration: 0,
                metacriticScore: 0,
                soldUnits: 0,
                price: 0,
                isActive: false,
                salesData: []
            };
            setGames(prevGames => [...prevGames, newGame]);
            setFunds(prevFunds => prevFunds - 100);
            saveGameState();
            customToast.success(`New game "${gameName}" created!`);
        } else {
            customToast.error('Not enough funds to create a new game.');
        }
    }, [funds, games.length, saveGameState]);

    const updateMarketTrends = useCallback(() => {
        const newTrends = {};
        genres.forEach(genre => {
            newTrends[genre.id] = Math.random() * 2 - 1; // Range from -1 to 1
        });
        setMarketTrends(newTrends);
    }, []);

    const generateEvent = useCallback(() => {
        // Logic to generate random events
    }, []);

    useEffect(() => {
        const marketInterval = setInterval(updateMarketTrends, 30000); // Update every 30 seconds
        const eventInterval = setInterval(generateEvent, 60000); // Generate event every minute

        return () => {
            clearInterval(marketInterval);
            clearInterval(eventInterval);
        };
    }, [updateMarketTrends, generateEvent]);

    const developGame = useCallback((gameId) => {
        setGames(prevGames => prevGames.map(game => {
            if (game.id === gameId) {
                const newPoints = game.points + clickPower;
                let newStage = game.stage;
                if (newPoints >= 250 && newStage === 'concept') newStage = 'pre-production';
                if (newPoints >= 500 && newStage === 'pre-production') newStage = 'production';
                if (newPoints >= 750 && newStage === 'production') newStage = 'testing';
                return { ...game, points: newPoints, stage: newStage };
            }
            return game;
        }));
    }, [clickPower]);

    const hireWorker = useCallback((type) => {
        let cost;
        let productivity;
        switch(type) {
            case 'junior':
                cost = 1000;
                productivity = 1;
                break;
            case 'senior':
                cost = 5000;
                productivity = 3;
                break;
            case 'expert':
                cost = 10000;
                productivity = 5;
                break;
            default:
                return;
        }

        if (funds >= cost) {
            setFunds(prevFunds => prevFunds - cost);
            setWorkers(prevWorkers => [...prevWorkers, { id: Date.now(), type, productivity, assignedTo: null }]);
            customToast.success(`Hired a new ${type} developer!`);
        } else {
            customToast.error('Not enough funds to hire this developer.');
        }
    }, [funds]);

    const assignWorker = useCallback((workerId, gameId) => {
        setWorkers(prevWorkers => prevWorkers.map(worker => 
            worker.id === workerId ? { ...worker, assignedTo: gameId } : worker
        ));
    }, []);

    const unassignWorker = useCallback((workerId) => {
        setWorkers(prevWorkers => prevWorkers.map(worker => 
            worker.id === workerId ? { ...worker, assignedTo: null } : worker
        ));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGames(prevGames => prevGames.map(game => {
                if (!game.isReleased) {
                    const assignedWorkers = workers.filter(worker => worker.assignedTo === game.id);
                    const workerContribution = assignedWorkers.reduce((sum, worker) => sum + worker.productivity, 0);
                    return {
                        ...game,
                        points: game.points + workerContribution
                    };
                }
                return game;
            }));
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [workers]);

    const signInWithGoogle = useCallback(() => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                customToast.success('Signed in successfully!');
                loadGameState(user.uid);
            }).catch((error) => {
                const errorMessage = error.message;
                customToast.error(`Sign-in error: ${errorMessage}`);
            });
    }, []);

    const setGameImportance = useCallback((gameId, importance) => {
        setGames(prevGames => prevGames.map(game => 
            game.id === gameId ? { ...game, importance } : game
        ));
        saveGameState();
    }, []);

    const redistributeWorkers = () => {
        const unreleasedGames = games.filter(game => !game.isReleased);
        const totalImportance = unreleasedGames.reduce((sum, game) => sum + (game.importance || 5), 0);

        const newWorkers = workers.map(worker => {
            if (unreleasedGames.length === 0) {
                return { ...worker, assignedTo: null };
            }

            const randomValue = Math.random() * totalImportance;
            let cumulativeImportance = 0;

            for (const game of unreleasedGames) {
                cumulativeImportance += game.importance || 5;
                if (randomValue <= cumulativeImportance) {
                    return { ...worker, assignedTo: game.id };
                }
            }

            return { ...worker, assignedTo: unreleasedGames[unreleasedGames.length - 1].id };
        });

        setWorkers(newWorkers);
    };

    useEffect(() => {
        redistributeWorkers();
    }, [games, workers.length]);

    const releaseGame = useCallback((gameId, price) => {
        setGames(prevGames => prevGames.map(game => {
            if (game.id === gameId) {
                return {
                    ...game,
                    isReleased: true,
                    price: parseFloat(price),
                    salesDuration: 30, // 30 days of sales
                    metacriticScore: Math.floor(Math.random() * 41) + 60, // Random score between 60-100
                    soldUnits: 0,
                    revenue: 0,
                    releaseDate: Date.now() // Add release date
                };
            }
            return game;
        }));
        saveGameState();
    }, [saveGameState]);

    // Add this effect to handle game sales
    useEffect(() => {
        const salesInterval = setInterval(() => {
            setGames(prevGames => prevGames.map(game => {
                if (game.isReleased && game.salesDuration > 0) {
                    const dailySales = Math.floor(Math.random() * 1000) + 100; // Random sales between 100-1100 per day
                    const newSoldUnits = game.soldUnits + dailySales;
                    const newRevenue = game.revenue + (dailySales * game.price);
                    return {
                        ...game,
                        salesDuration: game.salesDuration - 1,
                        soldUnits: newSoldUnits,
                        revenue: newRevenue
                    };
                }
                return game;
            }));
        }, 1000); // Update every second for demo purposes. In a real game, you might want to slow this down.

        return () => clearInterval(salesInterval);
    }, []);

    const saveGame = useCallback((saveName) => {
        if (user && user.uid) {
            const gameState = {
                saveName,
                timestamp: Date.now(),
                games,
                workers,
                funds,
                totalClicks,
                clickPower,
                autoClickPower,
                gameTime,
                prestigePoints,
                researchPoints,
                studioName,
                studioReputation,
                completedResearch,
                marketTrends,
                events,
            };
            push(ref(database, `users/${user.uid}/savedGames`), gameState)
                .then(() => {
                    customToast.success('Game saved successfully!');
                    loadSavedGames();
                })
                .catch((error) => customToast.error('Error saving game: ' + error.message));
        }
    }, [user, games, workers, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, researchPoints, studioName, studioReputation, completedResearch, marketTrends, events]);

    const loadSavedGames = useCallback(() => {
        if (user && user.uid) {
            const savedGamesRef = ref(database, `users/${user.uid}/savedGames`);
            get(savedGamesRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const savedGamesData = snapshot.val();
                    const savedGamesArray = Object.entries(savedGamesData).map(([key, value]) => ({
                        id: key,
                        ...value
                    }));
                    setSavedGames(savedGamesArray);
                } else {
                    setSavedGames([]);
                }
            }).catch((error) => {
                console.error("Error loading saved games:", error);
                customToast.error('Error loading saved games.');
            });
        }
    }, [user]);

    const loadGame = useCallback((saveId) => {
        if (user && user.uid) {
            const saveRef = ref(database, `users/${user.uid}/savedGames/${saveId}`);
            get(saveRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const gameState = snapshot.val();
                    setGames(gameState.games || []);
                    setWorkers(gameState.workers || []);
                    setFunds(gameState.funds || 10000);
                    setTotalClicks(gameState.totalClicks || 0);
                    setClickPower(gameState.clickPower || 1);
                    setAutoClickPower(gameState.autoClickPower || 0);
                    setGameTime(gameState.gameTime || 0);
                    setPrestigePoints(gameState.prestigePoints || 0);
                    setResearchPoints(gameState.researchPoints || 0);
                    setStudioName(gameState.studioName || 'New Studio');
                    setStudioReputation(gameState.studioReputation || 0);
                    setCompletedResearch(gameState.completedResearch || []);
                    setMarketTrends(gameState.marketTrends || {});
                    setEvents(gameState.events || []);
                    customToast.success('Game loaded successfully!');
                } else {
                    customToast.error('Save game not found.');
                }
            }).catch((error) => {
                console.error("Error loading game:", error);
                customToast.error('Error loading game.');
            });
        }
    }, [user]);

    const deleteSavedGame = useCallback((saveId) => {
        if (user && user.uid) {
            const saveRef = ref(database, `users/${user.uid}/savedGames/${saveId}`);
            remove(saveRef)
                .then(() => {
                    customToast.success('Save game deleted successfully!');
                    loadSavedGames();
                })
                .catch((error) => {
                    console.error("Error deleting save game:", error);
                    customToast.error('Error deleting save game.');
                });
        }
    }, [user, loadSavedGames]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                loadSavedGames();
            }
        });

        return () => unsubscribe();
    }, [loadSavedGames]);

    return (
        <GameContext.Provider value={{ 
            games, setGames, workers, setWorkers, funds, setFunds, 
            totalClicks, setTotalClicks, clickPower, setClickPower, 
            autoClickPower, setAutoClickPower, gameTime, setGameTime, 
            prestigePoints, setPrestigePoints, researchPoints, setResearchPoints, 
            newsItems, setNewsItems, studioName, setStudioName, 
            studioReputation, setStudioReputation, completedResearch, setCompletedResearch,
            user, isOnline, isOnlineMode, toggleOnlineMode,
            manualSync, resolveConflict, conflicts,
            createGame, developGame, releaseGame,
            hireWorker, setGameImportance,
            signInWithGoogle, loadGameState, saveGameState,
            savedGames,
            saveGame,
            loadGame,
            deleteSavedGame,
            loadSavedGames,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;