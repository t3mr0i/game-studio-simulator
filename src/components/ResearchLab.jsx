import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function ResearchLab() {
    const { gameState } = useContext(GameContext);

    return (
        <div className="bg-kb-black p-4 rounded-lg shadow-md mt-12">
            <h2 className="text-xl font-bold mb-4 text-kb-white">Research Lab</h2>
            <p className="text-kb-grey mb-2">Research Points: {gameState?.researchPoints?.toFixed(1) || '0.0'}</p>
            <p className="text-kb-grey mb-4">Generating {((gameState?.workers?.length || 0) * 0.1).toFixed(1)} RP/s</p>
            {/* Add more research lab content here */}
        </div>
    );
}

export default ResearchLab;