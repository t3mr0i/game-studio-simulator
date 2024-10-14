import React from 'react';
import { GameContextProvider } from './context/GameContext';
import GameContent from './components/GameContent';
import Sidebar from './components/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    return (
        <GameContextProvider>
            <div className="flex h-screen bg-game-base-100 text-white">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <GameContent />
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </GameContextProvider>
    );
}

export default App;
