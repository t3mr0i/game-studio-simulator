import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';

function TimeControl() {
    const { startTime, stopTime } = useContext(GameContext);
    const [isRunning, setIsRunning] = useState(false);

    const handleToggle = () => {
        if (isRunning) {
            stopTime();
            setIsRunning(false);
        } else {
            startTime();
            setIsRunning(true);
        }
    };

    return (
        <div className="bg-kb-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-kb-black">Time Control</h2>
            <button
                onClick={handleToggle}
                className={`w-full px-4 py-2 rounded font-bold ${
                    isRunning
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                }`}
            >
                {isRunning ? 'Pause Time' : 'Start Time'}
            </button>
        </div>
    );
}

export default TimeControl;
