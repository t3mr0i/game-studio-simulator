// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth, database } from '../firebase';
import { ref, set, get, onValue } from 'firebase/database';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
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
    const [researchPoints, setResearchPoints] = useState(0);
    const [newsItems, setNewsItems] = useState([]);
    const [studioName, setStudioName] = useState('New Studio');
    const [studioReputation, setStudioReputation] = useState(0);
    const [completedResearch, setCompletedResearch] = useState([]);

    const [user, setUser] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isOnlineMode, setIsOnlineMode] = useState(true);
    const [conflicts, setConflicts] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user && isOnlineMode) {
                loadGameState();
            }
        });

        return () => unsubscribe();
    }, [isOnlineMode]);

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
            loadGameState();
        }
    };

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
            studioName,
            studioReputation,
            completedResearch
        };

        console.log("Saving game state:", gameState);

        if (isOnlineMode && user) {
            set(ref(database, `users/${user.uid}/gameState`), gameState)
                .then(() => {
                    console.log("Game saved online successfully");
                    customToast.success('Game saved online successfully!');
                })
                .catch((error) => {
                    console.error("Error saving game online:", error);
                    customToast.error('Error saving game online: ' + error.message);
                });
        } else {
            localStorage.setItem('offlineGameState', JSON.stringify(gameState));
            console.log("Game saved offline successfully");
            customToast.success('Game saved offline successfully!');
        }
    }, [games, workers, funds, totalClicks, clickPower, autoClickPower, gameTime, prestigePoints, researchPoints, newsItems, user, studioName, studioReputation, completedResearch, isOnlineMode]);

    const loadGameState = useCallback(() => {
        if (isOnlineMode && user) {
            get(ref(database, `users/${user.uid}/gameState`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const gameState = snapshot.val();
                        console.log("Loaded online game state:", gameState);
                        setGames(gameState.games || []);
                        setWorkers(gameState.workers || []);
                        setFunds(gameState.funds || 10000);
                        setTotalClicks(gameState.totalClicks || 0);
                        setClickPower(gameState.clickPower || 1);
                        setAutoClickPower(gameState.autoClickPower || 0);
                        setGameTime(gameState.gameTime || 0);
                        setPrestigePoints(gameState.prestigePoints || 0);
                        setResearchPoints(gameState.researchPoints || 0);
                        setNewsItems(gameState.newsItems || []);
                        setStudioName(gameState.studioName || 'New Studio');
                        setStudioReputation(gameState.studioReputation || 0);
                        setCompletedResearch(gameState.completedResearch || []);
                        customToast.success('Game loaded online successfully!');
                    } else {
                        console.log("No online saved game found");
                        customToast.info('No online saved game found. Starting a new game.');
                    }
                })
                .catch((error) => {
                    console.error("Error loading online game state:", error);
                    customToast.error('Error loading online game state.');
                });
        } else {
            const offlineGameState = localStorage.getItem('offlineGameState');
            if (offlineGameState) {
                const gameState = JSON.parse(offlineGameState);
                console.log("Loaded offline game state:", gameState);
                setGames(gameState.games || []);
                setWorkers(gameState.workers || []);
                setFunds(gameState.funds || 10000);
                setTotalClicks(gameState.totalClicks || 0);
                setClickPower(gameState.clickPower || 1);
                setAutoClickPower(gameState.autoClickPower || 0);
                setGameTime(gameState.gameTime || 0);
                setPrestigePoints(gameState.prestigePoints || 0);
                setResearchPoints(gameState.researchPoints || 0);
                setNewsItems(gameState.newsItems || []);
                setStudioName(gameState.studioName || 'New Studio');
                setStudioReputation(gameState.studioReputation || 0);
                setCompletedResearch(gameState.completedResearch || []);
                customToast.success('Game loaded offline successfully!');
            } else {
                console.log("No offline saved game found");
                customToast.info('No offline saved game found. Starting a new game.');
            }
        }
    }, [user, isOnlineMode]);

    // Auto-save functionality
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            console.log("Auto-saving game state...");
            saveGameState();
        }, 300000); // Auto-save every 5 minutes (300000 ms)

        return () => clearInterval(autoSaveInterval);
    }, [saveGameState]);

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
            customToast.success(`New game "${gameName}" created!`);
        } else {
            customToast.error('Not enough funds to create a new game.');
        }
    }, [games, funds]);

    return (
        <GameContext.Provider value={{ 
            games, setGames, workers, setWorkers, funds, setFunds, 
            totalClicks, setTotalClicks, clickPower, setClickPower, 
            autoClickPower, setAutoClickPower, gameTime, setGameTime, 
            prestigePoints, setPrestigePoints, researchPoints, setResearchPoints, 
            newsItems, setNewsItems, studioName, setStudioName, 
            studioReputation, setStudioReputation, completedResearch, setCompletedResearch,
            user, isOnline, isOnlineMode, toggleOnlineMode,
            saveGameState, loadGameState, manualSync, resolveConflict, conflicts,
            createGame
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
