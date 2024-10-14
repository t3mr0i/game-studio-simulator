import React, { useContext } from 'react';
import { GameContextProvider, GameContext } from './context/GameContext';
import GameList from './components/GameList';
import NewGameForm from './components/NewGameForm';
import YearCounter from './components/YearCounter';
import NewsTicker from './components/NewsTicker';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function GameContent() {
    const { funds, totalClicks, clickPower, autoClickPower, upgradeClickPower, upgradeAutoClick, prestige, prestigePoints } = useContext(GameContext);

    return (
        <div className="game-container">
            <header className="game-header">
                <h1>Game Dev Clicker</h1>
            </header>
            <div className="funds-display">Funds: ${funds.toFixed(2)}</div>
            <div className="clicks-display">Total Clicks: {totalClicks}</div>
            <YearCounter />
            <NewsTicker />
            <main className="game-main">
                <div className="game-panel left-panel">
                    <NewGameForm />
                    <div className="upgrades">
                        <h2>Upgrades</h2>
                        <button onClick={upgradeClickPower}>Upgrade Click Power (Current: {clickPower})</button>
                        <button onClick={upgradeAutoClick}>Hire Auto-Clicker (Current: {autoClickPower})</button>
                    </div>
                    <div className="prestige">
                        <p>Prestige Points: {prestigePoints}</p>
                        <button onClick={prestige}>Prestige</button>
                    </div>
                </div>
                <div className="game-panel center-panel">
                    <GameList />
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <GameContextProvider>
            <GameContent />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </GameContextProvider>
    );
}

export default App;
