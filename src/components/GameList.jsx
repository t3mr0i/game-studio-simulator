// src/components/GameList.jsx
import React, { useContext, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GameContext } from '../context/GameContext';

function GameList() {
    const { activeGames, developGame, releaseGame, clickPower, workers } = useContext(GameContext);
    const [orderedGames, setOrderedGames] = useState(activeGames);

    useEffect(() => {
        setOrderedGames(activeGames);
    }, [activeGames]);

    useEffect(() => {
        const unreleased = orderedGames.filter(game => !game.isReleased);
        const allocatedWorkers = workers.length;
        const workersPerGame = Math.floor(allocatedWorkers / unreleased.length);
        const updatedGames = orderedGames.map(game => ({
            ...game,
            allocatedDevelopers: game.isReleased ? 0 : workersPerGame
        }));
        setOrderedGames(updatedGames);
    }, [workers, orderedGames]);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(orderedGames);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setOrderedGames(items);
    };

    const getStageColor = (stage) => {
        switch(stage) {
            case 'concept': return 'bg-yellow-500';
            case 'pre-production': return 'bg-blue-500';
            case 'production': return 'bg-green-500';
            case 'testing': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="games">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {orderedGames.map((game, index) => (
                            <Draggable key={game.id.toString()} draggableId={game.id.toString()} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                         className="bg-game-base-300 p-4 rounded-lg">
                                        <h3 className="text-xl font-bold">{game.name}</h3>
                                        <p>Genre: {game.genre}</p>
                                        <p>Points: {game.points.toFixed(0)}</p>
                                        <p>Allocated Developers: {game.allocatedDevelopers}</p>
                                        {!game.isReleased ? (
                                            <>
                                                <div className={`text-center p-2 mb-2 ${getStageColor(game.stage)}`}>
                                                    {game.stage}
                                                </div>
                                                <div className="progress-bar">
                                                    <div className="progress" style={{ width: `${Math.min((game.points / 1000) * 100, 100)}%` }}></div>
                                                </div>
                                                <button
                                                    className="btn btn-primary mt-2 w-full"
                                                    onClick={() => developGame(game.id)}
                                                >
                                                    Develop (+{clickPower})
                                                </button>
                                                {game.points >= 1000 && game.stage === 'testing' && (
                                                    <button
                                                        className="btn btn-secondary mt-2 w-full"
                                                        onClick={() => releaseGame(game.id)}
                                                    >
                                                        Release Game
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <p>Rating: {game.rating.toFixed(1)}</p>
                                                <p>Revenue: ${game.revenue.toFixed(2)}</p>
                                                <p>Sales Duration: {game.salesDuration} days</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default GameList;
