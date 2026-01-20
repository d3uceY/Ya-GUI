import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import ShortcutsPage from "./features/home/ShortcutsPage"
import SettingsPage from "./features/settings/SettingsPage"
import { AppContextProvider } from "./contexts/VersionContext"

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ShortcutsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </AppContextProvider>
  )
}

export default App