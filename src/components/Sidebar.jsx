import React from 'react';
import NewGameForm from './NewGameForm';
import DeveloperHiring from './DeveloperHiring';

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <div
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transform lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-30 w-64 bg-game-base-200 overflow-y-auto transition duration-300 ease-in-out lg:translate-x-0`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Controls</h2>
        <NewGameForm />
        <DeveloperHiring />
      </div>
    </div>
  );
}

export default Sidebar;
