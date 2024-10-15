import React from 'react';
import { GameContextProvider } from './context/GameContext';
import GameContent from './components/GameContent';

function App() {
    return (
        <GameContextProvider>
            <GameContent />
        </GameContextProvider>
    );
}

export default App;
