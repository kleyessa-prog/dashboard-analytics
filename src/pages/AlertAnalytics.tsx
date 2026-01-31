import { useState } from 'react';
import { KPICard } from '../components/kpi/KPICard';
import { AreaChart } from '../components/charts/AreaChart';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart } from '../components/charts/BarChart';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { alertData } from '../data/sampleData';

export const AlertAnalytics = () => {
  const [period, setPeriod] = useState('7d');
  const { kpis, charts } = alertData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert Analytics</h1>
          <p className="text-gray-600 mt-1">System alerts and resolution metrics</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      <div className="kpi-grid">
        <KPICard
          title="Active Alerts"
          value={kpis.activeAlerts}
          icon={<AlertTriangle size={24} />}
          color={kpis.activeAlerts > 10 ? 'error' : 'warning'}
        />
        <KPICard
          title="Critical Alerts"
          value={kpis.criticalAlerts}
          icon={<AlertCircle size={24} />}
          color="error"
        />
        <KPICard
          title="Warning Alerts"
          value={kpis.warningAlerts}
          icon={<Info size={24} />}
          color="warning"
        />
        <KPICard
          title="Resolution Rate"
          value={`${kpis.resolutionRate}%`}
          icon={<CheckCircle size={24} />}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Trend Over Time</h3>
          <AreaChart
            data={charts.alertTrend}
            dataKey="created"
            xKey="date"
            areas={[
              { key: 'created', name: 'Created', color: '#ef4444' },
              { key: 'resolved', name: 'Resolved', color: '#10b981' },
            ]}
          />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Severity Distribution</h3>
          <DonutChart
            data={[
              { name: 'Critical', value: charts.severityDistribution.critical },
              { name: 'Warning', value: charts.severityDistribution.warning },
              { name: 'Info', value: charts.severityDistribution.info },
            ]}
            colors={['#ef4444', '#f59e0b', '#0284c7']}
            centerValue={Object.values(charts.severityDistribution).reduce((a, b) => a + b, 0)}
          />
        </div>

        <div className="chart-container lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts by Source</h3>
          <BarChart
            data={charts.bySource}
            xKey="source"
            bars={[
              { key: 'critical', name: 'Critical', color: '#ef4444' },
              { key: 'warning', name: 'Warning', color: '#f59e0b' },
              { key: 'info', name: 'Info', color: '#0284c7' },
            ]}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};
