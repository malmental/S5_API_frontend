/**
 * ============================================================
 * COMPONENTE: QuickStats (Estadísticas Rápidas)
 * ============================================================
 * Descripción: 
 *   Componente que muestra un grid de 4 tarjetas con métricas 
 *   clave del dashboard. Utiliza el patrón de "Bento Grid" 
 *   para mostrar información resumida de forma visual.
 * 
 * Ubicación: src/components/dashboard/QuickStats.jsx
 * 
 * Props:
 *   - incidences: Array de incidencias para calcular métricas
 * 
 * Métricas mostradas:
 *   1. Total Active - Total de incidencias activas (del prop)
 *   2. High Priority - Incidencias de alta prioridad (filtrado del prop)
 *   3. Avg Resolution - Tiempo promedio de resolución (ESTÁTICO - necesita API)
 *   4. Nodes Online - Nodos del sistema online (ESTÁTICO - necesita API)
 * 
 * Notas técnicas:
 *   - Las tarjetas 3 y 4 usan valores estáticos porque la API actual
 *     no proporciona这些datos. Necesitan endpoint dedicado o enriquecerse
 *     desde el backend.
 *   - Los colores diferencian la tarjeta de "High Priority" del resto
 *   - El grid usa grid-cols-4 para distribución equitativa
 * ============================================================
 */

export default function QuickStats({ incidences }) {
  // Cálculo de métricas desde las incidencias recibidas
  const total = incidences.length;
  const highPriority = incidences.filter(i => i.priority === 'high' || i.priority === 'ALTA').length;
  
  // NOTA: Estos valores son de ejemplo - obtener de API real
  const avgResolution = '14m'; // Tiempo promedio de resolución
  const nodesOnline = 128;     // Nodos del sistema

  return (
    /* ============================================
       ESTRUCTURA: Bento Grid (Grid de tarjetas)
       - 4 columnas evenly distributed
       - Gap de 16px entre tarjetas
       - Margin bottom de 32px
       ============================================ */
    <div className="grid grid-cols-4 gap-4 mb-8">
      
      {/* TARJETA 1: Total Active */}
      {/* Fondo: surface-container | Borde: black 2px */}
      <div className="border-2 border-black p-4 bg-surface-container">
        <p className="font-mono text-[10px] uppercase text-gray-500">Total Active</p>
        <p className="text-3xl font-bold font-sans">{total}</p>
      </div>

      {/* TARJETA 2: High Priority */}
      {/* Fondo: primary (black) | Texto: on-primary (white) - Diferenciador visual */}
      <div className="border-2 border-black p-4 bg-primary text-white">
        <p className="font-mono text-[10px] uppercase text-gray-300">High Priority</p>
        <p className="text-3xl font-bold font-sans">{highPriority}</p>
      </div>

      {/* TARJETA 3: Avg Resolution */}
      {/* Fondo: surface-container-low | Borde: gray-300 - Estado secundario */}
      <div className="border-2 border-gray-300 p-4 bg-surface-container-low">
        <p className="font-mono text-[10px] uppercase text-gray-500">Avg Resolution</p>
        <p className="text-3xl font-bold font-sans text-gray-400">{avgResolution}</p>
      </div>

      {/* TARJETA 4: Nodes Online */}
      {/* Fondo: surface-container-low | Borde: gray-300 - Estado secundario */}
      <div className="border-2 border-gray-300 p-4 bg-surface-container-low">
        <p className="font-mono text-[10px] uppercase text-gray-500">Nodes Online</p>
        <p className="text-3xl font-bold font-sans text-gray-400">{nodesOnline}</p>
      </div>
      
    </div>
  );
}