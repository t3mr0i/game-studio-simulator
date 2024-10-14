import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function SaveLoadMenu() {
    const { saveGameState, loadGameState } = useContext(GameContext);

    return (
        <div className="save-load-menu">
            <button onClick={saveGameState}>Save Game</button>
            <button onClick={loadGameState}>Load Game</button>
        </div>
    );
}

export default SaveLoadMenu;