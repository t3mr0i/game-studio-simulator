import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';

const researchProjects = [
    { id: 1, name: '3D Graphics', cost: 5000, duration: 30, effect: 'Increases game quality by 10%' },
    { id: 2, name: 'Online Multiplayer', cost: 10000, duration: 60, effect: 'Increases game popularity by 20%' },
    { id: 3, name: 'AI Enhancement', cost: 15000, duration: 90, effect: 'Increases game rating by 15%' },
    { id: 4, name: 'VR Support', cost: 20000, duration: 120, effect: 'Adds a new VR game option' },
];

function ResearchLab() {
    const { funds, setFunds, games, setGames } = useContext(GameContext);
    const [currentResearch, setCurrentResearch] = useState(null);
    const [researchProgress, setResearchProgress] = useState(0);

    const startResearch = (project) => {
        if (funds >= project.cost) {
            setFunds(funds - project.cost);
            setCurrentResearch(project);
            setResearchProgress(0);

            const interval = setInterval(() => {
                setResearchProgress((progress) => {
                    if (progress >= project.duration) {
                        clearInterval(interval);
                        completeResearch(project);
                        return 0;
                    }
                    return progress + 1;
                });
            }, 1000);
        } else {
            alert('Not enough funds for this research project.');
        }
    };

    const completeResearch = (project) => {
        setGames(games.map(game => {
            switch (project.id) {
                case 1: // 3D Graphics
                    return { ...game, quality: (game.quality || 0) + 10 };
                case 2: // Online Multiplayer
                    return { ...game, popularity: game.popularity + 20 };
                case 3: // AI Enhancement
                    return { ...game, rating: game.rating ? game.rating * 1.15 : game.rating };
                case 4: // VR Support
                    return { ...game, hasVR: true };
                default:
                    return game;
            }
        }));
        setCurrentResearch(null);
        alert(`Research complete: ${project.name}`);
    };

    return (
        <div className="research-lab">
            <h2>Research Lab</h2>
            {currentResearch ? (
                <div>
                    <h3>Current Research: {currentResearch.name}</h3>
                    <p>Progress: {researchProgress} / {currentResearch.duration}</p>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${(researchProgress / currentResearch.duration) * 100}%` }}></div>
                    </div>
                </div>
            ) : (
                <div>
                    <h3>Available Projects</h3>
                    {researchProjects.map(project => (
                        <div key={project.id} className="research-project">
                            <h4>{project.name}</h4>
                            <p>Cost: ${project.cost}</p>
                            <p>Duration: {project.duration} seconds</p>
                            <p>Effect: {project.effect}</p>
                            <button onClick={() => startResearch(project)}>Start Research</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ResearchLab;