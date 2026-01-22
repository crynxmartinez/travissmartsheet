import { projects } from "./data";

export interface Deal {
  id: string;
  name: string;
  contact: string | null;
  notes: string | null;
  expectedStart: string | null;
  category: "active" | "hot" | "warm";
  matchedProjectId: number | null;
  matchedProjectName: string | null;
}

// Helper function to find matching project
function findMatchingProject(searchTerms: string[]): { id: number; name: string } | null {
  for (const term of searchTerms) {
    const match = projects.find(p => 
      p.projectName.toLowerCase().includes(term.toLowerCase())
    );
    if (match) {
      return { id: match.id, name: match.projectName };
    }
  }
  return null;
}

// Active Deals - Under contract, verbally won, in permitting, or very close to contract
const activeDealsRaw = [
  { name: "Terre Du Lac Watchman Expansion", contact: "Toni", notes: null, expectedStart: null, search: ["Terre Du Lac", "Watchman"] },
  { name: "Choctaw Expansion (Austin)", contact: "Toni", notes: null, expectedStart: null, search: ["Choctaw Expansion Austin", "Choctaw Expansion"] },
  { name: "24 Kitchen Pickle Ball", contact: "Toni", notes: null, expectedStart: null, search: ["24 Kitchen", "Pickle Ball"] },
  { name: "Kilpatrick Turnpike Storage", contact: null, notes: "OK City", expectedStart: null, search: ["Kilpatrick", "Turnpike"] },
  { name: "GHI Choctaw Phase 3", contact: null, notes: null, expectedStart: null, search: ["GHI Choctaw Phase 3", "GHI Choctaw"] },
  { name: "Knoxville Expansion", contact: null, notes: null, expectedStart: null, search: ["Knoxville Expansion", "Knoxville"] },
  { name: "Washington, Utah Conversion", contact: null, notes: null, expectedStart: null, search: ["Washington, Utah", "Washington Utah", "Utah Conversion"] },
  { name: "Best Boat & RV Expansion", contact: null, notes: "Tuttle, OK", expectedStart: null, search: ["Best Boat", "Tuttle"] },
  { name: "Garden Highway Self Storage", contact: null, notes: "Verbally won, permitting", expectedStart: "Summer 2026", search: ["Garden Highway"] },
  { name: "South Austin Commerce Park", contact: null, notes: "Contract signed + deposit", expectedStart: "April 2026", search: ["South Austin Commerce", "South Austin"] },
  { name: "Heideke Seguin Industrial", contact: null, notes: "Verbally won, contract pending", expectedStart: "June 2026", search: ["Heideke", "Seguin Industrial", "Seguin"] },
  { name: "Dayton Business Park", contact: null, notes: "Verbally won, design starting", expectedStart: "Q3/Q4 2026", search: ["Dayton Business Park"] },
  { name: "Titan Storage Norwalk", contact: null, notes: "Personal project", expectedStart: "Q2 2026", search: ["Titan Storage Norwalk", "Titan Norwalk"] },
];

// Hot Deals - Strong momentum, bids sent, or waiting on feedback
const hotDealsRaw = [
  { name: "Dayton, TX", contact: null, notes: null, expectedStart: null, search: ["Dayton, TX", "Dayton TX"] },
  { name: "Canopy – Grand Island, NE", contact: null, notes: null, expectedStart: null, search: ["Canopy", "Grand Island"] },
  { name: "Hurricane UT Storage", contact: null, notes: null, expectedStart: "July 2026", search: ["Hurricane UT", "Hurricane"] },
  { name: "West Indianapolis Storage", contact: null, notes: null, expectedStart: "May–June 2026", search: ["West Indianapolis", "Indianapolis"] },
  { name: "Waco Flex", contact: null, notes: null, expectedStart: "Q4 2026 / Q1 2027", search: ["Waco Flex", "Waco"] },
  { name: "Titan Storage Adel", contact: null, notes: "Personal project", expectedStart: "Q2 2026", search: ["Titan Storage Adel", "Titan Adel", "Adel"] },
  { name: "Lloyd Lane Storage", contact: null, notes: "Layout finalizing, possible full GC", expectedStart: "Summer 2026", search: ["Lloyd Lane"] },
  { name: "Empire Central – Mr. Sweeper BTS", contact: null, notes: null, expectedStart: null, search: ["Empire Central", "Mr. Sweeper", "Sweeper"] },
  { name: "Budget Store & Lock Self Storage", contact: null, notes: "Shillington", expectedStart: null, search: ["Budget Store", "Shillington"] },
  { name: "MAK Rapid City", contact: null, notes: null, expectedStart: null, search: ["MAK Rapid City", "Rapid City"] },
  { name: "Public Storage", contact: null, notes: null, expectedStart: null, search: ["Public Storage"] },
  { name: "Old Bridge", contact: null, notes: null, expectedStart: null, search: ["Old Bridge"] },
  { name: "Alden Green House", contact: null, notes: "Alden, NY", expectedStart: null, search: ["Alden Green House", "Alden"] },
  { name: "U-Haul Valdosta", contact: null, notes: null, expectedStart: null, search: ["U-Haul Valdosta", "Valdosta"] },
];

// Warm Deals - Stalled, early-stage, or future timeline
const warmDealsRaw = [
  { name: "King NC – 2 Story", contact: null, notes: null, expectedStart: null, search: ["King NC", "King"] },
  { name: "605 Neighborhood – Valley Springs, SD", contact: "Toni", notes: null, expectedStart: null, search: ["605 Neighborhood", "Valley Springs"] },
  { name: "Easley (Anderson County), SC", contact: "Toni", notes: null, expectedStart: null, search: ["Easley", "Anderson County"] },
  { name: "Secure Access Self Storage Expansion", contact: null, notes: null, expectedStart: null, search: ["Secure Access"] },
  { name: "Aberdeen, NC Conversion", contact: null, notes: null, expectedStart: null, search: ["Aberdeen, NC", "Aberdeen NC", "Aberdeen"] },
  { name: "Atlanta Area RV Storage", contact: null, notes: null, expectedStart: null, search: ["Atlanta Area RV", "Atlanta RV"] },
  { name: "Blueridge Rd Partners", contact: null, notes: "BTS under review", expectedStart: null, search: ["Blueridge"] },
  { name: "American General Storage", contact: null, notes: "Waiting on architect/layout", expectedStart: null, search: ["American General"] },
  { name: "Texas Motor Sports PEMB", contact: null, notes: "Owner decision pending", expectedStart: null, search: ["Texas Motor Sports", "Texas Motor"] },
  { name: "Cedar Port BTS", contact: null, notes: null, expectedStart: null, search: ["Cedar Port"] },
  { name: "Blair Storage", contact: null, notes: null, expectedStart: null, search: ["Blair Storage", "Blair"] },
  { name: "Filbert Highway Storage Expansion", contact: null, notes: null, expectedStart: null, search: ["Filbert Highway", "Filbert"] },
  { name: "Anytime Self Storage", contact: null, notes: null, expectedStart: null, search: ["Anytime Self Storage", "Anytime"] },
  { name: "Chicago Ridge Self Storage", contact: null, notes: null, expectedStart: null, search: ["Chicago Ridge"] },
  { name: "Extra Space – Bridgewater, MA", contact: null, notes: null, expectedStart: null, search: ["Extra Space Bridgewater", "Bridgewater"] },
  { name: "Justin Phillpp", contact: null, notes: null, expectedStart: null, search: ["Justin Phillpp", "Justin"] },
];

// Process and match deals
function processDeals(
  rawDeals: Array<{ name: string; contact: string | null; notes: string | null; expectedStart: string | null; search: string[] }>,
  category: "active" | "hot" | "warm"
): Deal[] {
  return rawDeals.map((deal, index) => {
    const match = findMatchingProject(deal.search);
    return {
      id: `${category}-${index}`,
      name: deal.name,
      contact: deal.contact,
      notes: deal.notes,
      expectedStart: deal.expectedStart,
      category,
      matchedProjectId: match?.id ?? null,
      matchedProjectName: match?.name ?? null,
    };
  });
}

export const activeDeals = processDeals(activeDealsRaw, "active");
export const hotDeals = processDeals(hotDealsRaw, "hot");
export const warmDeals = processDeals(warmDealsRaw, "warm");

export const allDeals = [...activeDeals, ...hotDeals, ...warmDeals];

export function getDealsByCategory(category: "active" | "hot" | "warm"): Deal[] {
  switch (category) {
    case "active":
      return activeDeals;
    case "hot":
      return hotDeals;
    case "warm":
      return warmDeals;
  }
}

export function getDealStats() {
  const matched = allDeals.filter(d => d.matchedProjectId !== null).length;
  const unmatched = allDeals.filter(d => d.matchedProjectId === null).length;
  return {
    total: allDeals.length,
    active: activeDeals.length,
    hot: hotDeals.length,
    warm: warmDeals.length,
    matched,
    unmatched,
  };
}
