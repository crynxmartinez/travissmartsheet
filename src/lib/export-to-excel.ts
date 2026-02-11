import * as XLSX from 'xlsx';
import { Project } from './types';

type ExportRow = Record<string, string | number | null>;

function categorizeProject(project: Project): string {
  // Check label first
  if (project.projectLabel === '2025 Active project') return '2025 Active Projects';
  if (project.projectLabel === '2025 Active Bid') return '2025 Active Bids';
  if (project.projectLabel === '2025 New Lead') return '2025 New Leads';
  
  // Check color status
  if (project.colorStatus?.includes('Red') || project.colorStatus?.includes('Needs Clarification')) return 'Needs Clarification';
  if (project.colorStatus?.includes('Green') || project.colorStatus?.includes('Already Quoted')) return 'Already Quoted';
  if (project.colorStatus?.includes('Yellow') || project.colorStatus?.includes('Quotation')) return 'Pending Quotation';
  if (project.colorStatus?.includes('Brown') || project.colorStatus?.includes('Ongoing')) return 'Ongoing Projects';
  
  return 'No Status';
}

function projectToRow(project: Project, category: string): ExportRow {
  return {
    'Category': category,
    'Project Name': project.projectName,
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
  // Group projects by category
  const categories: Record<string, Project[]> = {
    '2025 Active Projects': [],
    '2025 Active Bids': [],
    '2025 New Leads': [],
    'Needs Clarification': [],
    'Already Quoted': [],
    'Pending Quotation': [],
    'Ongoing Projects': [],
    'No Status': [],
  };

  projects.forEach((project) => {
    const category = categorizeProject(project);
    categories[category].push(project);
  });

  // Calculate stats
  const totalProjects = projects.length;
  const totalQuoteValue = projects.reduce((sum, p) => sum + (p.ourQuoteWithTax || 0), 0);
  const quoteSentYes = projects.filter(p => p.quoteSent).length;
  const quoteSentNo = projects.filter(p => !p.quoteSent).length;
  const depositPaid = projects.filter(p => p.depositPaid === 'Paid').length;
  
  // Get unique values for filters
  const uniqueLabels = [...new Set(projects.map(p => p.projectLabel).filter(Boolean))];
  const uniqueStatuses = [...new Set(projects.map(p => p.colorStatus).filter(Boolean))];
  const uniqueStates = [...new Set(projects.map(p => p.location).filter(Boolean))].sort();
  const uniqueCustomers = [...new Set(projects.map(p => p.customer).filter(Boolean))].sort().slice(0, 20);

  // Build rows
  const rows: ExportRow[] = [];
  
  // Dashboard Summary Section
  rows.push({ 'Category': '📊 DASHBOARD SUMMARY', 'Project Name': '', 'Customer': '', 'Phone': '', 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });
  rows.push({ 'Category': 'Total Projects', 'Project Name': String(totalProjects), 'Customer': 'Total Quote Value', 'Phone': `$${totalQuoteValue.toLocaleString()}`, 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });
  rows.push({ 'Category': 'Quote Sent (Yes)', 'Project Name': String(quoteSentYes), 'Customer': 'Quote Sent (No)', 'Phone': String(quoteSentNo), 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });
  rows.push({ 'Category': 'Deposit Paid', 'Project Name': String(depositPaid), 'Customer': '', 'Phone': '', 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });
  
  // Filter Options Row
  rows.push({ 'Category': '', 'Project Name': '', 'Customer': '', 'Phone': '', 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });
  rows.push({ 'Category': '🔍 FILTER OPTIONS', 'Project Name': `Labels: ${uniqueLabels.join(', ')}`, 'Customer': '', 'Phone': '', 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });
  rows.push({ 'Category': '', 'Project Name': `Statuses: ${uniqueStatuses.join(', ')}`, 'Customer': '', 'Phone': '', 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });
  rows.push({ 'Category': '', 'Project Name': `States: ${uniqueStates.slice(0, 15).join(', ')}...`, 'Customer': '', 'Phone': '', 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });
  rows.push({ 'Category': '', 'Project Name': `Customers: ${uniqueCustomers.slice(0, 10).join(', ')}...`, 'Customer': '', 'Phone': '', 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });
  
  // Empty row before data
  rows.push({ 'Category': '', 'Project Name': '', 'Customer': '', 'Phone': '', 'Email': '', 'Location': '', 'Address': '', 'Zip Code': '', 'Project Type': '', 'Build Size': '', 'SQFT': null, 'Quote Sent': '', 'Reached Out': '', 'Quote (Material)': null, 'Quote (With Tax)': null, 'Quote Accepted': '', 'Deposit Paid': '', 'Drawings Status': '', 'Est. Metal Delivery': '', 'Metal Production': '', 'Metal Delivery': '', 'Door Delivery': '', 'Contractor Start': '', 'Job Status': '', 'Comments': '' });

  // Category order
  const categoryOrder = [
    '2025 Active Projects',
    '2025 Active Bids',
    '2025 New Leads',
    'Needs Clarification',
    'Already Quoted',
    'Pending Quotation',
    'Ongoing Projects',
    'No Status',
  ];

  categoryOrder.forEach((category) => {
    const categoryProjects = categories[category];
    if (categoryProjects.length > 0) {
      // Calculate category totals
      const categoryTotal = categoryProjects.reduce((sum, p) => sum + (p.ourQuoteWithTax || 0), 0);
      
      // Add category parent row with summary
      rows.push({ 
        'Category': category, 
        'Project Name': `${categoryProjects.length} projects`, 
        'Customer': '', 
        'Phone': '', 
        'Email': '', 
        'Location': '', 
        'Address': '', 
        'Zip Code': '', 
        'Project Type': '', 
        'Build Size': '', 
        'SQFT': null, 
        'Quote Sent': '', 
        'Reached Out': '', 
        'Quote (Material)': null, 
        'Quote (With Tax)': categoryTotal > 0 ? categoryTotal : null, 
        'Quote Accepted': '', 
        'Deposit Paid': '', 
        'Drawings Status': '', 
        'Est. Metal Delivery': '', 
        'Metal Production': '', 
        'Metal Delivery': '', 
        'Door Delivery': '', 
        'Contractor Start': '', 
        'Job Status': '', 
        'Comments': '' 
      });
      
      // Add project rows (to be indented after import)
      categoryProjects.forEach((project) => {
        rows.push(projectToRow(project, ''));
      });
    }
  });

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 22 },  // Category
    { wch: 45 },  // Project Name
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
    { 'Filter Type': 'Labels', 'Options': uniqueLabels.join('\n') },
    { 'Filter Type': 'Statuses', 'Options': uniqueStatuses.join('\n') },
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
    { 'Step': '   a. Find category rows', 'Details': 'Look for rows like "2025 Active Projects", "2025 Active Bids", etc.' },
    { 'Step': '   b. Select child rows', 'Details': 'Select all project rows UNDER each category row' },
    { 'Step': '   c. Indent them', 'Details': 'Right-click > Indent (or press Ctrl + ])' },
    { 'Step': '   d. Repeat for each category', 'Details': 'This creates the collapsible + buttons' },
    { 'Step': '', 'Details': '' },
    { 'Step': '3. Set Up Filters', 'Details': '' },
    { 'Step': '   a. Click Filter icon', 'Details': 'In the toolbar, click the Filter button' },
    { 'Step': '   b. Add filters', 'Details': 'Filter by Category, Quote Sent, Location, etc.' },
    { 'Step': '', 'Details': '' },
    { 'Step': '4. Set Up Dropdown Columns (Optional)', 'Details': '' },
    { 'Step': '   a. Right-click column header', 'Details': 'e.g., "Quote Sent" or "Deposit Paid"' },
    { 'Step': '   b. Edit Column Properties', 'Details': 'Change type to "Dropdown List"' },
    { 'Step': '   c. Add values', 'Details': 'Use values from "Filter Options" sheet' },
    { 'Step': '', 'Details': '' },
    { 'Step': '5. Switch to Card View (Optional)', 'Details': '' },
    { 'Step': '   a. Click Card button', 'Details': 'In toolbar, next to Grid' },
    { 'Step': '   b. Group by Category', 'Details': 'Click "View by..." dropdown > select Category' },
    { 'Step': '', 'Details': '' },
    { 'Step': '📊 DASHBOARD SUMMARY (Rows 1-4)', 'Details': 'Shows total projects, quote values, and key stats' },
    { 'Step': '🔍 FILTER OPTIONS (Rows 6-10)', 'Details': 'Reference for available filter values' },
    { 'Step': '📁 CATEGORY ROWS', 'Details': 'Parent rows showing project count and total quote value per category' },
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
