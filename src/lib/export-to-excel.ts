import * as XLSX from 'xlsx';
import { Project } from './types';

interface ExportRow {
  'Category': string;
  'Project Name': string;
  'Customer': string;
  'Phone': string;
  'Email': string;
  'Location': string;
  'Address': string;
  'Zip Code': string;
  'Project Type': string;
  'Build Size': string;
  'SQFT': number | null;
  'Quote Sent': string;
  'Reached Out': string;
  'Quote (Material)': number | null;
  'Quote (With Tax)': number | null;
  'Quote Accepted': string;
  'Deposit Paid': string;
  'Drawings Status': string;
  'Est. Metal Delivery': string;
  'Metal Production': string;
  'Metal Delivery': string;
  'Door Delivery': string;
  'Contractor Start': string;
  'Job Status': string;
  'Comments': string;
}

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

  // Build rows with hierarchy
  const rows: ExportRow[] = [];
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
      // Add project rows with category
      categoryProjects.forEach((project) => {
        rows.push(projectToRow(project, category));
      });
    }
  });

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 20 },  // Category
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

  // Generate filename with date
  const date = new Date().toISOString().split('T')[0];
  const filename = `Storage_Materials_Export_${date}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, filename);
}
