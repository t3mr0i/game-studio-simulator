// src/components/GameShipping.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function GameShipping() {
    const { games, shipGame } = useContext(GameContext);

    if (!games || games.length === 0) {
        return <div>No games available for shipping.</div>;
    }

    return (
        <div>
            {games.map((game, index) => (
                <div key={index}>
                    <button onClick={() => shipGame(game.id)} disabled={game.shipped || game.points < 1000}>
                        Ship {game.name}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default GameShipping;
