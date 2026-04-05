/**
 * ============================================================
 * COMPONENTE: SideNavBar (Barra Lateral de Navegación)
 * ============================================================
 * Descripción: 
 *   Barra lateral fija que contiene el menú de operaciones principal.
 *   Incluye enlaces a Dashboard, My Incidences, Admin Area y logout.
 *   Cumple con el patrón "Navigation Rail" del sistema.
 * 
 * Ubicación: src/components/layout/SideNavBar.jsx
 * 
 * Características:
 *   - Position: fixed (permanece al hacer scroll)
 *   - Ancho: w-64 (256px)
 *   - Altura: Calculada para llenar el espacio restante (100vh - topbar)
 *   - Fondo: surface-container (para diferenciación tonal)
 *   - Dividida en dos secciones: navegación principal + footer links
 * 
 * Elementos del menú:
 *   1. Header: "OPERATIONS" con versión
 *   2. Navegación principal: Dashboard, My Incidences, Admin Area
 *   3. Links inferiores: Logout
 * 
 * Estados:
 *   - activeClass: Fondo negro para el item activo
 *   - inactiveClass: Gris para items inactivos con hover
 * 
 * Notas técnicas:
 *   - El item activo se detecta mediante useLocation
 *   - El botón Admin Area lleva a /admin
 *   - Logout usa la función del AuthContext
 * ============================================================
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SideNavBar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const isActive = (path) => location.pathname === path;
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const activeClass = 'bg-black text-white font-bold';
  const inactiveClass = 'text-gray-600 hover:bg-gray-300';

  return (
    /* ============================================================
        ESTRUCTURA: Fixed Sidebar
        Posición: Fixed left | Arriba: top-14 (debajo de TopNavBar)
        Ancho: w-64 (256px) | Alto: calc(100vh - 56px)
        Borde derecho: 2px black | Fondo: surface-container
        Font: IBM Plex Mono para estética técnica
       ============================================================ */
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 border-r-2 border-black bg-surface-container flex flex-col justify-between font-mono text-xs">
      
      {/* ============================================================
          SECCIÓN 1: NAVEGACIÓN PRINCIPAL
          Header: OPERATIONS + versión del sistema
          Links: Dashboard, Incidents, Reports, Logs
       ============================================================ */}
      <div>
        {/* Header con branding */}
        <div className="p-6 border-b-2 border-black">
          <h2 className="font-sans font-black text-lg tracking-tighter">OPERATIONS</h2>
          {/* NOTA: Versión hardcodeada - podría venir de config/constante */}
          <p className="text-[10px] text-gray-500 mt-1">V 2.0.48</p>
        </div>
        
        {/* Menú de navegación */}
        <nav className="mt-4">
          <Link to="/dashboard" className={`flex items-center px-4 py-3 border-b border-gray-300 transition-all duration-75 ${isActive('/dashboard') ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span>Dashboard</span>
          </Link>
          
          <Link to="/my-incidences" className={`flex items-center px-4 py-3 border-b border-black transition-all duration-75 ${isActive('/my-incidences') ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined mr-3">emergency_home</span>
            <span>My Incidences</span>
          </Link>
          
          <Link to="/admin" className={`flex items-center px-4 py-3 border-b border-black transition-all duration-75 ${isActive('/admin') ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined mr-3">admin_panel_settings</span>
            <span>Admin Area</span>
          </Link>
        </nav>
      </div>

      {/* ============================================================
          SECCIÓN 2: FOOTER LINKS
          Botón de logout
       ============================================================ */}
      <div className="mb-4">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-300 transition-colors"
        >
          <span className="material-symbols-outlined mr-3 text-sm">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}