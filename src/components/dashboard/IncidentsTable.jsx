import { useMemo } from 'react';
import { getPriorityClass, getStatusClass } from '../../utils/badgeHelpers';

export default function IncidentsTable({ 
  incidences, 
  loading, 
  onRowClick = null,
  currentPage = 1,
  totalPages = 1,
  onPageChange = null
}) {

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div>
      <section className="bg-white">
        
        {/* HEADER */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-dim border-b-2 border-black text-xs uppercase tracking-wide font-semibold">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-2 text-center">Tags</div>
          <div className="col-span-2 text-center">Priority</div>
          <div className="col-span-3 text-center">Status</div>
        </div>

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
              <div className="col-span-1 font-semibold">
                INC-{String(incidence.id).padStart(3, '0')}
              </div>
              <div className="col-span-4">
                <div className="font-medium">{incidence.title || 'Untitled'}</div>
                <div className="text-xs text-gray-500 truncate">{incidence.description?.slice(0, 50) || ''}</div>
              </div>
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
              <div className="col-span-2 text-center">
                <span className={getPriorityClass(incidence.priority)}>
                  {incidence.priority || 'medium'}
                </span>
              </div>
              <div className="col-span-3 text-center">
                <span className={getStatusClass(incidence.status)}>
                  {incidence.status || 'open'}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      {incidences.length > 0 && (
        <div className="px-6 py-4 bg-surface-dim border-t-2 border-black">
          <div className="flex items-center justify-between">
            {/* Info */}
            <div className="text-xs text-gray-600">
              Showing page {currentPage} of {totalPages}
            </div>

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