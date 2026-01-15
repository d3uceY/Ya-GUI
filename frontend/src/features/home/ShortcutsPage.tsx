import { useState, useEffect } from "react"
import { Edit2, Save, Trash2 } from "lucide-react"
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

import { GetShortcuts, AddShortcut, RemoveShortcut } from '../../../wailsjs/go/main/App'
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Badge } from "@/components/ui/badge"


export default function ShortcutsPage() {
    const [shortcutName, setShortcutName] = useState("")
    const [commandLine, setCommandLine] = useState("")
    const [shortcuts, setShortcuts] = useState<Record<string, string>>({})
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

    const formattedShortcuts = Object.entries(shortcuts).map(([name, command]) => ({ name, command }))

    return (
        <div className="flex flex-col h-full p-8 max-w-6xl mx-auto">
            {/* Shortcuts Table */}
            <Card className="mb-8 flex-1 flex flex-col border-2">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-xl">Your Shortcuts</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-x-auto p-0">
                    <ScrollArea className="h-80">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-2 hover:bg-transparent">
                                    <TableHead className="w-48 font-bold text-foreground">Shortcut</TableHead>
                                    <TableHead className="flex-1 font-bold text-foreground">Command</TableHead>
                                    <TableHead className="w-32 text-right font-bold text-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {formattedShortcuts.map((shortcut) => (
                                    <TableRow key={shortcut.name} className="hover:bg-muted/50">
                                        <TableCell className="py-4">
                                            <Badge variant="secondary" className="font-bold text-sm px-3 py-1">
                                                {shortcut.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {isEditing.name === shortcut.name ? (
                                                <Input 
                                                    value={isEditing.command} 
                                                    onChange={(e) => handleEditChange(e)}
                                                    className="border-2 focus:border-blue-500"
                                                />
                                            ) : (
                                                <code className="px-3 py-1.5 rounded bg-blue-50 text-blue-700 font-mono text-sm border border-blue-200">
                                                    {shortcut.command}
                                                </code>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right py-4">
                                            <div className="flex gap-2 justify-end">
                                                {isEditing.name === shortcut.name ? (
                                                    <Button
                                                        onClick={() => handleAddShortcut(isEditing.name, isEditing.command)}
                                                        variant="ghost" size="icon" className="h-9 w-9 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
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
                                                        variant="ghost" size="icon" className="h-9 w-9 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-red-600 hover:bg-red-100 hover:text-red-700">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="border-2">
                                                        <AlertDialogTitle className="text-xl font-bold">Delete Shortcut</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-base">
                                                            Are you sure you want to delete <span className="font-bold text-foreground">"{shortcut.name}"</span>? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                        <div className="flex gap-3 justify-end mt-4">
                                                            <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
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
            <Card className="border-2">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-xl">Add New Shortcut</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Shortcut Name</label>
                            <Input
                                placeholder="e.g., gp, dev"
                                value={shortcutName}
                                onChange={(e) => setShortcutName(e.target.value)}
                                className="w-full border-2 focus:border-blue-500 h-11"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Command Line</label>
                            <Input
                                placeholder="e.g., git push, npm run dev"
                                value={commandLine}
                                onChange={(e) => setCommandLine(e.target.value)}
                                className="w-full border-2 focus:border-blue-500 h-11"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={() => handleAddShortcut(shortcutName, commandLine)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-bold shadow-sm"
                        disabled={!shortcutName.trim() || !commandLine.trim()}
                    >
                        Add Shortcut
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
