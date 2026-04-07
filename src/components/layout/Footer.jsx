/**
 * ============================================================
 * COMPONENT: Footer (Footer)
 * ============================================================
 * Description: 
 *   Fixed footer at the bottom of the dashboard.
 *   Shows application version and UTC timestamp.
 * 
 * Location: src/components/layout/Footer.jsx
 * 
 * Characteristics:
 *   - Position: fixed bottom (remains on scroll)
 *   - Width: Calculated not to interfere with sidebar (left-64)
 *   - Top border: 2px black
 * 
 * Content:
 *   1. App version (hardcoded)
 *   2. Real-time UTC timestamp
 * 
 * Technical notes:
 *   - Width uses calc(100% - 16rem) to exclude sidebar
 *   - Timestamp updates on each render
 *   - Background color is surface for consistency
 * ============================================================
 */

export default function Footer() {
  return (
    /* ============================================================
        STRUCTURE: Fixed Footer
        Position: Fixed bottom | Left: left-64 (sidebar width)
        Width: calc(100% - 16rem) | Top border: 2px black
        z-index: 40 (below FAB)
       ============================================================ */
    <footer className="fixed bottom-0 right-0 left-64 flex justify-between items-center px-6 py-3 w-[calc(100%-16rem)] bg-surface border-t-2 border-black z-40">
      <div className="font-mono text-[10px]">
        INCIDENSly_v1.0.4_DASHBOARD
      </div>
      <div className="font-mono text-[10px]">
        {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
      </div>
    </footer>
  );
}