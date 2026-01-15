"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LabelChartData {
  label: string;
  count: number;
  [key: string]: string | number;
}

interface BarChartData {
  location: string;
  count: number;
}

const STATUS_COLORS: Record<string, string> = {
  "Green - Already Quoted": "#22c55e",
  "Brown - Ongoing Project": "#a16207",
  "Yellow - Quotation": "#eab308",
  "Red - Needs Clarification": "#ef4444",
  "Purple/Pink": "#a855f7",
  "Orange": "#f97316",
  "2025 New Lead": "#3b82f6",
  "2025 Active Bid": "#6366f1",
  "2025 Active project": "#14b8a6",
  "No Status": "#94a3b8",
};

export function ProjectsByLabelChart({ data }: { data: LabelChartData[] }) {
  // Sort by count descending and take top items
  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Projects by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="label" 
                type="category" 
                width={110}
                tick={{ fontSize: 12 }}
              />
              <Tooltip contentStyle={{ borderRadius: "8px" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.label] || "#64748b"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectsByLocationChart({ data }: { data: BarChartData[] }) {
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 10);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Projects by State</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="location" 
                type="category" 
                width={35}
                tick={{ fontSize: 12 }}
              />
              <Tooltip contentStyle={{ borderRadius: "8px" }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
