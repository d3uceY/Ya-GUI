import { useState, useEffect } from "react"
import { useCommandMaxLength } from "@/hooks/useCommandMaxLength"
import { formatShortcuts, filterShortcuts, truncateCommand } from "@/lib/shortcutHelpers"
import { Edit2, Save, Trash2, Search, TerminalSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
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

import { GetShortcuts, AddShortcut, RemoveShortcut, ApplyShortcut } from '../../../wailsjs/go/main/App'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"


export default function ShortcutsPage() {
    const [shortcutName, setShortcutName] = useState("")
    const [commandLine, setCommandLine] = useState("")
    const [shortcuts, setShortcuts] = useState<Record<string, string>>({})
    const [searchQuery, setSearchQuery] = useState("")
    const [isEditing, setisEditing] = useState({
        name: "",
        command: ""
    })

    // Load shortcuts on component mount
    useEffect(() => {
        loadShortcuts()
    }, [])

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setisEditing((prev) => ({
            ...prev,
            command: e.target.value
        }))
    }

    const loadShortcuts = async () => {
        try {
            const data = await GetShortcuts()
            setShortcuts(data)
        } catch (error) {
            console.error("Error loading shortcuts:", error)
        }
    }

    const handleAddShortcut = async (name: string, command: string) => {
        try {
            const updatedShortcuts = await AddShortcut(name, command)
            setShortcuts(updatedShortcuts)
            setShortcutName("")
            setCommandLine("")
            setisEditing({ name: "", command: "" })
        } catch (error) {
            console.error("Error adding shortcut:", error)
        }
    }

    const handleRemoveShortcut = async (name: string) => {
        try {
            await RemoveShortcut(name)
            await loadShortcuts()
        } catch (error) {
            console.error("Error removing shortcut:", error)
        }
    }

        const handleApplyShortcut = async (command: string) => {
            try {
                await ApplyShortcut(command)
            } catch (error) {
                alert("Error running shortcut: " + error)
            }
        }

    const formattedShortcuts = formatShortcuts(shortcuts)
    const filteredShortcuts = filterShortcuts(formattedShortcuts, searchQuery)
    const commandMaxLength = useCommandMaxLength()


    return (
        <div className="flex flex-col h-full p-8 pt-4 max-w-8xl mx-auto">
            {/* Shortcuts Table */}
            <Card className="mb-8 flex-1 pt-0 overflow-y-hidden flex flex-col border-2 bg-slate-800/50 border-slate-700">
                <CardHeader className="border-b pt-6 border-slate-700 bg-slate-900/50">
                    <CardTitle className="text-xl text-blue-100">Your Shortcuts</CardTitle>
                    <div className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search shortcuts or commands..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500 h-11"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-full">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-2 border-slate-700 hover:bg-transparent">
                                    <TableHead className="w-48 font-bold text-blue-200">Shortcut</TableHead>
                                    <TableHead className="flex-1 font-bold text-blue-200">Command</TableHead>
                                    <TableHead className="w-32 text-center font-bold text-blue-200">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredShortcuts.map((shortcut) => (
                                    <TableRow key={shortcut.name} className="hover:bg-slate-900/50 border-b border-slate-700/50">
                                        <TableCell className="py-4">
                                            <Badge variant="secondary" className="font-bold text-sm px-3 py-1 bg-blue-900/50 text-blue-200 border border-blue-700">
                                                {shortcut.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {isEditing.name === shortcut.name ? (
                                                <Input
                                                    value={isEditing.command}
                                                    onChange={(e) => handleEditChange(e)}
                                                    className="border-2 border-slate-600 bg-slate-900/50 text-blue-200 focus:border-blue-500"
                                                />
                                            ) : (
                                                <code className="px-3 py-1.5 rounded bg-slate-900 text-blue-300 font-mono text-sm border border-slate-700" title={shortcut.command}>
                                                    {truncateCommand(shortcut.command, commandMaxLength)}
                                                </code>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right py-4">
                                            <div className="flex gap-2 justify-end">
                                                {isEditing.name === shortcut.name ? (
                                                    <Button
                                                        onClick={() => handleAddShortcut(isEditing.name, isEditing.command)}
                                                        variant="ghost" size="icon" className="h-9 w-9 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300">
                                                        <Save className="w-4 h-4" />
                                                    </Button>)
                                                    :
                                                    <Button
                                                        onClick={() => setisEditing(
                                                            {
                                                                name: shortcut.name,
                                                                command: shortcut.command
                                                            }
                                                        )}
                                                        variant="ghost" size="icon" className="h-9 w-9 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>}
                                                    <Button
                                                        onClick={() => handleApplyShortcut(shortcut.command)}
                                                        variant="ghost" size="icon" className="h-9 w-9 text-green-400 hover:bg-green-900/50 hover:text-green-300"
                                                        title="Run Shortcut Command"
                                                    >
                                                        <TerminalSquare className="w-4 h-4" />
                                                    </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400 hover:bg-red-900/50 hover:text-red-300">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="border-2 bg-slate-800 border-slate-700">
                                                        <AlertDialogTitle className="text-xl font-bold text-blue-100">Delete Shortcut</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-base text-slate-300">
                                                            Are you sure you want to delete <span className="font-bold text-blue-200">"{shortcut.name}"</span>? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                        <div className="flex gap-3 justify-end mt-4">
                                                            <AlertDialogCancel className="border-2 border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                                onClick={() => handleRemoveShortcut(shortcut.name)}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </div>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Add New Shortcut Form */}
            <Card className="border-2 flex-1 bg-slate-800/50 pt-0 overflow-hidden border-slate-700">
                <CardHeader className="border-b pt-6 border-slate-700 bg-slate-900/50">
                    <CardTitle className="text-xl text-blue-100">Add New Shortcut</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-blue-200 mb-2">Shortcut Name</label>
                            <Input
                                placeholder="e.g., gp, dev"
                                value={shortcutName}
                                onChange={(e) => setShortcutName(e.target.value)}
                                className="w-full border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500 h-11"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-blue-200 mb-2">Command Line</label>
                            <Input
                                placeholder="e.g., git push, npm run dev"
                                value={commandLine}
                                onChange={(e) => setCommandLine(e.target.value)}
                                className="w-full border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500 h-11"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={() => handleAddShortcut(shortcutName, commandLine)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-bold shadow-lg shadow-blue-900/50 border-2 border-blue-500 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!shortcutName.trim() || !commandLine.trim()}
                    >
                        Add Shortcut
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
