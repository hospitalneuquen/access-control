import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handle on popstate
 */
export function useGoBack() {
    const [back, setBack] = useState(0);
    const location = useLocation();

    useEffect(() => {
        function onPopState() {
            setBack((prev) => prev + 1);
        }
        window.addEventListener('popstate', onPopState);
        return () => {
            window.removeEventListener('popstate', onPopState);
        }
    }, [])
    return back;
}