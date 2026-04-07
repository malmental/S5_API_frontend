/**
 * ============================================================
 * COMPONENT: SideNavBar (Side Navigation Bar)
 * ============================================================
 * Description: 
 *   Fixed sidebar containing the main operations menu.
 *   Includes links to Dashboard, My Incidences, Admin Area and logout.
 *   Follows the "Navigation Rail" pattern of the system.
 * 
 * Location: src/components/layout/SideNavBar.jsx
 * 
 * Characteristics:
 *   - Position: fixed (remains on scroll)
 *   - Width: w-64 (256px)
 *   - Height: Calculated to fill remaining space (100vh - topbar)
 *   - Background: surface-container (for tonal differentiation)
 *   - Divided into two sections: main navigation + footer links
 * 
 * Menu elements:
 *   1. Header: "OPERATIONS" with version
 *   2. Main navigation: Dashboard, My Incidences, Admin Area
 *   3. Bottom links: Logout
 * 
 * States:
 *   - activeClass: Black background for active item
 *   - inactiveClass: Gray for inactive items with hover
 * 
 * Technical notes:
 *   - Active item is detected using useLocation
 *   - Admin Area button goes to /admin
 *   - Logout uses AuthContext function
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
        STRUCTURE: Fixed Sidebar
        Position: Fixed left | Top: top-14 (below TopNavBar)
        Width: w-64 (256px) | Height: calc(100vh - 56px)
        Right border: 2px black | Background: surface-container
        Font: IBM Plex Mono for technical aesthetic
       ============================================================ */
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 border-r-2 border-black bg-surface-container flex flex-col justify-between font-mono text-xs">
      
      {/* ============================================================
          SECTION 1: MAIN NAVIGATION
          Header: OPERATIONS + system version
          Links: Dashboard, Incidents, Reports, Logs
       ============================================================ */}
      <div>
        {/* Header with branding */}
        <div className="p-6 border-b-2 border-black">
          <h2 className="font-sans font-black text-lg tracking-tighter">OPERATIONS</h2>
          {/* NOTE: Hardcoded version - could come from config/constant */}
          <p className="text-[10px] text-gray-500 mt-1">V 2.0.48</p>
        </div>
        
        {/* Navigation menu */}
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
          SECTION 2: FOOTER LINKS
          Logout button
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