import type { Shortcut, ShortcutData } from "@/types"

/**
 * Converts the raw Record<string, ShortcutData> returned by GetShortcuts
 * into a flat array of Shortcut objects, pinned entries first.
 */
export function formatShortcuts(shortcuts: Record<string, ShortcutData>): Shortcut[] {
    const list: Shortcut[] = Object.entries(shortcuts).map(([name, data]) => ({
        name,
        command: data.command,
        description: data.description ?? "",
        tags: data.tags ?? [],
        pinned: data.pinned ?? false,
        runCount: data.runCount ?? 0,
        lastRun: data.lastRun ?? "",
    }))
    return list.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return a.name.localeCompare(b.name)
    })
}

/**
 * Filters shortcuts by search query (name, command, description, tags).
 */
export function filterShortcuts(shortcuts: Shortcut[], query: string, activeTag?: string): Shortcut[] {
    const q = query.toLowerCase()
    return shortcuts.filter((s) => {
        const matchesTag = !activeTag || s.tags.includes(activeTag)
        const matchesSearch =
            !q ||
            s.name.toLowerCase().includes(q) ||
            s.command.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.tags.some((t) => t.toLowerCase().includes(q))
        return matchesTag && matchesSearch
    })
}

/**
 * Truncates a command string to maxLength characters, appending "..." if trimmed.
 */
export function truncateCommand(text: string, maxLength: number = 20): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
}

/**
 * Extracts all unique tags across all shortcuts.
 */
export function collectAllTags(shortcuts: Shortcut[]): string[] {
    const set = new Set<string>()
    shortcuts.forEach((s) => s.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
}

/**
 * Detects {variable} placeholders in a command string.
 */
export function extractVariables(command: string): string[] {
    const matches = command.match(/\{([^}]+)\}/g) ?? []
    return [...new Set(matches.map((m) => m.slice(1, -1)))]
}

/**
 * Replaces {variable} placeholders with provided values.
 */
export function substituteVariables(command: string, values: Record<string, string>): string {
    return command.replace(/\{([^}]+)\}/g, (_, name) => values[name] ?? `{${name}}`)
}
