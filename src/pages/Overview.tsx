import { useState } from 'react';
import { KPICard } from '../components/kpi/KPICard';
import { LineChart } from '../components/charts/LineChart';
import { DonutChart } from '../components/charts/DonutChart';
import { AreaChart } from '../components/charts/AreaChart';
import { BarChart } from '../components/charts/BarChart';
import {
  Server,
  Activity,
  ListTodo,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { overviewData } from '../data/sampleData';

export const Overview = () => {
  const [period, setPeriod] = useState('24h');
  const { kpis, charts } = overviewData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-600 mt-1">Real-time operational metrics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Servers"
          value={`${kpis.servers.healthy}/${kpis.servers.total}`}
          subtitle="All healthy"
          icon={<Server size={24} />}
          color="success"
        />
        <KPICard
          title="VMs"
          value={`${kpis.vms.healthy}/${kpis.vms.total}`}
          subtitle="Active"
          icon={<Activity size={24} />}
          color="success"
        />
        <KPICard
          title="Queue Size"
          value={kpis.queueSize}
          subtitle="Pending processing"
          icon={<ListTodo size={24} />}
        />
        <KPICard
          title="Total Patients"
          value={kpis.totalPatients.toLocaleString()}
          subtitle="All time"
          icon={<Users size={24} />}
        />
        <KPICard
          title="Active Alerts"
          value={kpis.activeAlerts}
          subtitle="Require attention"
          icon={<AlertTriangle size={24} />}
          color={kpis.activeAlerts > 5 ? 'error' : 'warning'}
        />
        <KPICard
          title="Success Rate"
          value={`${kpis.successRate}%`}
          subtitle="Processing"
          icon={<CheckCircle size={24} />}
          color="success"
        />
        <KPICard
          title="Avg Process Time"
          value={`${kpis.avgProcessTime} min`}
          subtitle="Per entry"
          icon={<Clock size={24} />}
        />
        <KPICard
          title="New Patients Today"
          value={kpis.newPatientsToday}
          subtitle="Last 24 hours"
          icon={<TrendingUp size={24} />}
          color="success"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Trend</h3>
          <LineChart
            data={charts.systemHealthTrend}
            dataKey="healthyVms"
            xKey="time"
            lines={[
              { key: 'healthyServers', name: 'Healthy Servers', color: '#0284c7' },
              { key: 'healthyVms', name: 'Healthy VMs', color: '#10b981' },
            ]}
          />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Throughput</h3>
          <LineChart
            data={charts.processingThroughput}
            dataKey="processed"
            xKey="date"
            lines={[
              { key: 'processed', name: 'Processed', color: '#0284c7' },
              { key: 'target', name: 'Target', color: '#ef4444' },
            ]}
          />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Status Distribution</h3>
          <DonutChart
            data={[
              { name: 'Pending', value: charts.queueStatus.pending },
              { name: 'Processing', value: charts.queueStatus.processing },
              { name: 'Done', value: charts.queueStatus.done },
              { name: 'Error', value: charts.queueStatus.error },
            ]}
            colors={['#f59e0b', '#0284c7', '#10b981', '#ef4444']}
            centerValue={Object.values(charts.queueStatus).reduce((a, b) => a + b, 0)}
          />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Growth</h3>
          <AreaChart
            data={charts.patientGrowth}
            dataKey="new"
            xKey="date"
            areas={[{ key: 'new', name: 'New Patients', color: '#0284c7' }]}
          />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts by Severity</h3>
          <DonutChart
            data={[
              { name: 'Critical', value: charts.alertSeverity.critical },
              { name: 'Warning', value: charts.alertSeverity.warning },
              { name: 'Info', value: charts.alertSeverity.info },
            ]}
            colors={['#ef4444', '#f59e0b', '#0284c7']}
            centerValue={Object.values(charts.alertSeverity).reduce((a, b) => a + b, 0)}
          />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage Overview</h3>
          <BarChart
            data={charts.resourceUsage}
            xKey="serverId"
            bars={[
              { key: 'cpu', name: 'CPU', color: '#0284c7' },
              { key: 'memory', name: 'Memory', color: '#10b981' },
              { key: 'disk', name: 'Disk', color: '#f59e0b' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
