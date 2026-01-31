import { useState } from 'react';
import { KPICard } from '../components/kpi/KPICard';
import { GaugeChart } from '../components/charts/GaugeChart';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { Server, CheckCircle, Cpu, HardDrive } from 'lucide-react';
import { serverHealthData } from '../data/sampleData';

export const ServerHealthAnalytics = () => {
  const [period, setPeriod] = useState('24h');
  const { kpis, charts } = serverHealthData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Server Health Analytics</h1>
          <p className="text-gray-600 mt-1">Server monitoring and resource utilization</p>
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
          value={`${kpis.avgCpuUsage}%`}
          icon={<Cpu size={24} />}
        />
        <KPICard
          title="Avg Memory Usage"
          value={`${kpis.avgMemoryUsage}%`}
          icon={<HardDrive size={24} />}
        />
      </div>

      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Status Grid</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {charts.servers.map((server) => (
            <div
              key={server.serverId}
              className="border-2 border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{server.serverId}</h4>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    server.status === 'healthy'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {server.status}
                </span>
              </div>
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
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    VMs: {server.healthyVmCount}/{server.vmCount} healthy
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage Trends</h3>
          <LineChart
            data={charts.resourceTrends.flatMap((trend) =>
              trend.servers.map((server) => ({
                time: trend.time,
                server: server.serverId,
                cpu: server.cpu,
                memory: server.memory,
                disk: server.disk,
              }))
            )}
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
            data={charts.vmDistribution}
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
