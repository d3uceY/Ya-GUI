import { useState, useEffect } from "react"
import { useCommandMaxLength } from "@/hooks/useCommandMaxLength"
import {
    formatShortcuts,
    filterShortcuts,
    truncateCommand,
    collectAllTags,
    extractVariables,
    substituteVariables,
} from "@/lib/shortcutHelpers"
import { Edit2, Trash2, Search, TerminalSquare, Star, Copy, Tag, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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

    useEffect(() => { loadShortcuts() }, [])

    const loadShortcuts = async () => {
        try {
            setShortcuts(await GetShortcuts())
        } catch (err) {
            console.error("Error loading shortcuts:", err)
        }
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

    return (
        <div className="flex flex-col h-full p-8 pt-4 max-w-6xl mx-auto">
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

            <Card className="mb-8 pt-0 overflow-y-hidden flex flex-col border-2 bg-slate-800/50 border-slate-700">
                <CardHeader className="border-b pt-6 border-slate-700 bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-blue-100">Your Shortcuts</CardTitle>
                        <Button
                            onClick={() => setAddDialogOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 hover:border-blue-400 h-9 px-3 gap-1.5 text-sm font-bold"
                        >
                            <Plus className="w-4 h-4" />
                            New Shortcut
                        </Button>
                    </div>
                    <div className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search name, command, description or tag..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500 h-11"
                            />
                        </div>
                    </div>
                    {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button
                                onClick={() => setActiveTag(null)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${activeTag === null ? "bg-blue-600 border-blue-400 text-white" : "border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200"}`}
                            >All</button>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${activeTag === tag ? "bg-blue-600 border-blue-400 text-white" : "border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200"}`}
                                >
                                    <Tag className="w-3 h-3" />{tag}
                                </button>
                            ))}
                        </div>
                    )}
                </CardHeader>

                <CardContent className="p-0">
                    <ScrollArea className="h-64 md:h-80 lg:h-96 xl:h-120 2xl:h-150">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-2 border-slate-700 hover:bg-transparent">
                                    <TableHead className="w-44 font-bold text-blue-200 pl-8!">Shortcut</TableHead>
                                    <TableHead className="font-bold text-blue-200">Command</TableHead>
                                    <TableHead className="w-44 text-center font-bold text-blue-200">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((shortcut) => {
                                    return (
                                        <TableRow key={shortcut.name} className={`hover:bg-slate-900/50 border-b border-slate-700/50 ${shortcut.pinned ? "bg-blue-950/20" : ""}`}>
                                            <TableCell className="py-3 align-top">
                                                <div className="flex flex-col gap-1 pl-4">
                                                    <Badge variant="secondary" className="font-bold text-sm px-3 py-1 bg-blue-900/50 text-blue-200 border border-blue-700 w-fit">
                                                        {shortcut.pinned && <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400 inline" />}
                                                        {shortcut.name}
                                                    </Badge>
                                                    {shortcut.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {shortcut.tags.map((t) => (
                                                                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">{t}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-3 align-top">
                                                <div className="space-y-1">
                                                    <code className="px-3 py-1.5 rounded bg-slate-900 text-blue-300 font-mono text-sm border border-slate-700" title={shortcut.command}>
                                                        {truncateCommand(shortcut.command, commandMaxLength)}
                                                    </code>
                                                    {shortcut.description && <p className="text-xs text-slate-400 pl-1 mt-3">{shortcut.description}</p>}
                                                    {shortcut.runCount > 0 && (
                                                        <p className="text-xs text-slate-500 pl-1 mt-3">
                                                            Run {shortcut.runCount}x {shortcut.lastRun && ` ${new Date(shortcut.lastRun).toLocaleDateString()}`}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-3 align-top">
                                                <div className="flex gap-1 justify-end flex-wrap">
                                                    <Button onClick={() => setEditDialog({ open: true, shortcut })} variant="ghost" size="icon" className="h-9 w-9 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300" title="Edit"><Edit2 className="w-4 h-4" /></Button>
                                                    <Button onClick={() => handleTogglePin(shortcut.name)} variant="ghost" size="icon" className={`h-9 w-9 hover:bg-yellow-900/30 ${shortcut.pinned ? "text-yellow-400" : "text-slate-500 hover:text-yellow-400"}`} title={shortcut.pinned ? "Unpin" : "Pin to top"}>
                                                        <Star className={`w-4 h-4 ${shortcut.pinned ? "fill-yellow-400" : ""}`} />
                                                    </Button>
                                                    <Button onClick={() => handleDuplicate(shortcut.name)} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200" title="Duplicate"><Copy className="w-4 h-4" /></Button>
                                                    <Button onClick={() => startRun(shortcut)} variant="ghost" size="icon" className="h-9 w-9 text-green-400 hover:bg-green-900/50 hover:text-green-300" title="Run"><TerminalSquare className="w-4 h-4" /></Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400 hover:bg-red-900/50 hover:text-red-300" title="Delete"><Trash2 className="w-4 h-4" /></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="border-2 bg-slate-800 border-slate-700">
                                                            <AlertDialogTitle className="text-xl font-bold text-blue-100">Delete Shortcut</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-base text-slate-300">Delete <span className="font-bold text-blue-200">"{shortcut.name}"</span>? This cannot be undone.</AlertDialogDescription>
                                                            <div className="flex gap-3 justify-end mt-4">
                                                                <AlertDialogCancel className="border-2 border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleRemoveShortcut(shortcut.name)}>Delete</AlertDialogAction>
                                                            </div>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {filtered.length === 0 && (
                                    <TableRow><TableCell colSpan={3} className="text-center py-12 text-slate-500">{searchQuery || activeTag ? "No shortcuts match your search." : "No shortcuts yet. Click \"New Shortcut\" to add one."}</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

        </div>
    )
}
