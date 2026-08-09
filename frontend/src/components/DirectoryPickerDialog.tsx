import { useState } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FolderOpen, FolderCheck } from "lucide-react"
import type { SavedDir } from "@/types"
import { SelectDirectory } from "../../wailsjs/go/main/App"

interface Props {
    open: boolean
    savedDirectories: SavedDir[]
    onConfirm: (dirPath: string) => void
    onCancel: () => void
}

export default function DirectoryPickerDialog({ open, savedDirectories, onConfirm, onCancel }: Props) {
    const [selectedPath, setSelectedPath] = useState<string>("")

    const handleBrowse = async () => {
        const path = await SelectDirectory()
        if (path) setSelectedPath(path)
    }

    const handleConfirm = () => {
        if (selectedPath) {
            onConfirm(selectedPath)
            setSelectedPath("")
        }
    }

    const handleCancel = () => {
        setSelectedPath("")
        onCancel()
    }

    return (
        <AlertDialog open={open} onOpenChange={(o) => { if (!o) handleCancel() }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogTitle>Choose a Directory</AlertDialogTitle>
                <AlertDialogDescription>
                    Select a workspace directory to run the command in.
                </AlertDialogDescription>

                {savedDirectories.length > 0 && (
                    <div className="my-2 max-h-48 space-y-1.5 overflow-y-auto">
                        <p className="text-[11px] font-semibold tracking-wider text-fg-faint uppercase">Saved Directories</p>
                        {savedDirectories.map((dir) => (
                            <button
                                key={dir.name}
                                onClick={() => setSelectedPath(dir.path)}
                                className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                                    selectedPath === dir.path
                                        ? "border-accent bg-accent-tint text-accent-soft"
                                        : "border-edge bg-surface text-fg-muted hover:border-edge-strong hover:text-fg-strong"
                                }`}
                            >
                                <p className="text-[13px] font-medium">{dir.name}</p>
                                <p className="mono-cell truncate text-[11px] text-fg-faint">{dir.path}</p>
                            </button>
                        ))}
                    </div>
                )}

                <Button
                    variant="ghost"
                    onClick={handleBrowse}
                    className="mt-2 w-full border border-dashed border-edge-strong text-fg-muted hover:border-accent-deep hover:text-accent-soft"
                >
                    <FolderOpen className="h-4 w-4" />
                    Browse for directory…
                </Button>

                {selectedPath && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-edge bg-surface-2 px-3 py-2">
                        <FolderCheck className="h-4 w-4 shrink-0 text-success" />
                        <p className="mono-cell truncate text-[12px] text-success">{selectedPath}</p>
                    </div>
                )}

                <div className="mt-2 flex justify-end gap-2">
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={!selectedPath}>
                        Run
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
