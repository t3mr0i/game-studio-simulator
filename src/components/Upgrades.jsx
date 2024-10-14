import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function Upgrades() {
    const { upgradeClickPower, upgradeAutoClick, clickPower, autoClickPower, funds } = useContext(GameContext);

    const clickUpgradeCost = Math.floor(100 * Math.pow(1.1, clickPower));
    const autoClickUpgradeCost = Math.floor(200 * Math.pow(1.15, autoClickPower));

    return (
        <div className="bg-kb-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-kb-black">Upgrades</h2>
            <div className="space-y-4">
                <div className="upgrade-item">
                    <p className="text-kb-black">Click Power: {clickPower}</p>
                    <button 
                        className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                        onClick={upgradeClickPower}
                        disabled={funds < clickUpgradeCost}
                    >
                        Upgrade (${clickUpgradeCost})
                    </button>
                </div>
                <div className="upgrade-item">
                    <p className="text-kb-black">Auto Click Power: {autoClickPower}</p>
                    <button 
                        className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                        onClick={upgradeAutoClick}
                        disabled={funds < autoClickUpgradeCost}
                    >
                        Upgrade (${autoClickUpgradeCost})
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Upgrades;
