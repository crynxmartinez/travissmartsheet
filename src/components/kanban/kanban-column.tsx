"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Project } from "@/lib/types";
import { KanbanCard } from "./kanban-card";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  projects: Project[];
  color: string;
}

export function KanbanColumn({ id, title, projects, color }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={cn(
        "flex flex-col min-w-[280px] max-w-[280px] bg-muted/50 rounded-lg",
        isOver && "ring-2 ring-primary"
      )}
    >
      <div className={`p-3 rounded-t-lg ${color}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-xs bg-white/80 px-2 py-0.5 rounded-full">
            {projects.length}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-220px)]"
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <KanbanCard key={project.id} project={project} />
          ))}
        </SortableContext>
        {projects.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No projects
          </div>
        )}
      </div>
    </div>
  );
}
