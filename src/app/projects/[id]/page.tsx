import { getProjectById, formatCurrency } from "@/lib/data";
import { allDeals } from "@/lib/deals";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, Flame, Sun, CircleDot, ClipboardList } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(parseInt(id));

  if (!project) {
    notFound();
  }

  // Find if this project is matched to a deal
  const matchedDeal = allDeals.find(d => d.matchedProjectId === project.id);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {project.projectName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {project.projectLabel && (
              <Badge variant={getLabelBadgeVariant(project.projectLabel)}>
                {project.projectLabel}
              </Badge>
            )}
            {project.jobStatus && (
              <Badge variant="outline">{project.jobStatus}</Badge>
            )}
          </div>
        </div>
      </div>

      {matchedDeal && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Deal Information
              {matchedDeal.category === "active" && (
                <Badge className="bg-blue-600 hover:bg-blue-700 ml-2">
                  <CircleDot className="h-3 w-3 mr-1" />
                  Active Deal
                </Badge>
              )}
              {matchedDeal.category === "hot" && (
                <Badge className="bg-orange-500 hover:bg-orange-600 ml-2">
                  <Flame className="h-3 w-3 mr-1" />
                  Hot Deal
                </Badge>
              )}
              {matchedDeal.category === "warm" && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black ml-2">
                  <Sun className="h-3 w-3 mr-1" />
                  Warm Deal
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="font-medium">{matchedDeal.contact || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium">{matchedDeal.notes || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected Start</p>
                <p className="font-medium">{matchedDeal.expectedStart || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location & Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{project.customer || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{project.location || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{project.projectAddress || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Zip Code</p>
              <p className="font-medium">{project.zipCode || "—"}</p>
            </div>
            <Separator />
            {project.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${project.phone}`} className="hover:underline">
                  {project.phone}
                </a>
              </div>
            )}
            {project.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${project.email}`} className="hover:underline">
                  {project.email}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total COGs</p>
              <p className="font-medium">{formatCurrency(project.totalCOGs)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Our Quote (Material Only)</p>
              <p className="font-medium">
                {formatCurrency(project.ourQuoteMaterialOnly)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sales Tax</p>
              <p className="font-medium">
                {project.salesTaxPercent
                  ? `${(project.salesTaxPercent * 100).toFixed(2)}%`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Our Quote (with Tax)</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(project.ourQuoteWithTax)}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Quote Status</p>
              <p className="font-medium">
                {project.quoteAcceptedDeclined || "Pending"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deposit</p>
              {project.depositPaid ? (
                <Badge
                  variant={
                    project.depositPaid === "Paid" ? "default" : "destructive"
                  }
                >
                  {project.depositPaid}
                </Badge>
              ) : (
                <span>—</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Project Type</p>
              <p className="font-medium">{project.projectType || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Build Size</p>
              <p className="font-medium">{project.buildSize || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Project SQFT</p>
              <p className="font-medium">
                {project.projectSQFT?.toLocaleString() || "—"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Quote Sent</p>
              <p className="font-medium">{project.quoteSent ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reached Out</p>
              <p className="font-medium">{project.reachedOut ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery & Production</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Engineered Drawings
                </p>
                <p className="font-medium">
                  {project.engineeredDrawingsStatus || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Metal Production</p>
                <p className="font-medium">{project.metalProduction || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Est. Metal Delivery
                </p>
                <p className="font-medium">
                  {project.estimatedMetalDeliveryDate || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Metal Delivery</p>
                <p className="font-medium">{project.metalDelivery || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Est. Door Delivery
                </p>
                <p className="font-medium">
                  {project.estimatedDoorDeliveryDate || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Door Delivery</p>
                <p className="font-medium">{project.doorDelivery || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Contractor Start Date
                </p>
                <p className="font-medium">
                  {project.contractorStartDate || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {project.comments || "No comments available"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
