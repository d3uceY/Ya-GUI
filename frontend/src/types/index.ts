// Mirror of Go utils types

export interface ShortcutData {
    command: string
    description?: string
    tags?: string[]
    pinned?: boolean
    runCount?: number
    lastRun?: string
}

export interface AppConfig {
    defaultDir?: string
    preferredTerminal?: string  // "auto" | "wt" | "powershell" | "cmd" | "bash"
    startOnBoot?: boolean
    savedDirectories?: SavedDir[]
}

export interface SavedDir {
    name: string
    path: string
}

export interface RunHistoryEntry {
    shortcutName: string
    command: string
    directory: string
    timestamp: string
}

/** Flat shortcut used in the UI, derived from the map key + ShortcutData value */
export interface Shortcut {
    name: string
    command: string
    description: string
    tags: string[]
    pinned: boolean
    runCount: number
    lastRun: string
}
