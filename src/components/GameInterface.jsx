// src/components/GameInterface.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import NewGameForm from './NewGameForm';
import DeveloperHiring from './DeveloperHiring';
import GameList from './GameList';
import GameShipping from './GameShipping';
// Import Tailwind CSS classes

function GameInterface() {
    const { games, developers, funds } = useContext(GameContext);

    return (
        <div className="game-interface">
            <NewGameForm />
            <DeveloperHiring />
            <GameList />
            <GameShipping />
            {/* Additional UI elements with Tailwind CSS classes */}
        </div>
    );
}

export default GameInterface;
