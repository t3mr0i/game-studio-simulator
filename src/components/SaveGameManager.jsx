import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

function SaveGameManager() {
    const { savedGames, saveGame, loadGame, deleteSavedGame, loadSavedGames } = useContext(GameContext);
    const [newSaveName, setNewSaveName] = useState('');
    const [sortedSavedGames, setSortedSavedGames] = useState([]);

    useEffect(() => {
        // Sort saved games by timestamp, most recent first
        const sorted = [...savedGames].sort((a, b) => b.timestamp - a.timestamp);
        setSortedSavedGames(sorted);
    }, [savedGames]);

    useEffect(() => {
        loadSavedGames();
    }, [loadSavedGames]);

    const handleSave = () => {
        if (newSaveName.trim()) {
            saveGame(newSaveName);
            setNewSaveName('');
        } else {
            alert('Please enter a name for your save game.');
        }
    };

    return (
        <div className="bg-kb-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-kb-black mb-4">Save Game Manager</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={newSaveName}
                    onChange={(e) => setNewSaveName(e.target.value)}
                    placeholder="Enter save game name"
                    className="w-full px-3 py-2 border border-kb-grey rounded-md"
                />
                <button
                    onClick={handleSave}
                    className="mt-2 w-full bg-kb-live-red text-kb-black px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                >
                    Save Game
                </button>
            </div>
            <div className="space-y-2">
                {sortedSavedGames.map((save) => (
                    <div key={save.id} className="flex justify-between items-center bg-kb-light-grey p-2 rounded">
                        <span>{save.saveName} - {new Date(save.timestamp).toLocaleString()}</span>
                        <div>
                            <button
                                onClick={() => loadGame(save.id)}
                                className="bg-kb-grey text-kb-white px-2 py-1 rounded mr-2"
                            >
                                Load
                            </button>
                            <button
                                onClick={() => deleteSavedGame(save.id)}
                                className="bg-red-500 text-kb-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SaveGameManager;
