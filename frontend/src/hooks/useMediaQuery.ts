import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window === "undefined") return false
        return window.matchMedia(query).matches
    })

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query)
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches)

        mediaQueryList.addEventListener("change", listener)
        setMatches(mediaQueryList.matches)

        return () => mediaQueryList.removeEventListener("change", listener)
    }, [query])

    return matches
}
