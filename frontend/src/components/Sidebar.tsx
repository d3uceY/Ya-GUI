import { Link, useLocation } from "react-router-dom"
import { Menu, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "My Shortcuts", icon: Menu },
    { path: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-[#DCE6F1]">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-6 text-base",
                    isActive && "bg-blue-500 hover:bg-blue-600 text-white",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
