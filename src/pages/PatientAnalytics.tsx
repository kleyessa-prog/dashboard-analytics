import { useState } from 'react';
import { KPICard } from '../components/kpi/KPICard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { Users, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import { patientData } from '../data/sampleData';

export const PatientAnalytics = () => {
  const [period, setPeriod] = useState('7d');
  const { kpis, charts } = patientData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Analytics</h1>
          <p className="text-gray-600 mt-1">Patient management insights and trends</p>
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
          title="Total Patients"
          value={kpis.totalPatients.toLocaleString()}
          icon={<Users size={24} />}
        />
        <KPICard
          title="New Today"
          value={kpis.newToday}
          color="success"
          icon={<TrendingUp size={24} />}
        />
        <KPICard
          title="EMR Assignment Rate"
          value={`${kpis.emrAssignmentRate}%`}
          color="success"
          icon={<CheckCircle size={24} />}
        />
        <KPICard
          title="Avg Per Day (7d)"
          value={kpis.avgPerDay}
          icon={<Calendar size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Growth Trend</h3>
          <LineChart
            data={charts.growthTrend}
            dataKey="total"
            xKey="date"
            lines={[
              { key: 'total', name: 'Total Patients', color: '#0284c7' },
              { key: 'new', name: 'New Patients', color: '#10b981' },
            ]}
          />
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patients by Location</h3>
          <BarChart
            data={charts.byLocation}
            xKey="locationName"
            bars={[{ key: 'count', name: 'Patients', color: '#0284c7' }]}
            horizontal={true}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};
