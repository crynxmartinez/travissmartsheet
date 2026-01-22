import json

# Load the extracted projects
with open('projects_data.json', 'r') as f:
    projects = json.load(f)

# Sort by row number descending (latest first - higher row = newer project)
projects = sorted(projects, key=lambda x: -x['row'])

print(f"Generating TypeScript data for {len(projects)} projects (sorted by latest first)...")

# Generate TypeScript code
lines = []
lines.append('import { Project, KPIData } from "./types";')
lines.append('')
lines.append(f'// Data extracted from Storage Materials.xlsx - {len(projects)} projects')
lines.append('// Sorted by row number descending (latest projects first)')
lines.append('export const projects: Project[] = [')

for i, p in enumerate(projects):
    status = p.get('color_status') or p.get('label') or None
    
    lines.append('  {')
    lines.append(f'    id: {p["row"]},')
    lines.append(f'    projectName: {json.dumps(p["name"])},')
    lines.append(f'    location: {json.dumps(p["location"])},')
    lines.append(f'    projectAddress: {json.dumps(p["address"])},')
    lines.append(f'    projectLabel: {json.dumps(p["label"])},')
    lines.append(f'    quoteSent: {"true" if p["quote_sent"] else "false"},')
    lines.append(f'    reachedOut: {"true" if p["reached_out"] else "false"},')
    lines.append(f'    totalCOGs: {p["total_cogs"] if p["total_cogs"] else "null"},')
    lines.append(f'    customer: {json.dumps(p["customer"])},')
    lines.append(f'    phone: {json.dumps(p["phone"])},')
    lines.append(f'    email: {json.dumps(p["email"])},')
    lines.append(f'    buildSize: {json.dumps(str(p["build_size"]) if p["build_size"] else None)},')
    lines.append(f'    receivedProjectDetails: null,')
    lines.append(f'    zipCode: {json.dumps(str(p["zip_code"]) if p["zip_code"] else None)},')
    lines.append(f'    projectType: {json.dumps(p["project_type"])},')
    lines.append(f'    projectSQFT: {p["project_sqft"] if p["project_sqft"] else "null"},')
    lines.append(f'    receivedQuoteDrawings: null,')
    lines.append(f'    erectingLabor: null,')
    lines.append(f'    concreteLabor: null,')
    lines.append(f'    ourQuoteMaterialOnly: {p["our_quote_material"] if p["our_quote_material"] else "null"},')
    lines.append(f'    salesTaxPercent: {p["sales_tax"] if p["sales_tax"] else "null"},')
    lines.append(f'    ourQuoteWithTax: {p["our_quote_with_tax"] if p["our_quote_with_tax"] else "null"},')
    lines.append(f'    deliveredCustomerQuote: null,')
    lines.append(f'    quoteAcceptedDeclined: {json.dumps(str(p["quote_accepted"]) if p["quote_accepted"] else None)},')
    lines.append(f'    depositPaid: {json.dumps(p["deposit_paid"])},')
    lines.append(f'    engineeredDrawingsStatus: null,')
    lines.append(f'    estimatedMetalDeliveryDate: null,')
    lines.append(f'    doorOrderSubmittedDate: null,')
    lines.append(f'    estimatedDoorDeliveryDate: null,')
    lines.append(f'    metalProduction: null,')
    lines.append(f'    metalDelivery: null,')
    lines.append(f'    doorDelivery: null,')
    lines.append(f'    finalACHPayment: null,')
    lines.append(f'    contractorStartDate: null,')
    lines.append(f'    jobStatus: {json.dumps(p["job_status"])},')
    comments_val = str(p["comments"])[:200] if p["comments"] else None
    lines.append(f'    comments: {json.dumps(comments_val)},')
    lines.append(f'    colorStatus: {json.dumps(status)},')
    lines.append('  },')

lines.append('];')
lines.append('')

# Add the functions
functions_code = '''
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

  // Group by label/status
  const labelCounts: Record<string, number> = {};
  projects.forEach(p => {
    const label = p.projectLabel || p.colorStatus || "No Status";
    labelCounts[label] = (labelCounts[label] || 0) + 1;
  });
  const projectsByLabel = Object.entries(labelCounts).map(([label, count]) => ({ label, count }));

  // Group by location (extract state from project name)
  const locationCounts: Record<string, number> = {};
  projects.forEach(p => {
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

lines.append(functions_code)

# Write the file
with open('../src/lib/data.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Generated ../src/lib/data.ts with {len(projects)} projects")
