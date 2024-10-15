import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';

function SyncControl() {
  const { isOnline, manualSync, conflicts } = useContext(GameContext);
  const [showConflicts, setShowConflicts] = useState(false);

  const handleManualSync = () => {
    manualSync();
    setShowConflicts(true);
  };

  const handleResolveConflict = (key, choice) => {
    resolveConflict(key, choice);
    setShowConflicts(false);
  };

  return (
    <div className="fixed bottom-16 right-4">
      <button
        onClick={handleManualSync}
        className={`px-4 py-2 rounded ${isOnline ? 'bg-kb-live-red' : 'bg-kb-grey'}`}
        disabled={!isOnline}
      >
        Manual Sync
      </button>
      {showConflicts && conflicts.length > 0 && (
        <div className="mt-4 bg-kb-black p-4 rounded">
          <h3 className="text-kb-white font-bold mb-2">Resolve Conflicts</h3>
          {conflicts.map((conflict, index) => (
            <div key={index} className="mb-2">
              <p className="text-kb-white">{conflict.key}: Local ({conflict.local}) vs Server ({conflict.server})</p>
              <button onClick={() => handleResolveConflict(conflict.key, 'local')} className="mr-2 bg-kb-live-red px-2 py-1 rounded">
                Use Local
              </button>
              <button onClick={() => handleResolveConflict(conflict.key, 'server')} className="bg-kb-grey px-2 py-1 rounded">
                Use Server
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SyncControl;