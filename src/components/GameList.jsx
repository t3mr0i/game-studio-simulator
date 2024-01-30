// src/components/GameList.jsx
import React from 'react';

function GameList({ games }) {
    return (
        <div>
            {games.map((game, index) => (
                <div key={index}>
                    <h3>{game.name}</h3>
                    <p>Points: {game.points}</p>
                    <p>Status: {game.shipped ? 'Shipped' : 'In Development'}</p>
                </div>
            ))}
        </div>
    );
}

export default GameList;
