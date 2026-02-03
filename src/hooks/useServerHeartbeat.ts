import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { ServerHeartbeat, ServerHeartbeatHistory } from '../services/api';

export const useServerHeartbeat = (serverId?: string, autoRefresh = true) => {
  const [heartbeat, setHeartbeat] = useState<ServerHeartbeat | null>(null);
  const [history, setHistory] = useState<ServerHeartbeatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeartbeat = useCallback(async () => {
    if (!serverId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getServerHealth(serverId);
      setHeartbeat(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch heartbeat');
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  const fetchHistory = useCallback(async (period: '24h' | '7d' = '24h') => {
    if (!serverId) return;
    
    try {
      const data = await apiService.getServerHeartbeatHistory(serverId, period);
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch heartbeat history:', err);
    }
  }, [serverId]);

  useEffect(() => {
    fetchHeartbeat();
    fetchHistory('24h');

    if (autoRefresh) {
      // Auto-refresh every 60 seconds
      const interval = setInterval(() => {
        fetchHeartbeat();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [serverId, autoRefresh, fetchHeartbeat, fetchHistory]);

  return {
    heartbeat,
    history,
    loading,
    error,
    refetch: fetchHeartbeat,
    refetchHistory: fetchHistory,
  };
};

// Hook for all servers
export const useAllServersHeartbeat = (autoRefresh = true) => {
  const [heartbeats, setHeartbeats] = useState<ServerHeartbeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllServersHealth();
      setHeartbeats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch heartbeats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    if (autoRefresh) {
      // Auto-refresh every 60 seconds
      const interval = setInterval(fetchAll, 60000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchAll]);

  return {
    heartbeats,
    loading,
    error,
    refetch: fetchAll,
  };
};
