import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { GameContext } from '../context/GameContext';

const gameHistory = [
"1972 - Pong becomes the first commercially successful video game, accidentally starting the ‘arcade era’ and turning tennis into a digital sensation.",
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
"2008 - Fallout 3 brings players into a post-apocalyptic open world, revolutionizing the RPG genre once again.",
"2009 - Minecraft enters early access, beginning its journey to becoming one of the best-selling games in history.",
"2012 - Journey releases, capturing the hearts of players with its emotional storytelling and stunning visuals, redefining what games can be.",
"2014 - The release of Destiny introduces a blend of MMO and shooter mechanics, with its persistent world and raids becoming a new standard.",
"2015 - Fallout 4 sets new records for pre-orders and sales, bringing players back to the wasteland in a massively popular RPG.",
"2016 - Overwatch launches, popularizing team-based hero shooters and creating a competitive eSports scene.",
"2019 - The Epic Games Store launches, shaking up the PC gaming market by offering exclusive titles and free games to players.",
"2021 - The rise of NFTs in gaming starts, causing debates around ownership, creativity, and environmental impact.",
"2022 - The announcement of Microsoft's acquisition of Activision Blizzard causes waves across the gaming industry, impacting future game releases and Xbox's lineup.",
"2023 - The digital marketplace landscape shifts as physical game sales decline and subscription services like Xbox Game Pass and PlayStation Plus expand.",
"2023 - The success of indie games continues to rise, with titles like Hades and Stray receiving critical acclaim and showcasing the potential for smaller studios.",
"2024 - Microsoft announces plans to enhance the Xbox Game Pass, focusing on integrating AI to personalize player experiences and recommendations.",
"2024 - The gaming industry sees a major push towards inclusivity, with more games featuring diverse characters and narratives, changing the face of storytelling in games.",
"1972 - Pong becomes the first commercially successful video game, accidentally starting the 'arcade era' and turning tennis into a digital sensation.",
"1978 - Space Invaders releases, causing a coin shortage in Japan as players line up to defend Earth from pixelated alien invaders.",
"1980 - Pac-Man fever sweeps the globe; ghosts Inky, Blinky, Pinky, and Clyde become household names.",
"1981 - Donkey Kong introduces Mario (originally called Jumpman) to the world, starting Nintendo's most iconic franchise.",
"1983 - The video game crash of 1983 leads to the decline of the arcade industry and the end of many gaming companies.",
"1985 - Super Mario Bros. launches with the NES, revolutionizing platformers and establishing Nintendo as a gaming powerhouse.",
"1986 - The Legend of Zelda releases, introducing players to Hyrule and laying the groundwork for open-world exploration in video games.",
"1987 - Metal Gear debuts, introducing stealth gameplay and complex storytelling to video games.",
"1989 - Game Boy launches, making portable gaming mainstream and introducing Tetris to millions.",
"1991 - Sonic the Hedgehog speeds onto the scene, becoming Sega's mascot and Mario's biggest rival.",
"1993 - Doom releases, popularizing the first-person shooter genre and pioneering networked multiplayer.",
"1994 - Sony enters the console market with the PlayStation, bringing 3D graphics to the masses.",
"1996 - Pokémon Red and Green launch in Japan, starting a global phenomenon of catching 'em all.",
"1997 - Final Fantasy VII is released, popularizing JRPGs in the West and setting new standards for storytelling in games.",
"1998 - The Legend of Zelda: Ocarina of Time releases, often cited as one of the greatest games ever made.",
"2000 - The PlayStation 2 launches, becoming the best-selling video game console of all time.",
"2001 - Grand Theft Auto III releases, popularizing open-world sandbox gameplay.",
"2004 - World of Warcraft launches, defining the MMORPG genre and peaking at over 12 million subscribers.",
"2005 - Guitar Hero releases, starting a rhythm game craze and bringing plastic instruments into living rooms.",
"2006 - Nintendo Wii launches, introducing motion controls to a wide audience and becoming a cultural phenomenon.",
"2007 - The first iPhone is released, paving the way for the mobile gaming revolution.",
"2009 - Minecraft enters early access, eventually becoming the best-selling video game of all time.",
"2011 - Twitch.tv launches, revolutionizing how people watch and interact with gaming content.",
"2013 - Grand Theft Auto V releases, becoming one of the most financially successful entertainment products of all time.",
"2016 - Pokémon GO launches, bringing augmented reality gaming to the mainstream.",
"2017 - Nintendo Switch releases, blurring the line between home and portable gaming.",
"2020 - Among Us skyrockets in popularity during the pandemic, becoming a cultural phenomenon.",
"2022 - Microsoft announces plans to acquire Activision Blizzard for $68.7 billion, the largest acquisition in gaming history.",
"2023 - The Last of Us HBO series premieres, setting new standards for video game adaptations.",
"2024 - Virtual reality gaming sees a resurgence with more affordable and advanced headsets entering the market.",   
"1978 - Space Invaders releases, causing a coin shortage in Japan as players line up to defend Earth from pixelated alien invaders.",
    "1981 - Frogger hops onto the arcade scene, teaching a generation of gamers about the dangers of road crossings.",
    "1982 - Pitfall! releases, making players obsessed with swinging over pixelated alligators and jumping into pixel-perfect pits.",
    "1983 - Dragon’s Lair arrives, pioneering full-motion video in arcades, making it a beautiful but wallet-draining experience.",
    "1985 - Duck Hunt makes the NES Zapper famous, and players develop a love-hate relationship with the snickering dog.",
    "1987 - Mega Man debuts, and players fall in love with blasting robots and stealing their powers, spawning a franchise of difficult side-scrolling platformers.",
    "1988 - Ninja Gaiden releases, becoming infamous for its difficulty, and players learn that wall-jumping is both a blessing and a curse.",
    "1989 - Prince of Persia introduces rotoscoped animation, bringing realistic movement to gaming and kicking off a franchise with parkour roots.",
    "1990 - Dr. Mario adds a medical degree to Mario’s resume, making pill-popping puzzles a thing.",
    "1991 - Street Fighter II brings fighting games into the mainstream, with players mastering the art of quarter-circle punches and claiming their local arcade cabinets.",
    "1992 - The original Mario Kart turns friendships into rivalries and introduces the world to the power of the blue shell.",
    "1993 - Myst introduces immersive first-person exploration, turning CD",
        "1980 - Pac-Man fever sweeps the globe; ghosts Inky, Blinky, Pinky, and Clyde become household names.",
"1993 - Day of the Tentacle releases, becoming one of the most beloved point-and-click adventures with its time-traveling madness.",
    "1994 - EarthBound brings quirky humor and a cult following to the RPG genre, proving that baseball bats and aliens can mix.",
    "1995 - Command & Conquer launches, helping establish the real-time strategy genre and making 'Tiberium' a household word.",
    "1995 - Chrono Trigger becomes an RPG masterpiece, delivering time travel, multiple endings, and an unforgettable cast.",
    "1996 - Resident Evil defines the survival horror genre, giving players nightmares about zombie dogs and limited ammo.",
    "1997 - GoldenEye 007 releases on N64, creating one of the first truly great multiplayer shooters and ruining friendships with proximity mines.",
    "1998 - Half-Life revolutionizes first-person shooters with immersive storytelling, and players discover that crowbars make excellent problem-solvers.",
    "1999 - Silent Hill creeps players out with foggy streets and psychological horror, spawning a franchise that still terrifies.",
    "2000 - Diablo II launches, forever cementing the idea that you can never have enough loot or click too many times.",
    "2001 - Halo: Combat Evolved becomes the Xbox's killer app, turning Master Chief into an icon and making 'LAN parties' a thing.",
    "2001 - Grand Theft Auto III breaks ground with its open-world design, letting players cause chaos in Liberty City however they see fit.",
    "2002 - Metroid Prime takes the Metroid series into 3D, blending exploration and shooting to critical acclaim.",
    "2004 - World of Warcraft launches and redefines the MMORPG, causing millions of players to lose countless hours to Azeroth.",
    "2005 - Shadow of the Colossus redefines what boss battles can be, pitting players against towering giants in a hauntingly beautiful world.",
    "2007 - Bioshock releases, blending first-person action with a philosophical narrative and one of the best plot twists in gaming.",
    "2008 - Dead Space brings horror into space, making players dread every shadow and the sound of a distant screech.",
    "2010 - Mass Effect 2 releases, raising the bar for storytelling in games and making the Normandy crew unforgettable.",
    "2011 - The Elder Scrolls V: Skyrim releases, and players spend hundreds of hours exploring Tamriel, while Fus Ro Dah becomes a household meme.",
    "2012 - XCOM: Enemy Unknown revives the tactical strategy genre, turning permadeath into the ultimate badge of honor (or regret).",
    "2013 - The Stanley Parable makes players question the nature of choice in games, leading to a whole new breed of meta-narrative experiences.",
    "2015 - Undertale releases, turning RPG conventions upside down and making players think twice before hitting the 'attack' button.",
    "2015 - The Witcher 3: Wild Hunt sets a new standard for open-world RPGs, introducing players to a world of morally gray choices and Gwent.",
    "2016 - Pokémon GO takes the world by storm, getting players off their couches and into the streets to catch virtual creatures.",
    "2017 - Cuphead debuts, challenging players with its brutal difficulty and stunning 1930s-style animation.",
    "2018 - Marvel’s Spider-Man swings onto PS4, giving players the most fun and fluid web-slinging experience ever.",
    "2019 - Sekiro: Shadows Die Twice wins Game of the Year for its intense swordplay and brutal difficulty, teaching players the art of perfect timing.",
    "2020 - Among Us skyrockets in popularity during the pandemic, turning space crewmates into paranoid suspects and fostering countless betrayals.",
    "2020 - Genshin Impact launches, becoming a global hit with its gacha mechanics and open-world exploration, drawing comparisons to Breath of the Wild.",
    "2021 - Resident Evil Village brings back Ethan Winters and introduces Lady Dimitrescu, instantly making her an internet sensation.",
    "2022 - Elden Ring launches, becoming a critical and commercial success, combining open-world exploration with the challenging combat of Dark Souls.",
    "2022 - Vampire Survivors revives the bullet-hell genre in a minimalistic, addictive way, turning into a viral indie hit.",
    "2023 - Starfield releases, promising a galaxy-spanning RPG from Bethesda, though its reception leaves some players divided.",
    "2023 - The Legend of Zelda: Tears of the Kingdom releases to widespread acclaim, continuing the open-world magic of Breath of the Wild.",
    "2024 - Lies of P surprises players with its dark take on the Pinocchio story, making puppet fighting a surprising subgenre of Soulslike games.",
    "2024 - Payday 3 launches, bringing back high-octane heists and tactical co-op gameplay for fans of robbing virtual banks.",
    "2024 - Metal Gear Solid Delta: Snake Eater teases a remake of the beloved MGS3, making fans of tactical espionage action excited all over again.",
        "2024 - Hollow Knight: Silksong anticipation grows as fans await the sequel to one of the best Metroidvania games ever made.",
    "2024 - Roblox surpasses 300 million active users, cementing its place as the most popular game-building platform among kids and creators.",
    "2024 - Elden Ring's DLC 'Shadow of the Erdtree' promises more punishingly difficult bosses, prompting players to stock up on health potions.",
    "2024 - Baldur's Gate 3 surpasses all expectations, with players falling in love with its freedom of choice, and romance options with a vampire spawn.",
    "2024 - The release of Final Fantasy VII Rebirth makes fans relive their nostalgia with a modern twist and deep RPG mechanics.",
    "2024 - Alan Wake 2 brings psychological horror back to center stage, offering a haunting narrative that blurs the lines between reality and fiction.",
    "2024 - Assassin's Creed Mirage takes the series back to its roots, offering a smaller, stealth-focused experience reminiscent of the original.",
    "2024 - Cyberpunk 2077's 'Phantom Liberty' expansion helps redeem the game in the eyes of players, turning it into a solid open-world RPG.",
    "2024 - Counter-Strike 2 launches, revolutionizing competitive shooters with updated graphics, improved mechanics, and a reworked map design.",
    "2024 - Marvel's Spider-Man 2 releases, delivering even more swinging, fighting, and an expanded story with multiple Spider-Men.",
    "2024 - Fable reboot teaser drops, reigniting excitement for fans of whimsical British humor and open-world exploration.",
    "2024 - Hollow Knight: Silksong finally gets a release date, sending the fanbase into a frenzy as they prepare to return to the depths of Hallownest.",
    "2024 - Dragon Age: Dreadwolf gets delayed yet again, leaving RPG fans eagerly waiting for the next entry in the fantasy series.",
    "2024 - The rise of AI-generated game development tools allows indie creators to fast-track game creation, spurring innovation across genres.",
    "2024 - Mortal Kombat 1 reboot thrills fighting game fans, reimagining the original game's timeline with brutal fatalities and cinematic storytelling.",
    "2024 - Persona 6 is teased, igniting excitement for fans of the series' stylish mix of turn-based combat and social simulation.",
    "2024 - Hideo Kojima’s next mysterious project hints at an even more mind-bending narrative experience, but details remain sparse.",
    "2024 - The new handheld gaming PC wars heat up as competitors to the Steam Deck, like ASUS ROG Ally and Lenovo Legion Go, gain popularity.",
    "2024 - The surge of 'roguelike' and 'soulslike' games continues, with more indie developers pushing the boundaries of difficulty and procedural generation.",
    "2024 - Nintendo remains silent on its next-gen console, but leaks suggest it will support 4K resolution and a more powerful chip.",
    "2024 - Valve announces plans for a Steam Deck 2, promising better battery life and performance, much to the delight of handheld gamers.",
    "2024 - Star Wars Outlaws, an open-world adventure set in the galaxy far, far away, gears up to release, letting players become space scoundrels.",
    "2024 - Microsoft's acquisition of Activision Blizzard finally closes, marking a major shift in the gaming landscape as Call of Duty becomes a central part of Xbox's offerings."
];

function YearCounter() {
    const { gameTime } = useContext(GameContext);
    const [currentYear, setCurrentYear] = useState(1972);
    const [tickerPosition, setTickerPosition] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const tickerRef = useRef(null);

    useEffect(() => {
        const year = Math.floor(gameTime / 360) + 1972; // Slowed down game time
        setCurrentYear(year);
    }, [gameTime]);

    const currentYearEvents = useMemo(() => {
        return gameHistory.filter(event => {
            const eventYear = parseInt(event.split(' ')[0]);
            return eventYear === currentYear;
        });
    }, [currentYear]);

    useEffect(() => {
        const ticker = tickerRef.current;
        if (!ticker || currentYearEvents.length === 0) return;

        const speed = 70; // Pixels per second
        const pauseDuration = 0; // 5 seconds pause between iterations
        let animationFrameId;
        let startTime;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            if (!isPaused) {
                const newPosition = -((elapsed * speed) / 1000) % ticker.scrollWidth;
                setTickerPosition(newPosition);

                if (-newPosition >= ticker.scrollWidth / 2) {
                    setIsPaused(true);
                    setTimeout(() => {
                        setIsPaused(false);
                        startTime = null;
                    }, pauseDuration);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [currentYearEvents, isPaused]);

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

    return (
        <div className="bg-kb-black text-white p-2 flex items-center">
            <span className="mr-1 text-2xl font-bold min-w-[70px]">{currentYear}</span>
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
    );
}

export default YearCounter;