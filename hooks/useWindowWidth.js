import { useState, useEffect } from "react";

export default function useWindowWidth() {
    const [windowSize, setWindowSize] = useState();

    useEffect(() => {
        setWindowSize(window.innerWidth);
    }, []);

    return windowSize
}