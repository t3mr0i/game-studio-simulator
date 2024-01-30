// src/components/GameShipping.jsx
import React from 'react';

function GameShipping({ games, shipGame }) {
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
