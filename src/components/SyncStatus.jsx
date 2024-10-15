import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function SyncStatus() {
  const { isOnline, isOnlineMode } = useContext(GameContext);

  return (
    <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} text-kb-white`}>
      {isOnlineMode ? (isOnline ? 'Online' : 'Offline (Will sync when online)') : 'Offline Mode'}
    </div>
  );
}

export default SyncStatus;
