import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameContext';

const achievementsList = [
    { id: 1, name: 'First Game', description: 'Create your first game', condition: (state) => state.games.length > 0 },
    { id: 2, name: 'Hit Maker', description: 'Ship a game with a rating over 90', condition: (state) => state.games.some(game => game.shipped && game.rating > 90) },
    { id: 3, name: 'Millionaire', description: 'Accumulate $1,000,000 in funds', condition: (state) => state.funds >= 1000000 },
    { id: 4, name: 'Studio Expansion', description: 'Hire 10 developers', condition: (state) => state.developers.length >= 10 },
    { id: 5, name: 'Genre Master', description: 'Create a game in every genre', condition: (state) => new Set(state.games.map(game => game.genreId)).size === 8 },
];

function Achievements() {
    const gameContext = useContext(GameContext);
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);

    useEffect(() => {
        const newUnlocked = achievementsList.filter(achievement => 
            !unlockedAchievements.includes(achievement.id) && 
            achievement.condition(gameContext)
        );

        if (newUnlocked.length > 0) {
            setUnlockedAchievements([...unlockedAchievements, ...newUnlocked.map(a => a.id)]);
            newUnlocked.forEach(achievement => {
                alert(`Achievement Unlocked: ${achievement.name}`);
            });
        }
    }, [gameContext, unlockedAchievements]);

    return (
        <div className="achievements">
            <h2>Achievements</h2>
            {achievementsList.map(achievement => (
                <div key={achievement.id} className={unlockedAchievements.includes(achievement.id) ? 'unlocked' : 'locked'}>
                    <h3>{achievement.name}</h3>
                    <p>{achievement.description}</p>
                </div>
            ))}
        </div>
    );
}

export default Achievements;