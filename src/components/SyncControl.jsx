import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';

function SyncControl() {
  const { isOnline, manualSync, conflicts, resolveConflict } = useContext(GameContext);
  const [showConflicts, setShowConflicts] = useState(false);

  const handleManualSync = () => {
    manualSync();
    setShowConflicts(true);
  };

  const handleResolveConflict = (key, choice) => {
    resolveConflict(key, choice);
    setShowConflicts(false);
  };

  return null

}

export default SyncControl;
