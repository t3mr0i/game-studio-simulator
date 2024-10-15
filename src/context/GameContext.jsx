// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
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

    const gamesRef = useRef(games);
    const fundsRef = useRef(funds);

    const [currentMonth, setCurrentMonth] = useState(0);

    useEffect(() => {
        gamesRef.current = games;
    }, [games]);

    useEffect(() => {
        fundsRef.current = funds;
    }, [funds]);

    const saveGameState = useCallback(() => {
        if (user && user.uid) {
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
                currentMonth
            };
            set(ref(database, `users/${user.uid}/gameState`), gameState)
                .then(() => console.log('Game autosaved successfully!'))
                .catch((error) => console.error('Error autosaving game:', error.message));
        }
    }, [user, games, workers, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, researchPoints, studioName, studioReputation, completedResearch, marketTrends, events, currentMonth]);

    // Autosave every 5 minutes
    useEffect(() => {
        const autosaveInterval = setInterval(() => {
            saveGameState();
        }, 5 * 60 * 1000);

        return () => clearInterval(autosaveInterval);
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
                setCurrentMonth(gameState.currentMonth || 0);
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
                const assignedWorkers = workers.filter(worker => worker.assignedTo === gameId);
                const workerContribution = assignedWorkers.reduce((sum, worker) => {
                    switch(worker.type) {
                        case 'junior': return sum + 1;
                        case 'senior': return sum + 3;
                        case 'expert': return sum + 5;
                        default: return sum;
                    }
                }, 0);
                
                const newPoints = game.points + clickPower + workerContribution;
                let newStage = game.stage;
                if (newPoints >= 250 && newStage === 'concept') newStage = 'pre-production';
                if (newPoints >= 500 && newStage === 'pre-production') newStage = 'production';
                if (newPoints >= 750 && newStage === 'production') newStage = 'testing';
                return { ...game, points: newPoints, stage: newStage };
            }
            return game;
        }));
    }, [clickPower, workers]);

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

    const redistributeWorkers = useCallback(() => {
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
    }, [games, workers]);

    useEffect(() => {
        redistributeWorkers();
    }, [games, workers.length, redistributeWorkers]);

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
                    releaseDate: Date.now(),
                    salesHistory: [] // Add this to track daily sales
                };
            }
            return game;
        }));
        saveGameState();
    }, [saveGameState]);

    // Update this effect to handle game sales and add revenue to funds
    useEffect(() => {
        const salesInterval = setInterval(() => {
            let totalDailyRevenue = 0;
            const updatedGames = gamesRef.current.map(game => {
                if (game.isReleased && game.salesDuration > 0) {
                    const dailySales = Math.floor(Math.random() * 1000) + 100;
                    const newSoldUnits = game.soldUnits + dailySales;
                    const dailyRevenue = dailySales * game.price;
                    const newRevenue = game.revenue + dailyRevenue;
                    
                    totalDailyRevenue += dailyRevenue;
                    
                    const newSalesHistory = [...game.salesHistory, { day: 30 - game.salesDuration, sales: dailySales, revenue: dailyRevenue }];
                    
                    return {
                        ...game,
                        salesDuration: game.salesDuration - 1,
                        soldUnits: newSoldUnits,
                        revenue: newRevenue,
                        salesHistory: newSalesHistory
                    };
                }
                return game;
            });

            setGames(updatedGames);
            setFunds(prevFunds => prevFunds + totalDailyRevenue);
        }, 1000);

        return () => clearInterval(salesInterval);
    }, []);

    // Add this function to analyze game performance
    const analyzeGamePerformance = useCallback((gameId) => {
        const game = games.find(g => g.id === gameId);
        if (!game || !game.isReleased) return null;

        const totalSales = game.soldUnits;
        const totalRevenue = game.revenue;
        const averageDailySales = totalSales / (30 - game.salesDuration);
        const peakSalesDay = game.salesHistory.reduce((max, day) => day.sales > max.sales ? day : max, game.salesHistory[0]);
        const salesTrend = game.salesHistory.slice(-7).reduce((sum, day) => sum + day.sales, 0) / 7 - averageDailySales;

        return {
            totalSales,
            totalRevenue,
            averageDailySales,
            peakSalesDay,
            salesTrend: salesTrend > 0 ? 'Increasing' : salesTrend < 0 ? 'Decreasing' : 'Stable',
            metacriticScore: game.metacriticScore,
            profitMargin: ((totalRevenue - 1000) / totalRevenue) * 100 // Assuming a base cost of 1000 for game development
        };
    }, [games]);

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
                currentMonth
            };
            push(ref(database, `users/${user.uid}/savedGames`), gameState)
                .then(() => {
                    customToast.success('Game saved successfully!');
                    loadSavedGames();
                })
                .catch((error) => customToast.error('Error saving game: ' + error.message));
        }
    }, [user, games, workers, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, researchPoints, studioName, studioReputation, completedResearch, marketTrends, events, currentMonth, loadSavedGames]);

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

    // Add this effect to handle time progression and salary payments
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setGameTime(prevTime => prevTime + 1);
            setCurrentMonth(prevMonth => {
                const newMonth = (prevMonth + 1) % 12;
                
                // Pay salaries at the start of each month
                if (newMonth === 0) {
                    const totalSalary = workers.reduce((sum, worker) => {
                        switch(worker.type) {
                            case 'junior': return sum + 1000;
                            case 'senior': return sum + 5000;
                            case 'expert': return sum + 10000;
                            default: return sum;
                        }
                    }, 0);

                    setFunds(prevFunds => {
                        const newFunds = prevFunds - totalSalary;
                        if (newFunds < 0) {
                            customToast.error(`You're in debt! Current balance: $${newFunds}`);
                        } else {
                            customToast.info(`Paid $${totalSalary} in salaries. Current balance: $${newFunds}`);
                        }
                        return newFunds;
                    });
                }
                
                return newMonth;
            });
        }, 1000); // 1 second represents 1 day in game time

        return () => clearInterval(timeInterval);
    }, [workers]);

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
            analyzeGamePerformance,
            gameTime,
            currentMonth,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;