/**
 * ============================================================
 * COMPONENT: TopNavBar (Top Navigation Bar)
 * ============================================================
 * Description: 
 *   Fixed navigation bar at the top of the application.
 *   Includes logo, navigation menu, system status and user profile.
 *   Follows the "App Bar" pattern of the design system.
 * 
 * Location: src/components/layout/TopNavBar.jsx
 * 
 * Props:
 *   - user: Object with user data (name, email, etc.)
 *   - onLogout: Callback function to logout
 * 
 * Bar elements:
 *   1. Logo: "SYSTEM MONITOR" (branding text)
 *   2. Navigation menu: Dashboard, My Incidents, Logout
 *   3. Status indicator: System ONLINE (with green dot)
 *   4. User profile: Name + icon
 *   5. Additional icons: Notifications, Settings
 * 
 * Technical notes:
 *   - Position: fixed (remains on scroll)
 *   - z-index: 50 (above other elements)
 *   - "MY INCIDENTS" and "LOGOUT" links use same destination temporarily
 *   - Notifications/settings icons are visual (no function)
 *   - Green dot is hardcoded as "ONLINE" - could be dynamic
 * ============================================================
 */

import { Link } from 'react-router-dom';

export default function TopNavBar({ user, onLogout }) {
  return (
    /* ============================================================
        STRUCTURE: Fixed Navigation Bar
        Position: Fixed top | Height: h-14 (56px)
        Border: 2px black bottom | Background: surface
        z-index: 50 to be above other elements
       ============================================================ */
    <nav className="fixed top-0 w-full z-50 border-b-2 border-black bg-surface flex justify-between items-center h-14 px-6">
      
      {/* ============================================================
          SECTION 1: LOGO + NAVIGATION MENU (Left)
          Logo: SYSTEM MONITOR (branding)
          Menu: Navigation links
       ============================================================ */}
      <div className="flex items-center gap-8">
        <span className="font-mono font-bold text-xl border-2 border-black px-2 py-1">INCIDENsly 𝒘ebApp</span>
      </div>

      {/* ============================================================
          SECTION 2: USER PROFILE (Right)
          User: User name + icon
       ============================================================ */}
      <div className="flex items-center gap-4">
        
        {/* User profile */}
        <div className="flex items-center gap-2 px-3 py-1 border-2 border-black bg-surface-container">
          <span className="w-2 h-2 bg-green-600"></span>
          <span className="font-mono text-xs font-bold text-black">USER: {user?.name?.toUpperCase() || 'GUEST'}</span>
          <span className="material-symbols-outlined text-black">account_circle</span>
        </div>
      </div>
    </nav>
  );
}