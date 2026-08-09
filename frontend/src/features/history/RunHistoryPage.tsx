import { useState, useEffect } from "react"
import { Clock, Trash2, FolderOpen, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
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

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 border-b border-edge px-4 py-4">
            <div className="h-9 w-24 shrink-0 animate-pulse rounded-md bg-surface-2" />
            <div className="h-9 w-40 shrink-0 animate-pulse rounded-md bg-surface-2" />
            <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
            </div>
        </div>
    )
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
        <div className="flex h-full flex-col p-4">
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-edge bg-surface shadow-[var(--shadow-panel)]">
                <header className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-edge px-4 py-3">
                    <Clock className="h-4 w-4 text-fg-faint" />
                    <h2 className="text-[13px] font-semibold text-fg-strong">Run History</h2>
                    {!loading && history.length > 0 && (
                        <span className="mono-cell text-[11px] text-fg-faint">
                            {history.length} {history.length === 1 ? "entry" : "entries"} · newest first
                        </span>
                    )}
                    {history.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="danger-ghost" size="sm" className="ml-auto">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Clear All</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogTitle>Clear Run History</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete all {history.length} history entries. This cannot be undone.
                                </AlertDialogDescription>
                                <div className="mt-2 flex justify-end gap-2">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-danger-strong hover:bg-danger" onClick={handleClearHistory}>
                                        Clear All
                                    </AlertDialogAction>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="border-t border-edge">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2.5 px-6 py-16 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-edge bg-surface-2">
                                <Clock className="h-5 w-5 text-fg-faint" />
                            </div>
                            <p className="text-[14px] font-medium text-fg-muted">No history yet.</p>
                            <p className="text-[12px] text-fg-faint">Run a shortcut to start tracking it here.</p>
                        </div>
                    ) : (
                        <table className="w-full border-collapse text-sm">
                            <tbody>
                                {history.map((entry, idx) => {
                                    const { date, time } = formatTimestamp(entry.timestamp)
                                    return (
                                        <tr
                                            key={idx}
                                            className="border-b border-edge transition-colors last:border-b-0 hover:bg-surface-2/60"
                                        >
                                            <td className="w-28 min-w-[104px] px-4 py-3 align-top">
                                                <span className="mono-cell block text-[11px] leading-4 text-fg-faint">{time}</span>
                                                <span className="mono-cell block text-[11px] leading-4 text-fg-faint">{date}</span>
                                            </td>
                                            <td className="w-44 min-w-[150px] max-w-[220px] px-3 py-3 align-top">
                                                <span className="mono-cell inline-flex max-w-full items-center gap-1.5 rounded-md border border-edge-strong bg-surface-2 px-2 py-1 text-[12px] font-semibold text-fg-strong">
                                                    <Terminal className="h-3 w-3 shrink-0 text-accent-soft" />
                                                    <span className="truncate">{entry.shortcutName || "—"}</span>
                                                </span>
                                            </td>
                                            <td className="min-w-0 px-3 py-3 align-top">
                                                <code className="mono-cell block break-all text-[13px] text-fg-muted">
                                                    {entry.command}
                                                </code>
                                                <div className="mt-1.5 flex items-center gap-1.5">
                                                    <FolderOpen className="h-3 w-3 shrink-0 text-fg-faint" />
                                                    <span className="truncate text-[11px] text-fg-faint">{entry.directory}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    )
}
