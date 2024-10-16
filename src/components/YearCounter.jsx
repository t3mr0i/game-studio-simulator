import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { GameContext } from '../context/GameContext';

const gameHistory = [
    "1972 - KPong becomes the first commercially successful video game, accidentally starting the ‘arcade era’ and turning tennis into a digital sensation.",
    "1976 - The first video game console, the Magnavox Odyssey, hits the market, introducing home gaming and the concept of ‘couch co-op.’",
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
    "1972 - Pong becomes the first commercially successful video game, accidentally starting the ‘arcade era’ and turning tennis into a digital sensation.",
    "1978 - Space Invaders releases, causing a coin shortage in Japan as players line up to defend Earth from pixelated alien invaders.",
    "1981 - Frogger hops onto the arcade scene, teaching a generation of gamers about the dangers of road crossings.",
    "1982 - Pitfall! releases, making players obsessed with swinging over pixelated alligators and jumping into pixel-perfect pits.",
    "1983 - Dragon’s Lair arrives, pioneering full-motion video in arcades, making it a beautiful but wallet-draining experience.",
    "1984 - The video game crash of 1983 leads to the decline of the arcade industry and the end of many gaming companies.",
    "1985 - Duck Hunt makes the NES Zapper famous, and players develop a love-hate relationship with the snickering dog.",
    "1985 - The NES launches in North America, saving the gaming industry from the crash and bringing beloved franchises like Super Mario and The Legend of Zelda to the forefront.",
    "1986 - The Legend of Zelda releases, introducing players to Hyrule and laying the groundwork for open-world exploration in video games.",
    "1987 - Mega Man debuts, and players fall in love with blasting robots and stealing their powers, spawning a franchise of difficult side-scrolling platformers.",
    "1987 - Street Fighter II popularizes competitive fighting games, leading to the rise of arcade tournaments and competitive play.",
    "1988 - Nintendo's Game Boy debuts, making handheld gaming a reality and creating a portable gaming revolution.",
    "1989 - Prince of Persia introduces rotoscoped animation, bringing realistic movement to gaming and kicking off a franchise with parkour roots.",
    "1989 - Sega releases the Sega Genesis, sparking the first major console war against Nintendo.",
    "1990 - Dr. Mario adds a medical degree to Mario’s resume, making pill-popping puzzles a thing.",
    "1994 - PlayStation launches in Japan, introducing 3D graphics and changing the landscape of gaming forever.",
    "1994 - EarthBound brings quirky humor and a cult following to the RPG genre, proving that baseball bats and aliens can mix.",
    "1995 - Sony sells over 100 million PlayStation consoles, making it the best-selling console of its time.",
    "1995 - Command & Conquer launches, helping establish the real-time strategy genre and making 'Tiberium' a household word.",
    "1995 - Chrono Trigger becomes an RPG masterpiece, delivering time travel, multiple endings, and an unforgettable cast.",
    "1996 - Pokémon Red and Green launch in Japan, igniting a franchise that would go on to become a cultural phenomenon worldwide.",
    "1996 - Resident Evil defines the survival horror genre, giving players nightmares about zombie dogs and limited ammo.",
    "1997 - Final Fantasy VII is released, popularizing RPGs in the West and leading to a new era of storytelling in games.",
    "1997 - GoldenEye 007 releases on N64, creating one of the first truly great multiplayer shooters and ruining friendships with proximity mines.",
    "1998 - Half-Life revolutionizes first-person shooters with immersive storytelling, and players discover that crowbars make excellent problem-solvers.",
    "1999 - Sega announces its exit from the hardware business, marking the end of the Dreamcast era.",
    "1999 - Silent Hill creeps players out with foggy streets and psychological horror, spawning a franchise that still terrifies.",
    "2000 - Diablo II launches, forever cementing the idea that you can never have enough loot or click too many times.",
    "2001 - Halo: Combat Evolved becomes the Xbox's killer app, turning Master Chief into an icon and making 'LAN parties' a thing.",
    "2001 - Grand Theft Auto III breaks ground with its open-world design, letting players cause chaos in Liberty City however they see fit.",
    "2002 - Metroid Prime takes the Metroid series into 3D, blending exploration and shooting to critical acclaim.",
    "2003 - Call of Duty releases, setting the stage for a franchise that will dominate first-person shooters for years to come.",
    "2004 - World of Warcraft launches and redefines the MMORPG, causing millions of players to lose countless hours to Azeroth.",
    "2005 - Shadow of the Colossus redefines what boss battles can be, pitting players against towering giants in a hauntingly beautiful world.",
    "2005 - Xbox 360 launches, introducing online gaming with Xbox Live and setting new standards for console gaming.",
    "2006 - The Wii launches, making motion controls a staple in gaming and bringing a broader audience to video games.",
    "2007 - Bioshock releases, blending first-person action with a philosophical narrative and one of the best plot twists in gaming.",
    "2007 - The release of The Orange Box combines Half-Life 2 with its episodic sequels and Portal, showcasing innovative game design.",
    "2008 - Dead Space brings horror into space, making players dread every shadow and the sound of a distant screech.",
    "2008 - Fallout 3 brings players into a post-apocalyptic open world, revolutionizing the RPG genre once again.",
    "2009 - Minecraft enters early access, beginning its journey to becoming one of the best-selling games in history.",
    "2010 - Mass Effect 2 releases, raising the bar for storytelling in games and making the Normandy crew unforgettable.",
    "2011 - The Elder Scrolls V: Skyrim releases, and players spend hundreds of hours exploring Tamriel, while Fus Ro Dah becomes a household meme.",
    "2012 - Journey releases, capturing the hearts of players with its emotional storytelling and stunning visuals, redefining what games can be.",
    "2013 - The Stanley Parable makes players question the nature of choice in games, leading to a whole new breed of meta-narrative experiences.",
    "2014 - The release of Destiny introduces a blend of MMO and shooter mechanics, with its persistent world and raids becoming a new standard.",
    "2015 - Undertale releases, turning RPG conventions upside down and making players think twice before hitting the 'attack' button.",
    "2015 - The Witcher 3: Wild Hunt sets a new standard for open-world RPGs, introducing players to a world of morally gray choices and Gwent.",
    "2016 - Pokémon GO takes the world by storm, getting players off their couches and into the streets to catch virtual creatures.",
    "2016 - Overwatch launches, popularizing team-based hero shooters and creating a competitive eSports scene.",
    "2017 - Cuphead debuts, challenging players with its brutal difficulty and stunning 1930s-style animation.",
    "2018 - Marvel’s Spider-Man swings onto PS4, giving players the most fun and fluid web-slinging experience ever.",
    "2019 - Sekiro: Shadows Die Twice wins Game of the Year for its intense swordplay and brutal difficulty, teaching players the art of perfect timing.",
    "2019 - The Epic Games Store launches, shaking up the PC gaming market by offering exclusive titles and free games to players.",
    "2020 - Among Us skyrockets in popularity during the pandemic, turning space crewmates into paranoid suspects and fostering countless betrayals.",
    "2020 - Genshin Impact launches, becoming a global hit with its gacha mechanics and open-world exploration, drawing comparisons to Breath of the Wild.",
    "2021 - The rise of NFTs in gaming starts, causing debates around ownership, creativity, and environmental impact.",
    "2021 - Resident Evil Village brings back Ethan Winters and introduces Lady Dimitrescu, instantly making her an internet sensation.",
    "2022 - Elden Ring launches, becoming a critical and commercial success, combining open-world exploration with the challenging combat of Dark Souls.",
    "2022 - Vampire Survivors revives the bullet-hell genre in a minimalistic, addictive way, turning into a viral indie hit.",
    "2022 - The announcement of Microsoft's acquisition of Activision Blizzard causes waves across the gaming industry, impacting future game releases and Xbox's lineup.",
    "2023 - Starfield releases, promising a galaxy-spanning RPG from Bethesda, though its reception leaves some players divided.",
    "2023 - The Legend of Zelda: Tears of the Kingdom releases to widespread acclaim, continuing the open-world magic of Breath of the Wild.",
    "2023 - The digital marketplace landscape shifts as physical game sales decline and subscription services like Xbox Game Pass and PlayStation Plus expand.",
    "2023 - The success of indie games continues to rise, with titles like Hades and Stray receiving critical acclaim and showcasing the potential for smaller studios.",
    "2024 - Lies of P surprises players with its dark take on the Pinocchio story, making puppet fighting a surprising subgenre of Soulslike games.",
    "2024 - Payday 3 launches, bringing back high-octane heists and tactical co-op gameplay for fans of robbing virtual banks.",
    "2024 - Baldur's Gate 3 surpasses all expectations, with players falling in love with its freedom of choice, and romance options with a vampire spawn.",
    "2024 - The release of Final Fantasy VII Rebirth makes fans relive their nostalgia with a modern twist and deep RPG mechanics.",
    "2024 - Alan Wake 2 brings psychological horror back to center stage, offering a haunting narrative that blurs the lines between reality and fiction.",
    "2024 - Assassin's Creed Mirage takes the series back to its roots, offering a smaller, stealth-focused experience reminiscent of the original.",
    "2025 - The first fully immersive VR MMORPG launches, reminiscent of 'Sword Art Online', causing a surge in VR headset sales.",
    "2026 - Artificial Intelligence in games reaches new heights, with NPCs exhibiting unprecedented levels of realistic behavior.",
    "2027 - The first successful brain-computer interface for gaming is released, allowing players to control games with their thoughts.",
    "2028 - Holographic gaming becomes commercially available, projecting game environments into living rooms.",
    "2029 - The line between e-sports and traditional sports blurs as major leagues integrate VR competitions.",
    "2030 - Quantum computing makes its way into gaming, enabling real-time, planet-scale simulations in strategy games."
    ];

function YearCounter() {
    const { gameTime, gameState } = useContext(GameContext);
    const [yearProgress, setYearProgress] = useState(0);
    const [tickerPosition, setTickerPosition] = useState(0);
    const tickerRef = useRef(null);

    useEffect(() => {
        const year = Math.floor(gameTime / 12) + 1972;
        const progress = (gameTime % 12) / 12;
        setYearProgress(progress);
    }, [gameTime]);

    const currentYearEvents = useMemo(() => {
        const events = gameHistory.filter(event => {
            const eventYear = parseInt(event.split(' ')[0]);
            return eventYear === gameState.year;
        });
        // If no events for the current year, return an array with a single "No notable events" message
        return events.length > 0 ? events : [`${gameState.year} - No notable events in the gaming industry this year.`];
    }, [gameState.year]);

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
                    {gameState.year}
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
