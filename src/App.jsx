import React, { useContext } from 'react';
import { GameContextProvider, GameContext } from './context/GameContext';
import GameContent from './components/GameContent';
import Auth from './components/Auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import SyncStatus from './components/SyncStatus';

function AppContent() {
    const [user] = useAuthState(auth);
    const { isOnlineMode, toggleOnlineMode } = useContext(GameContext);

    return (
        <>
            {user ? (
                <GameContent />
            ) : (
                <Auth />
            )}
            <ToastContainer />
            <SyncStatus />
            <button
                onClick={toggleOnlineMode}
                className="fixed bottom-4 left-4 bg-kb-live-red text-kb-white px-4 py-2 rounded"
            >
                {isOnlineMode ? 'Switch to Offline' : 'Switch to Online'}
            </button>
        </>
    );
}

function App() {
    return (
        <GameContextProvider>
            <AppContent />
        </GameContextProvider>
    );
}

export default App;
