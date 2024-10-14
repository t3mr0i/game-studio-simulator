import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

const tutorialSteps = [
    { id: 1, text: "Welcome to Game Dev Tycoon! Let's start by creating your first game.", target: '.new-game-form' },
    { id: 2, text: "Great! Now let's hire a developer to work on your game.", target: '.developer-hiring' },
    { id: 3, text: "Your game is in development. Keep an eye on its progress in the game list.", target: '.game-list' },
    { id: 4, text: "Once your game is ready, you can ship it to start earning revenue.", target: '.game-list' },
    { id: 5, text: "As you earn money, you can upgrade your studio to increase productivity.", target: '.studio-upgrades' },
    { id: 6, text: "Don't forget to market your games to increase their popularity!", target: '.marketing-campaigns' },
    { id: 7, text: "Keep an eye out for random events that can affect your studio.", target: '.game-events' },
    { id: 8, text: "Congratulations! You've completed the tutorial. Good luck with your game development studio!" },
];

function TutorialManager() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isTutorialActive, setIsTutorialActive] = useState(true);
    const { games, developers } = useContext(GameContext);

    useEffect(() => {
        if (!isTutorialActive) return;

        if (currentStep === 0 && games.length > 0) setCurrentStep(1);
        if (currentStep === 1 && developers.length > 0) setCurrentStep(2);
        if (currentStep === 2 && games.some(game => game.points > 0)) setCurrentStep(3);
        if (currentStep === 3 && games.some(game => game.shipped)) setCurrentStep(4);
        // Add more conditions for progressing through tutorial steps
    }, [isTutorialActive, currentStep, games, developers]);

    const handleNextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsTutorialActive(false);
        }
    };

    if (!isTutorialActive) return null;

    const currentTutorialStep = tutorialSteps[currentStep];

    return (
        <div className="tutorial-overlay">
            <div className="tutorial-box">
                <p>{currentTutorialStep.text}</p>
                <button onClick={handleNextStep}>Next</button>
            </div>
            {currentTutorialStep.target && (
                <div className="tutorial-highlight" style={{
                    position: 'absolute',
                    // You'll need to calculate the position of the target element
                    // and set the appropriate top, left, width, and height here
                }}></div>
            )}
        </div>
    );
}

export default TutorialManager;