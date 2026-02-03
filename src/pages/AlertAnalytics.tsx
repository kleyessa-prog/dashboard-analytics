import { useState } from 'react';
import { KPICard } from '../components/kpi/KPICard';
import { AreaChart } from '../components/charts/AreaChart';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart } from '../components/charts/BarChart';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useAlertAnalytics } from '../hooks/useAlertAnalytics';

export const AlertAnalytics = () => {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('7d');
  const { data, loading, error } = useAlertAnalytics(period);

  const handlePeriodChange = (newPeriod: '24h' | '7d' | '30d') => {
    if (import.meta.env.DEV) {
      console.log(`[AlertAnalytics] Period changed from ${period} to ${newPeriod}`);
    }
    setPeriod(newPeriod);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading alert analytics...</div>
      </div>
    );
  }

  if (error && !data) {
    const is404 = error.message.includes('404') || error.message.includes('not found');
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alert Analytics</h1>
            <p className="text-gray-600 mt-1">System alerts and resolution metrics</p>
          </div>
          <select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value as '24h' | '7d' | '30d')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-red-600 text-lg font-semibold mb-2">
            {is404 ? 'Endpoint Not Found' : 'Error loading alert analytics'}
          </div>
          <div className="text-gray-600 text-sm mb-2 text-center max-w-md">
            {error.message}
          </div>
          {is404 && (
            <div className="text-gray-500 text-xs mb-4 text-center max-w-md">
              The backend endpoint <code className="bg-gray-100 px-2 py-1 rounded">/analytics/alerts</code> has not been implemented yet. 
              Please implement this endpoint on your backend server.
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alert Analytics</h1>
            <p className="text-gray-600 mt-1">System alerts and resolution metrics</p>
          </div>
          <select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value as '24h' | '7d' | '30d')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-gray-600 text-lg font-semibold mb-2">No data available</div>
          <div className="text-gray-500 text-sm">Unable to fetch alert analytics data from the API.</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { kpis, charts } = data;

  // Validate and prepare chart data
  const alertTrendData = Array.isArray(charts.alertTrend) 
    ? charts.alertTrend.filter(item => item.date && typeof item.created === 'number' && typeof item.resolved === 'number')
    : [];
  
  const bySourceData = Array.isArray(charts.bySource)
    ? charts.bySource.filter(item => item.source && typeof item.critical === 'number' && typeof item.warning === 'number' && typeof item.info === 'number')
    : [];
  
  const severityData = charts.severityDistribution && 
    typeof charts.severityDistribution.critical === 'number' &&
    typeof charts.severityDistribution.warning === 'number' &&
    typeof charts.severityDistribution.info === 'number'
    ? charts.severityDistribution
    : { critical: 0, warning: 0, info: 0 };

  // Log data for debugging (dev only)
  if (import.meta.env.DEV) {
    console.log('[AlertAnalytics] Rendering with data:', {
      period,
      kpis,
      alertTrendLength: alertTrendData.length,
      bySourceLength: bySourceData.length,
      severityDistribution: severityData,
      sampleData: {
        firstAlertTrend: alertTrendData[0],
        firstBySource: bySourceData[0],
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert Analytics</h1>
          <p className="text-gray-600 mt-1">System alerts and resolution metrics</p>
        </div>
        <select
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value as '24h' | '7d' | '30d')}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={loading}
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
          {alertTrendData.length > 0 ? (
            <AreaChart
              data={alertTrendData}
              dataKey="created"
              xKey="date"
              areas={[
                { key: 'created', name: 'Created', color: '#ef4444' },
                { key: 'resolved', name: 'Resolved', color: '#10b981' },
              ]}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No trend data available
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Severity Distribution</h3>
          <div className="w-full" style={{ minHeight: '300px' }}>
            <DonutChart
              data={[
                { name: 'Critical', value: severityData.critical },
                { name: 'Warning', value: severityData.warning },
                { name: 'Info', value: severityData.info },
              ]}
              colors={['#ef4444', '#f59e0b', '#0284c7']}
              centerValue={severityData.critical + severityData.warning + severityData.info}
              height={300}
            />
          </div>
        </div>

        <div className="chart-container lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts by Source</h3>
          {bySourceData.length > 0 ? (
            <BarChart
              data={bySourceData}
              xKey="source"
              bars={[
                { key: 'critical', name: 'Critical', color: '#ef4444' },
                { key: 'warning', name: 'Warning', color: '#f59e0b' },
                { key: 'info', name: 'Info', color: '#0284c7' },
              ]}
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No source data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
