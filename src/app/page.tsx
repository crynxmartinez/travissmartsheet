import { getKPIData, formatCurrency } from "@/lib/data";
import { KPICard } from "@/components/kpi-card";
import { ProjectsByLabelChart, ProjectsByLocationChart } from "@/components/charts";
import {
  FolderKanban,
  Users,
  FileCheck,
  DollarSign,
  TrendingUp,
  Wallet,
  FileQuestion,
  CheckCircle,
  Clock,
  Hammer,
} from "lucide-react";

export default function Dashboard() {
  const kpiData = getKPIData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your storage materials projects ({kpiData.totalProjects} total)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Projects"
          value={kpiData.totalProjects}
          description="All tracked projects"
          icon={FolderKanban}
        />
        <KPICard
          title="New Leads"
          value={kpiData.newLeads}
          description="2025 new leads"
          icon={Users}
        />
        <KPICard
          title="Active Bids"
          value={kpiData.activeBids}
          description="Quotes pending"
          icon={TrendingUp}
        />
        <KPICard
          title="Active Projects"
          value={kpiData.activeProjects}
          description="In progress"
          icon={FileCheck}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Status by Color Code</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Quotation (Yellow)"
            value={kpiData.quotation}
            description="Pending quotation"
            icon={Clock}
          />
          <KPICard
            title="Already Quoted (Green)"
            value={kpiData.alreadyQuoted}
            description="Quote sent"
            icon={CheckCircle}
          />
          <KPICard
            title="Needs Clarification (Red)"
            value={kpiData.needsClarification}
            description="Requires follow-up"
            icon={FileQuestion}
          />
          <KPICard
            title="Ongoing Project (Brown)"
            value={kpiData.ongoingProjects}
            description="Currently active"
            icon={Hammer}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Quotes Accepted"
          value={kpiData.quotesAccepted}
          description="Confirmed deals"
          icon={DollarSign}
        />
        <KPICard
          title="Deposits Paid"
          value={kpiData.depositsPaid}
          description="Secured projects"
          icon={Wallet}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProjectsByLabelChart data={kpiData.projectsByLabel} />
        </div>
        <div className="md:col-span-2">
          <ProjectsByLocationChart data={kpiData.projectsByLocation} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">Total Quote Value</h3>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(kpiData.totalQuoteValue)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Sum of all quotes with tax
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">Average Quote Value</h3>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(
              kpiData.totalQuoteValue / (kpiData.quotesAccepted || 1)
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Per accepted quote
          </p>
        </div>
      </div>
    </div>
  );
}
