/**
 * ============================================================
 * COMPONENTE: IncidentsTable (Tabla de Incidencias)
 * ============================================================
 * Descripción: 
 *   Componente de tabla interactiva que muestra incidencias con
 *   paginación. Los filtros vienen del componente padre (Dashboard).
 * 
 * Ubicación: src/components/dashboard/IncidentsTable.jsx
 * 
 * Props:
 *   - incidences: Array de incidencias ya filtradas (desde padre)
 *   - loading: Booleano que indica estado de carga
 *   - onRowClick: Función callback al hacer click en una fila (opcional)
 * 
 * Características:
 *   1. Tabla con columnas: ID, Título, Prioridad, Estado, Tags
 *   2. Estados visuales para prioridad y estado
 *   3. Paginación funcional (client-side)
 *   4. Click en fila para ver detalles (si onRowClick proveído)
 * 
 * Notas técnicas:
 *   - Los filtros vienen del padre (Dashboard)
 *   - Paginación: client-side con 10 items por página
 *   - Los tags deben venir en la respuesta de la API
 * ============================================================
 */

import { useMemo } from 'react';

export default function IncidentsTable({ 
  incidences, 
  loading, 
  onRowClick = null,
  currentPage = 1,
  totalPages = 1,
  onPageChange = null
}) {

  // ============================================================
  // HELPER: getPriorityClass
  // Retorna clase CSS según prioridad
  // ============================================================
  const getPriorityClass = (priority) => {
    if (priority === 'high' || priority === 'ALTA' || priority === 'alta') {
      return 'border-2 border-black px-2 py-1 text-xs uppercase bg-black text-white';
    }
    if (priority === 'medium' || priority === 'MEDIA' || priority === 'media') {
      return 'border-2 border-gray-400 px-2 py-1 text-xs uppercase bg-white';
    }
    return 'border-2 border-gray-300 px-2 py-1 text-xs uppercase bg-white';
  };

  // ============================================================
  // HELPER: getStatusClass
  // Retorna clase CSS según estado
  // ============================================================
  const getStatusClass = (status) => {
    if (status === 'open' || status === 'ABIERTA') {
      return 'border-2 border-black px-2 py-1 text-xs uppercase bg-white';
    }
    if (status === 'in_progress' || status === 'EN_PROCESO') {
      return 'border-2 border-black px-2 py-1 text-xs uppercase bg-white';
    }
    return 'border-2 border-gray-300 px-2 py-1 text-xs uppercase bg-white';
  };

  // ============================================================
  // HANDLER: Cambiar página
  // ============================================================
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div>
      {/* ============================================================
          DATA TABLE (Tabla de datos) - Estilo S4
       ============================================================ */}
      <section className="bg-white">
        
        {/* ENCABEZADO */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-dim border-b-2 border-black text-xs uppercase tracking-wide font-semibold">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-2 text-center">Tags</div>
          <div className="col-span-2 text-center">Priority</div>
          <div className="col-span-3 text-center">Status</div>
        </div>

        {/* FILAS DE DATOS */}
        {loading ? (
          <div className="px-6 py-8 text-center">
            <p className="font-mono text-sm">CARGANDO DATOS...</p>
          </div>
        ) : incidences.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="font-mono text-sm text-gray-500">NO HAY INCIDENCIAS REGISTRADAS</p>
          </div>
        ) : (
          incidences.map((incidence, index) => (
            <div 
              key={incidence.id || index} 
              onClick={() => onRowClick && onRowClick(incidence)}
              className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-surface-dim transition-colors items-center ${index !== incidences.length - 1 ? 'border-b border-gray-300' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {/* ID */}
              <div className="col-span-1 font-semibold">
                INC-{String(incidence.id).padStart(3, '0')}
              </div>
              
              {/* Título con descripción */}
              <div className="col-span-4">
                <div className="font-medium">{incidence.title || 'Sin título'}</div>
                <div className="text-xs text-gray-500 truncate">{incidence.description?.slice(0, 50) || ''}</div>
              </div>
              
              {/* Tags */}
              <div className="col-span-2 flex flex-wrap gap-1 justify-center">
                {incidence.tags && incidence.tags.length > 0 ? (
                  incidence.tags.slice(0, 3).map((tag, tagIdx) => (
                    <span 
                      key={tagIdx}
                      className="px-2 py-1 text-xs bg-surface-dim text-gray-700"
                    >
                      #{tag.name || tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-mono text-gray-400">—</span>
                )}
              </div>
              
              {/* Priority */}
              <div className="col-span-2 text-center">
                <span className={getPriorityClass(incidence.priority)}>
                  {incidence.priority || 'medium'}
                </span>
              </div>
              
              {/* Status */}
              <div className="col-span-3 text-center">
                <span className={getStatusClass(incidence.status)}>
                  {incidence.status || 'open'}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* ============================================================
          PAGINATION (Paginación) - Estilo S4
       ============================================================ */}
      {incidences.length > 0 && (
        <div className="px-6 py-4 bg-surface-dim border-t-2 border-black">
          <div className="flex items-center justify-between">
            {/* Info */}
            <div className="text-xs text-gray-600">
              Mostrando página {currentPage} de {totalPages}
            </div>
            
            {/* Botones */}
            <div className="flex gap-2">
              <button 
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
              >
                ««
              </button>
              <button 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
              >
                «
              </button>
              <button 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
              >
                »
              </button>
              <button 
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
              >
                »»
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}