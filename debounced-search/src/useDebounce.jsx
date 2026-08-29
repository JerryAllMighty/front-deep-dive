import { useEffect, useState } from 'react'

export function useDebounce(inputValue) {
    const [searchResults, setSearchResults] = useState([]);
    const searchArray = [
        { id: 1, text: 't' }, { id: 2, text: 'te' },
        { id: 3, text: 'tes' }, { id: 4, text: 'test' }
    ];

    useEffect(() => {
        const timerId = setTimeout(() => {
            search();
        }, delayTime);
        return () => {
            clearTimeout(timerId);
        };
    }, [inputValue, delayTime]);

    function search() {
        const results = searchArray.filter(x =>
            x.text.toLowerCase().includes(inputValue.toLowerCase())
        );

        setSearchResults(results);
    }

    return { searchResults };
}
