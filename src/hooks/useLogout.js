/**
 * ============================================================
 * HOOK: useLogout
 * ============================================================
 * Reusable logout hook to avoid duplication across pages.
 * 
 * Usage:
 *   const { handleLogout } = useLogout();
 * ============================================================
 */

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return { handleLogout };
}
