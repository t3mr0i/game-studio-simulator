import React from 'react';
import { GameContextProvider } from './context/GameContext';
import GameInterface from './components/GameInterface';

function App() {
  return (
    <GameContextProvider>
      <GameInterface />
    </GameContextProvider>
  );
}

export default App;