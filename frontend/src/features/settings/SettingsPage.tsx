import { useState, useEffect } from "react"
import { Download, ExternalLink, Terminal, FolderOpen, Plus, Trash2, Power } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        <div className="flex flex-col h-full p-8 pt-4 max-w-4xl mx-auto space-y-6 overflow-y-auto">

            {/* Terminal Preference */}
            <Card className="border-2 bg-slate-800/50 overflow-hidden pt-0 border-slate-700">
                <CardHeader className="border-b border-slate-700 pt-6 bg-slate-900/50">
                    <CardTitle className="text-xl text-blue-100 flex items-center gap-2">
                        <Terminal className="w-5 h-5" />
                        Terminal Preference
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-blue-200">Preferred Terminal</p>
                            <p className="text-xs text-slate-400 mt-0.5">Which terminal to open when running a shortcut</p>
                        </div>
                        <Select value={config.preferredTerminal ?? "auto"} onValueChange={handleTerminalChange}>
                            <SelectTrigger className="w-52 border-2 border-slate-600 bg-slate-900/50 text-blue-200 focus:border-blue-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                                {TERMINAL_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-blue-200 focus:bg-slate-700">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Start on Boot */}
            <Card className="border-2 bg-slate-800/50 overflow-hidden pt-0 border-slate-700">
                <CardHeader className="border-b border-slate-700 pt-6 bg-slate-900/50">
                    <CardTitle className="text-xl text-blue-100 flex items-center gap-2">
                        <Power className="w-5 h-5" />
                        Start on Boot
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-900/50 border border-slate-700">
                        <div>
                            <p className="text-sm font-bold text-blue-200">Launch YaGUI at login</p>
                            <p className="text-xs text-slate-400 mt-0.5">Automatically start when you log into your computer</p>
                        </div>
                        <Switch
                            checked={startOnBoot}
                            onCheckedChange={handleBootToggle}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Saved Directories */}
            <Card className="border-2 bg-slate-800/50 overflow-hidden pt-0 border-slate-700">
                <CardHeader className="border-b border-slate-700 pt-6 bg-slate-900/50">
                    <CardTitle className="text-xl text-blue-100 flex items-center gap-2">
                        <FolderOpen className="w-5 h-5" />
                        Saved Directories
                    </CardTitle>
                    <p className="text-sm text-slate-400 mt-1">Named workspace directories that appear when running a shortcut</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    {savedDirs.length > 0 ? (
                        <div className="space-y-2">
                            {savedDirs.map((dir) => (
                                <div key={dir.name} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-blue-200">{dir.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{dir.path}</p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-900/30 hover:text-red-300 flex-shrink-0">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="border-2 bg-slate-800 border-slate-700">
                                            <AlertDialogTitle className="text-xl font-bold text-blue-100">Remove Directory</AlertDialogTitle>
                                            <AlertDialogDescription className="text-base text-slate-300">
                                                Remove <span className="font-bold text-blue-200">"{dir.name}"</span> from saved directories?
                                            </AlertDialogDescription>
                                            <div className="flex gap-3 justify-end mt-4">
                                                <AlertDialogCancel className="border-2 border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800">Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleRemoveDirectory(dir.name)}>Remove</AlertDialogAction>
                                            </div>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 px-1">No saved directories yet.</p>
                    )}

                    <div className="border-t border-slate-700 pt-4 space-y-3">
                        <p className="text-sm font-bold text-blue-200">Add New Directory</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                                placeholder='Name (e.g., "My Project")'
                                value={newDirName}
                                onChange={(e) => setNewDirName(e.target.value)}
                                className="border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500 h-10"
                            />
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Path"
                                    value={newDirPath}
                                    onChange={(e) => setNewDirPath(e.target.value)}
                                    className="flex-1 border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500 h-10"
                                />
                                <Button onClick={handleBrowseDir} variant="ghost" size="icon" className="h-10 w-10 border-2 border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-200 flex-shrink-0">
                                    <FolderOpen className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <Button
                            onClick={handleAddDirectory}
                            disabled={!newDirName.trim() || !newDirPath.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-blue-500 hover:border-blue-400 disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Directory
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="border-2 bg-slate-800/50 overflow-hidden pt-0 border-slate-700">
                <CardHeader className="border-b border-slate-700 pt-6 bg-slate-900/50">
                    <CardTitle className="text-xl text-blue-100">Data Management</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={() => ExportShortcuts()} className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-bold shadow-lg shadow-blue-900/50 border-2 border-blue-500 hover:border-blue-400">
                            Export Shortcuts
                        </Button>
                        <Button onClick={() => ImportShortcuts()} className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-bold shadow-lg shadow-blue-900/50 border-2 border-blue-500 hover:border-blue-400">
                            Import Shortcuts
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* About */}
            <Card className="border-2 bg-slate-800/50 pt-0 overflow-hidden border-slate-700">
                <CardHeader className="border-b border-slate-700 pt-6 bg-slate-900/50">
                    <CardTitle className="text-xl text-blue-100">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-900/50 border border-slate-700">
                        <span className="text-sm font-bold text-slate-400">Version</span>
                        <span className="text-base font-bold text-blue-200">{currentVersion}</span>
                    </div>
                    {updateAvailable && (
                        <div className="p-4 rounded-lg bg-blue-900/30 border-2 border-blue-500">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className="text-base font-bold text-blue-100 block">Update Available!</span>
                                    <Badge className="mt-1 bg-blue-600 text-white text-xs">v{updateAvailable.version}</Badge>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-900/50 border border-slate-700">
                                    <span className="text-xs font-bold text-slate-400">Release Date</span>
                                    <span className="text-sm text-blue-200">{formatReleaseDate(updateAvailable.releaseDate)}</span>
                                </div>
                            </div>
                            <a href={updateAvailable.releaseUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/50 border-2 border-blue-500 hover:border-blue-400">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Download Update
                                </Button>
                            </a>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <a href="https://github.com/d3uceY/Ya-GUI" target="_blank" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold hover:underline">
                            Visit Website <ExternalLink className="w-4 h-4" />
                        </a>
                        <a href="https://github.com/d3uceY/Ya-CLI/releases/tag/v0.3.1" target="_blank" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold hover:underline">
                            Download CLI <Download className="w-4 h-4" />
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
