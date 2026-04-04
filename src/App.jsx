/**
 * ============================================================
 * APP.JSX - Configuración Principal de Rutas
 * ============================================================
 * Descripción: 
 *   Componente raíz de la aplicación que configura el enrutamiento,
 *   el contexto de autenticación y las rutas protegidas/públicas.
 * 
 * Ubicación: src/App.jsx
 * 
 * ARQUITECTURA:
 *   1. AuthProvider - Proveedor de contexto de autenticación
 *   2. BrowserRouter - Enrutador de React Router
 *   3. AppRoutes - Definición de todas las rutas
 *   4. ProtectedRoute - Componente de orden superior para rutas privadas
 *   5. PublicRoute - Componente de orden público para rutas públicas
 * 
 * RUTAS DEFINIDAS:
 *   - "/" (GET)     → Landing (pública, redirige si logueado)
 *   - "/login"      → Login (pública, redirige si logueado)
 *   - "/register"   → Register (pública, redirige si logueado)
 *   - "/dashboard"  → Dashboard (protegida, requiere auth)
 *   - "*"           → Catch-all redirige a "/"
 * 
 * FLUJO DE AUTENTICACIÓN:
 *   1. AuthProvider carga token de localStorage al iniciar
 *   2. Verifica token con endpoint /me del backend
 *   3. Si token válido → user tiene datos
 *   4. Si token inválido → user es null
 *   5. ProtectedRoute redirige a "/" si user es null
 *   6. PublicRoute redirige a "/dashboard" si user existe
 * 
 * Notas técnicas:
 *   - El estado "loading" muestra pantalla de carga mientras
 *     se verifica el token en el backend
 *   - El componente AuthContext debe envolver toda la app
 *   - Las rutas se evaluan en orden - la primera que hace match gana
 *   - La ruta "*" captura todas las URLs no definidas
 * ============================================================
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';

/**
 * ============================================================
 * COMPONENTE: ProtectedRoute (Ruta Protegida)
 * ============================================================
 * Descripción: 
 *   Componente de orden superior que protege rutas privadas.
 *   Solo permite acceso si el usuario está autenticado.
 * 
 * Lógica:
 *   1. Si está cargando (loading=true) → muestra spinner
 *   2. Si hay usuario (user existe) → muestra children
 *   3. Si no hay usuario → redirige a "/"
 * 
 * Uso típico: Dashboard, páginas de usuario autenticado
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
 * COMPONENTE: PublicRoute (Ruta Pública)
 * ============================================================
 * Descripción: 
 *   Componente de orden superior para rutas públicas.
 *   Redirige a /dashboard si el usuario ya está logueado.
 * 
 * Lógica:
 *   1. Si está cargando (loading=true) → muestra spinner
 *   2. Si hay usuario (user existe) → redirige a /dashboard
 *   3. Si no hay usuario → muestra children (página pública)
 * 
 * Uso típico: Landing, Login, Register
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
 * COMPONENTE: AppRoutes
 * ============================================================
 * Descripción: 
 *   Define todas las rutas de la aplicación.
 *   Usa los componentes ProtectedRoute y PublicRoute como wrappers.
 * ============================================================
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas - accesibles sin autenticación */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Rutas protegidas - requieren autenticación */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Catch-all - cualquier ruta no definida */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

/**
 * ============================================================
 * COMPONENTE: App (Componente Raíz)
 * ============================================================
 * Descripción: 
 *   Componente principal que envuelve toda la aplicación
 *   con los proveedores necesarios.
 * 
 * Providers utilizados:
 *   - AuthProvider: Contexto de autenticación
 *   - BrowserRouter: Enrutamiento
 * ============================================================
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;