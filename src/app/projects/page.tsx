"use client";

import { useState, useMemo } from "react";
import { projects, formatCurrency } from "@/lib/data";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Star } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import Link from "next/link";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [labelFilter, setLabelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const { isFavorite, toggleFavorite } = useFavorites();

  // Get unique states from project names
  const states = useMemo(() => {
    const stateSet = new Set<string>();
    const statePattern = /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/;
    projects.forEach((p) => {
      const match = p.projectName.match(statePattern);
      if (match) stateSet.add(match[1]);
    });
    return Array.from(stateSet).sort();
  }, []);

  // Get unique customers
  const customers = useMemo(() => {
    const customerSet = new Set<string>();
    projects.forEach((p) => {
      if (p.customer) customerSet.add(p.customer);
    });
    return Array.from(customerSet).sort();
  }, []);

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

      const matchesState =
        stateFilter === "all" ||
        project.projectName.includes(stateFilter);

      const matchesCustomer =
        customerFilter === "all" ||
        project.customer === customerFilter;

      return matchesSearch && matchesLabel && matchesStatus && matchesState && matchesCustomer;
    });
  }, [search, labelFilter, statusFilter, stateFilter, customerFilter]);

  const clearFilters = () => {
    setSearch("");
    setLabelFilter("all");
    setStatusFilter("all");
    setStateFilter("all");
    setCustomerFilter("all");
  };

  const hasActiveFilters = search || labelFilter !== "all" || statusFilter !== "all" || stateFilter !== "all" || customerFilter !== "all";

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

      <div className="space-y-4">
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
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={labelFilter} onValueChange={setLabelFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Label" />
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Color Status" />
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
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={customerFilter} onValueChange={setCustomerFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customers.slice(0, 50).map((customer) => (
                <SelectItem key={customer} value={customer}>
                  {customer.length > 25 ? customer.slice(0, 25) + "..." : customer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Label / Status</TableHead>
              <TableHead>Quote (w/ Tax)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <button
                      onClick={() => toggleFavorite(project.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Star
                        className={`h-4 w-4 ${isFavorite(project.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    </button>
                  </TableCell>
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
