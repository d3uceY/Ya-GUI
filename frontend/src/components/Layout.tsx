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
    <div className="min-h-screen border border-white bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="flex gap-5 p-2">
        <div className="h-12 ">
          <img src="/ya.png" alt="" className="h-full" />
        </div>
        <div className="flex items-center">
          <h1 className="text-4xl font-bold text-blue-100 leading-0">| {getPageTitle()}</h1>
        </div>
      </div>
      <div className="flex flex-1 min-h-[calc(100vh-40px)] border-t border-white">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
