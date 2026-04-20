import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from '../ui/LogoutModal';

export default function SideNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef(null);
  
  const isActive = (path) => location.pathname === path;
  
  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/login', { replace: true });
    setTimeout(() => logout(), 0);
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
    <aside className="fixed left-0 top-0 h-screen w-64 border-r-2 border-black bg-surface-container flex flex-col justify-between font-mono text-xs z-40">
      <div>
        <div className="p-6 border-b-2 border-black">
          <h2 className="font-sans font-black text-lg tracking-tighter">INCIDENsly 𝒘ebApp</h2>
          <p className="text-[10px] text-gray-500 mt-1">V 2.0.48</p>
        </div>
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
      <div className="mb-4" ref={menuRef}>
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
        {showUserMenu && (
          <div className="border-b border-gray-300 bg-white shadow-lg">
            <button 
              onClick={handleLogoutClick}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <span className="material-symbols-outlined mr-3 text-sm">logout</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </aside>
  );
}
