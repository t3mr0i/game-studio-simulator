// src/components/DeveloperHiring.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function DeveloperHiring() {
    const { hireDeveloper, fireDeveloper, funds, developers } = useContext(GameContext);

    const handleHire = (type) => {
        hireDeveloper(type);
    };

    const handleFire = (id) => {
        fireDeveloper(id);
    };

    return (
        <div className="developer-hiring">
            <h2>Manage Developers</h2>
            <p>Available Funds: ${funds}</p>
            <p>Total Developers: {developers.length}</p>
            <button onClick={() => handleHire('junior')}>Hire Junior ($200)</button>
            <button onClick={() => handleHire('senior')}>Hire Senior ($500)</button>
            <button onClick={() => handleHire('expert')}>Hire Expert ($1000)</button>
            <h3>Current Developers:</h3>
            {developers.map((dev, index) => (
                <div key={index}>
                    <span>{dev.type} Developer</span>
                    <button onClick={() => handleFire(dev.id)}>Fire</button>
                </div>
            ))}
        </div>
    );
}

export default DeveloperHiring;
