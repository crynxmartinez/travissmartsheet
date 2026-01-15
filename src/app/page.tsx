import { getKPIData, formatCurrency } from "@/lib/data";
import { KPICard } from "@/components/kpi-card";
import { ProjectsByLabelChart, ProjectsByLocationChart } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  Users,
  FileCheck,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function Dashboard() {
  const kpiData = getKPIData();

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
    </div>
  );
}
