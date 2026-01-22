"use client";

import { useState } from "react";
import { activeDeals, hotDeals, warmDeals, getDealStats, Deal } from "@/lib/deals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CircleDot, 
  Flame, 
  Sun, 
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

type TabType = "active" | "hot" | "warm";

export default function SheetPage() {
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const stats = getDealStats();

  const getDeals = (): Deal[] => {
    switch (activeTab) {
      case "active":
        return activeDeals;
      case "hot":
        return hotDeals;
      case "warm":
        return warmDeals;
    }
  };

  const deals = getDeals();

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count: number; color: string }[] = [
    { 
      id: "active", 
      label: "Active Deals", 
      icon: <CircleDot className="h-4 w-4" />, 
      count: stats.active,
      color: "bg-blue-500",
    },
    { 
      id: "hot", 
      label: "Hot Deals", 
      icon: <Flame className="h-4 w-4" />, 
      count: stats.hot,
      color: "bg-orange-500",
    },
    { 
      id: "warm", 
      label: "Warm Deals", 
      icon: <Sun className="h-4 w-4" />, 
      count: stats.warm,
      color: "bg-yellow-500",
    },
  ];

  const getCategoryDescription = () => {
    switch (activeTab) {
      case "active":
        return "Under contract, verbally won, in permitting, or very close to contract";
      case "hot":
        return "Strong momentum, bids sent, or waiting on feedback";
      case "warm":
        return "Stalled, early-stage, or future timeline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deal Sheet</h1>
        <p className="text-muted-foreground">
          Track all active, hot, and warm deals in one place
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Matched in Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.matched}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Not in Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.unmatched}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.matched / stats.total) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={`gap-2 rounded-b-none ${activeTab === tab.id ? "" : "text-muted-foreground"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
            <Badge 
              variant={activeTab === tab.id ? "secondary" : "outline"} 
              className="ml-1"
            >
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="text-sm text-muted-foreground italic">
        {getCategoryDescription()}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px]">Deal Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Expected Start</TableHead>
                <TableHead className="text-center">Database Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {deal.name}
                  </TableCell>
                  <TableCell>
                    {deal.contact || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    {deal.notes || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    {deal.expectedStart ? (
                      <Badge variant="outline">{deal.expectedStart}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {deal.matchedProjectId ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Matched
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Not in Database
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {deal.matchedProjectId ? (
                      <Link href={`/projects/${deal.matchedProjectId}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          View Project
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">No link available</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {deals.filter(d => d.matchedProjectId).length > 0 && (
        <div className="text-sm text-muted-foreground">
          <strong>Matched Projects:</strong>{" "}
          {deals
            .filter(d => d.matchedProjectId)
            .map(d => d.matchedProjectName)
            .join(", ")}
        </div>
      )}
    </div>
  );
}
