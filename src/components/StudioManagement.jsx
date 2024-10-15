import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function StudioManagement() {
    const { gameState } = useContext(GameContext);

    return (
        <div className="bg-kb-black p-4 rounded-lg shadow-md mt-12">
            <h2 className="text-xl font-bold mb-4 text-kb-white">Studio Management</h2>
            <p className="text-kb-grey mb-2">Funds: ${gameState?.money?.toFixed(2) || '0.00'}</p>
            {/* Add more studio management content here */}
        </div>
    );
}

export default StudioManagement;
