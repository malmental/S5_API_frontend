/**
 * ============================================================
 * COMPONENT: IncidentsTable (Incidents Table)
 * ============================================================
 * Description: 
 *   Interactive table component that shows incidences with
 *   pagination. Filters come from parent component (Dashboard).
 * 
 * Location: src/components/dashboard/IncidentsTable.jsx
 * 
 * Props:
 *   - incidences: Array of already filtered incidences (from parent)
 *   - loading: Boolean indicating loading state
 *   - onRowClick: Callback function on row click (optional)
 * 
 * Characteristics:
 *   1. Table with columns: ID, Title, Priority, Status, Tags
 *   2. Visual states for priority and status
 *   3. Functional pagination (client-side)
 *   4. Row click to view details (if onRowClick provided)
 * 
 * Technical notes:
 *   - Filters come from parent (Dashboard)
 *   - Pagination: client-side with 10 items per page
 *   - Tags must come in the API response
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
  // Returns CSS class by priority
  // ============================================================
  const getPriorityClass = (priority) => {
    if (priority === 'high' || priority === 'ALTA' || priority === 'alta') {
      return 'px-2 py-1 text-xs uppercase bg-primary text-white';
    }
    if (priority === 'medium' || priority === 'MEDIA' || priority === 'media') {
      return 'border-2 border-gray-400 px-2 py-1 text-xs uppercase bg-white';
    }
    return 'border-2 border-gray-300 px-2 py-1 text-xs uppercase bg-white';
  };

  // ============================================================
  // HELPER: getStatusClass
  // Returns CSS class by status
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
  // HANDLER: Change page
  // ============================================================
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div>
      {/* ============================================================
          DATA TABLE - S4 Style
       ============================================================ */}
      <section className="bg-white">
        
        {/* HEADER */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-dim border-b-2 border-black text-xs uppercase tracking-wide font-semibold">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-2 text-center">Tags</div>
          <div className="col-span-2 text-center">Priority</div>
          <div className="col-span-3 text-center">Status</div>
        </div>

        {/* DATA ROWS */}
        {loading ? (
          <div className="px-6 py-8 text-center">
            <p className="font-mono text-sm">LOADING DATA...</p>
          </div>
        ) : incidences.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="font-mono text-sm text-gray-500">NO INCIDENCES REGISTERED</p>
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
              
              {/* Title with description */}
              <div className="col-span-4">
                <div className="font-medium">{incidence.title || 'Untitled'}</div>
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
          PAGINATION - S4 Style
       ============================================================ */}
      {incidences.length > 0 && (
        <div className="px-6 py-4 bg-surface-dim border-t-2 border-black">
          <div className="flex items-center justify-between">
            {/* Info */}
            <div className="text-xs text-gray-600">
              Showing page {currentPage} of {totalPages}
            </div>
            
            {/* Buttons */}
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