// src/components/DeveloperHiring.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function DeveloperHiring() {
    const { gameState, hireWorker } = useContext(GameContext);

    const getMonthlySalary = (type) => {
        switch(type) {
            case 'junior': return 1000;
            case 'senior': return 5000;
            case 'expert': return 10000;
            default: return 0;
        }
    };

    const totalMonthlySalary = gameState?.workers?.reduce((total, worker) => total + getMonthlySalary(worker.type), 0) || 0;

    return (
        <div className="bg-kb-white p-4 rounded-lg shadow-md mt-12">
            <h2 className="text-xl font-bold mb-4 text-kb-black">Hire Developers</h2>
            <p className="text-kb-black mb-2">Total Monthly Salary: ${totalMonthlySalary}</p>
            <p className="text-kb-black mb-4">Total Developers: {gameState?.workers?.length || 0}</p>
            <div className="space-y-2">
                <button 
                    className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                    onClick={() => hireWorker('junior')}
                    disabled={gameState?.funds < 1000}
                >
                    Hire Junior (Salary: $1000/month)
                </button>
                <button 
                    className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                    onClick={() => hireWorker('senior')}
                    disabled={gameState?.funds < 5000}
                >
                    Hire Senior (Salary: $5000/month)
                </button>
                <button 
                    className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                    onClick={() => hireWorker('expert')}
                    disabled={gameState?.funds < 10000}
                >
                    Hire Expert (Salary: $10000/month)
                </button>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-kb-black">Current Employees:</h3>
                {gameState?.workers?.map((worker, index) => (
                    <div key={index} className="text-kb-black">
                        {worker.type.charAt(0).toUpperCase() + worker.type.slice(1)} - Salary: ${getMonthlySalary(worker.type)}/month
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DeveloperHiring;
