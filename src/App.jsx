import React from 'react';
import { GameContextProvider } from './context/GameContext';
import GameContent from './components/GameContent';
import Auth from './components/Auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import SyncStatus from './components/SyncStatus';
import SyncControl from './components/SyncControl';

function App() {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <GameContextProvider>
            {user ? <GameContent /> : <Auth />}
            <ToastContainer />
            <SyncStatus />
            <SyncControl />
        </GameContextProvider>
    );
}

export default App;
