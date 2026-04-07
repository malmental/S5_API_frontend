/**
 * ============================================================
 * COMPONENT: QuickStats (Quick Statistics)
 * ============================================================
 * Description: 
 *   Component that displays a grid of 4 cards with key
 *   dashboard metrics. Uses "Bento Grid" pattern
 *   to show summarized information visually.
 * 
 * Location: src/components/dashboard/QuickStats.jsx
 * 
 * Props:
 *   - incidences: Array of incidences to calculate metrics
 * 
 * Metrics displayed:
 *   1. Total Active - Total active incidences (from prop)
 *   2. High Priority - High priority incidences (filtered from prop)
 *   3. Avg Resolution - Average resolution time (STATIC - needs API)
 *   4. Nodes Online - System nodes online (STATIC - needs API)
 * 
 * Technical notes:
 *   - Cards 3 and 4 use static values because the current API
 *     does not provide these data. They need dedicated endpoint or
 *     enrichment from the backend.
 *   - Colors differentiate the "High Priority" card from the rest
 *   - Grid uses grid-cols-4 for even distribution
 * ============================================================
 */

export default function QuickStats({ incidences }) {
  // Calculate metrics from received incidences
  const total = incidences.length;
  const highPriority = incidences.filter(i => i.priority === 'high' || i.priority === 'ALTA').length;
  
  // NOTE: These are example values - get from real API
  const avgResolution = '14m'; // Average resolution time
  const nodesOnline = 128;     // System nodes

  return (
    /* ============================================
       STRUCTURE: Bento Grid (Card grid)
       - 4 columns evenly distributed
       - Gap of 16px between cards
       - Margin bottom of 32px
       ============================================ */
    <div className="grid grid-cols-4 gap-4 mb-8">
      
      {/* CARD 1: Total Active */}
      {/* Background: surface-container | Border: black 2px */}
      <div className="border-2 border-black p-4 bg-surface-container">
        <p className="font-mono text-[10px] uppercase text-gray-500">Total Active</p>
        <p className="text-3xl font-bold font-sans">{total}</p>
      </div>

      {/* CARD 2: High Priority */}
      {/* Background: primary (black) | Text: on-primary (white) - Visual differentiator */}
      <div className="border-2 border-black p-4 bg-primary text-white">
        <p className="font-mono text-[10px] uppercase text-gray-300">High Priority</p>
        <p className="text-3xl font-bold font-sans">{highPriority}</p>
      </div>

      {/* CARD 3: Avg Resolution */}
      {/* Background: surface-container-low | Border: gray-300 - Secondary state */}
      <div className="border-2 border-gray-300 p-4 bg-surface-container-low">
        <p className="font-mono text-[10px] uppercase text-gray-500">Avg Resolution</p>
        <p className="text-3xl font-bold font-sans text-gray-400">{avgResolution}</p>
      </div>

      {/* CARD 4: Nodes Online */}
      {/* Background: surface-container-low | Border: gray-300 - Secondary state */}
      <div className="border-2 border-gray-300 p-4 bg-surface-container-low">
        <p className="font-mono text-[10px] uppercase text-gray-500">Nodes Online</p>
        <p className="text-3xl font-bold font-sans text-gray-400">{nodesOnline}</p>
      </div>
      
    </div>
  );
}