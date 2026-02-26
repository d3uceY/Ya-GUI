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
        <AlertDialog open={open}>
            <AlertDialogContent className="border-2 bg-slate-800 border-slate-700 max-w-fit!">
                <AlertDialogTitle className="text-xl font-bold text-blue-100">
                    Choose a Directory
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-300 text-sm">
                    Select a workspace directory to run the command in.
                </AlertDialogDescription>

                {savedDirectories.length > 0 && (
                    <div className="space-y-2 my-2 max-h-48 overflow-y-auto">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Directories</p>
                        {savedDirectories.map((dir) => (
                            <button
                                key={dir.name}
                                onClick={() => setSelectedPath(dir.path)}
                                className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                                    selectedPath === dir.path
                                        ? "border-blue-500 bg-blue-900/40 text-blue-100"
                                        : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500"
                                }`}
                            >
                                <p className="font-bold text-sm">{dir.name}</p>
                                <p className="text-xs text-slate-500 truncate">{dir.path}</p>
                            </button>
                        ))}
                    </div>
                )}

                <Button
                    variant="ghost"
                    onClick={handleBrowse}
                    className="w-full border-2 border-dashed border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-500 mt-2"
                >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Browse for directory…
                </Button>

                {selectedPath && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-600 mt-2">
                        <FolderCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <p className="text-sm text-green-300 truncate">{selectedPath}</p>
                    </div>
                )}

                <div className="flex gap-3 justify-end mt-2">
                    <AlertDialogCancel
                        className="border-2 border-slate-600 bg-slate-900 hover:text-white! text-white hover:bg-slate-800"
                        onClick={handleCancel}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                        onClick={handleConfirm}
                        disabled={!selectedPath}
                    >
                        Run
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
