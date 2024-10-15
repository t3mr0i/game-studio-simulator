import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function Auth() {
    const { signInWithGoogle } = useContext(GameContext);

    return (
        <div className="flex items-center justify-center h-screen bg-kb-black">
            <button
                onClick={signInWithGoogle}
                className="bg-kb-live-red text-kb-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-colors"
            >
                Sign in with Google
            </button>
        </div>
    );
}

export default Auth;
