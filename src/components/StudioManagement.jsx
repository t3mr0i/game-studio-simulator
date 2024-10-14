import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { customToast } from '../utils/toast';

function StudioManagement() {
    const { studioName, setStudioName, studioReputation, games } = useContext(GameContext);
    const [newStudioName, setNewStudioName] = useState(studioName);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleNameChange = () => {
        if (newStudioName.trim() !== '') {
            setStudioName(newStudioName);
            customToast.success('Studio name updated successfully!');
            setIsExpanded(false);
        } else {
            customToast.error('Studio name cannot be empty!');
        }
    };

    const releasedGames = games.filter(game => game.isReleased).length;

    return (
        <div className="bg-kb-black p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <h2 className="text-xl font-bold text-kb-white">{studioName}</h2>
                <svg 
                    className={`w-6 h-6 text-kb-white transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            <p className="text-kb-grey mt-2">Reputation: {studioReputation.toFixed(2)}</p>
            {isExpanded && (
                <div className="mt-4 space-y-2">
                    <p className="text-kb-grey">Released Games: {releasedGames}</p>
                    <input
                        type="text"
                        value={newStudioName}
                        onChange={(e) => setNewStudioName(e.target.value)}
                        className="w-full px-3 py-2 bg-kb-white text-kb-black rounded mb-2"
                        placeholder="New Studio Name"
                    />
                    <button
                        onClick={handleNameChange}
                        className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                    >
                        Update Studio Name
                    </button>
                </div>
            )}
        </div>
    );
}

export default StudioManagement;
