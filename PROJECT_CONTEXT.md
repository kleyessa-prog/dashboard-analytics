# Dashboard Project Context & Integration Guide

This document contains all necessary information from the main project needed for dashboard integration.

## Main Project Overview

**Project Name**: Solvhealth Patient Queue Management System  
**Location**: `/Users/biruktsegaye/Documents/solv-scrapper-clone`  
**Tech Stack**: FastAPI (Python), PostgreSQL, Playwright

## System Architecture

### Infrastructure
- **Servers**: 4 dedicated servers
- **VMs per Server**: 8 VMs each
- **Total VMs**: 32 VMs
- **Peak Load**: ~480 patients/hour
- **Processing Time**: ~4 minutes per patient
- **Heartbeat Frequency**: Every 30 seconds

### Database Tables

1. **patients** - Patient records
   - emr_id, booking_id, location_id, status, demographics, etc.

2. **pending_patients** - Staging table before EMR ID assignment

3. **encounters** - Encounter records
   - encounter_id, emr_id, encounter_payload (JSONB)

4. **queue** - Processing queue
   - queue_id, encounter_id, emr_id, status (PENDING/PROCESSING/DONE/ERROR)
   - raw_payload, parsed_payload (JSONB), attempts

5. **summaries** - Medical summaries
   - id, emr_id, encounter_id, note

6. **vm_health** - VM heartbeat tracking
   - vm_id, server_id, status (healthy/unhealthy/idle)
   - processing_queue_id, uipath_status, metadata (JSONB)

7. **server_health** - Server heartbeat tracking
   - server_id, status (healthy/unhealthy/down)
   - metadata (JSONB) with cpuUsage, memoryUsage, diskUsage

8. **alerts** - System alerts
   - alert_id, source (vm/server/uipath/monitor)
   - source_id, severity (critical/warning/info)
   - message, details (JSONB), resolved, resolved_at

9. **queue_validations** - Validation results

## API Endpoints Reference

### Base URL
- Local: `http://localhost:8000`
- Production: `https://app-97926.on-aptible.com` (or your production URL)

### Authentication
- **Session-based**: For UI endpoints (cookies)
- **X-API-Key**: For monitoring endpoints (same HMAC secret key)
- **HMAC**: For other API endpoints

### Existing Endpoints

#### Health & Monitoring
- `GET /health/dashboard` - Comprehensive health dashboard (returns HealthDashboardResponse)
- `POST /server/heartbeat` - Server heartbeat (X-API-Key auth)
- `GET /server/health/{serverId}` - Server health with VMs (X-API-Key auth)
- `POST /vm/heartbeat` - VM heartbeat (X-API-Key auth)
- `GET /vm/health/{vmId}` - VM health status

#### Alerts
- `POST /alerts` - Submit alert (X-API-Key auth)
- `GET /alerts` - Get alerts with filters (source, sourceId, severity, resolved)
- `PATCH /alerts/{alertId}/resolve` - Resolve alert (X-API-Key auth)

#### Patients
- `GET /patients` - List patients (with filters: locationId, statuses, limit)
- `GET /patient/{emrId}` - Get patient by EMR ID
- `POST /patients/create` - Create patient

#### Queue
- `GET /queue` - List queue entries (with filters: status, limit, offset)
- `POST /queue` - Update queue entry
- `PATCH /queue/{queue_id}/status` - Update queue status
- `GET /queue/{queue_id}/validation` - Get validation results

#### Summaries
- `GET /summary?emrId={emrId}` - Get summary by EMR ID
- `POST /summary` - Create summary

## Required Analytics Endpoints (To Be Created)

The dashboard needs these new aggregated analytics endpoints:

### 1. Overview Dashboard
```
GET /analytics/overview?period=24h|7d|30d
Response: {
  kpis: {
    servers: { total: number, healthy: number },
    vms: { total: number, healthy: number },
    queueSize: number,
    totalPatients: number,
    activeAlerts: number,
    successRate: number,
    avgProcessTime: number,
    newPatientsToday: number
  },
  charts: {
    systemHealthTrend: [{ time: string, healthyServers: number, healthyVms: number }],
    processingThroughput: [{ date: string, processed: number, target: number }],
    queueStatus: { pending: number, processing: number, done: number, error: number },
    patientGrowth: [{ date: string, new: number }],
    alertSeverity: { critical: number, warning: number, info: number },
    resourceUsage: [{ serverId: string, cpu: number, memory: number, disk: number }]
  }
}
```

### 2. Patient Analytics
```
GET /analytics/patients?period=24h|7d|30d
Response: {
  kpis: {
    totalPatients: number,
    newToday: number,
    emrAssignmentRate: number,
    avgPerDay: number
  },
  charts: {
    growthTrend: [{ date: string, total: number, new: number }],
    byLocation: [{ locationName: string, count: number }]
  }
}
```

### 3. Queue Processing Analytics
```
GET /analytics/queue?period=24h|7d|30d
Response: {
  kpis: {
    queueSize: number,
    processingRate: number,
    successRate: number,
    avgProcessingTime: number
  },
  charts: {
    statusDistribution: { pending: number, processing: number, done: number, error: number },
    successFailureRate: [{ date: string, success: number, failure: number }],
    processingTimeTrend: [{ date: string, avgTime: number }]
  }
}
```

### 4. VM Health Analytics
```
GET /analytics/vm-health?period=24h|7d
Response: {
  kpis: {
    totalVms: number,
    healthyVms: number,
    processingVms: number,
    uipathRunning: number
  },
  charts: {
    vmHeatmap: [{ vmId: string, serverId: string, status: string }],
    uipathStatus: { running: number, stopped: number, error: number }
  }
}
```

### 5. Server Health Analytics
```
GET /analytics/server-health?period=24h|7d
Response: {
  kpis: {
    totalServers: number,
    healthyServers: number,
    avgCpuUsage: number,
    avgMemoryUsage: number
  },
  charts: {
    servers: [{ serverId: string, status: string, cpu: number, memory: number, disk: number, vmCount: number, healthyVmCount: number }],
    resourceTrends: [{ time: string, servers: [{ serverId: string, cpu: number, memory: number, disk: number }] }],
    vmDistribution: [{ serverId: string, healthy: number, unhealthy: number, idle: number }]
  }
}
```

### 6. Alert Analytics
```
GET /analytics/alerts?period=24h|7d|30d
Response: {
  kpis: {
    activeAlerts: number,
    criticalAlerts: number,
    warningAlerts: number,
    resolutionRate: number
  },
  charts: {
    alertTrend: [{ date: string, created: number, resolved: number }],
    severityDistribution: { critical: number, warning: number, info: number },
    bySource: [{ source: string, critical: number, warning: number, info: number }]
  }
}
```

## Database Query Examples

### Patient Growth Trend (30 days)
```sql
SELECT 
    DATE(created_at) as date,
    COUNT(*) as new_patients,
    SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as total_patients
FROM patients
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;
```

### Queue Processing Throughput
```sql
SELECT 
    DATE_TRUNC('hour', updated_at) as hour,
    COUNT(*) FILTER (WHERE status = 'DONE') as processed,
    COUNT(*) FILTER (WHERE status = 'ERROR') as errors
FROM queue
WHERE updated_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', updated_at)
ORDER BY hour;
```

### VM Health Status
```sql
SELECT 
    vm_id,
    server_id,
    status,
    uipath_status,
    last_heartbeat
FROM vm_health
ORDER BY server_id, vm_id;
```

### Alert Statistics
```sql
SELECT 
    source,
    severity,
    COUNT(*) FILTER (WHERE resolved = FALSE) as active,
    COUNT(*) FILTER (WHERE resolved = TRUE) as resolved
FROM alerts
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY source, severity;
```

## Resource Alert Thresholds

From `app/utils/resource_alerts.py`:
- **CPU**: Warning >80%, Critical >95%
- **Memory**: Warning >85%, Critical >95%
- **Disk**: Warning >90%, Critical >95%

## Color Theme Reference

The dashboard uses a professional color scheme:
- **Primary**: Navy blue (#102a43 to #627d98)
- **Accent**: Blue (#0284c7)
- **Success**: Green (#059669)
- **Warning**: Orange (#d97706)
- **Error**: Red (#dc2626)

## Integration Steps

1. **Create Analytics Endpoints** in main project:
   - Add `app/api/routes/analytics.py`
   - Implement all 6 analytics endpoints
   - Use existing database utilities from `app/api/database.py`

2. **Update Dashboard**:
   - Create `src/services/api.ts` with API client
   - Replace sample data imports with API calls
   - Add loading states and error handling
   - Configure API base URL via environment variables

3. **Authentication**:
   - Decide on auth method (session-based or API key)
   - Update API client to include auth headers
   - Handle 401 errors and redirect to login if needed

4. **Deployment**:
   - Deploy dashboard to separate domain
   - Configure CORS on main API
   - Set environment variables for API URL

## Notes

- All timestamps should be in ISO 8601 format (UTC)
- Date ranges: 24h, 7d, 30d
- Auto-refresh interval: 30-60 seconds recommended
- The dashboard is currently using sample data for testing
- All endpoints should return consistent JSON structure
- Handle timezone conversions appropriately
