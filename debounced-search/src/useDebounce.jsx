import { useEffect, useState } from 'react'

export function useDebounce() {
    const [inputValue, setInputValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchArray = [
        { id: 1, text: 't' }, { id: 2, text: 'te' },
        { id: 3, text: 'tes' }, { id: 4, text: 'test' }
    ];

    let timerId = null;

    useEffect(() => {
        console.log('state Change:' + inputValue);
        timerId = setTimeout(() => {
            search();
        }, 1000);
        return () => {
            clearTimeout(timerId);
        };
    }, [inputValue]);

    function search() {
        const results = searchArray.filter(x =>
            x.text === inputValue
        );
        if (results === NaN || results === undefined) {
            return;
        }

        setSearchResults(results);
    }

    return { inputValue, setInputValue, searchResults };
}
