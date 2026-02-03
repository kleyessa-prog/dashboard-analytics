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
│   ├── hooks/               # Custom React hooks (useServerHeartbeat)
│   ├── services/            # API service layer (api.ts)
│   ├── data/                # Sample data (for testing)
│   └── styles/              # Global styles
├── public/                  # Static assets
└── dist/                    # Production build output
```

## Server Heartbeat Monitoring

The dashboard includes real-time server heartbeat monitoring with the following features:

### Features
- **Auto-refresh**: Automatically fetches server heartbeat data every 60 seconds
- **Stale Detection**: Highlights servers with heartbeats older than 180 seconds (3 minutes)
- **Visual Indicators**: 
  - Green pulsing dot for active heartbeats
  - Red dot for stale heartbeats
  - Red border and background for stale server cards
- **Heartbeat Information**: Displays last heartbeat time and time since last heartbeat
- **Fallback Support**: Falls back to sample data if API is unavailable

### Configuration

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_KEY=your-api-key-here
```

**Note:** In development mode, the app uses a Vite proxy (`/api`) to avoid CORS issues. The proxy automatically forwards requests to `http://localhost:8000`. In production, it uses the `VITE_API_BASE_URL` directly.

### Understanding CORS Errors

If you see a CORS (Cross-Origin Resource Sharing) error like:
```
Access to fetch at 'http://localhost:8000/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**What is CORS?**
- Browsers block requests between different origins (different protocol, domain, or port) for security
- Your frontend (`localhost:5173`) and backend (`localhost:8000`) are different origins
- The backend must explicitly allow requests from the frontend origin

**Solution Implemented:**
- **Development:** Vite proxy forwards `/api/*` requests to `http://localhost:8000/*`
  - All API calls go through the same origin (no CORS needed)
  - Requests: `http://localhost:5173/api/analytics/alerts` → `http://localhost:8000/analytics/alerts`
  
- **Production:** Backend must configure CORS headers:
  ```python
  # FastAPI example
  from fastapi.middleware.cors import CORSMiddleware
  
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["https://your-frontend-domain.com"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

### API Endpoints Required

The dashboard expects the following backend endpoints:

- `GET /server/health/{serverId}` - Get individual server health with heartbeat
- `GET /analytics/server-heartbeat/{serverId}?period=24h|7d` - Get server heartbeat history (optional)
- `GET /analytics/alerts?period=24h|7d|30d` - Get alert analytics aggregated data (required for Alert Analytics page)
- `GET /alerts` - Get raw alerts with optional filters (source, sourceId, severity, resolved)

The API service will automatically fetch all servers (Server 1, Server 2, Server 3, Server 4) by default.

## Color Theme

The dashboard uses a professional color scheme inspired by Catalyze Labs:
- Primary: Navy blue (#102a43 to #627d98)
- Accent: Blue (#0284c7)
- Success: Green (#059669)
- Warning: Orange (#d97706)
- Error: Red (#dc2626)

