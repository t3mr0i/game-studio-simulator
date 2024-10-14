import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

const allResearchProjects = [
    { id: 1, name: '2D Sprite-Based Graphics', cost: 5000, duration: 30, effect: 'Increases game quality by 10%, adds sprite-based visual capabilities', yearAvailable: 1972 },
    { id: 2, name: 'Basic Sound Effects', cost: 7000, duration: 45, effect: 'Adds basic sound effects and simple audio to games', yearAvailable: 1975 },
    { id: 3, name: 'Color Graphics', cost: 10000, duration: 60, effect: 'Introduces full color support, significantly improving visual appeal', yearAvailable: 1979 },
    { id: 4, name: '16-bit Graphics Processing', cost: 12000, duration: 70, effect: 'Enhances graphical fidelity, allowing more detailed sprites and backgrounds', yearAvailable: 1985 },
    { id: 5, name: 'Advanced Sound Engine', cost: 9000, duration: 50, effect: 'Adds multi-channel audio and high-quality music to games', yearAvailable: 1987 },
    { id: 6, name: 'Physics Engine', cost: 15000, duration: 90, effect: 'Introduces basic physics-based interactions like gravity, collision, and object movement', yearAvailable: 1990 },
    { id: 7, name: '3D Graphics Engine', cost: 18000, duration: 100, effect: 'Enables 3D rendering, allowing for polygonal models and environments', yearAvailable: 1992 },
    { id: 8, name: 'Procedural Generation', cost: 14000, duration: 75, effect: 'Enables randomly generated content, allowing dynamic game worlds and levels', yearAvailable: 1993 },
    { id: 9, name: 'Online Multiplayer Networking', cost: 20000, duration: 120, effect: 'Adds functionality for online multiplayer games and lobbies', yearAvailable: 1997 },
    { id: 10, name: 'AI Pathfinding', cost: 11000, duration: 65, effect: 'Improves NPC behavior by enabling smarter movement and decision-making', yearAvailable: 1999 },
    { id: 11, name: 'Physics-Based Destruction', cost: 22000, duration: 130, effect: 'Allows for destructible environments with realistic damage simulation', yearAvailable: 2002 },
    { id: 12, name: 'Mobile Game Development Framework', cost: 25000, duration: 150, effect: 'Enables development of mobile games with cross-platform compatibility', yearAvailable: 2007 },
    { id: 13, name: 'Advanced AI Machine Learning', cost: 30000, duration: 180, effect: 'Integrates machine learning for more adaptive AI behaviors and personalized gameplay', yearAvailable: 2011 },
    { id: 14, name: 'Augmented Reality (AR) Integration', cost: 32000, duration: 200, effect: 'Allows for games with AR features, overlaying digital content on the real world', yearAvailable: 2014 },
    { id: 15, name: 'Virtual Reality (VR) Development', cost: 30000, duration: 180, effect: 'Enables full VR support, allowing immersive 3D experiences', yearAvailable: 2016 },
    { id: 16, name: 'Cloud Gaming Infrastructure', cost: 35000, duration: 210, effect: 'Supports cloud gaming, allowing players to stream games from powerful servers', yearAvailable: 2018 },
    { id: 17, name: 'Blockchain Integration', cost: 40000, duration: 220, effect: 'Adds support for decentralized gaming economies and NFTs', yearAvailable: 2021 },
    { id: 18, name: 'Neural Network-Based AI', cost: 45000, duration: 240, effect: 'Uses neural networks to simulate complex AI behaviors, such as self-learning NPCs', yearAvailable: 2023 },
    { id: 19, name: 'Quantum Computing Optimizations', cost: 60000, duration: 270, effect: 'Leverages quantum computing for unparalleled optimization in game simulations and rendering', yearAvailable: 2025 },
    { id: 20, name: 'Holographic Display Support', cost: 70000, duration: 300, effect: 'Enables holographic gaming experiences using advanced 3D projection technology', yearAvailable: 2030 },
    { id: 21, name: 'Ray Tracing', cost: 55000, duration: 240, effect: 'Enables realistic lighting, reflections, and shadows in 3D games', yearAvailable: 2023 },
{ id: 22, name: '4K Ultra-HD Support', cost: 45000, duration: 220, effect: 'Optimizes games for 4K resolution displays, enhancing visual fidelity', yearAvailable: 2015 },
{ id: 23, name: 'Voice Recognition Controls', cost: 20000, duration: 100, effect: 'Adds voice control features, allowing players to interact via speech', yearAvailable: 2010 },
{ id: 24, name: 'Advanced Cloth Simulation', cost: 28000, duration: 140, effect: 'Simulates realistic cloth movement and physics, improving character animations', yearAvailable: 2012 },
{ id: 25, name: 'Full Body Motion Capture', cost: 35000, duration: 180, effect: 'Supports realistic character animations using motion capture technology', yearAvailable: 2009 },
{ id: 26, name: 'Spatial Audio', cost: 32000, duration: 160, effect: 'Provides 3D positional sound for immersive audio experiences', yearAvailable: 2017 },
{ id: 27, name: 'Dynamic Weather Systems', cost: 30000, duration: 150, effect: 'Adds real-time weather changes that affect gameplay and visuals', yearAvailable: 2008 },
{ id: 28, name: 'Advanced Particle Effects', cost: 24000, duration: 130, effect: 'Improves effects like smoke, fire, and explosions with more realistic particle simulation', yearAvailable: 2006 },
{ id: 29, name: 'Facial Animation System', cost: 27000, duration: 140, effect: 'Allows for detailed and realistic facial expressions in character models', yearAvailable: 2013 },
{ id: 30, name: 'Haptic Feedback Integration', cost: 33000, duration: 180, effect: 'Enables tactile feedback for controllers, enhancing player immersion', yearAvailable: 2019 },
{ id: 31, name: 'Emotion-Driven AI', cost: 42000, duration: 220, effect: 'Develops NPCs with emotional responses that change based on player interaction', yearAvailable: 2024 },
{ id: 32, name: 'Interactive Narrative Systems', cost: 36000, duration: 190, effect: 'Enables dynamic storylines that evolve based on player choices', yearAvailable: 2020 },
{ id: 33, name: 'Multisensory Feedback', cost: 50000, duration: 250, effect: 'Introduces immersive feedback systems combining visual, auditory, and haptic stimuli', yearAvailable: 2027 },
{ id: 34, name: 'AI-Based Content Generation', cost: 48000, duration: 230, effect: 'Uses AI to procedurally generate levels, characters, and quests dynamically', yearAvailable: 2022 },
{ id: 35, name: 'Neural Interface Control', cost: 65000, duration: 280, effect: 'Allows direct control of games via neural interfaces, bypassing traditional input devices', yearAvailable: 2035 },
{ id: 36, name: 'Realistic Water Physics', cost: 29000, duration: 150, effect: 'Simulates realistic water flow, waves, and buoyancy in aquatic environments', yearAvailable: 2011 },
{ id: 37, name: 'Real-Time Global Illumination', cost: 56000, duration: 250, effect: 'Adds dynamic global lighting to improve overall scene lighting and reflections', yearAvailable: 2024 },
{ id: 38, name: 'Biometric Feedback Systems', cost: 47000, duration: 240, effect: 'Utilizes player biometric data (heart rate, emotions) to adjust gameplay in real-time', yearAvailable: 2028 },
{ id: 39, name: 'Massive Multiplayer Scaling', cost: 38000, duration: 200, effect: 'Optimizes for large-scale multiplayer games, supporting thousands of concurrent players', yearAvailable: 2020 },
{ id: 40, name: 'Advanced Hair Simulation', cost: 26000, duration: 130, effect: 'Improves the realism of character hair with dynamic movement and physics', yearAvailable: 2015 },

];

function ResearchLab() {
    const { researchPoints, setResearchPoints, gameTime } = useContext(GameContext);
    const [availableProjects, setAvailableProjects] = useState([]);

    const currentYear = Math.floor(gameTime / 360) + 1972; // Slowed down game time

    useEffect(() => {
        const filteredProjects = allResearchProjects.filter(project => project.yearAvailable <= currentYear);
        setAvailableProjects(filteredProjects.slice(-5)); // Only show the latest 5 projects
    }, [currentYear]);

    const startResearch = (project) => {
        if (researchPoints >= project.cost) {
            setResearchPoints(prevPoints => prevPoints - project.cost);
            // Implement the effects of completed research here
            alert(`Research complete: ${project.name}`);
        } else {
            alert('Not enough research points for this project.');
        }
    };

    return (
        <div className="research-lab">
            <h2 className="text-xl font-bold mb-2">Research Lab</h2>
            <p>Research Points: {researchPoints.toFixed(1)}</p>
            <div>
                <h3>Available Projects</h3>
                {availableProjects.map(project => (
                    <div key={project.id} className="research-project">
                        <h4>{project.name}</h4>
                        <p>Cost: {project.cost} RP</p>
                        <p>Effect: {project.effect}</p>
                        <button onClick={() => startResearch(project)}>Start Research</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ResearchLab;