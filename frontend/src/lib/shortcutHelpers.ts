export type Shortcut = { name: string; command: string }

/**
 * Converts the raw Record<string, string> returned by GetShortcuts into
 * a flat array of { name, command } objects.
 */
export function formatShortcuts(shortcuts: Record<string, string>): Shortcut[] {
    return Object.entries(shortcuts).map(([name, command]) => ({ name, command }))
}

/**
 * Filters a list of shortcuts by a search query against both name and command.
 */
export function filterShortcuts(shortcuts: Shortcut[], query: string): Shortcut[] {
    const q = query.toLowerCase()
    return shortcuts.filter(
        (s) => s.name.toLowerCase().includes(q) || s.command.toLowerCase().includes(q)
    )
}

/**
 * Truncates a command string to maxLength characters, appending "..." if trimmed.
 */
export function truncateCommand(text: string, maxLength: number = 20): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
}
