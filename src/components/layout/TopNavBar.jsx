/**
 * ============================================================
 * COMPONENTE: TopNavBar (Barra de Navegación Superior)
 * ============================================================
 * Descripción: 
 *   Barra de navegación fija en la parte superior de la aplicación.
 *   Incluye logo, menú de navegación, estado del sistema y perfil de usuario.
 *   Cumple con el patrón "App Bar" del sistema de diseño.
 * 
 * Ubicación: src/components/layout/TopNavBar.jsx
 * 
 * Props:
 *   - user: Objeto con datos del usuario (name, email, etc.)
 *   - onLogout: Función callback para cerrar sesión
 * 
 * Elementos de la barra:
 *   1. Logo: "SYSTEM MONITOR" (texto branding)
 *   2. Menú de navegación: Dashboard, My Incidents, Logout
 *   3. Indicador de estado: Sistema ONLINE (con punto verde)
 *   4. Perfil de usuario: Nombre + icono
 *   5. Iconos adicionales: Notifications, Settings
 * 
 * Notas técnicas:
 *   - Position: fixed (permanece al hacer scroll)
 *   - z-index: 50 (sobre otros elementos)
 *   - Los enlaces "MY INCIDENTS" y "LOGOUT" usan el mismo destino temporalmente
 *   - Los iconos de notifications/settings son visuales (sin función)
 *   - El punto verde es hardcodeado como "ONLINE" - podría dinamizarse
 * ============================================================
 */

import { Link } from 'react-router-dom';

export default function TopNavBar({ user, onLogout }) {
  return (
    /* ============================================================
        ESTRUCTURA: Fixed Navigation Bar
        Posición: Fixed top | Altura: h-14 (56px)
        Borde: 2px black inferior | Fondo: surface
        z-index: 50 para estar sobre otros elementos
       ============================================================ */
    <nav className="fixed top-0 w-full z-50 border-b-2 border-black bg-surface flex justify-between items-center h-14 px-6">
      
      {/* ============================================================
          SECCIÓN 1: LOGO + NAVIGATION MENU (Izquierda)
          Logo: SYSTEM MONITOR (branding)
          Menú: Links de navegación
       ============================================================ */}
      <div className="flex items-center gap-8">
        <span className="font-mono font-bold text-xl border-2 border-black px-2 py-1">INCIDENsly 𝒘ebApp</span>
      </div>

      {/* ============================================================
          SECCIÓN 2: USER PROFILE (Derecha)
          User: Nombre del usuario + icono
       ============================================================ */}
      <div className="flex items-center gap-4">
        
        {/* Perfil de usuario */}
        <div className="flex items-center gap-2 px-3 py-1 border-2 border-black bg-surface-container">
          <span className="w-2 h-2 bg-green-600"></span>
          <span className="font-mono text-xs font-bold text-black">USER: {user?.name?.toUpperCase() || 'GUEST'}</span>
          <span className="material-symbols-outlined text-black">account_circle</span>
        </div>
      </div>
    </nav>
  );
}