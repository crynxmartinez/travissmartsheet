"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Project } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";

interface KanbanBoardProps {
  projects: Project[];
}

type ColumnId = "unassigned" | "new_lead" | "quoted" | "accepted" | "deposit_paid" | "in_progress" | "completed" | "needs_attention" | "no_status";

interface Column {
  id: ColumnId;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: "unassigned", title: "Unassigned", color: "bg-gray-400 text-white" },
  { id: "new_lead", title: "New Lead", color: "bg-blue-500 text-white" },
  { id: "quoted", title: "Quoted", color: "bg-green-500 text-white" },
  { id: "needs_attention", title: "Needs Attention", color: "bg-red-500 text-white" },
  { id: "accepted", title: "Accepted", color: "bg-emerald-600 text-white" },
  { id: "deposit_paid", title: "Deposit Paid", color: "bg-purple-500 text-white" },
  { id: "in_progress", title: "In Progress", color: "bg-amber-600 text-white" },
];

function getProjectColumn(project: Project): ColumnId {
  // Check project label first
  if (project.projectLabel === "2025 New Lead") return "new_lead";
  if (project.projectLabel === "2025 Active Bid") return "quoted";
  if (project.projectLabel === "2025 Active project") return "in_progress";
  
  // Check color status
  if (project.colorStatus?.includes("Green") || project.colorStatus?.includes("Already Quoted")) return "quoted";
  if (project.colorStatus?.includes("Red") || project.colorStatus?.includes("Needs Clarification")) return "needs_attention";
  if (project.colorStatus?.includes("Yellow") || project.colorStatus?.includes("Quotation")) return "new_lead";
  if (project.colorStatus?.includes("Brown") || project.colorStatus?.includes("Ongoing")) return "in_progress";
  
  // Check deposit status
  if (project.depositPaid === "Paid") return "deposit_paid";
  
  // Check quote accepted
  if (project.quoteAcceptedDeclined?.toLowerCase() === "accepted") return "accepted";
  
  // Default to new lead if has customer, otherwise unassigned (grey)
  if (project.customer) return "new_lead";
  
  return "unassigned";
}

export function KanbanBoard({ projects }: KanbanBoardProps) {
  // Initialize columns with projects
  const initialColumnProjects: Record<ColumnId, Project[]> = {
    unassigned: [],
    new_lead: [],
    quoted: [],
    needs_attention: [],
    accepted: [],
    deposit_paid: [],
    in_progress: [],
    completed: [],
    no_status: [],
  };

  projects.forEach((project) => {
    const columnId = getProjectColumn(project);
    initialColumnProjects[columnId].push(project);
  });

  const [columnProjects, setColumnProjects] = useState(initialColumnProjects);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findProjectById = (id: number): Project | undefined => {
    for (const columnId of Object.keys(columnProjects) as ColumnId[]) {
      const project = columnProjects[columnId].find((p) => p.id === id);
      if (project) return project;
    }
    return undefined;
  };

  const findColumnByProjectId = (id: number): ColumnId | undefined => {
    for (const columnId of Object.keys(columnProjects) as ColumnId[]) {
      if (columnProjects[columnId].some((p) => p.id === id)) {
        return columnId;
      }
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const project = findProjectById(active.id as number);
    setActiveProject(project || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    const activeColumn = findColumnByProjectId(activeId);
    let overColumn: ColumnId | undefined;

    // Check if over is a column
    if (columns.some((c) => c.id === overId)) {
      overColumn = overId as ColumnId;
    } else {
      // Over is a project, find its column
      overColumn = findColumnByProjectId(overId as number);
    }

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumnProjects((prev) => {
      const activeProjects = [...prev[activeColumn]];
      const overProjects = [...prev[overColumn]];

      const activeIndex = activeProjects.findIndex((p) => p.id === activeId);
      const [movedProject] = activeProjects.splice(activeIndex, 1);

      overProjects.push(movedProject);

      return {
        ...prev,
        [activeColumn]: activeProjects,
        [overColumn]: overProjects,
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveProject(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-4 p-3 bg-muted rounded-lg">
        <p className="text-sm font-medium mb-2">Card Color Legend (from Excel):</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-300 border border-gray-400"></div>
            <span>No Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-300 border border-yellow-400"></div>
            <span>Yellow - Quotation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-300 border border-green-400"></div>
            <span>Green - Already Quoted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-300 border border-red-400"></div>
            <span>Red - Needs Clarification</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-300 border border-amber-400"></div>
            <span>Brown - Ongoing Project</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-300 border border-purple-400"></div>
            <span>Purple/Pink</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-300 border border-orange-400"></div>
            <span>Orange</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            projects={columnProjects[column.id]}
            color={column.color}
          />
        ))}
      </div>
      <DragOverlay>
        {activeProject ? <KanbanCard project={activeProject} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
