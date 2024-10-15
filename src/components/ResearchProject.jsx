import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function ResearchProject({ project }) {
    const { researchPoints, startResearch, activeResearch } = useContext(GameContext);

    return (
        <div className="bg-kb-dark-grey p-3 rounded-lg">
            <h4 className="text-kb-white font-semibold">{project.name}</h4>
            <p className="text-kb-light-grey text-sm mb-1">Cost: {project.cost} RP</p>
            <p className="text-kb-light-grey text-sm mb-2">{project.effect}</p>
            <button 
                onClick={() => startResearch(project)}
                className="w-full bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:bg-kb-grey disabled:cursor-not-allowed"
                disabled={researchPoints < project.cost || activeResearch}
            >
                Start Research
            </button>
        </div>
    );
}

export default ResearchProject;
