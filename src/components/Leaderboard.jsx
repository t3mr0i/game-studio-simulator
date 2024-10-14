import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const leaderboardRef = ref(db, 'leaderboard');
        onValue(leaderboardRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const sortedLeaderboard = Object.entries(data)
                    .sort(([, a], [, b]) => b.funds - a.funds)
                    .slice(0, 10);
                setLeaderboard(sortedLeaderboard);
            }
        });
    }, []);

    return (
        <div className="leaderboard">
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.map(([userId, userData], index) => (
                    <li key={userId}>
                        {index + 1}. {userData.name}: ${userData.funds.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Leaderboard;
