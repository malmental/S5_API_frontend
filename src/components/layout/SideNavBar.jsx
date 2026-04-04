/**
 * ============================================================
 * COMPONENTE: SideNavBar (Barra Lateral de Navegación)
 * ============================================================
 * Descripción: 
 *   Barra lateral fija que contiene el menú de operaciones principal.
 *   Incluye enlaces a Dashboard, Incidents, Reports, Logs y opciones
 *   de soporte. Cumple con el patrón "Navigation Rail" del sistema.
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
 *   2. Navegación principal: Dashboard, Incidents, Reports, Logs
 *   3. Links inferiores: Support, System Status
 * 
 * Notas técnicas:
 *   - El item "Incidents" está activo (bg-black) como ejemplo
 *   - Todos los enlaces apuntan a /dashboard temporalmente
 *   - La versión "V 2.0.48" es hardcodeada
 *   - Hover effect con transición de 75ms
 * ============================================================
 */

import { Link } from 'react-router-dom';

export default function SideNavBar() {
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
          <Link to="/dashboard" className="flex items-center px-4 py-3 border-b border-gray-300 text-gray-600 hover:bg-gray-300 transition-all duration-75">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span>Dashboard</span>
          </Link>
          
          {/* NOTA: Este item está "activo" como ejemplo de estado */}
          <Link to="/dashboard" className="bg-black text-white font-bold flex items-center px-4 py-3 border-b border-black">
            <span className="material-symbols-outlined mr-3">emergency_home</span>
            <span>Incidents</span>
          </Link>
          
          <Link to="/dashboard" className="flex items-center px-4 py-3 border-b border-gray-300 text-gray-600 hover:bg-gray-300 transition-all duration-75">
            <span className="material-symbols-outlined mr-3">assessment</span>
            <span>Reports</span>
          </Link>
          
          <Link to="/dashboard" className="flex items-center px-4 py-3 border-b border-gray-300 text-gray-600 hover:bg-gray-300 transition-all duration-75">
            <span className="material-symbols-outlined mr-3">terminal</span>
            <span>Logs</span>
          </Link>
        </nav>
      </div>

      {/* ============================================================
          SECCIÓN 2: FOOTER LINKS
          Links inferiores de soporte y estado del sistema
       ============================================================ */}
      <div className="mb-4">
        <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-300">
          <span className="material-symbols-outlined mr-3 text-sm">help</span>
          <span>Support</span>
        </Link>
        <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-300">
          <span className="material-symbols-outlined mr-3 text-sm">check_circle</span>
          <span>System Status</span>
        </Link>
      </div>
    </aside>
  );
}