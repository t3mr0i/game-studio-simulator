import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { genres } from '../data/genres';

function MarketTrends() {
    const { marketTrends } = useContext(GameContext);

    return (
        <div className="bg-kb-black p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-kb-white">Market Trends</h2>
            <div className="grid grid-cols-2 gap-4">
                {genres.map(genre => (
                    <div key={genre.id} className="flex items-center">
                        <span className="text-kb-white mr-2">{genre.name}:</span>
                        <div className="w-full bg-kb-grey rounded-full h-2.5">
                            <div 
                                className={`h-2.5 rounded-full ${marketTrends[genre.id] > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.abs(marketTrends[genre.id] * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MarketTrends;
