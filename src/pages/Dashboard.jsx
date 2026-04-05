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

import { useEffect, useState } from 'react';
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
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });

  // Estadísticas del dashboard
  const [statsData, setStatsData] = useState({
    total: 0,
    high: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  
  // Modal: Ver detalles de incidencia
  const [selectedIncidence, setSelectedIncidence] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ============================================================
  // EFECTO: Cargar estadísticas del dashboard
  // ============================================================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/metrics');
        setStatsData({
          total: data.data.total || 0,
          high: data.data.by_priority?.high || 0,
          open: data.data.by_status?.open || 0,
          inProgress: data.data.by_status?.in_progress || 0,
          resolved: data.data.by_status?.resolved || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  // ============================================================
  // EFECTO: Resetear página cuando cambia el filtro
  // ============================================================
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // ============================================================
  // EFECTO: Cargar incidencias al iniciar y cuando cambia la página
  // ============================================================
  useEffect(() => {
    setLoading(true);
    
    let url = `/incidences?page=${currentPage}`;
    
    if (activeFilter) {
      if (activeFilter === 'critical') {
        url += '&priority=critical';
      } else if (activeFilter === 'high') {
        url += '&priority=high';
      } else {
        url += `&status=${activeFilter}`;
      }
    }
    
    if (searchTag.trim()) {
      url += `&search=${encodeURIComponent(searchTag.trim())}`;
    }
    
    api.get(url)
      .then(({ data }) => {
        const incidenceData = data.data || data;
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
  }, [currentPage, activeFilter, searchTag]);

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
  // HANDLER: handleCommentAdded
  // Descripción: Actualiza selectedIncidence cuando se añade comentario
  // ============================================================
  const handleCommentAdded = (updatedIncidence) => {
    setSelectedIncidence(updatedIncidence);
    setIncidences(prev => prev.map(inc => 
      inc.id === updatedIncidence.id ? updatedIncidence : inc
    ));
  };

  // ============================================================
  // HANDLER: handleCommentDeleted
  // Descripción: Actualiza selectedIncidence cuando se elimina comentario
  // ============================================================
  const handleCommentDeleted = (updatedIncidence) => {
    setSelectedIncidence(updatedIncidence);
    setIncidences(prev => prev.map(inc => 
      inc.id === updatedIncidence.id ? updatedIncidence : inc
    ));
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
              {/* Botón: HIGH */}
              <button 
                onClick={() => setActiveFilter(activeFilter === 'high' ? null : 'high')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'high' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">High</div>
                <div className="text-5xl font-light mb-2">{statsData.high}</div>
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
                <div className="text-5xl font-light mb-2">{statsData.open}</div>
                <div className="text-xs">Open incidents</div>
              </button>

              {/* Botón: IN PROGRESS */}
              <button 
                onClick={() => setActiveFilter(activeFilter === 'in_progress' ? null : 'in_progress')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'in_progress' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">In Progress</div>
                <div className="text-5xl font-light mb-2">{statsData.inProgress}</div>
                <div className="text-xs">In progress incidents</div>
              </button>

              {/* Botón: RESOLVED */}
              <button 
                onClick={() => setActiveFilter(activeFilter === 'resolved' ? null : 'resolved')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'resolved' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">Resolved</div>
                <div className="text-5xl font-light mb-2">{statsData.resolved}</div>
                <div className="text-xs">Resolved incidents</div>
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
            incidences={incidences} 
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
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
        />
      </Modal>
    </div>
  );
}