import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const YearCounter = () => {
    const { gameState } = useContext(GameContext);

    return (
        <div>
            <h2>Year: {gameState.year}</h2>
            <h3>Month: {gameState.month}</h3>
        </div>
    );
};

export default YearCounter;
