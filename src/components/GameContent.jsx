import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import GameList from './GameList';
import YearCounter from './YearCounter';
import NewsTicker from './NewsTicker';
import Upgrades from './Upgrades';
import ResearchLab from './ResearchLab';

function GameContent() {
  const { funds, totalClicks } = useContext(GameContext);

  return (
    <div className="h-full flex flex-col">
      <header className="bg-game-base-300 p-4 flex justify-between items-center">
        <div>
          <span className="mr-4">Funds: ${funds.toFixed(2)}</span>
          <span>Total Clicks: {totalClicks}</span>
        </div>
      </header>
      <YearCounter />
      <NewsTicker />
      <div className="flex-grow overflow-auto p-4">
        <GameList />
      </div>
      <footer className="bg-game-base-300 p-4">
        <Upgrades />
        <ResearchLab />
      </footer>
    </div>
  );
}

export default GameContent;
