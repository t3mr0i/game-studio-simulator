// src/components/GameInterface.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import GameShipping from './GameShipping';
// Import Tailwind CSS classes

function GameInterface() {
    const { funds } = useContext(GameContext);

    return (
        <div className="game-interface">
            <p>Available Funds: ${funds}</p>
            <GameShipping />
        </div>
    );
}

export default GameInterface;
