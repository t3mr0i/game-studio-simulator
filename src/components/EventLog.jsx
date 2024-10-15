import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function EventLog() {
    const { events } = useContext(GameContext);

    return (
        <div className="bg-kb-black p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold mb-4 text-kb-white">Event Log</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {events.map((event, index) => (
                    <div key={index} className="bg-kb-dark-grey p-2 rounded">
                        <p className="text-kb-white">{event.message}</p>
                        <p className="text-kb-light-grey text-sm">{event.timestamp}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventLog;