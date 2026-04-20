import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useMetrics() {
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/metrics');
      setStats({
        total: data.data.total || 0,
        high: data.data.by_priority?.high || 0,
        open: data.data.by_status?.open || 0,
        inProgress: data.data.by_status?.in_progress || 0,
        closed: data.data.by_status?.closed || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, fetchStats };
}
