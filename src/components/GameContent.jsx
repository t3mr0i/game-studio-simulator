import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import GameList from './GameList';
import GameHistory from './GameHistory';
import YearCounter from './YearCounter';
import NewsTicker from './NewsTicker';
import Upgrades from './Upgrades';
import ResearchLab from './ResearchLab';
import DeveloperHiring from './DeveloperHiring';
import NewGameForm from './NewGameForm';

function GameContent() {
  const { funds, totalClicks, saveGameState, loadGameState } = useContext(GameContext);
  const [activeTab, setActiveTab] = useState('active');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-gray-100 text-gray-800">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 lg:hidden"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold">Game Dev Tycoon</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-blue-500 px-3 py-1 rounded">Funds: ${funds.toFixed(2)}</span>
          <span className="bg-blue-500 px-3 py-1 rounded">Clicks: {totalClicks}</span>
        </div>
      </header>
      
      <YearCounter />
      <NewsTicker />
      
      <div className="flex-grow flex overflow-hidden">
        <aside className={`w-64 bg-gray-200 p-4 overflow-y-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="space-y-4">
            <NewGameForm />
            <DeveloperHiring />
            <Upgrades />
            <ResearchLab />
          </div>
        </aside>
        
        <main className="flex-grow p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex mb-4">
              <button 
                className={`px-4 py-2 rounded-tl-lg rounded-tr-lg ${activeTab === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('active')}
              >
                Active Games
              </button>
              <button 
                className={`px-4 py-2 rounded-tl-lg rounded-tr-lg ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('history')}
              >
                Game History
              </button>
            </div>
            {activeTab === 'active' ? <GameList /> : <GameHistory />}
          </div>
        </main>
      </div>
      
      <footer className="bg-gray-300 p-4 flex justify-between">
        <button onClick={saveGameState} className="bg-green-500 text-white px-4 py-2 rounded">Save Game</button>
        <button onClick={loadGameState} className="bg-yellow-500 text-white px-4 py-2 rounded">Load Game</button>
      </footer>
    </div>
  );
}

export default GameContent;
