/**
 * ============================================================
 * COMPONENTE: IncidentsTable (Tabla de Incidencias)
 * ============================================================
 * Descripción: 
 *   Componente de tabla interactiva con búsqueda en tiempo real,
 *   filtrado por texto, estados visuales y paginación.
 *   Cumple con el patrón "Data Sheet" del sistema de diseño.
 * 
 * Ubicación: src/components/dashboard/IncidentsTable.jsx
 * 
 * Props:
 *   - incidences: Array de incidencias (desde API)
 *   - loading: Booleano que indica estado de carga
 * 
 * Características:
 *   1. Search Bar con filtrado en tiempo real (client-side)
 *   2. Tabla con columnas: ID, Título, Prioridad, Estado
 *   3. Estados visuales para prioridad (ALTA/MEDIA/BAJA)
 *   4. Estados visuales para estado (ABIERT/EN_PROCESO/CERRADA)
 *   5. Paginación (botones - no funcional aún)
 * 
 * Notas técnicas:
 *   - El filtrado es client-side (filtra el array localmente)
 *   - Para filtrado server-side, modificar props y API call
 *   - La paginación es visual únicamente (botones sin función)
 *   - Los estados de prioridad/estado soportan múltiples formatos
 *     (inglés, español, mayúsculas, minúsculas)
 * ============================================================
 */

import { useState } from 'react';

export default function IncidentsTable({ incidences, loading }) {
  // ============================================================
  // ESTADO: searchTerm (Término de búsqueda)
  // Función: Almacena el texto introducido en el buscador
  // ============================================================
  const [searchTerm, setSearchTerm] = useState('');

  // ============================================================
  // FILTER LOGIC: Filtrado client-side
  // Descripción: Filtra las incidencias por ID, título o descripción
  // NOTA: Este filtrado es temporal - para grandes volúmenes,
  //       debería moverse al backend mediante query params
  // ============================================================
  const filteredIncidences = incidences.filter(inc => {
    const search = searchTerm.toLowerCase();
    return (
      inc.title?.toLowerCase().includes(search) ||
      inc.id?.toString().includes(search) ||
      inc.description?.toLowerCase().includes(search)
    );
  });

  // ============================================================
  // HELPER: getPriorityClass (Clase CSS según prioridad)
  // Descripción: Retorna clase CSS según el nivel de prioridad
  // Estados soportados: high/ALTA/alta, medium/MEDIA/media, low/BAJA/baja
  // ============================================================
  const getPriorityClass = (priority) => {
    if (priority === 'high' || priority === 'ALTA' || priority === 'alta') {
      return 'bg-primary text-on-primary font-mono text-[10px] px-3 py-1 font-bold';
    }
    if (priority === 'medium' || priority === 'MEDIA' || priority === 'media') {
      return 'border border-gray-400 text-gray-500 font-mono text-[10px] px-3 py-1';
    }
    return 'border border-gray-300 text-gray-400 font-mono text-[10px] px-3 py-1';
  };

  // ============================================================
  // HELPER: getStatusClass (Clase CSS según estado)
  // Descripción: Retorna clase CSS según el estado de la incidencia
  // Estados soportados: open/ABIERTA, in_progress/EN_PROCESO, closed/CERRADA
  // ============================================================
  const getStatusClass = (status) => {
    if (status === 'open' || status === 'ABIERTA') {
      return 'border-2 border-black px-3 py-1 font-mono text-[10px] font-bold bg-primary text-white';
    }
    if (status === 'in_progress' || status === 'EN_PROCESO') {
      return 'border-2 border-black px-3 py-1 font-mono text-[10px] font-bold bg-surface-container-high';
    }
    return 'border-2 border-gray-300 px-3 py-1 font-mono text-[10px] font-bold text-gray-400';
  };

  return (
    <div>
      {/* ============================================================
          SECCIÓN 1: SEARCH BAR (Barra de búsqueda)
          Descripción: Input de texto con icono de búsqueda
          Funcionalidad: Filtra la tabla en tiempo real
          Estilo: Borde 2px black, fondo surface-container-lowest
          NOTA: El botón SEARCH es visual - la búsqueda es automática
          ============================================================ */}
      <div className="flex items-stretch border-2 border-black mb-8">
        <div className="flex-grow flex items-center px-4 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-gray-400 mr-3">search</span>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 bg-transparent border-none focus:ring-0 font-mono text-sm uppercase placeholder:text-gray-300" 
            placeholder="FILTER BY ID, TITLE, OR ASSIGNEE..."
          />
        </div>
        <button className="bg-primary text-on-primary px-8 font-sans font-bold uppercase text-sm hover:bg-neutral-800 transition-colors">
          SEARCH
        </button>
      </div>

      {/* ============================================================
          SECCIÓN 2: DATA TABLE (Tabla de datos)
          Descripción: Grid con encabezado y filas de incidencias
          Estructura: Grid de 12 columnas
          Columnas: ID (2) | Título (5) | Prioridad (2) | Estado (3)
          ============================================================ */}
      <section className="border-2 border-black overflow-hidden">
        
        {/* ENCABEZADO DE TABLA */}
        {/* Fondo: primary (black) | Texto: on-primary (white) */}
        <div className="bg-primary text-on-primary grid grid-cols-12 font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2">
          <div className="col-span-2">ID_REF</div>
          <div className="col-span-5">INCIDENT_TITLE</div>
          <div className="col-span-2">PRIORITY</div>
          <div className="col-span-3">STATUS_STATE</div>
        </div>

        {/* FILAS DE DATOS */}
        {loading ? (
          // ESTADO 1: Cargando
          <div className="grid grid-cols-12 items-center px-4 py-8 border-b-2 border-gray-200 bg-surface-container-lowest">
            <div className="col-span-12 text-center">
              <p className="font-mono text-sm">CARGANDO DATOS...</p>
            </div>
          </div>
        ) : filteredIncidences.length === 0 ? (
          // ESTADO 2: Sin resultados
          <div className="grid grid-cols-12 items-center px-4 py-8 border-b-2 border-gray-200 bg-surface-container-lowest">
            <div className="col-span-12 text-center">
              <p className="font-mono text-sm text-gray-500">NO HAY INCIDENCIAS REGISTRADAS</p>
            </div>
          </div>
        ) : (
          // ESTADO 3: Datos visibles
          filteredIncidences.map((incidence, index) => (
            <div 
              key={incidence.id || index} 
              className={`grid grid-cols-12 items-center px-4 py-4 ${index !== filteredIncidences.length - 1 ? 'border-b-2 border-gray-200' : ''} bg-surface-container-lowest hover:bg-gray-50 transition-colors`}
            >
              {/* Columna 1: ID */}
              <div className="col-span-2 font-mono text-sm font-bold">
                #{incidence.id || `INC-${1000 + index}`}
              </div>
              
              {/* Columna 2: Título */}
              <div className="col-span-5 font-sans font-semibold text-sm">
                {incidence.title || 'Sin título'}
              </div>
              
              {/* Columna 3: Prioridad */}
              <div className="col-span-2">
                <span className={getPriorityClass(incidence.priority)}>
                  {(incidence.priority || 'MEDIUM').toUpperCase()}
                </span>
              </div>
              
              {/* Columna 4: Estado */}
              <div className="col-span-3">
                <div className={getStatusClass(incidence.status)}>
                  {(incidence.status || 'OPEN').toUpperCase()}
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* ============================================================
          SECCIÓN 3: PAGINATION (Paginación)
          Descripción: Botones de navegación y contador de resultados
          Funcionalidad: Solo visual - necesita implementación
          NOTA: Eliminar esta sección si no se necesita paginación
          ============================================================ */}
      <div className="mt-6 flex justify-between items-center font-mono text-[10px] uppercase">
        <div className="flex gap-4">
          <button className="border-2 border-black px-4 py-1 font-bold hover:bg-gray-200">PREV_PAGE</button>
          <button className="border-2 border-black px-4 py-1 font-bold hover:bg-gray-200">NEXT_PAGE</button>
        </div>
        <div className="text-gray-500">
          DISPLAYING {filteredIncidences.length} OF {incidences.length} ENTRIES
        </div>
      </div>
    </div>
  );
}