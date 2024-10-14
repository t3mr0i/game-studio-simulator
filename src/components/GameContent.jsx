import React, { useState, useContext, useEffect, useRef } from 'react';
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
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  return (
    <div className="h-full flex flex-col bg-kb-white text-kb-black font-sans">
      <header className="bg-kb-black text-kb-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-kb-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-kb-grey px-3 py-1 rounded text-kb-white">Funds: ${funds.toFixed(2)}</span>
        </div>
      </header>
      
      <YearCounter />
      <NewsTicker />
      
      <div className="flex-grow flex overflow-hidden relative">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-kb-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        <aside ref={sidebarRef} className={`w-64 bg-kb-white text-kb-black p-4 overflow-y-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 shadow-lg`}>
          <div className="space-y-6">
            <NewGameForm />
            <DeveloperHiring />
            <Upgrades />
            <ResearchLab />
          </div>
        </aside>
        
        <main className="flex-grow p-4 overflow-y-auto">
          <div className="bg-kb-white rounded-lg shadow-md p-4">
            <div className="flex mb-4 space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'active' ? 'bg-kb-live-red text-kb-black' : 'bg-kb-light-grey text-kb-black hover:bg-kb-grey'}`}
                onClick={() => setActiveTab('active')}
              >
                Active Games
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-kb-live-red text-kb-black' : 'bg-kb-light-grey text-kb-black hover:bg-kb-grey'}`}
                onClick={() => setActiveTab('history')}
              >
                Game History
              </button>
            </div>
            {activeTab === 'active' ? <GameList /> : <GameHistory />}
          </div>
        </main>
      </div>
      
      <footer className="bg-kb-black p-4 flex justify-between">
        <button onClick={saveGameState} className="bg-kb-live-red text-kb-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors">Save Game</button>
        <button onClick={loadGameState} className="bg-kb-grey text-kb-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">Load Game</button>
      </footer>
    </div>
  );
}

export default GameContent;
