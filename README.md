# System Analytics Dashboard

A professional analytics dashboard for monitoring system health, patient management, queue processing, VM/server health, and alerts.

## Features

- **Overview Dashboard**: High-level system metrics and insights
- **Patient Analytics**: Patient growth trends and location distribution
- **Queue Processing**: Queue status, success rates, and processing time trends
- **VM Health**: VM status heatmap and UiPath monitoring
- **Server Health**: Server resource usage and VM distribution
- **Alert Analytics**: Alert trends, severity distribution, and source analysis

## Tech Stack

- React 19 + TypeScript
- Vite (Build tool)
- React Router (Navigation)
- Recharts (Charting library)
- Tailwind CSS (Styling)
- Lucide React (Icons)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
dashboard-analytics/
├── src/
│   ├── components/
│   │   ├── charts/          # Chart components (Line, Bar, Donut, Area, Heatmap, Gauge)
│   │   ├── kpi/             # KPI card component
│   │   └── layout/          # Layout components (Sidebar, Breadcrumb, DashboardLayout)
│   ├── pages/               # Page components (Overview, PatientAnalytics, etc.)
│   ├── data/                # Sample data (for testing)
│   └── styles/              # Global styles
├── public/                  # Static assets
└── dist/                    # Production build output
```

## Color Theme

The dashboard uses a professional color scheme inspired by Catalyze Labs:
- Primary: Navy blue (#102a43 to #627d98)
- Accent: Blue (#0284c7)
- Success: Green (#059669)
- Warning: Orange (#d97706)
- Error: Red (#dc2626)

