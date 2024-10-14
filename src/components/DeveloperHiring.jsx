// src/components/DeveloperHiring.jsx
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function DeveloperHiring() {
    const { hireWorker, workers, funds } = useContext(GameContext);

    return (
        <div className="developer-hiring">
            <h2 className="text-xl font-bold mb-2">Hire Developers</h2>
            <p>Available Funds: ${funds.toFixed(2)}</p>
            <p>Total Developers: {workers ? workers.length : 0}</p>
            <button className="btn btn-primary mt-2" onClick={() => hireWorker('junior')}>Hire Junior ($1000)</button>
            <button className="btn btn-primary mt-2" onClick={() => hireWorker('senior')}>Hire Senior ($5000)</button>
            <button className="btn btn-primary mt-2" onClick={() => hireWorker('expert')}>Hire Expert ($10000)</button>

        </div>
    );
}

export default DeveloperHiring;
