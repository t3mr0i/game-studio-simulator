import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function IPBetting() {
    const { availableIPs, betOnIP, funds } = useContext(GameContext);

    return (
        <div className="ip-betting">
            <h2>Available IPs for Betting</h2>
            {availableIPs.map(ip => (
                <div key={ip.id} className="ip-item">
                    <span>{ip.name}</span>
                    <button onClick={() => betOnIP(ip.id)} disabled={funds < 1000}>
                        Bet on IP ($1000)
                    </button>
                </div>
            ))}
        </div>
    );
}

export default IPBetting;
