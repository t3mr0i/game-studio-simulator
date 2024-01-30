// src/components/DeveloperHiring.jsx
import React from 'react';

function DeveloperHiring({ hireDeveloper, funds }) {
    const handleHire = () => {
        const cost = 100; // Set the hiring cost
        if (funds >= cost) {
            hireDeveloper(cost);
        } else {
            alert("Not enough funds to hire a developer");
        }
    };

    return (
        <div>
            <button onClick={handleHire}>Hire Developer</button>
            <p>Available Funds: ${funds}</p>
        </div>
    );
}

export default DeveloperHiring;
