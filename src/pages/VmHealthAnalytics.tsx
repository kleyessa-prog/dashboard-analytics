import { useState } from 'react';
import { KPICard } from '../components/kpi/KPICard';
import { Heatmap } from '../components/charts/Heatmap';
import { DonutChart } from '../components/charts/DonutChart';
import { Activity, CheckCircle, Play } from 'lucide-react';
import { vmHealthData } from '../data/sampleData';

export const VmHealthAnalytics = () => {
  const [period, setPeriod] = useState('24h');
  const { kpis, charts } = vmHealthData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">VM Health Analytics</h1>
          <p className="text-gray-600 mt-1">Virtual machine status and monitoring</p>
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
          title="Total VMs"
          value={kpis.totalVms}
          icon={<Activity size={24} />}
        />
        <KPICard
          title="Healthy VMs"
          value={kpis.healthyVms}
          color="success"
          icon={<CheckCircle size={24} />}
        />
        <KPICard
          title="Processing Active"
          value={kpis.processingVms}
          icon={<Activity size={24} />}
        />
        <KPICard
          title="UiPath Running"
          value={kpis.uipathRunning}
          color="success"
          icon={<Play size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">VM Health Status Heatmap</h3>
          <div className="mb-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-success-main rounded"></div>
              <span>Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-warning-main rounded"></div>
              <span>Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-error-main rounded"></div>
              <span>Unhealthy</span>
            </div>
          </div>
          <Heatmap data={charts.vmHeatmap} cols={8} />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">UiPath Status Distribution</h3>
          <DonutChart
            data={[
              { name: 'Running', value: charts.uipathStatus.running },
              { name: 'Stopped', value: charts.uipathStatus.stopped },
              { name: 'Error', value: charts.uipathStatus.error },
            ]}
            colors={['#10b981', '#6b7280', '#ef4444']}
            centerValue={Object.values(charts.uipathStatus).reduce((a, b) => a + b, 0)}
          />
        </div>
      </div>
    </div>
  );
};
