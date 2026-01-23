"use client";

import { projects, formatCurrency } from "@/lib/data";
import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

interface ProjectWithScore {
  project: Project;
  score: number;
  maxScore: number;
}

function calculateProgressScore(project: Project): number {
  let score = 0;
  
  if (project.reachedOut) score++;
  if (project.quoteSent) score++;
  if (project.quoteAcceptedDeclined) score++;
  if (project.depositPaid === "Paid") score++;
  if (project.metalProduction) score++;
  if (project.metalDelivery === "Delivered" || project.doorDelivery === "Delivered") score++;
  
  return score;
}

export function ProgressLeaderboard() {
  const maxScore = 6;
  
  // Calculate scores for all projects
  const projectsWithScores: ProjectWithScore[] = projects
    .map((project) => ({
      project,
      score: calculateProgressScore(project),
      maxScore,
    }))
    .filter((p) => p.score > 0) // Only show projects with at least 1 milestone
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, 10); // Top 10

  if (projectsWithScores.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Project Progress Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {projectsWithScores.map((item, index) => (
            <Link
              key={item.project.id}
              href={`/projects/${item.project.id}`}
              className="block p-3 rounded-lg border hover:bg-muted group"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">
                      {item.project.projectName}
                    </p>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 text-muted-foreground flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    {item.project.customer && (
                      <span className="truncate">{item.project.customer}</span>
                    )}
                    {item.project.ourQuoteWithTax && (
                      <span className="font-medium text-green-600">
                        {formatCurrency(item.project.ourQuoteWithTax)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[150px]">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.score}/{item.maxScore}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <div className="flex items-center gap-1" title="Reached Out">
                      {item.project.reachedOut ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-300" />}
                      <span className={item.project.reachedOut ? "" : "text-muted-foreground"}>Reached</span>
                    </div>
                    <div className="flex items-center gap-1" title="Quote Sent">
                      {item.project.quoteSent ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-300" />}
                      <span className={item.project.quoteSent ? "" : "text-muted-foreground"}>Quoted</span>
                    </div>
                    <div className="flex items-center gap-1" title="Quote Accepted">
                      {item.project.quoteAcceptedDeclined ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-300" />}
                      <span className={item.project.quoteAcceptedDeclined ? "" : "text-muted-foreground"}>Accepted</span>
                    </div>
                    <div className="flex items-center gap-1" title="Deposit Paid">
                      {item.project.depositPaid === "Paid" ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-300" />}
                      <span className={item.project.depositPaid === "Paid" ? "" : "text-muted-foreground"}>Deposit</span>
                    </div>
                    <div className="flex items-center gap-1" title="In Production">
                      {item.project.metalProduction ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-300" />}
                      <span className={item.project.metalProduction ? "" : "text-muted-foreground"}>Production</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
