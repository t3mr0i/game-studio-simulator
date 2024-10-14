// src/components/DeveloperHiring.jsx
import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

function DeveloperHiring() {
    const { hireDeveloper, funds } = useContext(GameContext);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleHire = (type) => {
        if (cooldown === 0) {
            hireDeveloper(type);
            setCooldown(30); // 30 second cooldown
        } else {
            alert(`You can hire again in ${cooldown} seconds`);
        }
    };

    return (
        <div className="developer-hiring">
            <h2>Hire Developers</h2>
            <p>Available Funds: ${funds}</p>
            <button onClick={() => handleHire('junior')} disabled={cooldown > 0}>Hire Junior ($100)</button>
            <button onClick={() => handleHire('senior')} disabled={cooldown > 0}>Hire Senior ($250)</button>
            <button onClick={() => handleHire('expert')} disabled={cooldown > 0}>Hire Expert ($500)</button>
            {cooldown > 0 && <p>Hiring cooldown: {cooldown}s</p>}
        </div>
    );
}

export default DeveloperHiring;
