import { useState } from 'react';
import { KPICard } from '../components/kpi/KPICard';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { ListTodo, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { queueData } from '../data/sampleData';

export const QueueAnalytics = () => {
  const [period, setPeriod] = useState('7d');
  const { kpis, charts } = queueData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Queue Processing Analytics</h1>
          <p className="text-gray-600 mt-1">Queue management and processing insights</p>
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
          title="Queue Size"
          value={kpis.queueSize}
          icon={<ListTodo size={24} />}
        />
        <KPICard
          title="Processing Rate"
          value={`${kpis.processingRate}/hr`}
          icon={<TrendingUp size={24} />}
        />
        <KPICard
          title="Success Rate"
          value={`${kpis.successRate}%`}
          color="success"
          icon={<CheckCircle size={24} />}
        />
        <KPICard
          title="Avg Process Time"
          value={`${kpis.avgProcessingTime} min`}
          icon={<Clock size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Status Distribution</h3>
          <DonutChart
            data={[
              { name: 'Pending', value: charts.statusDistribution.pending },
              { name: 'Processing', value: charts.statusDistribution.processing },
              { name: 'Done', value: charts.statusDistribution.done },
              { name: 'Error', value: charts.statusDistribution.error },
            ]}
            colors={['#f59e0b', '#0284c7', '#10b981', '#ef4444']}
            centerValue={Object.values(charts.statusDistribution).reduce((a, b) => a + b, 0)}
          />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success vs Failure Rate</h3>
          <BarChart
            data={charts.successFailureRate}
            xKey="date"
            bars={[
              { key: 'success', name: 'Success', color: '#10b981' },
              { key: 'failure', name: 'Failure', color: '#ef4444' },
            ]}
          />
        </div>

        <div className="chart-container lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time Trend</h3>
          <LineChart
            data={charts.processingTimeTrend}
            dataKey="avgTime"
            xKey="date"
            lines={[
              { key: 'avgTime', name: 'Average Time', color: '#0284c7' },
            ]}
            height={300}
          />
          <div className="mt-2 text-sm text-gray-500">
            Target: 4.0 minutes (shown as reference line)
          </div>
        </div>
      </div>
    </div>
  );
};
