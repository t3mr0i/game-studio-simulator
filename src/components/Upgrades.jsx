import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function Upgrades() {
    const { upgradeClickPower, upgradeAutoClick, clickPower, autoClickPower, funds } = useContext(GameContext);

    const clickUpgradeCost = Math.floor(100 * Math.pow(1.1, clickPower));
    const autoClickUpgradeCost = Math.floor(200 * Math.pow(1.15, autoClickPower));

    return (
        <div className="upgrades">
            <h2 className="text-xl font-bold mb-2">Upgrades</h2>
            <div className="upgrade-item">
                <p>Click Power: {clickPower}</p>
                <button 
                    className="btn btn-secondary mt-2" 
                    onClick={upgradeClickPower}
                    disabled={funds < clickUpgradeCost}
                >
                    Upgrade (${clickUpgradeCost})
                </button>
            </div>
            <div className="upgrade-item">
                <p>Auto Click Power: {autoClickPower}</p>
                <button 
                    className="btn btn-secondary mt-2" 
                    onClick={upgradeAutoClick}
                    disabled={funds < autoClickUpgradeCost}
                >
                    Upgrade (${autoClickUpgradeCost})
                </button>
            </div>
        </div>
    );
}

export default Upgrades;
