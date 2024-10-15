import React from 'react';

function GameProgressBar({ game }) {
    const progress = (game.points / 1000) * 100;

    return (
        <div className="w-full bg-kb-grey rounded-full h-2.5 dark:bg-kb-grey mt-2">
            <div 
                className="bg-kb-live-red h-2.5 rounded-full" 
                style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
        </div>
    );
}

export default GameProgressBar;
