import { useEffect, useState } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Shortcut } from "@/types"

interface Props {
    shortcut: Shortcut | null
    open: boolean
    onSave: (name: string, command: string, description: string, tags: string) => Promise<void>
    onClose: () => void
}

export default function EditShortcutDialog({ shortcut, open, onSave, onClose }: Props) {
    const [command, setCommand] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (shortcut) {
            setCommand(shortcut.command)
            setDescription(shortcut.description)
            setTags(shortcut.tags.join(", "))
        }
    }, [shortcut])

    const handleSave = async () => {
        if (!shortcut || !command.trim()) return
        setSaving(true)
        try {
            await onSave(shortcut.name, command.trim(), description.trim(), tags.trim())
            onClose()
        } finally {
            setSaving(false)
        }
    }

    if (!shortcut) return null

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="border-2 bg-slate-800 border-slate-700 max-w-lg">
                <AlertDialogTitle className="text-xl font-bold text-blue-100">
                    Edit Shortcut
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                    <div>
                        <span className="text-slate-400 text-sm">Editing </span>
                        <Badge className="font-bold text-sm px-2 py-0.5 bg-blue-900/50 text-blue-200 border border-blue-700">
                            {shortcut.name}
                        </Badge>
                    </div>
                </AlertDialogDescription>

                <div className="space-y-4 mt-2">
                    <div>
                        <label className="block text-sm font-bold text-blue-200 mb-1.5">Command</label>
                        <Input
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="e.g., git push origin main"
                            className="border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-blue-200 mb-1.5">
                            Description <span className="font-normal text-slate-400">(optional)</span>
                        </label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What does this shortcut do?"
                            className="border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-blue-200 mb-1.5">
                            Tags <span className="font-normal text-slate-400">(comma-separated)</span>
                        </label>
                        <Input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g., git, npm, docker"
                            className="border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-4">
                    <AlertDialogCancel
                        className="border-2 border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        onClick={handleSave}
                        disabled={!command.trim() || saving}
                    >
                        {saving ? "Saving…" : "Save"}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
