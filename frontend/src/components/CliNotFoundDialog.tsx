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
      <AlertDialogContent className="bg-slate-900 border-slate-700/50 text-blue-100">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-500/10 p-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <AlertDialogTitle className="text-xl text-blue-100">
              CLI Tool Not Found
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-300 text-base pt-4">
            The Ya CLI tool is either not installed or not in your system's environmental path, or it could be in the environmental path but it's file name is not "ya".
            <br /><br />
            To use this application, you need to install the Ya CLI tool first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex flex-col gap-3 py-2">
          <button
            onClick={() => openExternalLink("https://github.com/d3uceY/Ya-CLI?tab=readme-ov-file#installation")}
            className="flex items-center gap-2 p-3 rounded-md bg-blue-950/50 hover:bg-blue-950/70 border border-slate-700/50 transition-colors group"
          >
            <ExternalLink className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-blue-100">Installation Instructions</div>
              <div className="text-xs text-slate-400">Step-by-step guide to install Ya CLI</div>
            </div>
          </button>
          
          <button
            onClick={() => openExternalLink("https://github.com/d3uceY/Ya-CLI/releases/latest")}
            className="flex items-center gap-2 p-3 rounded-md bg-blue-950/50 hover:bg-blue-950/70 border border-slate-700/50 transition-colors group"
          >
            <ExternalLink className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-blue-100">Download Latest Release</div>
              <div className="text-xs text-slate-400">Get the latest version of Ya CLI</div>
            </div>
          </button>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            I've Installed It - Refresh
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
