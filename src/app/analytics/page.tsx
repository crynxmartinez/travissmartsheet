"use client";

import { useMemo } from "react";
import { projects, formatCurrency, getKPIData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Target,
  Percent,
  MapPin,
  Users,
} from "lucide-react";

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7", "#f97316", "#14b8a6", "#6366f1"];

export default function AnalyticsPage() {
  const kpiData = getKPIData();

  // Financial calculations
  const financialData = useMemo(() => {
    const withQuotes = projects.filter((p) => p.ourQuoteWithTax);
    const totalQuoteValue = withQuotes.reduce((sum, p) => sum + (p.ourQuoteWithTax || 0), 0);
    const avgQuoteValue = withQuotes.length > 0 ? totalQuoteValue / withQuotes.length : 0;
    
    const accepted = projects.filter((p) => 
      p.quoteAcceptedDeclined?.toLowerCase() === "accepted" ||
      p.depositPaid === "Paid"
    );
    const acceptedValue = accepted.reduce((sum, p) => sum + (p.ourQuoteWithTax || 0), 0);
    
    const conversionRate = withQuotes.length > 0 
      ? (accepted.length / withQuotes.length) * 100 
      : 0;

    const pipelineValue = projects
      .filter((p) => p.ourQuoteWithTax && !p.depositPaid)
      .reduce((sum, p) => sum + (p.ourQuoteWithTax || 0), 0);

    return {
      totalQuoteValue,
      avgQuoteValue,
      acceptedValue,
      conversionRate,
      pipelineValue,
      quotedCount: withQuotes.length,
      acceptedCount: accepted.length,
    };
  }, []);

  // Quote value by state
  const quoteByState = useMemo(() => {
    const stateMap = new Map<string, number>();
    const statePattern = /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/;
    
    projects.forEach((p) => {
      if (!p.ourQuoteWithTax) return;
      const match = p.projectName.match(statePattern);
      if (match) {
        const state = match[1];
        stateMap.set(state, (stateMap.get(state) || 0) + p.ourQuoteWithTax);
      }
    });

    return Array.from(stateMap.entries())
      .map(([state, value]) => ({ state, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, []);

  // Projects by status for pie chart
  const statusDistribution = useMemo(() => {
    const statusMap = new Map<string, number>();
    
    projects.forEach((p) => {
      const status = p.colorStatus || p.projectLabel || "No Status";
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    return Array.from(statusMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, []);

  // Monthly trend (simulated based on row position)
  const projectTrend = useMemo(() => {
    const buckets = 6;
    const bucketSize = Math.ceil(projects.length / buckets);
    const trend = [];
    
    for (let i = 0; i < buckets; i++) {
      const start = i * bucketSize;
      const end = Math.min(start + bucketSize, projects.length);
      const bucketProjects = projects.slice(start, end);
      const quoteValue = bucketProjects.reduce((sum, p) => sum + (p.ourQuoteWithTax || 0), 0);
      
      trend.push({
        period: `Batch ${buckets - i}`,
        projects: bucketProjects.length,
        quoteValue,
      });
    }
    
    return trend.reverse();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Financial insights and project analytics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quote Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.totalQuoteValue)}</div>
            <p className="text-xs text-muted-foreground">
              {financialData.quotedCount} projects quoted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.pipelineValue)}</div>
            <p className="text-xs text-muted-foreground">
              Pending quotes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.acceptedValue)}</div>
            <p className="text-xs text-muted-foreground">
              {financialData.acceptedCount} accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Quoted to accepted
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Quote</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.avgQuoteValue)}</div>
            <p className="text-xs text-muted-foreground">Per project</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(projects.filter(p => p.customer).map(p => p.customer)).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">States Covered</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.projectsByLocation.length}</div>
            <p className="text-xs text-muted-foreground">Across USA</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quote Value by State (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={quoteByState}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis dataKey="state" type="category" width={35} />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Volume Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar yAxisId="left" dataKey="projects" fill="#3b82f6" name="Projects" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="quoteValue" fill="#22c55e" name="Quote Value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
