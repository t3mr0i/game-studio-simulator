import { useContext, useEffect, useRef } from 'react';
import { GameContext } from '../context/GameContext';
import { customToast } from './toast';

export const useTimeManager = () => {
    const {
        setGameTime,
        setCurrentMonth,
        workers,
        setFunds,
        saveGameState
    } = useContext(GameContext);

    const intervalRef = useRef(null);

    const startTime = () => {
        if (intervalRef.current) return; // Don't start if already running

        intervalRef.current = setInterval(() => {
            setGameTime(prevTime => prevTime + 1);
            setCurrentMonth(prevMonth => {
                const newMonth = (prevMonth + 1) % 12;
                
                // Pay salaries at the start of each month
                if (newMonth === 0) {
                    const totalSalary = workers.reduce((sum, worker) => {
                        switch(worker.type) {
                            case 'junior': return sum + 1000;
                            case 'senior': return sum + 5000;
                            case 'expert': return sum + 10000;
                            default: return sum;
                        }
                    }, 0);

                    setFunds(prevFunds => {
                        const newFunds = prevFunds - totalSalary;
                        if (newFunds < 0) {
                            customToast.error(`You're in debt! Current balance: $${newFunds}`);
                        } else {
                            customToast.info(`Paid $${totalSalary} in salaries. Current balance: $${newFunds}`);
                        }
                        return newFunds;
                    });

                    // Save game state at the start of each month
                    saveGameState();
                }
                
                return newMonth;
            });
        }, 1000); // 1 second represents 1 day in game time
    };

    const stopTime = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return { startTime, stopTime };
};
