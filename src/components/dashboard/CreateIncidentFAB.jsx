/**
 * ============================================================
 * COMPONENT: CreateIncidentFAB (Floating Create Incident Button)
 * ============================================================
 * Description: 
 *   Floating Action Button (FAB) to create new incidences.
 *   Follows Material Design FAB pattern with adaptations to the
 *   "Tactile Data-Sheet" style (no shadows, technical borders).
 * 
 * Location: src/components/dashboard/CreateIncidentFAB.jsx
 * 
 * Props:
 *   - onClick: Callback function executed on click
 * 
 * Characteristics:
 *   - Position: fixed bottom-right
 *   - Style: Circle with "cutout" visual border
 *   - Icon: + (add) from Material Symbols
 *   - Effects: hover (scale), active (press)
 * 
 * Technical notes:
 *   - The "white border" is a visual trick to simulate double border
 *   - Shadow uses box-shadow instead of drop-shadow
 *   - Size is w-14 h-14 (56px) following standard
 *   - onClick currently only does console.log in Dashboard
 * ============================================================
 */

export default function CreateIncidentFAB({ onClick }) {
  return (
    /* ============================================================
        STRUCTURE: Floating Action Button
        Position: Fixed bottom-right (bottom-8, right-8 = 2rem)
        Effect: Scale on hover (1.05), press on active (0.95)
        Icon: Material Symbols "add"
       ============================================================ */
    <div className="fixed bottom-8 right-8">
      <button 
        onClick={onClick}
        className="bg-primary text-on-primary w-14 h-14 flex items-center justify-center border-4 border-white hover:scale-105 active:scale-95 transition-transform"
        style={{ boxShadow: '0 0 0 2px black' }}
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}