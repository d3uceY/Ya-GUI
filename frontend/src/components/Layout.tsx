import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useLocation } from "react-router-dom"

export default function Layout() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/": return "Command Alias Manager";
      case "/settings": return "Settings";
      default: return "";
    }
  }
  return (
    <div className="h-screen bg-[#DCE6F1]">
      <div className="flex gap-5 p-2">
        <div className="h-12 ">
          <img src="/ya.png" alt="" className="h-full" />
        </div>
        <div className="flex items-center">
          <h1 className="text-4xl font-bold text-foreground leading-0">| {getPageTitle()}</h1>
        </div>
      </div>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
