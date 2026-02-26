import { useMediaQuery } from "@/hooks/useMediaQuery"

/**
 * Returns a max character length for command display based on the current
 * viewport width, aligned to Tailwind's default breakpoints.
 */
export function useCommandMaxLength(): number {
    const is2xl = useMediaQuery("(min-width: 1536px)")
    const isXl  = useMediaQuery("(min-width: 1280px)")
    const isLg  = useMediaQuery("(min-width: 1024px)")
    const isMd  = useMediaQuery("(min-width: 768px)")
    const isSm  = useMediaQuery("(min-width: 640px)")

    switch (true) {
        case is2xl: return 150
        case isXl:  return 100
        case isLg:  return 80
        case isMd:  return 65
        case isSm:  return 20
        default:    return 14
    }
}
