"use client";

import { useState, useMemo } from "react";
import { projects, formatCurrency } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [labelFilter, setLabelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        search === "" ||
        project.projectName.toLowerCase().includes(searchLower) ||
        project.customer?.toLowerCase().includes(searchLower) ||
        project.location?.toLowerCase().includes(searchLower);

      const matchesLabel =
        labelFilter === "all" ||
        (labelFilter === "none" && !project.projectLabel && !project.colorStatus) ||
        project.projectLabel === labelFilter ||
        project.colorStatus?.includes(labelFilter);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "none" && !project.colorStatus) ||
        project.colorStatus?.includes(statusFilter);

      return matchesSearch && matchesLabel && matchesStatus;
    });
  }, [search, labelFilter, statusFilter]);

  const getLabelBadgeVariant = (label: string | null) => {
    switch (label) {
      case "2025 Active project":
        return "default";
      case "2025 Active Bid":
        return "secondary";
      case "2025 New Lead":
        return "outline";
      default:
        return "outline";
    }
  };

  const getColorStatusBadgeVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "outline";
    if (status.includes("Yellow") || status.includes("Quotation")) return "secondary";
    if (status.includes("Green") || status.includes("Already Quoted")) return "default";
    if (status.includes("Red") || status.includes("Needs Clarification")) return "destructive";
    if (status.includes("Brown") || status.includes("Ongoing")) return "default";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage and track all your storage material projects
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by project, customer, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={labelFilter} onValueChange={setLabelFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Labels</SelectItem>
            <SelectItem value="2025 Active project">Active Project</SelectItem>
            <SelectItem value="2025 Active Bid">Active Bid</SelectItem>
            <SelectItem value="2025 New Lead">New Lead</SelectItem>
            <SelectItem value="none">No Label</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by color status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Quotation">Yellow - Quotation</SelectItem>
            <SelectItem value="Already Quoted">Green - Already Quoted</SelectItem>
            <SelectItem value="Needs Clarification">Red - Needs Clarification</SelectItem>
            <SelectItem value="Ongoing Project">Brown - Ongoing Project</SelectItem>
            <SelectItem value="none">No Color Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Label / Status</TableHead>
              <TableHead>Quote (w/ Tax)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-medium hover:underline"
                    >
                      {project.projectName}
                    </Link>
                  </TableCell>
                  <TableCell>{project.customer || "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.projectLabel && (
                        <Badge variant={getLabelBadgeVariant(project.projectLabel)}>
                          {project.projectLabel.replace("2025 ", "")}
                        </Badge>
                      )}
                      {project.colorStatus && (
                        <Badge variant={getColorStatusBadgeVariant(project.colorStatus)}>
                          {project.colorStatus.split(" - ")[0]}
                        </Badge>
                      )}
                      {!project.projectLabel && !project.colorStatus && "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(project.ourQuoteWithTax)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>
    </div>
  );
}
