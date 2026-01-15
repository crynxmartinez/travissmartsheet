import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your dashboard and data connections
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Source</CardTitle>
            <CardDescription>
              Configure your Google Sheets connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection Status</span>
              <Badge variant="outline">Using Mock Data</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                To connect to Google Sheets, you need to set up a Google Cloud
                Service Account and add the credentials to your environment
                variables.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>GOOGLE_SHEETS_PRIVATE_KEY</li>
                <li>GOOGLE_SHEETS_CLIENT_EMAIL</li>
                <li>GOOGLE_SHEETS_SPREADSHEET_ID</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Application information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Version</span>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Framework</span>
              <span className="text-sm text-muted-foreground">Next.js 15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">UI Library</span>
              <span className="text-sm text-muted-foreground">shadcn/ui</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
