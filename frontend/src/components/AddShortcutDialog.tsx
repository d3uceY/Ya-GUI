import { useState } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

interface Props {
    open: boolean
    onAdd: (name: string, command: string, description: string, tags: string) => Promise<void>
    onClose: () => void
}

export default function AddShortcutDialog({ open, onAdd, onClose }: Props) {
    const [name, setName] = useState("")
    const [command, setCommand] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState("")
    const [saving, setSaving] = useState(false)

    const reset = () => {
        setName("")
        setCommand("")
        setDescription("")
        setTags("")
    }

    const handleAdd = async () => {
        if (!name.trim() || !command.trim()) return
        setSaving(true)
        try {
            await onAdd(name.trim(), command.trim(), description.trim(), tags.trim())
            reset()
            onClose()
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogTitle>Add New Shortcut</AlertDialogTitle>
                <AlertDialogDescription>Create a new command-line shortcut.</AlertDialogDescription>

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
                            placeholder="e.g., git push, git checkout {branch}"
                            className="font-mono"
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
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
                    <AlertDialogCancel onClick={handleClose} disabled={saving}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleAdd}
                        disabled={!name.trim() || !command.trim() || saving}
                    >
                        {saving ? "Adding…" : "Add Shortcut"}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
