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

## Current Status

✅ **Fully functional with sample data**

The dashboard is currently using sample/mock data for all visualizations. To integrate with your API:

1. Create API service layer in `src/services/api.ts`
2. Replace sample data imports in pages with API hooks
3. Add loading and error states
4. Configure API base URL via environment variables

## Color Theme

The dashboard uses a professional color scheme inspired by Catalyze Labs:
- Primary: Navy blue (#102a43 to #627d98)
- Accent: Blue (#0284c7)
- Success: Green (#059669)
- Warning: Orange (#d97706)
- Error: Red (#dc2626)

## Deployment

### Option 1: Static Hosting (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Set environment variable `VITE_API_BASE_URL` to your API endpoint

### Option 2: Docker

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Next Steps

1. **API Integration**: Replace sample data with real API calls
2. **Authentication**: Add authentication layer if needed
3. **Real-time Updates**: Implement WebSocket or polling for live data
4. **Error Handling**: Add comprehensive error boundaries
5. **Loading States**: Enhance loading indicators
6. **Responsive Design**: Test and optimize for mobile devices

## License

ISC
