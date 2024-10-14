import React from 'react';
import { GameContextProvider } from './context/GameContext';
import GameInterface from './components/GameInterface';
import DeveloperHiring from './components/DeveloperHiring';
import GameList from './components/GameList';
import NewGameForm from './components/NewGameForm';
import StudioUpgrades from './components/StudioUpgrades';
import MarketingCampaigns from './components/MarketingCampaigns';
import GameEvents from './components/GameEvents';
import Achievements from './components/Achievements';
import SaveLoadMenu from './components/SaveLoadMenu';
import './App.css';

function App() {
  return (
    <GameContextProvider>
      <div className="game-container">
        <header className="game-header">
          <h1>Game Dev Tycoon</h1>
          <SaveLoadMenu />
        </header>
        <main className="game-main">
          <div className="game-panel left-panel">
            <NewGameForm />
            <DeveloperHiring />
            <StudioUpgrades />
          </div>
          <div className="game-panel center-panel">
            <GameList />
          </div>
          <div className="game-panel right-panel">
            <MarketingCampaigns />
            <GameEvents />
            <Achievements />
          </div>
        </main>
        <footer className="game-footer">
          <GameInterface />
        </footer>
      </div>
    </GameContextProvider>
  );
}

export default App;