/**
 * ============================================================
 * COMPONENTE: CreateIncidentFAB (Botón Flotante de Crear Incidencia)
 * ============================================================
 * Descripción: 
 *   Botón flotante (Floating Action Button) para crear nuevas incidencias.
 *   Sigue el patrón Material Design de FAB con adaptaciones al estilo
 *   "Tactile Data-Sheet" (sin sombras, bordes técnicos).
 * 
 * Ubicación: src/components/dashboard/CreateIncidentFAB.jsx
 * 
 * Props:
 *   - onClick: Función callback ejecutada al hacer click
 * 
 * Características:
 *   - Position: fixed bottom-right
 *   - Estilo: Círculo con borde de "recorte" visual
 *   - Icono: + (add) de Material Symbols
 *   - Efectos: hover (scale), active (press)
 * 
 * Notas técnicas:
 *   - El "borde blanco" es un trick visual para simular doble borde
 *   - La shadow usa box-shadow en lugar de drop-shadow
 *   - El tamaño es w-14 h-14 (56px) siguiendo estándar
 *   - El onClick actualmente solo hace console.log en Dashboard
 * ============================================================
 */

export default function CreateIncidentFAB({ onClick }) {
  return (
    /* ============================================================
        ESTRUCTURA: Floating Action Button
        Posición: Fixed bottom-right (bottom-8, right-8 = 2rem)
        Efecto: Scale en hover (1.05), press en active (0.95)
        Icono: Material Symbols "add"
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