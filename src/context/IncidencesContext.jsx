/**
 * ============================================================
 * CONTEXT: IncidencesContext
 * ============================================================
 * Global state for incidences to avoid prop drilling and
 * state duplication between Dashboard and MyIncidences.
 * 
 * Features:
 *   - List of incidences
 *   - Loading state
 *   - Pagination meta
 *   - CRUD operations (create, update, delete)
 * 
 * Usage:
 *   const { incidences, refresh } = useIncidences();
 * ============================================================
 */

import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const IncidencesContext = createContext(null);

export function IncidencesProvider({ children }) {
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const fetchIncidences = useCallback(async (url = '/incidences') => {
    setLoading(true);
    try {
      const { data } = await api.get(url);
      const incidenceData = data.data || data;
      setIncidences(Array.isArray(incidenceData) ? incidenceData : []);
      if (data.meta) {
        setMeta(data.meta);
      }
    } catch (err) {
      console.error('Error fetching incidences:', err);
      setIncidences([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchIncidences();
  }, [fetchIncidences]);

  const value = {
    incidences,
    loading,
    meta,
    fetchIncidences,
    refresh,
    setIncidences,
    setMeta,
  };

  return (
    <IncidencesContext.Provider value={value}>
      {children}
    </IncidencesContext.Provider>
  );
}

export function useIncidences() {
  const context = useContext(IncidencesContext);
  if (!context) {
    throw new Error('useIncidences must be used within IncidencesProvider');
  }
  return context;
}
