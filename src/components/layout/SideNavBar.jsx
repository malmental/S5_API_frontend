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
 *   1. Header: "INCIDENsly 𝒘ebApp" with version
 *   2. Main navigation: Dashboard, My Incidences, Admin Area
 *   3. Bottom: User dropdown with logout option
 * 
 * States:
 *   - activeClass: Black background for active item
 *   - inactiveClass: Gray for inactive items with hover
 *   - showUserMenu: Boolean for dropdown visibility
 * 
 * Technical notes:
 *   - Active item is detected using useLocation
 *   - Admin Area button goes to /admin
 *   - Logout uses AuthContext function
 *   - Click outside closes the dropdown menu
 * ============================================================
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SideNavBar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef(null);
  
  const isActive = (path) => location.pathname === path;
  
  const handleLogout = async () => {
    setShowUserMenu(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/login');
  };
  
  const activeClass = 'bg-primary text-white font-bold';
  const inactiveClass = 'text-gray-600 hover:bg-gray-300';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    /* ============================================================
        STRUCTURE: Fixed Sidebar
        Position: Fixed left | Top: top-0
        Width: w-64 (256px) | Height: h-screen
        Right border: 2px black | Background: surface-container
        Font: IBM Plex Mono for technical aesthetic
       ============================================================ */
    <aside className="fixed left-0 top-0 h-screen w-64 border-r-2 border-black bg-surface-container flex flex-col justify-between font-mono text-xs z-40">
      
      {/* ============================================================
          SECTION 1: MAIN NAVIGATION
          Header: INCIDENsly 𝒘ebApp + system version
          Links: Dashboard, Incidents, Reports, Logs
       ============================================================ */}
      <div>
        {/* Header with branding */}
        <div className="p-6 border-b-2 border-black">
          <h2 className="font-sans font-black text-lg tracking-tighter">INCIDENsly 𝒘ebApp</h2>
          <p className="text-[10px] text-gray-500 mt-1">V 2.0.48</p>
        </div>
        
        {/* Navigation menu */}
        <nav className="mt-4">
          <Link to="/dashboard" className={`flex items-center px-4 py-3 border-b border-gray-300 transition-all duration-75 ${isActive('/dashboard') ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span>Dashboard</span>
          </Link>
          
          <Link to="/my-incidences" className={`flex items-center px-4 py-3 border-b border-gray-300 transition-all duration-75 ${isActive('/my-incidences') ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined mr-3">emergency_home</span>
            <span>My Incidences</span>
          </Link>
          
          <Link to="/admin" className={`flex items-center px-4 py-3 border-b border-gray-300 transition-all duration-75 ${isActive('/admin') ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined mr-3">admin_panel_settings</span>
            <span>Admin Area</span>
          </Link>
        </nav>
      </div>

      {/* ============================================================
          SECTION 2: USER MENU
          Clickable user info with dropdown logout option
       ============================================================ */}
      <div className="mb-4" ref={menuRef}>
        {/* Clickable user name display */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center w-full px-4 py-3 border-b border-gray-300 hover:bg-gray-300 transition-colors"
        >
          <div className="flex items-center gap-2 flex-1 text-left">
            <span className="w-2 h-2 bg-green-600 flex-shrink-0"></span>
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Logged in as</p>
              <p className="font-bold text-black truncate">{user?.name || 'USER'}</p>
            </div>
          </div>
          <span className={`material-symbols-outlined text-sm transition-transform ${showUserMenu ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
        
        {/* Dropdown menu */}
        {showUserMenu && (
          <div className="border-b border-gray-300 bg-white shadow-lg">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <span className="material-symbols-outlined mr-3 text-sm">logout</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================
          MODAL: LOGOUT CONFIRMATION
          Confirmation dialog before logging out
       ============================================================ */}
      {showLogoutModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div 
            className="w-full max-w-md bg-white shadow-none relative "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b-2 border-black bg-surface-container">
              <h2 className="font-sans font-bold text-lg uppercase">LOGOUT</h2>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="material-symbols-outlined text-gray-500 hover:text-black transition-colors"
              >
                close
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 24 24" className="mx-auto mb-4 text-red-600">
                  <title xmlns="">account-alert-loop</title>
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <g strokeDasharray="22">
                      <path d="M5 21v-1c0 -2.21 1.79 -4 4 -4h4c2.21 0 4 1.79 4 4v1">
                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="22;0"/>
                      </path>
                      <path strokeDashoffset="22" d="M11 13c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3Z">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" to="0"/>
                      </path>
                    </g>
                    <path strokeDasharray="6" strokeDashoffset="6" d="M20 3v4">
                      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0"/>
                      <animate attributeName="stroke-width" begin="0.9s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2"/>
                    </path>
                    <path strokeDasharray="4" strokeDashoffset="4" d="M20 11v0.01">
                      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" to="0"/>
                      <animate attributeName="stroke-width" begin="1.2s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2"/>
                    </path>
                  </g>
                </svg>
              </div>
              <p className="font-mono text-sm text-gray-700 mb-6">
                Are you sure you want to logout?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-6 py-2 border-2 border-black font-mono text-xs uppercase hover:bg-gray-100 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-6 py-3 bg-primary text-white font-mono text-xs uppercase hover:bg-neutral-800 transition-colors"
                >
                  CONFIRM LOGOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}