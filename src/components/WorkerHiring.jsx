import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function WorkerHiring() {
    const { hireWorker, workers, funds, games } = useContext(GameContext);

    const totalWorkers = workers.length;
    const assignedWorkers = workers.filter(worker => worker.assignedTo !== null).length;

    return (
        <div className="worker-hiring bg-kb-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-kb-black mb-4">Hire Workers</h2>
            <p className="text-kb-grey mb-2">Available Funds: ${funds.toFixed(2)}</p>
            <p className="text-kb-grey mb-4">Total Workers: {totalWorkers} (Assigned: {assignedWorkers})</p>
            <div className="space-y-2">
                <button 
                    className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                    onClick={() => hireWorker('junior')}
                >
                    Hire Junior ($1000)
                </button>
                <button 
                    className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                    onClick={() => hireWorker('senior')}
                >
                    Hire Senior ($5000)
                </button>
                <button 
                    className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                    onClick={() => hireWorker('expert')}
                >
                    Hire Expert ($10000)
                </button>
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-bold text-kb-black mb-2">Worker Distribution</h3>
                {games.filter(game => !game.isReleased).map(game => (
                    <div key={game.id} className="flex justify-between items-center mb-2">
                        <span className="text-kb-grey">{game.name}</span>
                        <span className="text-kb-black font-bold">
                            {workers.filter(worker => worker.assignedTo === game.id).length} workers
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WorkerHiring;
