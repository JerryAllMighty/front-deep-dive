import { useEffect, useState } from 'react'
import './App.css'

export function useStopwatch() {
    const initialTimeValue = 0;
    const initialIsRunningValue = false;
    const initialTimeLabsValue = [];

    const [time, setTime] = useState(initialTimeValue);
    const [isRunning, setIsRunning] = useState(initialIsRunningValue);
    const [timeLabs, setTimeLabs] = useState(initialTimeLabsValue);


    // TODO : prev 대신 time 써주는건 안되는지?
    useEffect(() => {
        if (isRunning === true) {
            const id = setInterval(() => {
                setTime((prev) => prev + 1)
            }, 100);

            return () => clearInterval(id);
        }
        return;
    }, [isRunning]);

    useEffect(() => {
        function handleSpaceBar(event) {
            if (event.code === 'Space') {
                setIsRunning(isRunning ? false : true);
            }
        }
        window.addEventListener('keydown', handleSpaceBar);
        return window.removeEventListener('keydown', handleSpaceBar);
    });



    function handleAddTimeLabs() {
        const randomUUID = crypto.randomUUID();
        setTimeLabs([...timeLabs, {
            id: randomUUID,
            text: time
        }]);
    }

    function handleReset() {
        setTime(initialTimeValue);
        setIsRunning(initialIsRunningValue);
        setTimeLabs(initialTimeLabsValue);
    }

    function calculateTime(milliseconds) {
        const minutes = String(parseInt(parseInt(milliseconds / 10) / 60)).padStart(2, '0');
        const seconds = String(parseInt(milliseconds / 10) % 60).padStart(2, '0');
        return `${minutes}:${seconds}.${milliseconds % 10}`;
    }

    return { time, isRunning, timeLabs, handleAddTimeLabs, handleReset, calculateTime, setIsRunning };
}
