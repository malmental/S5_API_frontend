/**
 * ============================================================
 * PÁGINA: MyIncidences (Mis Incidencias)
 * ============================================================
 * Descripción: 
 *   Página que muestra las incidencias creadas por el usuario logueado.
 *   Incluye botón para crear nueva incidencia (abre modal) y
 *   возможность de ver detalles de cada incidencia.
 * 
 * Ubicación: src/pages/MyIncidences.jsx
 * 
 * Routing:
 *   - Accesible desde /my-incidences
 *   - Requiere autenticación (protegida)
 * 
 * Características:
 *   1. Lista de incidencias del usuario actual
 *   2. Modal para crear nueva incidencia
 *   3. Modal para ver detalles de incidencia
 *   4. Modal para editar incidencia
 *   5. Estados: loading, empty, data
 * 
 * Integración API:
 *   - GET /incidences → Lista todas (filtrar por user_id después)
 *   - POST /incidences → Crear nueva
 *   - GET /incidences/:id → Ver detalles
 *   - PUT /incidences/:id → Actualizar
 *   - DELETE /incidences/:id → Eliminar
 * 
 * Componentes utilizados:
 *   - TopNavBar, SideNavBar, Footer (layout)
 *   - Modal (ui)
 *   - IncidenceForm (formulario crear/editar)
 *   - IncidenceDetail (vista de detalles)
 * 
 * Notas técnicas:
 *   - Por ahora filtra client-side (mejorar a server-side)
 *   - El modal de edición reutiliza IncidenceForm
 *   - La eliminación requiere confirmación
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import TopNavBar from '../components/layout/TopNavBar';
import SideNavBar from '../components/layout/SideNavBar';
import Modal from '../components/ui/Modal';
import IncidenceForm from '../components/incidences/IncidenceForm';
import IncidenceDetail from '../components/incidences/IncidenceDetail';

export default function MyIncidences() {
  // ============================================================
  // ESTADOS DEL COMPONENTE
  // ============================================================
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Datos
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal: Crear nueva incidencia
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Modal: Ver detalles
  const [selectedIncidence, setSelectedIncidence] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  // Modal: Editar incidencia
  const [editingIncidence, setEditingIncidence] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });

  // ============================================================
  // EFECTO: Cargar incidencias al iniciar y cuando cambia la página
  // ============================================================
  useEffect(() => {
    fetchIncidences(currentPage);
  }, [currentPage]);

  // ============================================================
  // FUNCIÓN: fetchIncidences
  // Descripción: Obtiene lista de incidencias del usuario autenticado
  // ============================================================
  const fetchIncidences = async (page = 1) => {
    try {
      const { data } = await api.get(`/my-incidences?page=${page}`);
      setIncidences(data.data || []);
      if (data.meta) {
        setMeta(data.meta);
      }
    } catch (err) {
      console.error('Error fetching incidences:', err);
      setIncidences([]);
    } finally {
      setLoading(false);
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
  // HANDLER: handleLogout
  // ============================================================
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ============================================================
  // HANDLER: handleCreate
  // Descripción: Crear nueva incidencia
  // ============================================================
  const handleCreate = async (formData) => {
    setCreating(true);
    try {
      await api.post('/incidences', formData);
      await fetchIncidences();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating incidence:', err);
      alert('Error al crear incidencia: ' + (err.response?.data?.message || 'Error desconocido'));
    } finally {
      setCreating(false);
    }
  };

  // ============================================================
  // HANDLER: handleViewDetails
  // Descripción: Ver detalles de una incidencia
  // ============================================================
  const handleViewDetails = async (incidence) => {
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
  // HANDLER: handleEdit
  // Descripción: Abrir modal de edición
  // ============================================================
  const handleEdit = () => {
    setEditingIncidence(selectedIncidence);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  // ============================================================
  // HANDLER: handleUpdate
  // Descripción: Actualizar incidencia
  // ============================================================
  const handleUpdate = async (formData) => {
    setUpdating(true);
    try {
      await api.put(`/incidences/${editingIncidence.id}`, formData);
      await fetchIncidences();
      setShowEditModal(false);
      setEditingIncidence(null);
      setShowDetailModal(false);
      setSelectedIncidence(null);
    } catch (err) {
      console.error('Error updating incidence:', err);
      alert('Error al actualizar incidencia: ' + (err.response?.data?.message || 'Error desconocido'));
    } finally {
      setUpdating(false);
    }
  };

  // ============================================================
  // HANDLER: handleDelete
  // Descripción: Eliminar incidencia
  // ============================================================
  const handleDelete = async () => {
    if (!selectedIncidence) return;
    
    if (!window.confirm('¿Está seguro de eliminar esta incidencia?')) {
      return;
    }
    
    try {
      await api.delete(`/incidences/${selectedIncidence.id}`);
      await fetchIncidences();
      setShowDetailModal(false);
      setSelectedIncidence(null);
    } catch (err) {
      console.error('Error deleting incidence:', err);
      alert('Error al eliminar incidencia: ' + (err.response?.data?.message || 'Error desconocido'));
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    /* ============================================================
        CONTENEDOR PRINCIPAL
        Layout: Flex column | Fondo: surface
       ============================================================ */
    <div className="flex flex-col min-h-screen bg-surface">
      
      {/* ============================================================
          SECCIÓN 1: TOP NAV BAR
          Barra de navegación superior
          Componente: src/components/layout/TopNavBar.jsx
       ============================================================ */}
      <TopNavBar user={user} onLogout={handleLogout} />
      
      {/* ============================================================
          SECCIÓN 2: SIDE NAV BAR
          Barra lateral de navegación
          Componente: src/components/layout/SideNavBar.jsx
       ============================================================ */}
      <SideNavBar />
      
      {/* ============================================================
          SECCIÓN 3: MAIN CONTENT
          Área principal con lista de incidencias
       ============================================================ */}
      <main className="ml-64 pt-14 min-h-screen relative">
        {/* Background pattern */}
        <div className="absolute inset-0 stippled-bg"></div>
        <div className="relative p-8 max-w-6xl">
          
          {/* ============================================================
              HEADER: Título + Botón nuevo
              Título: "MIS INCIDENCIAS"
              Botón: "+ NUEVA INCIDENCIA" →abre modal crear
           ============================================================ */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">MÓDULO DE INCIDENCIAS</span>
              <h1 className="font-sans font-bold text-4xl mt-2">MIS INCIDENCIAS</h1>
              <p className="font-label text-sm text-on-surface-variant mt-1">Incidencias creadas por usted</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="font-sans font-bold uppercase tracking-wider bg-primary text-on-primary px-6 py-3 hover:bg-neutral-800 transition-colors border-2 border-black"
            >
              + NUEVA INCIDENCIA
            </button>
          </div>

          {/* ============================================================
              LISTA DE INCIDENCIAS
              Tabla o mensaje según estado
           ============================================================ */}
          {loading ? (
            <div className="border-2 border-black p-8 bg-white text-center">
              <p className="font-label text-sm">CARGANDO DATOS...</p>
            </div>
          ) : incidences.length === 0 ? (
            <div className="p-8 bg-white text-center">
              <p className="font-label text-sm text-on-surface-variant">NO HA CREADO NINGUNA INCIDENCIA</p>
              <p className="font-label text-xs text-on-surface-variant mt-2">Haga clic en "+ NUEVA INCIDENCIA" para crear una</p>
            </div>
          ) : (
            /* Lista de incidencias */
            <div className="bg-white">
              {/* Header de la tabla */}
              <div className="grid grid-cols-12 border-b-2 border-black bg-surface-container">
                <div className="col-span-1 px-4 py-3 font-label text-xs uppercase">ID</div>
                <div className="col-span-5 px-4 py-3 font-label text-xs uppercase">Título</div>
                <div className="col-span-2 px-4 py-3 font-label text-xs uppercase">Estado</div>
                <div className="col-span-2 px-4 py-3 font-label text-xs uppercase">Prioridad</div>
                <div className="col-span-2 px-4 py-3 font-label text-xs uppercase text-right">Fecha</div>
              </div>
              
              {/* Filas de datos */}
              {incidences.map((incidence, index) => (
                <div 
                  key={incidence.id}
                  onClick={() => handleViewDetails(incidence)}
                  className={`grid grid-cols-12 cursor-pointer ${index !== incidences.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors`}
                >
                  <div className="col-span-1 px-4 py-4 font-mono text-sm font-bold">
                    #{incidence.id}
                  </div>
                  <div className="col-span-5 px-4 py-4 font-sans font-medium">
                    {incidence.title}
                  </div>
                  <div className="col-span-2 px-4 py-4">
                    <span className={`font-mono text-xs px-2 py-1 border ${
                      incidence.status === 'open' 
                        ? 'border-black bg-white' 
                        : 'border-gray-300 bg-gray-100 text-gray-500'
                    }`}>
                      {incidence.status?.toUpperCase() || 'OPEN'}
                    </span>
                  </div>
                  <div className="col-span-2 px-4 py-4">
                    <span className={`font-mono text-xs px-2 py-1 ${
                      incidence.priority === 'high' 
                        ? 'bg-primary text-on-primary' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {incidence.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
                  </div>
                  <div className="col-span-2 px-4 py-4 font-mono text-xs text-right text-gray-500">
                    {incidence.created_at ? new Date(incidence.created_at).toISOString().slice(0, 10).replace('T', '-') : '--'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contador */}
          <div className="mt-4 font-label text-xs text-gray-500">
            MOSTRANDO {incidences.length} DE {meta.total} INCIDENCIAS
          </div>

          {/* Paginación */}
          {meta.last_page > 1 && (
            <div className="mt-6 flex justify-between items-center font-mono text-[10px] uppercase">
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="border-2 border-black px-3 py-1 font-bold hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ««
                </button>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-2 border-black px-3 py-1 font-bold hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  «
                </button>
              </div>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                  let pageNum;
                  if (meta.last_page <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= meta.last_page - 2) {
                    pageNum = meta.last_page - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border-2 ${currentPage === pageNum ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.last_page}
                  className="border-2 border-black px-3 py-1 font-bold hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  »
                </button>
                <button 
                  onClick={() => handlePageChange(meta.last_page)}
                  disabled={currentPage === meta.last_page}
                  className="border-2 border-black px-3 py-1 font-bold hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  »»
                </button>
              </div>
              
              <div className="text-gray-500">
                PAGE {currentPage} OF {meta.last_page}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================
          MODAL 1: CREAR NUEVA INCIDENCIA
          Componente: IncidenceForm
          Título: "CREAR INCIDENCIA"
       ============================================================ */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="CREAR INCIDENCIA"
        size="lg"
      >
        <IncidenceForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={creating}
          isEdit={false}
        />
      </Modal>

      {/* ============================================================
          MODAL 2: VER DETALLES
          Componente: IncidenceDetail
          Título: "DETALLES DE INCIDENCIA"
       ============================================================ */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="DETALLES DE INCIDENCIA"
        size="lg"
      >
        <IncidenceDetail
          incidence={selectedIncidence}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setShowDetailModal(false)}
          showCommentForm={false}
        />
      </Modal>

      {/* ============================================================
          MODAL 3: EDITAR INCIDENCIA
          Componente: IncidenceForm (reutilizado)
          Título: "EDITAR INCIDENCIA"
       ============================================================ */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingIncidence(null);
        }}
        title="EDITAR INCIDENCIA"
        size="lg"
      >
        <IncidenceForm
          initialData={editingIncidence}
          onSubmit={handleUpdate}
          onCancel={() => {
            setShowEditModal(false);
            setEditingIncidence(null);
          }}
          loading={updating}
          isEdit={true}
        />
      </Modal>
    </div>
  );
}