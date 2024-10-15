import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';

function SyncOfflineData() {
    const { isOnline, isOnlineMode, user, saveGameState, loadGameState } = useContext(GameContext);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        if (!isOnline || !user) return;

        setIsSyncing(true);
        const offlineData = JSON.parse(localStorage.getItem('offlineGameState') || '{}');
        const onlineData = await loadGameState();

        // Implement your merging logic here
        // This is a simple example, you might need more complex logic depending on your data structure
        const mergedData = {
            ...onlineData,
            ...offlineData,
            funds: Math.max(onlineData.funds || 0, offlineData.funds || 0),
            // Add more merging logic for other properties
        };

        await saveGameState(mergedData);
        localStorage.removeItem('offlineGameState');
        setIsSyncing(false);
    };

    if (!isOnline || isOnlineMode || !user) return null;

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className="fixed bottom-16 left-4 bg-kb-live-red text-kb-white px-4 py-2 rounded"
        >
            {isSyncing ? 'Syncing...' : 'Sync Offline Data'}
        </button>
    );
}

export default SyncOfflineData;
