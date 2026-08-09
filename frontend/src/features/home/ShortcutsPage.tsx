import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { useCommandMaxLength } from "@/hooks/useCommandMaxLength"
import {
    formatShortcuts,
    filterShortcuts,
    truncateCommand,
    collectAllTags,
    extractVariables,
    substituteVariables,
} from "@/lib/shortcutHelpers"
import { Edit2, Trash2, Search, Terminal, Star, Copy, Tag, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import VarSubstitutionDialog from "@/components/VarSubstitutionDialog"
import DirectoryPickerDialog from "@/components/DirectoryPickerDialog"
import EditShortcutDialog from "@/components/EditShortcutDialog"
import AddShortcutDialog from "@/components/AddShortcutDialog"
import { useAppConfig } from "@/contexts/VersionContext"
import type { Shortcut, ShortcutData } from "@/types"

import {
    GetShortcuts,
    AddShortcut,
    UpdateShortcut,
    RemoveShortcut,
    TogglePinShortcut,
    DuplicateShortcut,
    ApplyShortcut,
} from "../../../wailsjs/go/main/App"

function TagPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                active
                    ? "border-accent-deep bg-accent-strong text-white"
                    : "border-edge-strong bg-surface text-fg-faint hover:border-accent-deep/60 hover:text-fg-strong",
            )}
        >
            {label !== "All" && <Tag className="h-3 w-3" />}
            {label}
        </button>
    )
}

interface VarDialogState {
    open: boolean
    shortcut: Shortcut | null
    variables: string[]
    values: Record<string, string>
}

interface DirDialogState {
    open: boolean
    shortcut: Shortcut | null
    interpolatedCommand: string
}

export default function ShortcutsPage() {
    const { config } = useAppConfig()

    const [shortcuts, setShortcuts] = useState<Record<string, ShortcutData>>({})
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTag, setActiveTag] = useState<string | null>(null)

    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [editDialog, setEditDialog] = useState<{ open: boolean; shortcut: Shortcut | null }>({ open: false, shortcut: null })

    const [varDialog, setVarDialog] = useState<VarDialogState>({
        open: false, shortcut: null, variables: [], values: {},
    })
    const [dirDialog, setDirDialog] = useState<DirDialogState>({
        open: false, shortcut: null, interpolatedCommand: "",
    })

    const commandMaxLength = useCommandMaxLength()

    const searchRef = useRef<HTMLInputElement>(null)
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)

    const loadShortcuts = async () => {
        try {
            setShortcuts(await GetShortcuts())
        } catch (err) {
            console.error("Error loading shortcuts:", err)
        }
    }

    // Load shortcuts on mount; loadShortcuts is async, so the state update
    // happens in the promise callback, not synchronously in the effect.
    useEffect(() => {
        GetShortcuts().then(setShortcuts).catch((err) => console.error("Error loading shortcuts:", err))
    }, [])

    // Keep the selected row in view as the user navigates with the arrows.
    useEffect(() => {
        rowRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" })
    }, [selectedIndex])

    // Palette helpers: every search/tag change resets keyboard selection to the top.
    const setQuery = (q: string) => {
        setSearchQuery(q)
        setSelectedIndex(0)
    }
    const setTag = (t: string | null) => {
        setActiveTag(t)
        setSelectedIndex(0)
    }

    const handleAddShortcut = async (name: string, command: string, description: string, tags: string) => {
        const updated = await AddShortcut(name, command, description, tags)
        setShortcuts(updated)
    }

    const handleSaveEdit = async (oldName: string, newName: string, command: string, description: string, tags: string) => {
        await UpdateShortcut(oldName, newName, command, description, tags)
        await loadShortcuts()
    }

    const handleRemoveShortcut = async (name: string) => {
        try {
            await RemoveShortcut(name)
            await loadShortcuts()
        } catch (err) {
            console.error("Error removing shortcut:", err)
        }
    }

    const handleTogglePin = async (name: string) => {
        try {
            await TogglePinShortcut(name)
            await loadShortcuts()
        } catch (err) {
            console.error("Error toggling pin:", err)
        }
    }

    const handleDuplicate = async (name: string) => {
        try {           
            const updated = await DuplicateShortcut(name)
            setShortcuts(updated)
        } catch (err) {
            console.error("Error duplicating shortcut:", err)
        }
    }

    const startRun = (shortcut: Shortcut) => {
        const variables = extractVariables(shortcut.command)
        if (variables.length > 0) {
            setVarDialog({ open: true, shortcut, variables, values: {} })
        } else {
            setDirDialog({ open: true, shortcut, interpolatedCommand: shortcut.command })
        }
    }

    const handleVarConfirm = () => {
        const { shortcut, values } = varDialog
        if (!shortcut) return
        const interpolated = substituteVariables(shortcut.command, values)
        setVarDialog({ open: false, shortcut: null, variables: [], values: {} })
        setDirDialog({ open: true, shortcut, interpolatedCommand: interpolated })
    }

    const handleDirConfirm = async (dirPath: string) => {
        const { shortcut, interpolatedCommand } = dirDialog
        if (!shortcut) return
        setDirDialog({ open: false, shortcut: null, interpolatedCommand: "" })
        const ok = await ApplyShortcut(shortcut.name, interpolatedCommand, dirPath)
        if (!ok) alert("Failed to launch the shortcut command.")
        await loadShortcuts()
    }

    const allShortcuts = formatShortcuts(shortcuts)
    const allTags = collectAllTags(allShortcuts)
    const filtered = filterShortcuts(allShortcuts, searchQuery, activeTag ?? undefined)
    const pinnedCount = allShortcuts.filter((s) => s.pinned).length

    const handlePaletteKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            if (filtered.length > 0) setSelectedIndex((i) => (i + 1) % filtered.length)
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            if (filtered.length > 0) setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length)
        } else if (e.key === "Enter") {
            e.preventDefault()
            const target = filtered[selectedIndex] ?? filtered[0]
            if (target) startRun(target)
        } else if (e.key === "Escape") {
            if (searchQuery || activeTag) {
                setQuery("")
                setTag(null)
            } else {
                e.currentTarget.blur()
            }
        }
    }

    const clearSearch = () => {
        setQuery("")
        setTag(null)
        searchRef.current?.focus()
    }

    return (
        <div className="flex h-full flex-col p-4">
            <AddShortcutDialog
                open={addDialogOpen}
                onAdd={handleAddShortcut}
                onClose={() => setAddDialogOpen(false)}
            />
            <EditShortcutDialog
                open={editDialog.open}
                shortcut={editDialog.shortcut}
                onSave={handleSaveEdit}
                onClose={() => setEditDialog({ open: false, shortcut: null })}
            />
            <VarSubstitutionDialog
                open={varDialog.open}
                variables={varDialog.variables}
                values={varDialog.values}
                onChange={(v, val) => setVarDialog((prev) => ({ ...prev, values: { ...prev.values, [v]: val } }))}
                onConfirm={handleVarConfirm}
                onCancel={() => setVarDialog({ open: false, shortcut: null, variables: [], values: {} })}
            />
            <DirectoryPickerDialog
                open={dirDialog.open}
                savedDirectories={config.savedDirectories ?? []}
                onConfirm={handleDirConfirm}
                onCancel={() => setDirDialog({ open: false, shortcut: null, interpolatedCommand: "" })}
            />

            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-edge bg-surface shadow-[var(--shadow-panel)]">
                {/* Palette input */}
                <div className="flex shrink-0 items-center gap-2 border-b border-edge px-3 transition-colors focus-within:bg-surface-2/50">
                    <span className="prompt text-[15px]" aria-hidden>❯</span>
                    <input
                        ref={searchRef}
                        value={searchQuery}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handlePaletteKeyDown}
                        placeholder="Search name, command, description, or tag…"
                        autoFocus
                        aria-label="Search shortcuts"
                        className="h-12 w-full min-w-0 bg-transparent font-mono text-[14px] text-fg placeholder:text-fg-faint focus:outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            aria-label="Clear search"
                            className="rounded p-1 text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-strong"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <kbd className="kbd hidden sm:inline-flex">esc</kbd>
                </div>

                {/* Toolbar: count · tags · new */}
                <div className="flex shrink-0 items-center gap-2 border-b border-edge bg-surface-2/40 px-3 py-2">
                    <span className="mono-cell shrink-0 text-[11px] text-fg-faint">
                        {filtered.length}/{allShortcuts.length} · {pinnedCount} pinned
                    </span>
                    {allTags.length > 0 && (
                        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
                            <TagPill label="All" active={activeTag === null} onClick={() => setTag(null)} />
                            {allTags.map((tag) => (
                                <TagPill
                                    key={tag}
                                    label={tag}
                                    active={activeTag === tag}
                                    onClick={() => setTag(activeTag === tag ? null : tag)}
                                />
                            ))}
                        </div>
                    )}
                    <Button onClick={() => setAddDialogOpen(true)} size="sm" className="ml-auto shrink-0">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">New Shortcut</span>
                    </Button>
                </div>

                {/* Results */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                    {filtered.length > 0 ? (
                        <table className="w-full border-collapse text-sm">
                            <tbody>
                                {filtered.map((shortcut, i) => (
                                    <tr
                                        key={shortcut.name}
                                        ref={(el) => { rowRefs.current[i] = el }}
                                        data-selected={i === selectedIndex}
                                        onClick={() => startRun(shortcut)}
                                        className={cn(
                                            "group relative cursor-pointer border-b border-edge transition-colors last:border-b-0",
                                            "hover:bg-surface-2/70",
                                            shortcut.pinned && "bg-accent-tint/25",
                                            i === selectedIndex && "bg-[var(--row-selected)] hover:bg-[var(--row-selected)]",
                                        )}
                                    >
                                        <td className="relative w-[200px] min-w-[150px] max-w-[240px] px-4 py-3 align-top">
                                            {i === selectedIndex && (
                                                <span className="absolute top-0 left-0 h-full w-0.5 bg-accent" aria-hidden />
                                            )}
                                            <span className="mono-cell inline-flex max-w-full items-center gap-1.5 rounded-md border border-edge-strong bg-surface-2 px-2 py-1 text-[12px] font-semibold text-fg-strong">
                                                {shortcut.pinned && <Star className="h-3 w-3 shrink-0 fill-pin text-pin" />}
                                                <span className="truncate">{shortcut.name}</span>
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 align-top">
                                            <code
                                                className="mono-cell block max-w-full truncate text-[13px] text-fg-muted transition-colors group-hover:text-fg"
                                                title={shortcut.command}
                                            >
                                                {truncateCommand(shortcut.command, commandMaxLength)}
                                            </code>
                                            {shortcut.description && (
                                                <p className="mt-1.5 line-clamp-2 text-[12px] text-fg-faint">{shortcut.description}</p>
                                            )}
                                            {(shortcut.tags.length > 0 || shortcut.runCount > 0) && (
                                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                                    {shortcut.tags.slice(0, 3).map((t) => (
                                                        <span key={t} className="rounded-full border border-edge bg-surface-2 px-1.5 py-px text-[10px] text-fg-faint">{t}</span>
                                                    ))}
                                                    {shortcut.runCount > 0 && (
                                                        <span className="mono-cell text-[10px] text-fg-faint">
                                                            {shortcut.runCount} run{shortcut.runCount === 1 ? "" : "s"}
                                                            {shortcut.lastRun ? ` · ${new Date(shortcut.lastRun).toLocaleDateString()}` : ""}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="w-[230px] px-3 py-3 text-right align-top">
                                            <div className="flex items-center justify-end gap-0.5">
                                                <Button
                                                    variant="success-ghost"
                                                    size="icon-sm"
                                                    onClick={(e) => { e.stopPropagation(); startRun(shortcut) }}
                                                    title="Run"
                                                >
                                                    <Terminal className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={(e) => { e.stopPropagation(); setEditDialog({ open: true, shortcut }) }}
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={(e) => { e.stopPropagation(); handleDuplicate(shortcut.name) }}
                                                    title="Duplicate"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={(e) => { e.stopPropagation(); handleTogglePin(shortcut.name) }}
                                                    title={shortcut.pinned ? "Unpin" : "Pin to top"}
                                                    className={shortcut.pinned ? "text-pin hover:text-pin" : "text-fg-faint hover:text-pin"}
                                                >
                                                    <Star className={`h-4 w-4 ${shortcut.pinned ? "fill-pin" : ""}`} />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="danger-ghost" size="icon-sm" className="text-fg-faint" title="Delete">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogTitle>Delete Shortcut</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Delete <span className="font-semibold text-fg">{shortcut.name}</span>? This cannot be undone.
                                                        </AlertDialogDescription>
                                                        <div className="mt-2 flex justify-end gap-2">
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-danger-strong hover:bg-danger" onClick={() => handleRemoveShortcut(shortcut.name)}>Delete</AlertDialogAction>
                                                        </div>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2.5 px-6 py-16 text-center">
                            {allShortcuts.length === 0 ? (
                                <>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-edge bg-surface-2">
                                        <Terminal className="h-5 w-5 text-fg-faint" />
                                    </div>
                                    <p className="text-[14px] font-medium text-fg-muted">No shortcuts yet.</p>
                                    <p className="text-[12px] text-fg-faint">
                                        Create one with <span className="font-medium text-fg-muted">New Shortcut</span> — or add aliases
                                        with <span className="mono-cell text-accent-soft">ya</span> in your terminal.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-edge bg-surface-2">
                                        <Search className="h-5 w-5 text-fg-faint" />
                                    </div>
                                    <p className="text-[14px] font-medium text-fg-muted">
                                        No matches for <span className="mono-cell text-accent-soft">"{searchQuery}"</span>.
                                    </p>
                                    <p className="text-[12px] text-fg-faint">
                                        Try a different name, command, or tag. Press <kbd className="kbd">esc</kbd> to clear.
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
