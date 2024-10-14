import React, { useContext } from 'react';
import { GameContextProvider, GameContext } from './context/GameContext';
import GameContent from './components/GameContent';
import Sidebar from './components/Sidebar';
import IPBetting from './components/IPBetting';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function AppContent() {
    const { user, signOut } = useContext(GameContext);

    return (
        <div className="flex h-screen bg-game-base-100 text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-game-base-300 p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Game Dev Tycoon</h1>
                    {user ? (
                        <button onClick={signOut} className="btn btn-secondary">Sign Out</button>
                    ) : null}
                </header>
                {user ? (
                    <>
                        <GameContent />
                        <IPBetting />
                    </>
                ) : (
                    <Login />
                )}
            </div>
        </div>
    );
}

function App() {
    return (
        <GameContextProvider>
            <AppContent />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </GameContextProvider>
    );
}

export default App;
