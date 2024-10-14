import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function StudioUpgrades() {
    const { upgradeStudio, studioLevel, funds } = useContext(GameContext);

    const upgradeCost = studioLevel * 1000;

    return (
        <div className="studio-upgrades">
            <h2>Studio Upgrades</h2>
            <p>Current Level: {studioLevel}</p>
            <p>Upgrade Cost: ${upgradeCost}</p>
            <button onClick={upgradeStudio} disabled={funds < upgradeCost}>
                Upgrade Studio
            </button>
            <p>Upgrading your studio increases development speed for all games.</p>
        </div>
    );
}

export default StudioUpgrades;