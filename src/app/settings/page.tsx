import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/data";
import { allDeals, getDealStats } from "@/lib/deals";
import { CheckCircle2, FileSpreadsheet, Database } from "lucide-react";

export default function SettingsPage() {
  const dealStats = getDealStats();
  const totalProjects = projects.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Data source information and application settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Data Source
            </CardTitle>
            <CardDescription>
              Excel database connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection Status</span>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Source File</span>
              <span className="text-sm text-muted-foreground">Storage Materials.xlsx</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Projects</span>
              <Badge variant="secondary">{totalProjects}</Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-md">
              <p className="font-medium mb-2">To update data:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Update the Excel file in <code>database/</code> folder</li>
                <li>Run <code>python scan_all.py</code></li>
                <li>Run <code>python generate_data2.py</code></li>
                <li>Commit and push to GitHub</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Deal Tracking
            </CardTitle>
            <CardDescription>Active deals and matching status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Deals</span>
              <Badge variant="secondary">{dealStats.total}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Matched to Database</span>
              <Badge variant="default" className="bg-green-600">{dealStats.matched}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Not in Database</span>
              <Badge variant="outline">{dealStats.unmatched}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Match Rate</span>
              <span className="text-sm font-bold">{((dealStats.matched / dealStats.total) * 100).toFixed(0)}%</span>
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
              <span className="text-sm text-muted-foreground">Next.js 16</span>
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
