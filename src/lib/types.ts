export interface Project {
  id: number;
  projectName: string;
  location: string | null;
  projectAddress: string | null;
  projectLabel: string | null;
  quoteSent: boolean;
  reachedOut: boolean;
  totalCOGs: number | null;
  customer: string | null;
  phone: string | null;
  email: string | null;
  buildSize: string | null;
  receivedProjectDetails: string | null;
  zipCode: string | null;
  projectType: string | null;
  projectSQFT: number | null;
  receivedQuoteDrawings: string | null;
  erectingLabor: number | null;
  concreteLabor: number | null;
  ourQuoteMaterialOnly: number | null;
  salesTaxPercent: number | null;
  ourQuoteWithTax: number | null;
  deliveredCustomerQuote: string | null;
  quoteAcceptedDeclined: string | null;
  depositPaid: string | null;
  engineeredDrawingsStatus: string | null;
  estimatedMetalDeliveryDate: string | null;
  doorOrderSubmittedDate: string | null;
  estimatedDoorDeliveryDate: string | null;
  metalProduction: string | null;
  metalDelivery: string | null;
  doorDelivery: string | null;
  finalACHPayment: string | null;
  contractorStartDate: string | null;
  jobStatus: string | null;
  comments: string | null;
  colorStatus: string | null;
}

export interface KPIData {
  totalProjects: number;
  newLeads: number;
  activeBids: number;
  activeProjects: number;
  quotesAccepted: number;
  depositsPaid: number;
  totalQuoteValue: number;
  projectsByLabel: { label: string; count: number }[];
  projectsByLocation: { location: string; count: number }[];
  quotation: number;
  alreadyQuoted: number;
  needsClarification: number;
  ongoingProjects: number;
}
