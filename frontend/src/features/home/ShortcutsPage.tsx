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
        <div className="flex flex-col h-full p-8">
            {/* Shortcuts Table */}
            <Card className="mb-8 flex-1 flex flex-col shadow-2xl/15">
                <CardHeader>
                    <CardTitle>Shortcuts</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-x-auto">
                    <ScrollArea className="h-80">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-48">Shortcut</TableHead>
                                    <TableHead className="flex-1">Command</TableHead>
                                    <TableHead className="w-24 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {formattedShortcuts.map((shortcut) => (
                                    <TableRow key={shortcut.name}>
                                        <TableCell className="font-medium">{shortcut.name}</TableCell>
                                        <TableCell>
                                            {isEditing.name === shortcut.name ? (
                                                <Input value={isEditing.command} onChange={(e) => handleEditChange(e)} />
                                            ) : (
                                                shortcut.command
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                {isEditing.name === shortcut.name ? (
                                                    <Button
                                                        onClick={() => handleAddShortcut(isEditing.name, isEditing.command)}
                                                        variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50">
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
                                                        variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogTitle>Delete Shortcut</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{shortcut.name}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                        <div className="flex gap-3 justify-end">
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-500 hover:bg-red-600"
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
            <Card className="shadow-2xl/15">
                <CardHeader>
                    <CardTitle>Add New Shortcut</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Shortcut Name</label>
                        <Input
                            placeholder="Shortcut Name"
                            value={shortcutName}
                            onChange={(e) => setShortcutName(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Command Line</label>
                        <Input
                            placeholder="Command Line"
                            value={commandLine}
                            onChange={(e) => setCommandLine(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <Button
                        onClick={() => handleAddShortcut(shortcutName, commandLine)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-base font-medium"
                    >
                        Add Shortcut
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
