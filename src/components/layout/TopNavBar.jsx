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
        <span className="text-xl font-bold text-black uppercase tracking-tighter">SYSTEM MONITOR</span>
        <div className="hidden md:flex gap-6 font-sans uppercase tracking-wider text-sm">
          <Link to="/dashboard" className="text-black font-bold underline decoration-2 underline-offset-4">DASHBOARD</Link>
          <Link to="/dashboard" className="text-gray-500 hover:bg-gray-200 transition-colors px-2">MY INCIDENTS</Link>
          <button onClick={onLogout} className="text-gray-500 hover:bg-gray-200 transition-colors px-2">LOGOUT</button>
        </div>
      </div>

      {/* ============================================================
          SECCIÓN 2: SYSTEM STATUS + USER PROFILE (Derecha)
          Status: Indicador visual de sistema online
          User: Nombre del usuario + icono
          Icons: Notifications, Settings (visuales)
       ============================================================ */}
      <div className="flex items-center gap-4">
        
        {/* Indicador de estado del sistema */}
        {/* NOTA: El estado ONLINE está hardcodeado - podría dynamizarse */}
        <div className="flex items-center gap-2 px-3 py-1 border-2 border-primary bg-surface-container">
          <span className="w-2 h-2 bg-green-600"></span>
          <span className="font-mono text-xs font-bold">SYSTEM STATUS: ONLINE</span>
        </div>
        
        {/* Perfil de usuario */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-black">USER: {user?.name?.toUpperCase() || 'GUEST'}</span>
          <span className="material-symbols-outlined text-black">account_circle</span>
        </div>
        
        {/* Iconos de acción - NOTA: Solo visuales, sin funcionalidad */}
        <span className="material-symbols-outlined text-gray-500 cursor-pointer">notifications</span>
        <span className="material-symbols-outlined text-gray-500 cursor-pointer">settings</span>
      </div>
    </nav>
  );
}