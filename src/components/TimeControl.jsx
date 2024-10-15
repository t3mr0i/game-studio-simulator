import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function TimeControl() {
    const { startTime, stopTime, isTimeRunning } = useContext(GameContext);

    const handleToggle = () => {
        if (isTimeRunning) {
            stopTime();
        } else {
            startTime();
        }
    };

    return (
        <div className="bg-kb-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-kb-black">Time Control</h2>
            <button
                onClick={handleToggle}
                className={`w-full px-4 py-2 rounded font-bold ${
                    isTimeRunning
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                }`}
            >
                {isTimeRunning ? 'Pause Time' : 'Start Time'}
            </button>
        </div>
    );
}

export default TimeControl;
