import { useState, useEffect } from "react"
import { Clock, Trash2, FolderOpen, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { RunHistoryEntry } from "@/types"
import { GetRunHistory, ClearRunHistory } from "../../../wailsjs/go/main/App"

function formatTimestamp(ts: string): { date: string; time: string } {
    const d = new Date(ts)
    return {
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
}

export default function RunHistoryPage() {
    const [history, setHistory] = useState<RunHistoryEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadHistory() }, [])

    const loadHistory = async () => {
        setLoading(true)
        try {
            setHistory(await GetRunHistory())
        } catch (err) {
            console.error("Error loading history:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleClearHistory = async () => {
        try {
            await ClearRunHistory()
            setHistory([])
        } catch (err) {
            console.error("Error clearing history:", err)
        }
    }

    return (
        <div className="flex flex-col h-full p-8 pt-4 max-w-5xl mx-auto">
            <Card className="flex-1 pt-0 overflow-y-hidden flex flex-col border-2 bg-slate-800/50 border-slate-700">
                <CardHeader className="border-b pt-6 border-slate-700 bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-blue-100 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Run History
                        </CardTitle>
                        {history.length > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:bg-red-900/30 hover:text-red-300 border border-red-800/50"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear All
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="border-2 bg-slate-800 border-slate-700">
                                    <AlertDialogTitle className="text-xl font-bold text-blue-100">
                                        Clear Run History
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-base text-slate-300">
                                        This will permanently delete all {history.length} history entries. This cannot be undone.
                                    </AlertDialogDescription>
                                    <div className="flex gap-3 justify-end mt-4">
                                        <AlertDialogCancel className="border-2 border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                            onClick={handleClearHistory}
                                        >
                                            Clear All
                                        </AlertDialogAction>
                                    </div>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                        {history.length} {history.length === 1 ? "entry" : "entries"} · newest first
                    </p>
                </CardHeader>

                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full">
                        {loading ? (
                            <div className="flex items-center justify-center py-24 text-slate-500">
                                Loading…
                            </div>
                        ) : history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
                                <Clock className="w-12 h-12 opacity-20" />
                                <p className="text-base font-medium">No history yet.</p>
                                <p className="text-sm">Run a shortcut to start tracking.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-700/50">
                                {history.map((entry, idx) => {
                                    const { date, time } = formatTimestamp(entry.timestamp)
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-4 px-6 py-4 hover:bg-slate-900/30 transition-colors"
                                        >
                                            {/* Icon */}
                                            <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-900/30 border border-blue-800/50 flex items-center justify-center">
                                                <Terminal className="w-4 h-4 text-blue-400" />
                                            </div>

                                            {/* Main content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-bold text-xs px-2 py-0.5 bg-blue-900/50 text-blue-200 border border-blue-700"
                                                    >
                                                        {entry.shortcutName || "—"}
                                                    </Badge>
                                                    <span className="text-xs text-slate-500">{date} · {time}</span>
                                                </div>
                                                <code className="text-sm text-blue-300 font-mono break-all">
                                                    {entry.command}
                                                </code>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <FolderOpen className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                                    <p className="text-xs text-slate-500 truncate">{entry.directory}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
