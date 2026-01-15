import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#E7ECF3]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
