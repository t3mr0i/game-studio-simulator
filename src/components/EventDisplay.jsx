import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function EventDisplay() {
    const { currentEvent, handleEventChoice } = useContext(GameContext);

    if (!currentEvent) return null;

    return (
        <div className="bg-kb-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold mb-2 text-kb-black">{currentEvent.title}</h2>
            <p className="mb-4 text-kb-grey">{currentEvent.description}</p>
            <div className="space-y-2">
                {currentEvent.choices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => handleEventChoice(choice)}
                        className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                    >
                        {choice.text}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default EventDisplay;
