import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ExternalLink, AlertTriangle } from "lucide-react"

interface CliNotFoundDialogProps {
    open: boolean
}

export default function CliNotFoundDialog({ open }: CliNotFoundDialogProps) {
    const openExternalLink = (url: string) => {
        window.open(url, "_blank")
    }

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-warning-tint bg-warning-tint/40 p-2">
                            <AlertTriangle className="h-5 w-5 text-warning" />
                        </div>
                        <AlertDialogTitle>CLI Tool Not Found</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pt-1 leading-relaxed">
                        The Ya CLI tool is either not installed or not on your system's PATH, or it isn't named{" "}
                        <span className="mono-cell font-medium text-fg">"ya"</span>. You'll need it installed to use this
                        application.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => openExternalLink("https://github.com/d3uceY/Ya-CLI?tab=readme-ov-file#installation")}
                        className="group flex items-center gap-3 rounded-lg border border-edge bg-surface p-3 text-left transition-colors hover:bg-surface-3"
                    >
                        <ExternalLink className="h-4 w-4 shrink-0 text-accent-soft" />
                        <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-medium text-fg-strong">Installation Instructions</div>
                            <div className="text-[11px] text-fg-faint">Step-by-step guide to install Ya CLI</div>
                        </div>
                    </button>

                    <button
                        onClick={() => openExternalLink("https://github.com/d3uceY/Ya-CLI/releases/latest")}
                        className="group flex items-center gap-3 rounded-lg border border-edge bg-surface p-3 text-left transition-colors hover:bg-surface-3"
                    >
                        <ExternalLink className="h-4 w-4 shrink-0 text-accent-soft" />
                        <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-medium text-fg-strong">Download Latest Release</div>
                            <div className="text-[11px] text-fg-faint">Get the latest version of Ya CLI</div>
                        </div>
                    </button>
                </div>

                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => window.location.reload()}>
                        I've Installed It — Refresh
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
