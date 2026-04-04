/**
 * ============================================================
 * COMPONENTE: Footer (Pie de Página)
 * ============================================================
 * Descripción: 
 *   Pie de página fijo en la parte inferior del dashboard.
 *   Muestra la versión de la aplicación y timestamp UTC.
 * 
 * Ubicación: src/components/layout/Footer.jsx
 * 
 * Características:
 *   - Position: fixed bottom (permanece al hacer scroll)
 *   - Ancho: Calculado para no interferir con sidebar (left-64)
 *   - Borde superior: 2px black
 * 
 * Contenido:
 *   1. Versión de la app (hardcodeada)
 *   2. Timestamp UTC en tiempo real
 * 
 * Notas técnicas:
 *   - El ancho usa calc(100% - 16rem) para excluir el sidebar
 *   - El timestamp se actualiza en cada render
 *   - El color de fondo es surface para consistencia
 * ============================================================
 */

export default function Footer() {
  return (
    /* ============================================================
        ESTRUCTURA: Fixed Footer
        Posición: Fixed bottom | Izquierda: left-64 (sidebar width)
        Ancho: calc(100% - 16rem) | Borde superior: 2px black
        z-index: 40 (debajo de FAB)
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