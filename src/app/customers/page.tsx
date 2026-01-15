"use client";

import { useState, useMemo } from "react";
import { projects, formatCurrency } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Users, DollarSign, FolderKanban, TrendingUp } from "lucide-react";
import Link from "next/link";

interface CustomerData {
  name: string;
  projectCount: number;
  totalQuoteValue: number;
  projects: typeof projects;
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  // Aggregate customer data
  const customerData = useMemo(() => {
    const customerMap = new Map<string, CustomerData>();

    projects.forEach((project) => {
      if (!project.customer) return;

      const existing = customerMap.get(project.customer);
      if (existing) {
        existing.projectCount++;
        existing.totalQuoteValue += project.ourQuoteWithTax || 0;
        existing.projects.push(project);
      } else {
        customerMap.set(project.customer, {
          name: project.customer,
          projectCount: 1,
          totalQuoteValue: project.ourQuoteWithTax || 0,
          projects: [project],
        });
      }
    });

    return Array.from(customerMap.values());
  }, []);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    if (!search) return customerData;
    const searchLower = search.toLowerCase();
    return customerData.filter((c) =>
      c.name.toLowerCase().includes(searchLower)
    );
  }, [customerData, search]);

  // Sort by project count (repeat customers first)
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => b.projectCount - a.projectCount);
  }, [filteredCustomers]);

  // Stats
  const totalCustomers = customerData.length;
  const repeatCustomers = customerData.filter((c) => c.projectCount > 1).length;
  const topCustomerByValue = customerData.reduce(
    (max, c) => (c.totalQuoteValue > max.totalQuoteValue ? c : max),
    { name: "", totalQuoteValue: 0, projectCount: 0, projects: [] }
  );
  const totalQuoteValue = customerData.reduce((sum, c) => sum + c.totalQuoteValue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Customer analytics and project history
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repeatCustomers}</div>
            <p className="text-xs text-muted-foreground">Multiple projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Customer</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{topCustomerByValue.name || "—"}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(topCustomerByValue.totalQuoteValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quote Value</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalQuoteValue)}</div>
            <p className="text-xs text-muted-foreground">All customers</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredCustomers.length} of {totalCustomers} customers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead className="text-center">Projects</TableHead>
                <TableHead className="text-right">Total Quote Value</TableHead>
                <TableHead>Latest Project</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCustomers.slice(0, 50).map((customer) => (
                <TableRow key={customer.name}>
                  <TableCell className="font-medium">
                    {customer.name}
                    {customer.projectCount > 1 && (
                      <Badge variant="secondary" className="ml-2">
                        Repeat
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{customer.projectCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(customer.totalQuoteValue)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/projects/${customer.projects[0].id}`}
                      className="text-sm hover:underline text-primary"
                    >
                      {customer.projects[0].projectName.slice(0, 30)}
                      {customer.projects[0].projectName.length > 30 && "..."}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Customers by Quote Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerData
              .sort((a, b) => b.totalQuoteValue - a.totalQuoteValue)
              .slice(0, 10)
              .map((customer, index) => (
                <div key={customer.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.projectCount} project{customer.projectCount > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(customer.totalQuoteValue)}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
