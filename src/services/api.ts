// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Use Vite proxy in development to avoid CORS
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
const API_KEY = import.meta.env.VITE_API_KEY || '';

export interface ServerHeartbeat {
  serverId: string;
  status: 'healthy' | 'unhealthy' | 'down';
  lastHeartbeat: string;
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
  vmCount?: number;
  healthyVmCount?: number;
  vms?: any[];
  metadata?: {
    cpuUsage?: number;
    memoryUsage?: number;
    diskUsage?: number;
  };
}

export interface ServerHeartbeatHistory {
  timestamp: string;
  serverId: string;
  status: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface Alert {
  alertId: string;
  source: 'vm' | 'server' | 'uipath' | 'monitor';
  sourceId: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  details?: any;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface AlertAnalyticsResponse {
  kpis: {
    activeAlerts: number;
    criticalAlerts: number;
    warningAlerts: number;
    resolutionRate: number;
  };
  charts: {
    alertTrend: Array<{
      date: string;
      created: number;
      resolved: number;
    }>;
    severityDistribution: {
      critical: number;
      warning: number;
      info: number;
    };
    bySource: Array<{
      source: string;
      critical: number;
      warning: number;
      info: number;
    }>;
  };
}

class ApiService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Endpoint not found: ${url}. The backend endpoint may not be implemented yet.`);
      }
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
    }

    return response.json();
  }

  // Get server health with heartbeat info
  async getServerHealth(serverId: string): Promise<ServerHeartbeat> {
    return this.fetchWithAuth(`/server/health/${serverId}`);
  }

  // Get all servers heartbeat status
  async getAllServersHealth(): Promise<ServerHeartbeat[]> {
    // Try to fetch all servers - use lowercase server IDs (server1, server2, etc.)
    const servers = ['server1', 'server2', 'server3', 'server4'];
    
    // Fetch all servers and filter out errors (servers that don't exist)
    const results = await Promise.allSettled(
      servers.map(serverId => this.getServerHealth(serverId))
    );
    
    return results
      .filter((result): result is PromiseFulfilledResult<ServerHeartbeat> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  // Get server heartbeat history (you'll need to create this endpoint)
  async getServerHeartbeatHistory(
    serverId: string,
    period: '24h' | '7d' = '24h'
  ): Promise<ServerHeartbeatHistory[]> {
    return this.fetchWithAuth(
      `/analytics/server-heartbeat/${serverId}?period=${period}`
    );
  }

  // Get alerts with optional filters
  async getAlerts(params?: {
    source?: string;
    sourceId?: string;
    severity?: 'critical' | 'warning' | 'info';
    resolved?: boolean;
  }): Promise<Alert[]> {
    const queryParams = new URLSearchParams();
    if (params?.source) queryParams.append('source', params.source);
    if (params?.sourceId) queryParams.append('sourceId', params.sourceId);
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.resolved !== undefined) queryParams.append('resolved', params.resolved.toString());
    
    const queryString = queryParams.toString();
    return this.fetchWithAuth(`/alerts${queryString ? `?${queryString}` : ''}`);
  }

  // Get alert analytics aggregated data
  async getAlertAnalytics(period: '24h' | '7d' | '30d' = '7d'): Promise<AlertAnalyticsResponse> {
    return this.fetchWithAuth(`/analytics/alerts?period=${period}`);
  }
}

export const apiService = new ApiService();
