import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function Upgrades() {
    const { gameState, upgradeClickPower } = useContext(GameContext);
    const { clickPower, money } = gameState;

    const clickUpgradeCost = Math.floor(100 * Math.pow(1.5, clickPower));

    return (
        <div className="bg-kb-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-kb-black">Upgrades</h2>
            <div className="space-y-4">
                <div className="upgrade-item">
                    <p className="text-kb-black">Click Power: {clickPower}</p>
                    <button 
                        className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                        onClick={upgradeClickPower}
                        disabled={money < clickUpgradeCost}
                    >
                        Upgrade Click Power (${clickUpgradeCost})
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Upgrades;
