
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {



    return (
        <div className="flex flex-col h-full p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
            </div>

            {/* General Section */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                        <span className="text-base text-foreground">Dark Mode</span>
                        <Switch
                        // checked={settings.darkMode}
                        // onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                        />
                    </div>
                    <div className="border-t border-border" />
                </CardContent>
            </Card> 

            {/* Data Section */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Button
                            //   onClick={handleExport}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-5 text-base font-medium"
                        >
                            Export Shortcuts
                        </Button>
                        <Button
                            //   onClick={handleImport}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-5 text-base font-medium"
                        >
                            Import Shortcuts
                        </Button>
                    </div>
                    {/* {exportMessage && <p className="text-sm text-green-600 mt-3">{exportMessage}</p>} */}
                </CardContent>
            </Card>

            {/* About Section */}
            <Card>
                <CardHeader>
                    <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-base text-foreground">ya-gui v1.2.0</p>
                    <a href="#" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium">
                        Visit Website
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </CardContent>
            </Card>
        </div>
    )
}
