import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';

function MarketingCampaigns() {
    const { games, funds, setGames, setFunds } = useContext(GameContext);
    const [selectedGame, setSelectedGame] = useState('');

    const campaigns = [
        { name: 'Social Media', cost: 500, effect: 10 },
        { name: 'YouTube Ads', cost: 1000, effect: 25 },
        { name: 'Influencer Partnership', cost: 2000, effect: 50 },
    ];

    const runCampaign = (campaign) => {
        if (funds >= campaign.cost && selectedGame) {
            setFunds(funds - campaign.cost);
            setGames(games.map(game => 
                game.id === parseInt(selectedGame) 
                    ? { ...game, popularity: game.popularity + campaign.effect }
                    : game
            ));
            alert(`${campaign.name} campaign run successfully for ${games.find(g => g.id === parseInt(selectedGame)).name}!`);
        } else if (!selectedGame) {
            alert('Please select a game for the campaign.');
        } else {
            alert('Not enough funds for this campaign.');
        }
    };

    return (
        <div className="marketing-campaigns">
            <h2>Marketing Campaigns</h2>
            <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
                <option value="">Select a game</option>
                {games.filter(game => game.shipped).map(game => (
                    <option key={game.id} value={game.id}>{game.name}</option>
                ))}
            </select>
            {campaigns.map(campaign => (
                <button key={campaign.name} onClick={() => runCampaign(campaign)}>
                    {campaign.name} (${campaign.cost})
                </button>
            ))}
        </div>
    );
}

export default MarketingCampaigns;
