import { getKPIData, formatCurrency, projects } from "@/lib/data";
import { KPICard } from "@/components/kpi-card";
import { ProjectsByLabelChart, ProjectsByLocationChart } from "@/components/charts";
import { FavoritesSection } from "@/components/favorites-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Users,
  FileCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const kpiData = getKPIData();
  
  // Get projects needing attention
  const needsClarification = projects.filter(p => 
    p.colorStatus?.includes("Needs Clarification") || p.colorStatus?.includes("Red")
  ).slice(0, 5);
  
  const pendingQuotation = projects.filter(p => 
    p.colorStatus?.includes("Quotation") || p.colorStatus?.includes("Yellow")
  ).slice(0, 5);
  
  const noStatus = projects.filter(p => 
    !p.colorStatus && !p.projectLabel && p.customer
  ).slice(0, 5);
  
  const hasCustomerNoQuote = projects.filter(p => 
    p.customer && !p.ourQuoteWithTax
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your storage materials projects
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Projects"
          value={kpiData.totalProjects}
          description="All tracked"
          icon={FolderKanban}
        />
        <KPICard
          title="New Leads"
          value={kpiData.newLeads}
          description="2025 leads"
          icon={Users}
        />
        <KPICard
          title="Active Bids"
          value={kpiData.activeBids}
          description="Pending quotes"
          icon={TrendingUp}
        />
        <KPICard
          title="Active Projects"
          value={kpiData.activeProjects}
          description="In progress"
          icon={FileCheck}
        />
        <KPICard
          title="Total Quote Value"
          value={formatCurrency(kpiData.totalQuoteValue)}
          description="All quotes"
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectsByLabelChart data={kpiData.projectsByLabel} />
        <ProjectsByLocationChart data={kpiData.projectsByLocation} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Color Code Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <div>
                <p className="text-2xl font-bold">{kpiData.quotation}</p>
                <p className="text-xs text-muted-foreground">Quotation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <div>
                <p className="text-2xl font-bold">{kpiData.alreadyQuoted}</p>
                <p className="text-xs text-muted-foreground">Already Quoted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <div>
                <p className="text-2xl font-bold">{kpiData.needsClarification}</p>
                <p className="text-xs text-muted-foreground">Needs Clarification</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-amber-700"></div>
              <div>
                <p className="text-2xl font-bold">{kpiData.ongoingProjects}</p>
                <p className="text-xs text-muted-foreground">Ongoing Project</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Needs Attention</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <FavoritesSection />
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Needs Clarification</span>
                <Badge variant="destructive">{kpiData.needsClarification}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {needsClarification.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between text-sm hover:bg-muted p-1 rounded group"
                >
                  <span className="truncate flex-1">{p.projectName}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
              {needsClarification.length === 0 && (
                <p className="text-sm text-muted-foreground">None</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Pending Quotation</span>
                <Badge variant="secondary">{kpiData.quotation}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingQuotation.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between text-sm hover:bg-muted p-1 rounded group"
                >
                  <span className="truncate flex-1">{p.projectName}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
              {pendingQuotation.length === 0 && (
                <p className="text-sm text-muted-foreground">None</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>No Status (Has Customer)</span>
                <Badge variant="outline">{noStatus.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {noStatus.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between text-sm hover:bg-muted p-1 rounded group"
                >
                  <span className="truncate flex-1">{p.projectName}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
              {noStatus.length === 0 && (
                <p className="text-sm text-muted-foreground">None</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Has Customer, No Quote</span>
                <Badge variant="outline">{hasCustomerNoQuote.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasCustomerNoQuote.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between text-sm hover:bg-muted p-1 rounded group"
                >
                  <span className="truncate flex-1">{p.projectName}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
              {hasCustomerNoQuote.length === 0 && (
                <p className="text-sm text-muted-foreground">None</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
