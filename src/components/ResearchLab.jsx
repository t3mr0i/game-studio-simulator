import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

const allResearchProjects = [
    { id: 1, name: '2D Graphics', cost: 5000, duration: 30, effect: 'Increases game quality by 10%', yearAvailable: 1972 },
    { id: 2, name: 'Basic Sound', cost: 7000, duration: 45, effect: 'Adds simple sound effects to games', yearAvailable: 1975 },
    { id: 3, name: 'Color Graphics', cost: 10000, duration: 60, effect: 'Enables color in games', yearAvailable: 1979 },
    { id: 4, name: '3D Graphics', cost: 15000, duration: 90, effect: 'Allows creation of 3D games', yearAvailable: 1992 },
    { id: 5, name: 'Online Multiplayer', cost: 20000, duration: 120, effect: 'Enables online multiplayer features', yearAvailable: 1997 },
    { id: 6, name: 'Mobile Development', cost: 25000, duration: 150, effect: 'Allows development of mobile games', yearAvailable: 2007 },
    { id: 7, name: 'VR Support', cost: 30000, duration: 180, effect: 'Enables Virtual Reality game development', yearAvailable: 2016 },
];

function ResearchLab() {
    const { funds, setFunds, gameTime } = useContext(GameContext);
    const [currentResearch, setCurrentResearch] = useState(null);
    const [researchProgress, setResearchProgress] = useState(0);
    const [availableProjects, setAvailableProjects] = useState([]);

    const currentYear = Math.floor(gameTime / 60) + 1972;

    useEffect(() => {
        setAvailableProjects(allResearchProjects.filter(project => project.yearAvailable <= currentYear));
    }, [currentYear]);

    const startResearch = (project) => {
        if (funds >= project.cost) {
            setFunds(prevFunds => prevFunds - project.cost);
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
        // Implement the effects of completed research here
        alert(`Research complete: ${project.name}`);
        setCurrentResearch(null);
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
                    {availableProjects.map(project => (
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
