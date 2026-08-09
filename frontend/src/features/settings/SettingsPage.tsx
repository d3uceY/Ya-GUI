import { useState, useEffect } from "react"
import { Download, Upload, ExternalLink, Terminal, FolderOpen, Plus, Trash2, Power } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ImportShortcuts, ExportShortcuts, SetPreferredTerminal, SetStartOnBoot, GetStartOnBoot, AddSavedDirectory, RemoveSavedDirectory, SelectDirectory } from "../../../wailsjs/go/main/App"
import { useVersion } from "@/contexts/VersionContext"
import { useAppConfig } from "@/contexts/VersionContext"
import { formatReleaseDate } from "@/lib/dateHelpers"
import type { SavedDir } from "@/types"

const TERMINAL_OPTIONS = [
    { value: "auto", label: "Auto-detect" },
    { value: "wt", label: "Windows Terminal (wt)" },
    { value: "powershell", label: "PowerShell" },
    { value: "cmd", label: "Command Prompt (cmd)" },
    { value: "bash", label: "Bash / Unix terminal" },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="px-1 pt-6 pb-2 text-[11px] font-semibold tracking-wider text-fg-faint uppercase">
            {children}
        </h3>
    )
}

export default function SettingsPage() {
    const { currentVersion, updateAvailable } = useVersion()
    const { config, refreshConfig } = useAppConfig()

    const [startOnBoot, setStartOnBoot] = useState(false)
    const [newDirName, setNewDirName] = useState("")
    const [newDirPath, setNewDirPath] = useState("")

    useEffect(() => {
        GetStartOnBoot().then(setStartOnBoot).catch(console.error)
    }, [])

    const handleTerminalChange = async (value: string) => {
        await SetPreferredTerminal(value)
        await refreshConfig()
    }

    const handleBootToggle = async (enabled: boolean) => {
        await SetStartOnBoot(enabled)
        setStartOnBoot(enabled)
    }

    const handleBrowseDir = async () => {
        const path = await SelectDirectory()
        if (path) setNewDirPath(path)
    }

    const handleAddDirectory = async () => {
        if (!newDirName.trim() || !newDirPath.trim()) return
        await AddSavedDirectory(newDirName.trim(), newDirPath.trim())
        setNewDirName("")
        setNewDirPath("")
        await refreshConfig()
    }

    const handleRemoveDirectory = async (name: string) => {
        await RemoveSavedDirectory(name)
        await refreshConfig()
    }

    const savedDirs: SavedDir[] = config.savedDirectories ?? []

    return (
        <div className="flex h-full flex-col overflow-y-auto p-4">
            <div className="mx-auto w-full max-w-3xl space-y-3 pb-12">
                <SectionLabel>Terminal &amp; Startup</SectionLabel>
                <Card>
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between gap-6 px-5 py-4">
                            <div className="min-w-0">
                                <p className="flex items-center gap-2 text-[13px] font-medium text-fg">
                                    <Terminal className="h-4 w-4 shrink-0 text-fg-faint" />
                                    Preferred Terminal
                                </p>
                                <p className="mt-0.5 text-[12px] text-fg-faint">Which terminal to open when running a shortcut</p>
                            </div>
                            <Select value={config.preferredTerminal ?? "auto"} onValueChange={handleTerminalChange}>
                                <SelectTrigger className="w-48 sm:w-56">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TERMINAL_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between gap-6 border-t border-edge px-5 py-4">
                            <div className="min-w-0">
                                <p className="flex items-center gap-2 text-[13px] font-medium text-fg">
                                    <Power className="h-4 w-4 shrink-0 text-fg-faint" />
                                    Start on Boot
                                </p>
                                <p className="mt-0.5 text-[12px] text-fg-faint">Automatically launch YaGUI when you log in</p>
                            </div>
                            <Switch checked={startOnBoot} onCheckedChange={handleBootToggle} aria-label="Start on boot" />
                        </div>
                    </CardContent>
                </Card>

                <SectionLabel>Saved Directories</SectionLabel>
                <Card>
                    <CardContent className="p-0">
                        {savedDirs.length === 0 ? (
                            <p className="px-5 py-4 text-[12px] text-fg-faint">No saved directories yet.</p>
                        ) : (
                            savedDirs.map((dir) => (
                                <div key={dir.name} className="flex items-center gap-3 border-b border-edge px-5 py-3 last:border-b-0">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[13px] font-medium text-fg">{dir.name}</p>
                                        <p className="mono-cell truncate text-[11px] text-fg-faint">{dir.path}</p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="danger-ghost" size="icon-sm" title={`Remove ${dir.name}`}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogTitle>Remove Directory</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Remove <span className="font-semibold text-fg">{dir.name}</span> from saved directories?
                                            </AlertDialogDescription>
                                            <div className="mt-2 flex justify-end gap-2">
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-danger-strong hover:bg-danger" onClick={() => handleRemoveDirectory(dir.name)}>Remove</AlertDialogAction>
                                            </div>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))
                        )}

                        <div className="border-t border-edge px-5 py-4">
                            <p className="mb-2 text-[12px] font-medium text-fg-muted">Add New Directory</p>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                <Input
                                    placeholder='Name (e.g., "My Project")'
                                    value={newDirName}
                                    onChange={(e) => setNewDirName(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Path"
                                        value={newDirPath}
                                        onChange={(e) => setNewDirPath(e.target.value)}
                                        className="min-w-0 flex-1"
                                    />
                                    <Button variant="outline" size="icon" onClick={handleBrowseDir} title="Browse for directory" className="shrink-0">
                                        <FolderOpen className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <Button
                                onClick={handleAddDirectory}
                                disabled={!newDirName.trim() || !newDirPath.trim()}
                                size="sm"
                                className="mt-3"
                            >
                                <Plus className="h-4 w-4" />
                                Add Directory
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <SectionLabel>Data</SectionLabel>
                <Card>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
                            <Button variant="outline" className="justify-start py-5" onClick={() => ExportShortcuts()}>
                                <Download className="h-4 w-4 text-accent-soft" />
                                Export Shortcuts
                            </Button>
                            <Button variant="outline" className="justify-start py-5" onClick={() => ImportShortcuts()}>
                                <Upload className="h-4 w-4 text-accent-soft" />
                                Import Shortcuts
                            </Button>
                        </div>
                        <p className="px-5 pb-5 text-[11px] text-fg-faint">
                            Shortcuts live in your <span className="mono-cell text-fg-muted">ya</span> CLI config — export merges back, import merges from a file.
                        </p>
                    </CardContent>
                </Card>

                <SectionLabel>About</SectionLabel>
                <Card>
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between gap-6 px-5 py-4">
                            <p className="text-[13px] font-medium text-fg">Version</p>
                            <span className="mono-cell text-[13px] text-fg-muted">{currentVersion || "—"}</span>
                        </div>

                        {updateAvailable && (
                            <div className="border-t border-edge px-5 py-4">
                                <div className="rounded-lg border border-accent-deep/70 bg-accent-tint/30 p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[13px] font-semibold text-fg-strong">Update available</span>
                                        <Badge variant="secondary">{updateAvailable.version}</Badge>
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                        <span className="text-[12px] text-fg-faint">
                                            Released {formatReleaseDate(updateAvailable.releaseDate)}
                                        </span>
                                        <a href={updateAvailable.releaseUrl} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm">
                                                <ExternalLink className="h-4 w-4" />
                                                Download Update
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-edge px-5 py-4">
                            <a
                                href="https://github.com/d3uceY/Ya-GUI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-soft hover:underline"
                            >
                                Website <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://github.com/d3uceY/Ya-CLI/releases/latest"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-soft hover:underline"
                            >
                                Download CLI <Download className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
