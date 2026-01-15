# Storage Materials Dashboard

A project management dashboard for tracking storage materials projects, built with Next.js, shadcn/ui, and Tailwind CSS.

## Features

- **Dashboard** - KPI cards showing total projects, leads, bids, and financial metrics
- **Projects List** - Searchable and filterable table of all projects
- **Project Details** - Detailed view of individual projects with contact, financial, and delivery information
- **Charts** - Visual breakdown of projects by label and location

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Environment Variables (for Google Sheets integration)

To connect to Google Sheets as a data source, add these environment variables:

```env
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
```

## Deploy on Vercel

Connect this repository to Vercel for automatic deployments. The app is configured to work with Vercel out of the box.
