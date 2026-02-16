import * as XLSX from 'xlsx';
import { Project } from './types';

type ExportRow = Record<string, string | number | null>;

// Extract year from project data
function getProjectYear(project: Project): number {
  // Check label for year
  if (project.projectLabel?.includes('2025')) return 2025;
  if (project.projectLabel?.includes('2024')) return 2024;
  if (project.projectLabel?.includes('2026')) return 2026;
  
  // Check dates for year
  const dates = [
    project.estimatedMetalDeliveryDate,
    project.contractorStartDate,
    project.doorOrderSubmittedDate,
    project.estimatedDoorDeliveryDate,
  ];
  
  for (const dateStr of dates) {
    if (dateStr) {
      const yearMatch = dateStr.match(/202[3-6]/);
      if (yearMatch) return parseInt(yearMatch[0]);
    }
  }
  
  // Use row number as proxy (higher = newer)
  // Rows 1-150 = 2023, 150-300 = 2024, 300+ = 2025
  if (project.id > 300) return 2025;
  if (project.id > 150) return 2024;
  return 2023;
}

// Extract contact name from project title (e.g., "-Toni", "- Austin")
function extractContactFromTitle(projectName: string): { cleanName: string; assignedTo: string } {
  // Common patterns: "-Toni", "- Toni", "-Austin", "J-Toni"
  const contactPatterns = [
    /[-–]\s*(Toni|Austin|Chris|John|Mike|Brad|Paul|Ron|Joe|Ken|Steve|Kyle|Adam|Gary|Shane|Daniel|Dilip|Zak|Brian|Andrew|Brent|Jack|Brandy)\s*$/i,
    /\s+(Toni|Austin)\s*$/i,
  ];
  
  let cleanName = projectName;
  let assignedTo = '';
  
  for (const pattern of contactPatterns) {
    const match = projectName.match(pattern);
    if (match) {
      assignedTo = match[1];
      cleanName = projectName.replace(pattern, '').trim();
      break;
    }
  }
  
  return { cleanName, assignedTo };
}

// Determine Kanban stage from project data
function getKanbanStage(project: Project): string {
  // Signed = closed/won/active execution
  if (project.depositPaid === 'Paid') return 'Signed';
  if (project.quoteAcceptedDeclined?.toLowerCase().includes('accept')) return 'Signed';
  if (project.projectLabel === '2025 Active project') return 'Signed';
  if (project.metalProduction || project.metalDelivery || project.doorDelivery) return 'Signed';
  if (project.colorStatus?.includes('Brown') || project.colorStatus?.includes('Ongoing')) return 'Signed';

  // Hot Leads = active quoting/bidding, close to conversion
  if (project.projectLabel === '2025 Active Bid') return 'Hot Leads';
  if (project.quoteSent) return 'Hot Leads';
  if (project.colorStatus?.includes('Green') || project.colorStatus?.includes('Already Quoted')) return 'Hot Leads';

  // Warm Leads = early engagement/new lead
  if (project.projectLabel?.includes('New Lead')) return 'Warm Leads';
  if (project.reachedOut) return 'Warm Leads';
  if (project.colorStatus?.includes('Yellow') || project.colorStatus?.includes('Quotation')) return 'Warm Leads';

  // Unassigned/unclear
  if (project.colorStatus?.includes('Red') || project.colorStatus?.includes('Needs Clarification')) return 'Unassigned';
  if (project.customer) return 'Warm Leads';
  return 'Unassigned';
}

function projectToRow(project: Project, year: string): ExportRow {
  const { cleanName, assignedTo } = extractContactFromTitle(project.projectName);
  const stage = getKanbanStage(project);
  
  return {
    'Project Name': cleanName,
    'Year': year,
    'Stage': stage,
    'Assigned To': assignedTo || project.customer || '',
    'Customer': project.customer || '',
    'Phone': project.phone || '',
    'Email': project.email || '',
    'Location': project.location || '',
    'Address': project.projectAddress || '',
    'Zip Code': project.zipCode || '',
    'Project Type': project.projectType || '',
    'Build Size': project.buildSize || '',
    'SQFT': project.projectSQFT || null,
    'Quote Sent': project.quoteSent ? 'Yes' : 'No',
    'Reached Out': project.reachedOut ? 'Yes' : 'No',
    'Quote (Material)': project.ourQuoteMaterialOnly || null,
    'Quote (With Tax)': project.ourQuoteWithTax || null,
    'Quote Accepted': project.quoteAcceptedDeclined || '',
    'Deposit Paid': project.depositPaid || '',
    'Drawings Status': project.engineeredDrawingsStatus || '',
    'Est. Metal Delivery': project.estimatedMetalDeliveryDate || '',
    'Metal Production': project.metalProduction || '',
    'Metal Delivery': project.metalDelivery || '',
    'Door Delivery': project.doorDelivery || '',
    'Contractor Start': project.contractorStartDate || '',
    'Job Status': project.jobStatus || '',
    'Comments': project.comments || '',
  };
}


export function exportProjectsToExcel(projects: Project[]): void {
  // Group projects by year
  const projectsByYear: Record<number, Project[]> = {};
  
  projects.forEach((project) => {
    const year = getProjectYear(project);
    if (!projectsByYear[year]) projectsByYear[year] = [];
    projectsByYear[year].push(project);
  });

  // Sort years descending (newest first) and sort projects within each year by id descending
  const years = Object.keys(projectsByYear).map(Number).sort((a, b) => b - a);
  years.forEach(year => {
    projectsByYear[year].sort((a, b) => b.id - a.id);
  });

  // Calculate stats
  const totalProjects = projects.length;
  const totalQuoteValue = projects.reduce((sum, p) => sum + (p.ourQuoteWithTax || 0), 0);
  const quoteSentYes = projects.filter(p => p.quoteSent).length;
  const quoteSentNo = projects.filter(p => !p.quoteSent).length;
  const depositPaidCount = projects.filter(p => p.depositPaid === 'Paid').length;
  
  // Get unique values for filters
  const uniqueStates = [...new Set(projects.map(p => p.location).filter(Boolean))].sort();
  const uniqueCustomers = [...new Set(projects.map(p => p.customer).filter(Boolean))].sort().slice(0, 20);
  
  // Kanban stages for dropdown
  const kanbanStages = ['Signed', 'Hot Leads', 'Warm Leads', 'Unassigned'];

  // Build rows
  const rows: ExportRow[] = [];
  
  // Helper to create empty row
  const emptyRow = (): ExportRow => ({
    'Project Name': '', 'Year': '', 'Stage': '', 'Assigned To': '', 'Customer': '', 'Phone': '', 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': ''
  });
  
  // Dashboard Summary Section
  rows.push({ ...emptyRow(), 'Project Name': '📊 DASHBOARD SUMMARY' });
  rows.push({ ...emptyRow(), 'Project Name': 'Total Projects', 'Year': String(totalProjects), 'Stage': 'Total Quote Value', 'Assigned To': `$${totalQuoteValue.toLocaleString()}` });
  rows.push({ ...emptyRow(), 'Project Name': 'Quote Sent (Yes)', 'Year': String(quoteSentYes), 'Stage': 'Quote Sent (No)', 'Assigned To': String(quoteSentNo) });
  rows.push({ ...emptyRow(), 'Project Name': 'Deposit Paid', 'Year': String(depositPaidCount) });
  rows.push(emptyRow());

  // Add projects grouped by year
  years.forEach((year) => {
    const yearProjects = projectsByYear[year];
    if (yearProjects.length > 0) {
      // Calculate year totals
      const yearTotal = yearProjects.reduce((sum, p) => sum + (p.ourQuoteWithTax || 0), 0);
      
      // Add year parent row with summary
      rows.push({ 
        ...emptyRow(),
        'Project Name': `Projects ${year}`, 
        'Year': '', 
        'Stage': `${yearProjects.length} projects`, 
        'Quote (With Tax)': yearTotal > 0 ? yearTotal : null,
      });
      
      // Add project rows (to be indented after import)
      yearProjects.forEach((project) => {
        rows.push(projectToRow(project, ''));
      });
    }
  });

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 45 },  // Project Name
    { wch: 15 },  // Year
    { wch: 15 },  // Stage
    { wch: 15 },  // Assigned To
    { wch: 20 },  // Customer
    { wch: 15 },  // Phone
    { wch: 25 },  // Email
    { wch: 15 },  // Location
    { wch: 30 },  // Address
    { wch: 10 },  // Zip Code
    { wch: 15 },  // Project Type
    { wch: 12 },  // Build Size
    { wch: 10 },  // SQFT
    { wch: 10 },  // Quote Sent
    { wch: 12 },  // Reached Out
    { wch: 15 },  // Quote (Material)
    { wch: 15 },  // Quote (With Tax)
    { wch: 15 },  // Quote Accepted
    { wch: 12 },  // Deposit Paid
    { wch: 20 },  // Drawings Status
    { wch: 18 },  // Est. Metal Delivery
    { wch: 18 },  // Metal Production
    { wch: 15 },  // Metal Delivery
    { wch: 15 },  // Door Delivery
    { wch: 15 },  // Contractor Start
    { wch: 15 },  // Job Status
    { wch: 40 },  // Comments
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
  
  // Add Filter Options sheet
  const filterData = [
    { 'Filter Type': 'Kanban Stages (Dropdown)', 'Options': kanbanStages.join('\n') },
    { 'Filter Type': 'States', 'Options': uniqueStates.join('\n') },
    { 'Filter Type': 'Customers (Top 50)', 'Options': uniqueCustomers.slice(0, 50).join('\n') },
  ];
  const filterSheet = XLSX.utils.json_to_sheet(filterData);
  filterSheet['!cols'] = [{ wch: 20 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(workbook, filterSheet, 'Filter Options');

  // Add Instructions sheet
  const instructions = [
    { 'Step': '📋 SMARTSHEET SETUP INSTRUCTIONS', 'Details': '' },
    { 'Step': '', 'Details': '' },
    { 'Step': '1. Import this Excel file', 'Details': 'File > Import > Browse for this file' },
    { 'Step': '', 'Details': '' },
    { 'Step': '2. Create Hierarchy (Collapsible Groups)', 'Details': '' },
    { 'Step': '   a. Find year rows', 'Details': 'Look for rows like "Projects 2025", "Projects 2024", etc.' },
    { 'Step': '   b. Select child rows', 'Details': 'Select all project rows UNDER each year row' },
    { 'Step': '   c. Indent them', 'Details': 'Right-click > Indent (or press Ctrl + ])' },
    { 'Step': '   d. Repeat for each year', 'Details': 'This creates the collapsible + buttons' },
    { 'Step': '', 'Details': '' },
    { 'Step': '3. Set Up Stage Dropdown', 'Details': '' },
    { 'Step': '   a. Right-click "Stage" column header', 'Details': '' },
    { 'Step': '   b. Edit Column Properties', 'Details': 'Change type to "Dropdown List"' },
    { 'Step': '   c. Add these values:', 'Details': 'Signed, Hot Leads, Warm Leads, Unassigned' },
    { 'Step': '', 'Details': '' },
    { 'Step': '4. Set Up Conditional Formatting (Row Colors)', 'Details': '' },
    { 'Step': '   a. Click Format > Conditional Formatting', 'Details': '' },
    { 'Step': '   b. Add rule for each stage:', 'Details': '' },
    { 'Step': '      - Signed = Green', 'Details': 'When Stage = "Signed", apply green background' },
    { 'Step': '      - Hot Leads = Orange', 'Details': 'When Stage = "Hot Leads", apply orange background' },
    { 'Step': '      - Warm Leads = Blue', 'Details': 'When Stage = "Warm Leads", apply blue background' },
    { 'Step': '      - Unassigned = Grey', 'Details': 'When Stage = "Unassigned", apply grey background' },
    { 'Step': '', 'Details': '' },
    { 'Step': '5. Set Up Filters', 'Details': '' },
    { 'Step': '   a. Click Filter icon', 'Details': 'In the toolbar, click the Filter button' },
    { 'Step': '   b. Add filters', 'Details': 'Filter by Year, Stage, Location, Assigned To, etc.' },
    { 'Step': '', 'Details': '' },
    { 'Step': '📊 COLUMNS EXPLAINED', 'Details': '' },
    { 'Step': '   Year', 'Details': 'Project year (extracted from label, dates, or row position)' },
    { 'Step': '   Stage', 'Details': 'Kanban stage - use dropdown to change status' },
    { 'Step': '   Project Name', 'Details': 'Cleaned project name (contact removed)' },
    { 'Step': '   Assigned To', 'Details': 'Contact extracted from project title (e.g., Toni, Austin)' },
  ];
  const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
  instructionsSheet['!cols'] = [{ wch: 35 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

  // Generate filename with date
  const date = new Date().toISOString().split('T')[0];
  const filename = `Storage_Materials_Export_${date}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, filename);
}
