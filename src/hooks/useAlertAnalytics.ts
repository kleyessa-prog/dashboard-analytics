import { useState, useEffect, useMemo } from 'react';
import { apiService, type Alert, type AlertAnalyticsResponse } from '../services/api';

export const useAlertAnalytics = (period: '24h' | '7d' | '30d' = '7d') => {
  const [data, setData] = useState<AlertAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Calculate date range based on period
  const dateRange = useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
    }
    
    return { startDate, endDate: now };
  }, [period]);

  // Transform raw alerts into analytics format
  const transformAlertsToAnalytics = (alerts: Alert[]): AlertAnalyticsResponse => {
    // Ensure alerts is an array
    if (!Array.isArray(alerts)) {
      console.error('[AlertAnalytics] transformAlertsToAnalytics received non-array:', alerts);
      alerts = [];
    }
    
    // Filter alerts by date range
    const filteredAlerts = alerts.filter(alert => {
      const alertDate = new Date(alert.createdAt);
      return alertDate >= dateRange.startDate && alertDate <= dateRange.endDate;
    });

    // Calculate KPIs
    const activeAlerts = filteredAlerts.filter(a => !a.resolved).length;
    const criticalAlerts = filteredAlerts.filter(a => !a.resolved && a.severity === 'critical').length;
    const warningAlerts = filteredAlerts.filter(a => !a.resolved && a.severity === 'warning').length;
    
    const totalAlerts = filteredAlerts.length;
    const resolvedAlerts = filteredAlerts.filter(a => a.resolved).length;
    const resolutionRate = totalAlerts > 0 ? (resolvedAlerts / totalAlerts) * 100 : 0;

    // Generate date range for trend chart (daily data for all periods)
    const dates: string[] = [];
    const today = new Date();
    const days = period === '24h' ? 1 : period === '7d' ? 7 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Build alert trend data
    const alertTrend = dates.map(dateStr => {
      const dayAlerts = filteredAlerts.filter(alert => {
        const alertDate = new Date(alert.createdAt).toISOString().split('T')[0];
        return alertDate === dateStr;
      });
      
      const resolvedOnDay = dayAlerts.filter(a => {
        if (!a.resolved || !a.resolvedAt) return false;
        const resolvedDate = new Date(a.resolvedAt).toISOString().split('T')[0];
        return resolvedDate === dateStr;
      }).length;
      
      return {
        date: dateStr,
        created: dayAlerts.length,
        resolved: resolvedOnDay,
      };
    });

    // Calculate severity distribution (all alerts in period, not just active)
    const severityDistribution = {
      critical: filteredAlerts.filter(a => a.severity === 'critical').length,
      warning: filteredAlerts.filter(a => a.severity === 'warning').length,
      info: filteredAlerts.filter(a => a.severity === 'info').length,
    };

    // Group by source
    const sourceMap = new Map<string, { critical: number; warning: number; info: number }>();
    
    filteredAlerts.forEach(alert => {
      // Capitalize first letter of source
      const source = alert.source.charAt(0).toUpperCase() + alert.source.slice(1);
      if (!sourceMap.has(source)) {
        sourceMap.set(source, { critical: 0, warning: 0, info: 0 });
      }
      const counts = sourceMap.get(source)!;
      counts[alert.severity]++;
    });

    const bySource = Array.from(sourceMap.entries()).map(([source, counts]) => ({
      source,
      critical: counts.critical,
      warning: counts.warning,
      info: counts.info,
    }));

    return {
      kpis: {
        activeAlerts,
        criticalAlerts,
        warningAlerts,
        resolutionRate: Math.round(resolutionRate * 10) / 10, // Round to 1 decimal
      },
      charts: {
        alertTrend,
        severityDistribution,
        bySource,
      },
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (import.meta.env.DEV) {
          console.log(`[AlertAnalytics] Fetching alerts for period: ${period}`);
        }
        
        // Helper function to extract alerts from response
        const extractAlerts = (response: any): Alert[] => {
          if (Array.isArray(response)) {
            return response;
          } else if (response && typeof response === 'object') {
            const responseObj = response as any;
            if (Array.isArray(responseObj.data)) {
              return responseObj.data;
            } else if (Array.isArray(responseObj.alerts)) {
              return responseObj.alerts;
            } else if (Array.isArray(responseObj.items)) {
              return responseObj.items;
            }
          }
          return [];
        };
        
        // Fetch both resolved and unresolved alerts separately to ensure we get all alerts
        // Use Promise.allSettled to handle cases where one request might fail
        const [unresolvedResult, resolvedResult] = await Promise.allSettled([
          apiService.getAlerts({ resolved: false }),
          apiService.getAlerts({ resolved: true }),
        ]);
        
        // Extract alerts from both responses, handling errors gracefully
        let unresolvedAlerts: Alert[] = [];
        let resolvedAlerts: Alert[] = [];
        
        if (unresolvedResult.status === 'fulfilled') {
          unresolvedAlerts = extractAlerts(unresolvedResult.value);
          if (import.meta.env.DEV) {
            console.log('[AlertAnalytics] Unresolved response:', unresolvedResult.value);
          }
        } else {
          console.warn('[AlertAnalytics] Failed to fetch unresolved alerts:', unresolvedResult.reason);
        }
        
        if (resolvedResult.status === 'fulfilled') {
          resolvedAlerts = extractAlerts(resolvedResult.value);
          if (import.meta.env.DEV) {
            console.log('[AlertAnalytics] Resolved response:', resolvedResult.value);
          }
        } else {
          console.warn('[AlertAnalytics] Failed to fetch resolved alerts:', resolvedResult.reason);
        }
        
        // Combine all alerts
        const allAlerts = [...unresolvedAlerts, ...resolvedAlerts];
        
        if (import.meta.env.DEV) {
          console.log(`[AlertAnalytics] Received ${unresolvedAlerts.length} unresolved + ${resolvedAlerts.length} resolved = ${allAlerts.length} total alerts`);
        }
        
        // If we got no alerts from either request, throw an error
        if (allAlerts.length === 0 && unresolvedResult.status === 'rejected' && resolvedResult.status === 'rejected') {
          throw new Error('Failed to fetch alerts from both resolved and unresolved endpoints');
        }
        
        // Transform alerts into analytics format
        const analyticsData = transformAlertsToAnalytics(allAlerts);
        
        if (import.meta.env.DEV) {
          console.log(`[AlertAnalytics] Transformed data:`, analyticsData);
        }
        
        setData(analyticsData);
      } catch (err) {
        console.error('[AlertAnalytics] Failed to fetch alerts:', err);
        if (import.meta.env.DEV) {
          console.error('[AlertAnalytics] Error details:', err);
        }
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, dateRange.startDate, dateRange.endDate]);

  return { data, loading, error };
};
