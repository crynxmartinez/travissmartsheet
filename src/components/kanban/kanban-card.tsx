"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import { formatCurrency } from "@/lib/data";
import { allDeals } from "@/lib/deals";
import Link from "next/link";
import { GripVertical, Flame, Sun, CircleDot } from "lucide-react";

interface KanbanCardProps {
  project: Project;
}

// Find deal category for a project
function getDealCategory(projectId: number): "active" | "hot" | "warm" | null {
  const deal = allDeals.find(d => d.matchedProjectId === projectId);
  return deal?.category ?? null;
}

export function KanbanCard({ project }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-100";
    if (status.includes("Green")) return "bg-green-100 border-green-300";
    if (status.includes("Yellow")) return "bg-yellow-100 border-yellow-300";
    if (status.includes("Red")) return "bg-red-100 border-red-300";
    if (status.includes("Brown")) return "bg-amber-100 border-amber-300";
    if (status.includes("Purple")) return "bg-purple-100 border-purple-300";
    if (status.includes("Orange")) return "bg-orange-100 border-orange-300";
    return "bg-gray-100";
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getStatusColor(project.colorStatus)}`}
      >
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <Link href={`/projects/${project.id}`}>
              <h4 className="font-medium text-sm truncate hover:underline">
                {project.projectName}
              </h4>
            </Link>
            {project.customer && (
              <p className="text-xs text-muted-foreground truncate mt-1">
                {project.customer}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {getDealCategory(project.id) === "active" && (
                <Badge className="text-xs bg-blue-600 hover:bg-blue-700">
                  <CircleDot className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
              {getDealCategory(project.id) === "hot" && (
                <Badge className="text-xs bg-orange-500 hover:bg-orange-600">
                  <Flame className="h-3 w-3 mr-1" />
                  Hot
                </Badge>
              )}
              {getDealCategory(project.id) === "warm" && (
                <Badge className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Sun className="h-3 w-3 mr-1" />
                  Warm
                </Badge>
              )}
              {project.ourQuoteWithTax && (
                <Badge variant="secondary" className="text-xs">
                  {formatCurrency(project.ourQuoteWithTax)}
                </Badge>
              )}
              {project.colorStatus && (
                <Badge variant="outline" className="text-xs">
                  {project.colorStatus.split(" - ")[0]}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
