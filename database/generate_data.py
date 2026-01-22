import json

# Load the extracted projects
with open('projects_data.json', 'r') as f:
    projects = json.load(f)

print(f"Generating TypeScript data for {len(projects)} projects...")

# Generate TypeScript code
ts_code = 'import { Project, KPIData } from "./types";\n\n'
ts_code += f'// Data extracted from Storage Materials.xlsx - {len(projects)} projects\n'
ts_code += 'export const projects: Project[] = [\n'

for i, p in enumerate(projects):
    # Determine status from color or label
    status = p.get('color_status') or p.get('label') or None
    
    ts_code += '  {\n'
    ts_code += f'    id: {p["row"]},\n'
    ts_code += f'    projectName: {json.dumps(p["name"])},\n'
    ts_code += f'    location: {json.dumps(p["location"])},\n'
    ts_code += f'    projectAddress: {json.dumps(p["address"])},\n'
    ts_code += f'    projectLabel: {json.dumps(p["label"])},\n'
    ts_code += f'    quoteSent: {"true" if p["quote_sent"] else "false"},\n'
    ts_code += f'    reachedOut: {"true" if p["reached_out"] else "false"},\n'
    ts_code += f'    totalCOGs: {p["total_cogs"] if p["total_cogs"] else "null"},\n'
    ts_code += f'    customer: {json.dumps(p["customer"])},\n'
    ts_code += f'    phone: {json.dumps(p["phone"])},\n'
    ts_code += f'    email: {json.dumps(p["email"])},\n'
    ts_code += f'    buildSize: {json.dumps(str(p["build_size"]) if p["build_size"] else None)},\n'
    ts_code += f'    receivedProjectDetails: null,\n'
    ts_code += f'    zipCode: {json.dumps(str(p["zip_code"]) if p["zip_code"] else None)},\n'
    ts_code += f'    projectType: {json.dumps(p["project_type"])},\n'
    ts_code += f'    projectSQFT: {p["project_sqft"] if p["project_sqft"] else "null"},\n'
    ts_code += f'    receivedQuoteDrawings: null,\n'
    ts_code += f'    erectingLabor: null,\n'
    ts_code += f'    concreteLabor: null,\n'
    ts_code += f'    ourQuoteMaterialOnly: {p["our_quote_material"] if p["our_quote_material"] else "null"},\n'
    ts_code += f'    salesTaxPercent: {p["sales_tax"] if p["sales_tax"] else "null"},\n'
    ts_code += f'    ourQuoteWithTax: {p["our_quote_with_tax"] if p["our_quote_with_tax"] else "null"},\n'
    ts_code += f'    deliveredCustomerQuote: null,\n'
    ts_code += f'    quoteAcceptedDeclined: {json.dumps(str(p["quote_accepted"]) if p["quote_accepted"] else None)},\n'
    ts_code += f'    depositPaid: {json.dumps(p["deposit_paid"])},\n'
    ts_code += f'    engineeredDrawingsStatus: null,\n'
    ts_code += f'    estimatedMetalDeliveryDate: null,\n'
    ts_code += f'    doorOrderSubmittedDate: null,\n'
    ts_code += f'    estimatedDoorDeliveryDate: null,\n'
    ts_code += f'    metalProduction: null,\n'
    ts_code += f'    metalDelivery: null,\n'
    ts_code += f'    doorDelivery: null,\n'
    ts_code += f'    finalACHPayment: null,\n'
    ts_code += f'    contractorStartDate: null,\n'
    ts_code += f'    jobStatus: {json.dumps(p["job_status"])},\n'
    ts_code += f'    comments: {json.dumps(str(p["comments"])[:200] if p["comments"] else None)},\n'
    ts_code += f'    colorStatus: {json.dumps(status)},\n'
    ts_code += '  },\n'

ts_code += '];\n'

export function getKPIData(): KPIData {
  const totalProjects = projects.length;
  const newLeads = projects.filter(p => p.projectLabel === "2025 New Lead").length;
  const activeBids = projects.filter(p => p.projectLabel === "2025 Active Bid").length;
  const activeProjects = projects.filter(p => p.projectLabel === "2025 Active project").length;
  
  // Count by color status
  const quotation = projects.filter(p => p.colorStatus?.includes("Quotation")).length;
  const alreadyQuoted = projects.filter(p => p.colorStatus?.includes("Already Quoted")).length;
  const needsClarification = projects.filter(p => p.colorStatus?.includes("Needs Clarification")).length;
  const ongoingProjects = projects.filter(p => p.colorStatus?.includes("Ongoing Project")).length;
  
  const quotesAccepted = projects.filter(p => 
    p.quoteAcceptedDeclined && 
    (p.quoteAcceptedDeclined.toLowerCase() === "accepted" || p.quoteAcceptedDeclined.match(/^\\d{2}\\/\\d{2}\\/\\d{2}$/))
  ).length;
  const depositsPaid = projects.filter(p => p.depositPaid === "Paid").length;
  const totalQuoteValue = projects.reduce((sum, p) => sum + (p.ourQuoteWithTax || 0), 0);

  // Group by label
  const labelCounts: Record<string, number> = {};
  projects.forEach(p => {
    const label = p.projectLabel || p.colorStatus || "No Status";
    labelCounts[label] = (labelCounts[label] || 0) + 1;
  });
  const projectsByLabel = Object.entries(labelCounts).map(([label, count]) => ({ label, count }));

  // Group by location
  const locationCounts: Record<string, number> = {};
  projects.forEach(p => {
    // Extract state from project name if no location
    let location = p.location;
    if (!location && p.projectName) {
      const stateMatch = p.projectName.match(/\\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\\b/);
      if (stateMatch) {
        location = stateMatch[1];
      }
    }
    if (location) {
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    }
  });
  const projectsByLocation = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return {
    totalProjects,
    newLeads,
    activeBids,
    activeProjects,
    quotesAccepted,
    depositsPaid,
    totalQuoteValue,
    projectsByLabel,
    projectsByLocation,
    // Additional KPIs
    quotation,
    alreadyQuoted,
    needsClarification,
    ongoingProjects,
  };
}

export function getProjectById(id: number): Project | undefined {
  return projects.find(p => p.id === id);
}

export function formatCurrency(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
'''

# Write the file
with open('app/src/lib/data.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print(f"Generated app/src/lib/data.ts with {len(projects)} projects")
