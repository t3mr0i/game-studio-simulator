import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function StudioOverview() {
    const { studioName, funds, studioReputation } = useContext(GameContext);

    return (
        <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">{studioName}</h1>
            <p>Funds: ${funds.toFixed(2)}</p>
            <p>Reputation: {studioReputation.toFixed(2)}</p>
        </div>
    );
}

export default StudioOverview;
