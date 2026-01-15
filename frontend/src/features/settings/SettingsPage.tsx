
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { GetVersion, ImportShortcuts, ExportShortcuts } from "../../../wailsjs/go/main/App"
import { useState, useEffect } from "react"


export default function SettingsPage() {
    const [version, setVersion] = useState<string>("");

    const handleImportshortcuts = async () => {
        await ImportShortcuts();
    }
    const handleExportshortcuts = async () => {
        await ExportShortcuts();
    }

    const getVersion = async () => {
        await GetVersion().then((version) => {
            setVersion(version);
        });
    }

    useEffect(() => {
        getVersion();
    }, [])


    return (
        <div className="flex flex-col h-full p-8 pt-4 max-w-4xl mx-auto">
            {/* General Section */}
            <Card className="mb-6 border-2">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-xl">General</CardTitle>
                </CardHeader>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                            <span className="text-base font-bold text-foreground block">Dark Mode</span>
                            <span className="text-sm text-muted-foreground">Toggle dark theme</span>
                        </div>
                        <Switch
                        // checked={settings.darkMode}
                        // onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Data Section */}
            <Card className="mb-6 border-2">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-xl">Data Management</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={handleExportshortcuts}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-bold shadow-sm border-2 border-transparent hover:border-blue-800"
                        >
                            Export Shortcuts
                        </Button>
                        <Button
                            onClick={handleImportshortcuts}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-bold shadow-sm border-2 border-transparent hover:border-blue-800"
                        >
                            Import Shortcuts
                        </Button>
                    </div>
                    {/* {exportMessage && <p className="text-sm text-green-600 mt-3">{exportMessage}</p>} */}
                </CardContent>
            </Card>

            {/* About Section */}
            <Card className="border-2">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-xl">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50">
                        <span className="text-sm font-bold text-muted-foreground">Version</span>
                        <span className="text-base font-bold text-foreground">{version}</span>
                    </div>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold hover:underline"
                    >
                        Visit Website
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </CardContent>
            </Card>
        </div>
    )
}
