/**
 * ============================================================
 * PÁGINA: Dashboard (Panel Principal)
 * ============================================================
 * Descripción: 
 *   Página principal del dashboard que muestra una visión general
 *   de todas las incidencias del sistema. Incluye filtros por
 *   estado/prioridad, búsqueda por tags, y detalles al hacer click.
 * 
 * Ubicación: src/pages/Dashboard.jsx
 * 
 * Routing:
 *   - Accesible desde /dashboard
 *   - Requiere autenticación (protegida)
 * 
 * Características:
 *   1. Filtros: Critical, Open, In Process, Closed (clickables)
 *   2. Buscador: Filtra por tags de las incidencias
 *   3. IncidentsTable: Tabla con incidencias filtradas
 *   4. Click en fila abre modal de detalles
 * 
 * Estados de filtro:
 *   - filter: null (todas) | 'critical' | 'open' | 'in_progress' | 'closed'
 *   - searchTag: string para buscar en tags
 * 
 * Componentes utilizados:
 *   - TopNavBar, SideNavBar, Footer (layout)
 *   - IncidentsTable (tabla interactiva)
 *   - CreateIncidentFAB (botón flotante)
 *   - Modal, IncidenceDetail (ui para ver detalles)
 * ============================================================
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TopNavBar from '../components/layout/TopNavBar';
import SideNavBar from '../components/layout/SideNavBar';
import IncidentsTable from '../components/dashboard/IncidentsTable';
import Modal from '../components/ui/Modal';
import IncidenceDetail from '../components/incidences/IncidenceDetail';

export default function Dashboard() {
  // ============================================================
  // ESTADOS DEL COMPONENTE
  // ============================================================
  const { user, logout } = useAuth();
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Filtros
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchTag, setSearchTag] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  
  // Modal: Ver detalles de incidencia
  const [selectedIncidence, setSelectedIncidence] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ============================================================
  // EFECTO: Cargar incidencias al iniciar y cuando cambia la página
  // ============================================================
  useEffect(() => {
    setLoading(true);
    api.get(`/incidences?page=${currentPage}`)
      .then(({ data }) => {
        const incidenceData = data.data || data;
        console.log('Incidences loaded:', incidenceData);
        setIncidences(Array.isArray(incidenceData) ? incidenceData : []);
        if (data.meta) {
          setMeta(data.meta);
        }
      })
      .catch(err => {
        console.error('Error fetching incidences:', err);
        setIncidences([]);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  // ============================================================
  // COMPUTED: filteredIncidences
  // Descripción: Aplica filtros de estado/prioridad y búsqueda por tags
  // ============================================================
  const filteredIncidences = useMemo(() => {
    let result = incidences;
    
    // Filtro 1: Por estado o prioridad
    if (activeFilter === 'critical') {
      result = result.filter(inc => inc.priority === 'high' || inc.priority === 'ALTA');
    } else if (activeFilter === 'open') {
      result = result.filter(inc => inc.status === 'open' || inc.status === 'ABIERTA');
    } else if (activeFilter === 'in_progress') {
      result = result.filter(inc => inc.status === 'in_progress' || inc.status === 'EN_PROCESO');
    } else if (activeFilter === 'closed') {
      result = result.filter(inc => inc.status === 'closed' || inc.status === 'CERRADA');
    }
    
    // Filtro 2: Por tags (si hay búsqueda)
    if (searchTag.trim()) {
      const tagSearch = searchTag.toLowerCase();
      result = result.filter(inc => {
        const tagNames = inc.tags?.map(t => t.name.toLowerCase()) || [];
        return tagNames.some(tag => tag.includes(tagSearch));
      });
    }
    
    return result;
  }, [incidences, activeFilter, searchTag]);

  // ============================================================
  // COMPUTED: Estadísticas para los botones
  // ============================================================
  const stats = useMemo(() => {
    const total = meta.total || incidences.length;
    const critical = incidences.filter(i => i.priority === 'high' || i.priority === 'ALTA').length;
    const open = incidences.filter(i => i.status === 'open' || i.status === 'ABIERTA').length;
    const inProgress = incidences.filter(i => i.status === 'in_progress' || i.status === 'EN_PROCESO').length;
    const closed = incidences.filter(i => i.status === 'closed' || i.status === 'CERRADA').length;
    
    return { total, critical, open, inProgress, closed };
  }, [incidences, meta.total]);

  // ============================================================
  // HANDLER: handleLogout
  // ============================================================
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ============================================================
  // HANDLER: handleRowClick
  // Descripción: Abre modal con detalles al hacer click en fila
  // ============================================================
  const handleRowClick = async (incidence) => {
    setLoadingDetail(true);
    setSelectedIncidence(incidence);
    setShowDetailModal(true);
    
    // Cargar datos frescos de la API
    try {
      const { data } = await api.get(`/incidences/${incidence.id}`);
      setSelectedIncidence(data.data || data);
    } catch (err) {
      console.error('Error fetching incidence details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ============================================================
  // HANDLER: handlePageChange
  // Descripción: Cambia la página de la paginación
  // ============================================================
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* TOP NAV BAR */}
      <TopNavBar user={user} onLogout={handleLogout} />
      
      {/* SIDEBAR NAVIGATION */}
      <SideNavBar />
      
      {/* MAIN CONTENT AREA */}
      <main className="ml-64 pt-14 min-h-screen relative">
        {/* Background pattern */}
        <div className="absolute inset-0 stippled-bg"></div>
        
        {/* Content */}
        <div className="relative p-8 max-w-6xl">
          
          {/* ============================================================
              HEADER: Título + Subtítulo
           ============================================================ */}
          <div className="mb-8">
            <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">MÓDULO DE DASHBOARD</span>
            <h1 className="font-sans font-bold text-4xl mt-2">DASHBOARD PRINCIPAL</h1>
            <p className="font-label text-sm text-on-surface-variant mt-1">Resumen de incidencias del sistema</p>
          </div>

          {/* ============================================================
              SECCIÓN: FILTER BUTTONS (Botones de filtro) - Estilo S4
              Estilo: Compacto, border-2 border-black, números grandes
           ============================================================ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
            {/* Botón: CRITICAL (Alta prioridad) */}
            <button 
              onClick={() => setActiveFilter(activeFilter === 'critical' ? null : 'critical')}
              className={`block text-center p-6 border-2 border-black transition-colors ${
                activeFilter === 'critical' 
                  ? 'bg-black text-white' 
                  : 'bg-white hover:bg-surface-dim'
              }`}
            >
              <div className="text-xs uppercase tracking-wide mb-3">Critical</div>
              <div className="text-5xl font-light mb-2">{stats.critical}</div>
              <div className="text-xs">High priority incidents</div>
            </button>

            {/* Botón: OPEN */}
            <button 
              onClick={() => setActiveFilter(activeFilter === 'open' ? null : 'open')}
              className={`block text-center p-6 border-2 border-black transition-colors ${
                activeFilter === 'open' 
                  ? 'bg-black text-white' 
                  : 'bg-white hover:bg-surface-dim'
              }`}
            >
              <div className="text-xs uppercase tracking-wide mb-3">Open</div>
              <div className="text-5xl font-light mb-2">{stats.open}</div>
              <div className="text-xs">Open incidents</div>
            </button>

            {/* Botón: IN PROCESS */}
            <button 
              onClick={() => setActiveFilter(activeFilter === 'in_progress' ? null : 'in_progress')}
              className={`block text-center p-6 border-2 border-black transition-colors ${
                activeFilter === 'in_progress' 
                  ? 'bg-black text-white' 
                  : 'bg-white hover:bg-surface-dim'
              }`}
            >
              <div className="text-xs uppercase tracking-wide mb-3">In Process</div>
              <div className="text-5xl font-light mb-2">{stats.inProgress}</div>
              <div className="text-xs">In process incidents</div>
            </button>

            {/* Botón: CLOSED */}
            <button 
              onClick={() => setActiveFilter(activeFilter === 'closed' ? null : 'closed')}
              className={`block text-center p-6 border-2 border-black transition-colors ${
                activeFilter === 'closed' 
                  ? 'bg-black text-white' 
                  : 'bg-white hover:bg-surface-dim'
              }`}
            >
              <div className="text-xs uppercase tracking-wide mb-3">Closed</div>
              <div className="text-5xl font-light mb-2">{stats.closed}</div>
              <div className="text-xs">Closed incidents</div>
            </button>
          </div>

          {/* SEARCH BAR - Buscar por tags - Estilo S4 */}
          <div className="mb-6 bg-white p-4">
            <div className="flex gap-4 items-center">
              <input 
                type="text"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="border-2 border-black p-2 text-xs flex-1" 
                placeholder="Buscar por hashtag..."
              />
              <button className="px-16 py-2 border-2 border-black bg-black text-white text-xs uppercase">
                Search
              </button>
            </div>
          </div>

          {/* INCIDENTS TABLE - Pasar incidencias filtradas */}
          <IncidentsTable 
            incidences={filteredIncidences} 
            loading={loading}
            onRowClick={handleRowClick}
            currentPage={currentPage}
            totalPages={meta.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {/* MODAL: DETALLES DE INCIDENCIA */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="DETALLES DE INCIDENCIA"
        size="lg"
      >
        <IncidenceDetail
          incidence={selectedIncidence}
          onEdit={() => navigate('/my-incidences')}
          onDelete={() => alert('Para eliminar incidencias, use la página "My Incidences"')}
          onClose={() => setShowDetailModal(false)}
          showCommentForm={true}
        />
      </Modal>
    </div>
  );
}