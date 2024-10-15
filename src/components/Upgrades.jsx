import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function Upgrades() {
    const { upgradeClickPower, upgradeAutoClickPower, clickPower, autoClickPower, funds } = useContext(GameContext);

    const clickUpgradeCost = Math.floor(100 * Math.pow(1.5, clickPower));
    const autoClickUpgradeCost = Math.floor(200 * Math.pow(1.5, autoClickPower));

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
                        Upgrade Click Power (${clickUpgradeCost})
                    </button>
                </div>
                <div className="upgrade-item">
                    <p className="text-kb-black">Auto Click Power: {autoClickPower}</p>
                    <button 
                        className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed" 
                        onClick={upgradeAutoClickPower}
                        disabled={funds < autoClickUpgradeCost}
                    >
                        Upgrade Auto Click Power (${autoClickUpgradeCost})
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Upgrades;
