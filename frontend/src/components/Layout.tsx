import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useLocation } from "react-router-dom"
import { WindowSetTitle } from '../../wailsjs/runtime/runtime'
import { useCli } from "@/contexts/VersionContext"
import CliNotFoundDialog from "./CliNotFoundDialog"

export default function Layout() {
  const cliExists = useCli();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        WindowSetTitle("Ya - GUI | Command Alias Manager");
        return "Command Alias Manager";
      case "/settings":
        WindowSetTitle("Ya - GUI | Settings");
        return "Settings";
      default: return "";
    }
  }
  return (
    <>
      <CliNotFoundDialog open={!cliExists} />
      <div className="min-h-screen   bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="flex gap-5 p-2">
          <div className="h-12 ">
            <img src="/ya.png" alt="" className="h-full" />
          </div>
          <div className="flex items-center">
            <h1 className="text-4xl font-bold text-blue-100 leading-0">| {getPageTitle()}</h1>
          </div>
        </div>
        <div className="flex flex-1 min-h-[calc(100vh-40px)] border-t border-slate-700/50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
