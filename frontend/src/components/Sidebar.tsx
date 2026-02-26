import { Link, useLocation } from "react-router-dom"
import { Menu, Settings, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useVersion } from "@/contexts/VersionContext"

export default function Sidebar() {
  const location = useLocation()
  const { updateAvailable } = useVersion()

  const navItems = [
    { path: "/", label: "My Shortcuts", icon: Menu },
    { path: "/history", label: "Run History", icon: Clock },
    { path: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-slate-900/50 border-r border-slate-700/50">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const showUpdateIndicator = item.path === "/settings" && updateAvailable
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-6 text-base text-blue-200 hover:bg-slate-800/70 hover:text-blue-100",
                    isActive && "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/50",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {showUpdateIndicator && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
