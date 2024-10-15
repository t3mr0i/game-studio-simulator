import React from 'react';
import StudioManagement from './StudioManagement';
import NewGameForm from './NewGameForm';
import DeveloperHiring from './DeveloperHiring';
import Upgrades from './Upgrades';
import ResearchLab from './ResearchLab';
import SaveGameManager from './SaveGameManager';
import TimeControl from './TimeControl';

function Sidebar({ isOpen, setIsOpen }) {
    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
            <div
                className={`${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } transform lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-50 w-64 bg-kb-black text-kb-white overflow-y-auto transition duration-300 ease-in-out lg:translate-x-0`}
            >
                <div className="p-4 space-y-6">
                    <TimeControl />
                    <StudioManagement />
                    <NewGameForm />
                    <DeveloperHiring />
                    <Upgrades />
                    <ResearchLab />
                    <SaveGameManager />
                </div>
            </div>
        </>
    );
}

export default Sidebar;
