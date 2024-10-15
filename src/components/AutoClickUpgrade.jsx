import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function AutoClickUpgrade() {
    const { autoClickPower, upgradeAutoClickPower, funds } = useContext(GameContext);
    const upgradeCost = Math.floor(100 * Math.pow(1.5, autoClickPower));

    return (
        <div className="bg-kb-white p-4 rounded-lg shadow-md mt-4">
            <h3 className="text-lg font-bold text-kb-black mb-2">Auto-Click Power</h3>
            <p className="text-kb-grey mb-2">Current Power: {autoClickPower}</p>
            <button
                className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed"
                onClick={upgradeAutoClickPower}
                disabled={funds < upgradeCost}
            >
                Upgrade (Cost: ${upgradeCost})
            </button>
        </div>
    );
}

export default AutoClickUpgrade;
