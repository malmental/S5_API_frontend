/**
 * ============================================================
 * APP.JSX - Main Route Configuration
 * ============================================================
 * Description: 
 *   Root component of the application that configures routing,
 *   authentication context and protected/public routes.
 * 
 * Location: src/App.jsx
 * 
 * ARCHITECTURE:
 *   1. AuthProvider - Authentication context provider
 *   2. BrowserRouter - React Router router
 *   3. AppRoutes - All route definitions
 *   4. ProtectedRoute - Higher-order component for private routes
 *   5. PublicRoute - Higher-order component for public routes
 * 
 * DEFINED ROUTES:
 *   - "/" (GET)     → Landing (public, redirects if logged in)
 *   - "/login"      → Login (public, redirects if logged in)
 *   - "/register"   → Register (public, redirects if logged in)
 *   - "/dashboard"  → Dashboard (protected, requires auth)
 *   - "*"           → Catch-all redirects to "/"
 * 
 * AUTHENTICATION FLOW:
 *   1. AuthProvider loads token from localStorage on init
 *   2. Verifies token with backend /me endpoint
 *   3. If token valid → user has data
 *   4. If token invalid → user is null
 *   5. ProtectedRoute redirects to "/" if user is null
 *   6. PublicRoute redirects to "/dashboard" if user exists
 * 
 * Technical notes:
 *   - The "loading" state shows loading screen while
 *     token is verified with backend
 *   - AuthContext component must wrap entire app
 *   - Routes are evaluated in order - first match wins
 *   - The "*" route captures all undefined URLs
 * ============================================================
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IncidencesProvider } from './context/IncidencesContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import MyIncidences from './pages/MyIncidences';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

/**
 * ============================================================
 * COMPONENT: ProtectedRoute (Protected Route)
 * ============================================================
 * Description: 
 *   Higher-order component that protects private routes.
 *   Only allows access if user is authenticated.
 * 
 * Logic:
 *   1. If loading (loading=true) → shows spinner
 *   2. If user exists (user exists) → shows children
 *   3. If no user → redirects to "/"
 * 
 * Typical usage: Dashboard, authenticated user pages
 * ============================================================
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant font-label">Loading...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/" />;
}

/**
 * ============================================================
 * COMPONENT: PublicRoute (Public Route)
 * ============================================================
 * Description: 
 *   Higher-order component for public routes.
 *   Redirects to /dashboard if user is already logged in.
 * 
 * Logic:
 *   1. If loading (loading=true) → shows spinner
 *   2. If user exists (user exists) → redirects to /dashboard
 *   3. If no user → shows children (public page)
 * 
 * Typical usage: Landing, Login, Register
 * ============================================================
 */
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant font-label">Loading...</p>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : children;
}

/**
 * ============================================================
 * COMPONENT: AppRoutes
 * ============================================================
 * Description: 
 *   Defines all routes of the application.
 *   Uses ProtectedRoute and PublicRoute as wrappers.
 * ============================================================
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Protected routes - require authentication */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/my-incidences" element={<ProtectedRoute><MyIncidences /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      
      {/* Catch-all - any undefined route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/**
 * ============================================================
 * COMPONENT: App (Root Component)
 * ============================================================
 * Description: 
 *   Main component that wraps entire application
 *   with necessary providers.
 * 
 * Providers used:
 *   - AuthProvider: Authentication context
 *   - BrowserRouter: Routing
 * ============================================================
 */
function App() {
  return (
    <AuthProvider>
      <IncidencesProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </IncidencesProvider>
    </AuthProvider>
  );
}

export default App;