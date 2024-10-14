import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function NewsTicker() {
    const { newsItems } = useContext(GameContext);

    return (
        <div className="news-ticker">
            <h3>Industry News</h3>
            <ul>
                {newsItems.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default NewsTicker;
