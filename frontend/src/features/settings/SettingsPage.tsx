
import { Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"
import { ImportShortcuts, ExportShortcuts } from "../../../wailsjs/go/main/App"
import { useVersion } from "@/contexts/VersionContext"


export default function SettingsPage() {
    const { currentVersion, updateAvailable } = useVersion();

    const handleImportshortcuts = async () => {
        await ImportShortcuts();
    }
    const handleExportshortcuts = async () => {
        await ExportShortcuts();
    }


    return (
        <div className="flex flex-col h-full p-8 pt-4 max-w-4xl mx-auto">

            {/* Data Section */}
            <Card className="mb-6 border-2 bg-slate-800/50 overflow-hidden pt-0 border-slate-700">
                <CardHeader className="border-b border-slate-700 pt-6 bg-slate-900/50">
                    <CardTitle className="text-xl text-blue-100">Data Management</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={handleExportshortcuts}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-bold shadow-lg shadow-blue-900/50 border-2 border-blue-500 hover:border-blue-400"
                        >
                            Export Shortcuts
                        </Button>
                        <Button
                            onClick={handleImportshortcuts}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-bold shadow-lg shadow-blue-900/50 border-2 border-blue-500 hover:border-blue-400"
                        >
                            Import Shortcuts
                        </Button>
                    </div>
                    {/* {exportMessage && <p className="text-sm text-green-600 mt-3">{exportMessage}</p>} */}
                </CardContent>
            </Card>

            {/* About Section */}
            <Card className="border-2 bg-slate-800/50 pt-0 overflow-hidden border-slate-700">
                <CardHeader className="border-b border-slate-700 pt-6 bg-slate-900/50">
                    <CardTitle className="text-xl text-blue-100">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-900/50 border border-slate-700">
                        <span className="text-sm font-bold text-slate-400">Version</span>
                        <span className="text-base font-bold text-blue-200">{currentVersion}</span>
                    </div>

                    {updateAvailable && (
                        <div className="p-4 rounded-lg bg-blue-900/30 border-2 border-blue-500">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className="text-base font-bold text-blue-100 block">Update Available!</span>
                                    <span className="text-sm text-blue-300">Version {updateAvailable.version}</span>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between py-2 px-3 rounded bg-slate-900/50 border border-slate-700">
                                    <span className="text-xs font-bold text-slate-400">Release Date</span>
                                    <span className="text-sm text-blue-200">{new Date(updateAvailable.releaseDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <a
                                href={updateAvailable.releaseUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/50 border-2 border-blue-500 hover:border-blue-400">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Download Update
                                </Button>
                            </a>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/d3uceY/Ya-GUI"
                            target="_blank"
                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold hover:underline"
                        >
                            Visit Website
                            <ExternalLink className="w-4 h-4" />
                        </a>
                        <a
                            href="https://github.com/d3uceY/Ya-CLI/releases/tag/v0.3.1"
                            target="_blank"
                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold hover:underline"
                        >
                            Download CLI
                            <Download className="w-4 h-4" />
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
