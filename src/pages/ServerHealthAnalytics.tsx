import { useState, useMemo } from 'react';
import { KPICard } from '../components/kpi/KPICard';
import { GaugeChart } from '../components/charts/GaugeChart';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { Server, CheckCircle, Cpu, HardDrive, Heart, Clock, AlertCircle } from 'lucide-react';
import { useAllServersHeartbeat } from '../hooks/useServerHeartbeat';
import { serverHealthData } from '../data/sampleData';

// Stale threshold: 180 seconds (3 minutes)
const STALE_THRESHOLD_SECONDS = 180;

export const ServerHealthAnalytics = () => {
  const [period, setPeriod] = useState('24h');
  const { heartbeats, loading, error } = useAllServersHeartbeat(true);
  
  // Fallback to sample data if API fails or no data
  const useSampleData = error || (!loading && heartbeats.length === 0);
  const { kpis: sampleKpis, charts: sampleCharts } = serverHealthData;

  // Calculate KPIs from heartbeat data
  const kpis = useMemo(() => {
    if (useSampleData) {
      return sampleKpis;
    }

    return {
      totalServers: heartbeats.length,
      healthyServers: heartbeats.filter(h => h.status === 'healthy').length,
      avgCpuUsage: heartbeats.length > 0
        ? heartbeats.reduce((sum, h) => sum + (h.cpuUsage || h.metadata?.cpuUsage || 0), 0) / heartbeats.length
        : 0,
      avgMemoryUsage: heartbeats.length > 0
        ? heartbeats.reduce((sum, h) => sum + (h.memoryUsage || h.metadata?.memoryUsage || 0), 0) / heartbeats.length
        : 0,
    };
  }, [heartbeats, useSampleData, sampleKpis]);

  // Helper function to calculate time since last heartbeat and check if stale
  const getHeartbeatInfo = (lastHeartbeat: string) => {
    const lastHeartbeatDate = new Date(lastHeartbeat);
    const timeSinceLastHeartbeat = Math.floor(
      (Date.now() - lastHeartbeatDate.getTime()) / 1000
    );
    const isStale = timeSinceLastHeartbeat > STALE_THRESHOLD_SECONDS;
    
    const formatTime = () => {
      if (timeSinceLastHeartbeat < 60) {
        return `${timeSinceLastHeartbeat}s ago`;
      } else if (timeSinceLastHeartbeat < 3600) {
        return `${Math.floor(timeSinceLastHeartbeat / 60)}m ago`;
      } else {
        return `${Math.floor(timeSinceLastHeartbeat / 3600)}h ago`;
      }
    };

    return {
      timeSinceLastHeartbeat,
      isStale,
      formattedTime: formatTime(),
      lastHeartbeatDate,
    };
  };

  // Get servers data (either from heartbeats or sample data)
  const serversData = useMemo(() => {
    if (useSampleData) {
      return sampleCharts.servers;
    }

    return heartbeats.map(heartbeat => {
      const heartbeatInfo = getHeartbeatInfo(heartbeat.lastHeartbeat);
      return {
        serverId: heartbeat.serverId,
        status: heartbeat.status,
        cpu: heartbeat.cpuUsage || heartbeat.metadata?.cpuUsage || 0,
        memory: heartbeat.memoryUsage || heartbeat.metadata?.memoryUsage || 0,
        disk: heartbeat.diskUsage || heartbeat.metadata?.diskUsage || 0,
        lastHeartbeat: heartbeat.lastHeartbeat,
        heartbeatInfo,
        vmCount: heartbeat.vmCount,
        healthyVmCount: heartbeat.healthyVmCount,
      };
    });
  }, [heartbeats, useSampleData, sampleCharts]);

  if (loading && heartbeats.length === 0 && !useSampleData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading server heartbeat data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Server Health Analytics</h1>
          <p className="text-gray-600 mt-1">Server monitoring and resource utilization</p>
          {error && (
            <div className="flex items-center gap-2 mt-2 text-sm text-amber-600">
              <AlertCircle size={16} />
              <span>Using sample data - API connection failed</span>
            </div>
          )}
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>

      <div className="kpi-grid">
        <KPICard
          title="Total Servers"
          value={kpis.totalServers}
          icon={<Server size={24} />}
        />
        <KPICard
          title="Healthy Servers"
          value={kpis.healthyServers}
          color="success"
          icon={<CheckCircle size={24} />}
        />
        <KPICard
          title="Avg CPU Usage"
          value={`${kpis.avgCpuUsage.toFixed(1)}%`}
          icon={<Cpu size={24} />}
        />
        <KPICard
          title="Avg Memory Usage"
          value={`${kpis.avgMemoryUsage.toFixed(1)}%`}
          icon={<HardDrive size={24} />}
        />
      </div>

      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Status Grid</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serversData.map((server) => {
            const heartbeatInfo = 'heartbeatInfo' in server 
              ? server.heartbeatInfo 
              : null;
            const hasHeartbeatData = heartbeatInfo !== null;

            return (
              <div
                key={server.serverId}
                className={`border-2 rounded-lg p-4 bg-white ${
                  hasHeartbeatData && heartbeatInfo.isStale
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{server.serverId}</h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        server.status === 'healthy'
                          ? 'bg-green-100 text-green-800'
                          : server.status === 'unhealthy'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {server.status}
                    </span>
                    {hasHeartbeatData && (
                      <div
                        className={`h-2 w-2 rounded-full ${
                          heartbeatInfo.isStale ? 'bg-red-500' : 'bg-green-500'
                        } ${!heartbeatInfo.isStale ? 'animate-pulse' : ''}`}
                        title={heartbeatInfo.isStale ? 'Stale heartbeat' : 'Active heartbeat'}
                      />
                    )}
                  </div>
                </div>

                {/* Heartbeat Status Section */}
                {hasHeartbeatData && (
                  <div
                    className={`mb-3 p-2 rounded ${
                      heartbeatInfo.isStale
                        ? 'bg-red-100 border border-red-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Heart size={12} />
                        <span>Last Heartbeat</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span
                          className={
                            heartbeatInfo.isStale
                              ? 'text-red-600 font-medium'
                              : 'text-gray-600'
                          }
                        >
                          {heartbeatInfo.formattedTime}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {heartbeatInfo.lastHeartbeatDate.toLocaleTimeString()}
                    </div>
                    {heartbeatInfo.isStale && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600 font-medium">
                        <AlertCircle size={12} />
                        <span>Stale - No heartbeat for {heartbeatInfo.formattedTime}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>CPU</span>
                      <span>{server.cpu.toFixed(1)}%</span>
                    </div>
                    <GaugeChart value={server.cpu} height={120} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Memory</span>
                      <span>{server.memory.toFixed(1)}%</span>
                    </div>
                    <GaugeChart value={server.memory} height={120} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Disk</span>
                      <span>{server.disk.toFixed(1)}%</span>
                    </div>
                    <GaugeChart value={server.disk} height={120} />
                  </div>
                  {'vmCount' in server && (
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        VMs: {server.healthyVmCount}/{server.vmCount} healthy
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage Trends</h3>
          <LineChart
            data={useSampleData 
              ? sampleCharts.resourceTrends.flatMap((trend) =>
                  trend.servers.map((server) => ({
                    time: trend.time,
                    server: server.serverId,
                    cpu: server.cpu,
                    memory: server.memory,
                    disk: server.disk,
                  }))
                )
              : []}
            dataKey="cpu"
            xKey="time"
            lines={[
              { key: 'cpu', name: 'CPU', color: '#0284c7' },
              { key: 'memory', name: 'Memory', color: '#10b981' },
              { key: 'disk', name: 'Disk', color: '#f59e0b' },
            ]}
          />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">VM Distribution by Server</h3>
          <BarChart
            data={useSampleData ? sampleCharts.vmDistribution : []}
            xKey="serverId"
            bars={[
              { key: 'healthy', name: 'Healthy', color: '#10b981' },
              { key: 'unhealthy', name: 'Unhealthy', color: '#ef4444' },
              { key: 'idle', name: 'Idle', color: '#f59e0b' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
