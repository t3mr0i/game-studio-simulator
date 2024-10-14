export const saveGame = (gameState) => {
    localStorage.setItem('gameDevTycoonSave', JSON.stringify(gameState));
};

export const loadGame = () => {
    const savedGame = localStorage.getItem('gameDevTycoonSave');
    return savedGame ? JSON.parse(savedGame) : null;
};