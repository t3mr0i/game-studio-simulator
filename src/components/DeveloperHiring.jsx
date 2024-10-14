// src/components/DeveloperHiring.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function DeveloperHiring() {
    const { hireWorker, workers, funds } = useContext(GameContext);

    return (
        <div className="bg-kb-white p-4 rounded-lg shadow-md mt-12">
            <h2 className="text-xl font-bold mb-4 text-kb-black">Hire Developers</h2>
            <p className="text-kb-black mb-2">Available Funds: ${funds.toFixed(2)}</p>
            <p className="text-kb-black mb-4">Total Developers: {workers.length}</p>
            <div className="space-y-2">
                <button 
                    className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                    onClick={() => hireWorker('junior')}
                    disabled={funds < 1000}
                >
                    Hire Junior ($1000)
                </button>
                <button 
                    className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                    onClick={() => hireWorker('senior')}
                    disabled={funds < 5000}
                >
                    Hire Senior ($5000)
                </button>
                <button 
                    className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                    onClick={() => hireWorker('expert')}
                    disabled={funds < 10000}
                >
                    Hire Expert ($10000)
                </button>
            </div>
        </div>
    );
}

export default DeveloperHiring;
