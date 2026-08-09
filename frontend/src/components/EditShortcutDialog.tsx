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
    onSave: (oldName: string, newName: string, command: string, description: string, tags: string) => Promise<void>
    onClose: () => void
}

export default function EditShortcutDialog({ shortcut, open, onSave, onClose }: Props) {
    const [name, setName] = useState("")
    const [command, setCommand] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (shortcut) {
            setName(shortcut.name)
            setCommand(shortcut.command)
            setDescription(shortcut.description)
            setTags(shortcut.tags.join(", "))
        }
    }, [shortcut])

    const handleSave = async () => {
        if (!shortcut || !name.trim() || !command.trim()) return
        setSaving(true)
        try {
            await onSave(shortcut.name, name.trim(), command.trim(), description.trim(), tags.trim())
            onClose()
        } finally {
            setSaving(false)
        }
    }

    if (!shortcut) return null

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogTitle>Edit Shortcut</AlertDialogTitle>
                <AlertDialogDescription asChild>
                    <div className="flex items-center gap-1.5">
                        <span>Editing</span>
                        <Badge variant="secondary" className="mono-cell font-semibold">
                            {shortcut.name}
                        </Badge>
                    </div>
                </AlertDialogDescription>

                <div className="mt-2 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-fg">Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., gp, dev"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-fg">Command</label>
                        <Input
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="e.g., git push origin main"
                            className="font-mono"
                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-fg">
                            Description <span className="font-normal text-fg-faint">(optional)</span>
                        </label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What does this shortcut do?"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-fg">
                            Tags <span className="font-normal text-fg-faint">(comma-separated)</span>
                        </label>
                        <Input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g., git, npm, docker"
                        />
                    </div>
                </div>

                <div className="mt-2 flex justify-end gap-2">
                    <AlertDialogCancel onClick={onClose} disabled={saving}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSave}
                        disabled={!name.trim() || !command.trim() || saving}
                    >
                        {saving ? "Saving…" : "Save"}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
