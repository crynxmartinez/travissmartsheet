"use client";

import { projects } from "@/lib/data";
import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ChevronRight } from "lucide-react";
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
        <div className="space-y-3">
          {projectsWithScores.map((item, index) => (
            <Link
              key={item.project.id}
              href={`/projects/${item.project.id}`}
              className="flex items-center gap-3 p-2 rounded hover:bg-muted group"
            >
              <div className="w-6 text-center font-bold text-muted-foreground">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.project.projectName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[200px]">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.score}/{item.maxScore}
                  </Badge>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
