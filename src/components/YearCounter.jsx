import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { GameContext } from '../context/GameContext';

const gameHistory = [
"1972 - Pong becomes the first commercially successful video game, accidentally starting the 'arcade era' and turning tennis into a digital sensation.",
"1976 - The first video game console, the Magnavox Odyssey, hits the market, introducing home gaming and the concept of 'couch co-op.'",
"1980 - Pac-Man fever sweeps the globe; ghosts Inky, Blinky, Pinky, and Clyde become household names.",
"1983 - The video game crash of 1983 leads to the decline of the arcade industry and the end of many gaming companies.",
"1984 - Tetris is created by Russian programmer Alexey Pajitnov, leading to a puzzle phenomenon that will span decades.",
"1985 - The NES launches in North America, saving the gaming industry from the crash and bringing beloved franchises like Super Mario and The Legend of Zelda to the forefront.",
"1986 - The Legend of Zelda releases, introducing players to Hyrule and laying the groundwork for open-world exploration in video games.",
"1987 - Street Fighter II popularizes competitive fighting games, leading to the rise of arcade tournaments and competitive play.",
"1988 - Nintendo's Game Boy debuts, making handheld gaming a reality and creating a portable gaming revolution.",
"1989 - Sega releases the Sega Genesis, sparking the first major console war against Nintendo.",
"1994 - PlayStation launches in Japan, introducing 3D graphics and changing the landscape of gaming forever.",
"1995 - Sony sells over 100 million PlayStation consoles, making it the best-selling console of its time.",
"1996 - Pokémon Red and Green launch in Japan, igniting a franchise that would go on to become a cultural phenomenon worldwide.",
"1997 - Final Fantasy VII is released, popularizing RPGs in the West and leading to a new era of storytelling in games.",
"1999 - Sega announces its exit from the hardware business, marking the end of the Dreamcast era.",
"2000 - The PlayStation 2 launches, quickly becoming the best-selling console of all time with a library of iconic games.",
"2003 - Call of Duty releases, setting the stage for a franchise that will dominate first-person shooters for years to come.",
"2005 - Xbox 360 launches, introducing online gaming with Xbox Live and setting new standards for console gaming.",
"2006 - The Wii launches, making motion controls a staple in gaming and bringing a broader audience to video games.",
"2007 - The release of The Orange Box combines Half-Life 2 with its episodic sequels and Portal, showcasing innovative game design.",
"2025 - The first fully immersive VR MMORPG launches, reminiscent of 'Sword Art Online', causing a surge in VR headset sales.",
"2026 - Artificial Intelligence in games reaches new heights, with NPCs exhibiting unprecedented levels of realistic behavior.",
"2027 - The first successful brain-computer interface for gaming is released, allowing players to control games with their thoughts.",
"2028 - Holographic gaming becomes commercially available, projecting game environments into living rooms.",
"2029 - The line between e-sports and traditional sports blurs as major leagues integrate VR competitions.",
"2030 - Quantum computing makes its way into gaming, enabling real-time, planet-scale simulations in strategy games."
];

function YearCounter() {
    const { gameTime } = useContext(GameContext);
    const [currentYear, setCurrentYear] = useState(1972);
    const [yearProgress, setYearProgress] = useState(0);
    const [tickerPosition, setTickerPosition] = useState(0);
    const tickerRef = useRef(null);

    useEffect(() => {
        const totalMonths = Number(gameTime);
        const year = Math.floor(totalMonths / 12) + 1972;
        const progress = (totalMonths % 12) / 12;
        setCurrentYear(year);
        setYearProgress(progress);
    }, [gameTime]);

    const currentYearEvents = useMemo(() => {
        const events = gameHistory.filter(event => {
            const eventYear = parseInt(event.split(' ')[0]);
            return eventYear === currentYear;
        });
        // If no events for the current year, use all events
        return events.length > 0 ? events : gameHistory;
    }, [currentYear]);

    useEffect(() => {
        const ticker = tickerRef.current;
        if (!ticker) return;

        const speed = 60; // Pixels per second
        let animationFrameId;
        let startTime;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const tickerWidth = ticker.offsetWidth;
            const contentWidth = ticker.scrollWidth / 2; // Divide by 2 because content is duplicated

            const newPosition = -((elapsed * speed) / 1000) % contentWidth;
            setTickerPosition(newPosition);

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [currentYearEvents]);

    const tickerStyle = {
        transform: `translateX(${tickerPosition}px)`,
        whiteSpace: 'nowrap',
        display: 'inline-block',
        transition: 'transform 0.1s linear',
    };

    const gradientMaskStyle = {
        maskImage: 'linear-gradient(to right, transparent, black 20px, black)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 20px, black)',
    };

    const progressBarStyle = {
        width: `${yearProgress * 100}%`,
        height: '4px',
        backgroundColor: 'white',
        transition: 'width 0.1s linear',
    };

    return (
        <div className="bg-kb-black text-white p-2">
            <div className="flex items-center">
                <div className="mr-1 text-2xl font-bold min-w-[70px] relative">
                    {isNaN(currentYear) ? 1972 : currentYear}
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-700 h-1">
                        <div style={progressBarStyle}></div>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden" style={gradientMaskStyle}>
                    <div ref={tickerRef} style={tickerStyle}>
                        {currentYearEvents.map((event, index) => (
                            <span key={index} className="mr-8">{event}</span>
                        ))}
                        {currentYearEvents.map((event, index) => (
                            <span key={`repeat-${index}`} className="mr-8">{event}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default YearCounter;
