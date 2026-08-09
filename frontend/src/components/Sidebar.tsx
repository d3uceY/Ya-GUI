import { Link, useLocation } from "react-router-dom"
import { List, Settings, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useVersion } from "@/contexts/VersionContext"

export default function Sidebar() {
  const location = useLocation()
  const { updateAvailable } = useVersion()

  const navItems = [
    { path: "/", label: "My Shortcuts", icon: List },
    { path: "/history", label: "Run History", icon: Clock },
    { path: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="flex w-14 shrink-0 flex-col border-r border-edge bg-surface md:w-52">
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} className="block">
              <span
                className={cn(
                  "relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-accent-tint text-accent-soft"
                    : "text-fg-muted hover:bg-surface-3 hover:text-fg-strong",
                )}
              >
                {isActive && (
                  <span
                    className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                    aria-hidden
                  />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden truncate md:inline">{item.label}</span>
                {item.path === "/settings" && updateAvailable && (
                  <span
                    className="ml-auto hidden h-2 w-2 shrink-0 rounded-full bg-warning md:block"
                    title="Update available"
                  />
                )}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
