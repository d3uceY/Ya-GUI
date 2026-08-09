import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useLocation } from "react-router-dom"
import { WindowSetTitle } from '../../wailsjs/runtime/runtime'
import { useCli, useVersion } from "@/contexts/VersionContext"
import CliNotFoundDialog from "./CliNotFoundDialog"

export default function Layout() {
  const cliExists = useCli();
  const { currentVersion } = useVersion();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        WindowSetTitle("Ya - GUI | Command Alias Manager");
        return "Command Alias Manager";
      case "/history":
        WindowSetTitle("Ya - GUI | Run History");
        return "Run History";
      case "/settings":
        WindowSetTitle("Ya - GUI | Settings");
        return "Settings";
      default: return "";
    }
  }
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-fg">
      {/* THE COMMAND PALETTE — Ya-GUI.
          THESIS: Ya-GUI is a command palette, not a dashboard. Search is the front door; type to find any alias, Enter to run it. Refuses the card-grid dev-tool look.
          OWN-WORLD: slate ground, hairline borders, blue accent; Inter for UI, JetBrains Mono for commands/aliases/data; flat panels, a `❯` prompt on every search.
          STORY: A developer lands, types, and runs a command in seconds; every surface is a searchable list (shortcuts, history, settings).
          FIRST VIEWPORT: title bar (Ya mark + title + version) / left nav rail / palette search with ❯ + tag pills + command list filling the view / status bar with key hints (↑↓ · ↵ · esc).
          FORM: Command Palette — grounded candidate 5 of 7; seed key yagui-cli-command-manager.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md */}
      <CliNotFoundDialog open={!cliExists} />

      {/* Title bar */}
      <header className="flex h-12 shrink-0 items-center gap-2.5 border-b border-edge bg-surface px-4">
        <img src="/ya.png" alt="Ya" className="h-6 w-6 rounded" />
        <span className="mono-cell text-[13px] font-bold tracking-tight text-accent-soft">ya</span>
        <span className="h-4 w-px bg-edge-strong" aria-hidden />
        <h1 className="truncate text-[13px] font-medium text-fg-muted">{getPageTitle()}</h1>
        <span className="mono-cell ml-auto hidden text-[11px] text-fg-faint sm:inline">
          v{currentVersion || "—"}
        </span>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Status bar */}
      <footer className="flex h-7 shrink-0 items-center gap-4 border-t border-edge bg-surface px-4 text-[11px] text-fg-faint">
        <span className={`flex items-center gap-1.5 ${cliExists ? "" : "text-warning"}`}>
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${cliExists ? "bg-success" : "bg-warning"}`}
            aria-hidden
          />
          {cliExists ? "ya CLI connected" : "ya CLI not found"}
        </span>
        <span className="ml-auto hidden items-center gap-4 sm:flex">
          <span className="flex items-center gap-1.5"><kbd className="kbd">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1.5"><kbd className="kbd">↵</kbd> run</span>
          <span className="flex items-center gap-1.5"><kbd className="kbd">esc</kbd> clear search</span>
        </span>
      </footer>
    </div>
  )
}
