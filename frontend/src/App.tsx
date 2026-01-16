import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import ShortcutsPage from "./features/home/ShortcutsPage"
import SettingsPage from "./features/settings/SettingsPage"
import { VersionContextProvider } from "./contexts/VersionContext"

function App() {
  return (
    <VersionContextProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ShortcutsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </VersionContextProvider>
  )
}

export default App