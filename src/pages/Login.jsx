/**
 * ============================================================
 * PÁGINA: Login (Página de Autenticación)
 * ============================================================
 * Descripción: 
 *   Formulario de inicio de sesión para usuarios existentes.
 *   Utiliza el contexto de autenticación para validar credenciales.
 * 
 * Ubicación: src/pages/Login.jsx
 * 
 * Routing:
 *   - Accesible desde /login
 *   - Redirige a /dashboard si ya está logueado
 *   - Link a /register para nuevos usuarios
 * 
 * Estados del formulario:
 *   1. idle - Formulario en reposo
 *   2. loading - En proceso de autenticación
 *   3. error - Credenciales inválidas
 * 
 * Integración:
 *   - Usa useAuth() hook del contexto
 *   - Llama a login(email, password) del AuthContext
 *   - Navega a /dashboard tras login exitoso
 * 
 * Campos:
 *   - email: Correo electrónico del usuario
 *   - password: Contraseña
 * 
 * Manejo de errores:
 *   - Muestra mensaje de error del backend
 *   - Fallback genérico si no hay respuesta específica
 * 
 * Notas técnicas:
 *   - Requiere AuthProvider en App.jsx
 *   - El token se guarda en localStorage automáticamente
 *   - El focus en inputs cambia el borde a 4px
 * ============================================================
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  // ============================================================
  // ESTADOS DEL COMPONENTE
  // ============================================================
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Hooks de autenticación y navegación
  const { login } = useAuth();
  const navigate = useNavigate();

  // ============================================================
  // HANDLER: handleSubmit
  // Descripción: Maneja el envío del formulario de login
  // Flujo: Valida → Llama API → Guarda token → Redirige
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Extraer mensaje de error de la respuesta o usar fallback
      const message = err.response?.data?.message || 
                      err.response?.data?.error ||
                      'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* ============================================================
        CONTENEDOR PRINCIPAL
        Layout: Flex column | Min-height: 100vh | Fondo: surface
       ============================================================ */
    <div className="flex flex-col min-h-screen bg-surface">
      
      {/* ============================================================
          SECCIÓN 1: HEADER
          Descripción: Barra superior con logo y botón de registro
       ============================================================ */}
      <header className="flex justify-between items-center px-6 h-16 w-full border-b-2 border-black bg-surface">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-mono font-bold text-xl border-2 border-black px-2 py-1">INCIDENT_LOG_v1.0</Link>
          <span className="font-label text-[10px] bg-primary text-on-primary px-1">SYSTEM_READY</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/register" className="font-sans uppercase tracking-tighter bg-black text-white hover:bg-gray-800 transition-colors px-4 py-1">REGISTER</Link>
        </div>
      </header>

      {/* ============================================================
          SECCIÓN 2: FORMULARIO DE LOGIN
          Descripción: Área central con formulario de autenticación
          Layout: Centrado con max-width 512px
       ============================================================ */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          {/* Badge y título */}
          <div className="mb-6">
            <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">MÓDULO DE AUTENTICACIÓN</span>
          </div>
          
          <h1 className="font-sans font-bold text-4xl mb-2">INICIAR SESIÓN</h1>
          <p className="font-label text-sm text-on-surface-variant mb-8">Acceso restringido. Introduzca credenciales.</p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="border-2 border-black p-6 bg-white">
            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-error-container border border-error text-error text-sm font-label">
                ERROR: {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Campo: Email */}
              <div>
                <label htmlFor="email" className="block font-label text-xs uppercase mb-2">
                  Email / Usuario
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-black bg-surface focus:outline-none focus:border-4 focus:border-primary transition-all font-mono text-sm"
                  placeholder="user@domain.ext"
                  required
                />
              </div>

              {/* Campo: Password */}
              <div>
                <label htmlFor="password" className="block font-label text-xs uppercase mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-black bg-surface focus:outline-none focus:border-4 focus:border-primary transition-all font-mono text-sm"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              {/* Botón de submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-sans font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'AUTENTICANDO...' : 'ACCEDER'}
              </button>
            </div>
          </form>

          {/* Link a registro */}
          <div className="mt-6 text-center">
            <p className="font-label text-xs text-on-surface-variant">
              ¿Sin acceso?{' '}
              <Link to="/register" className="text-primary hover:underline font-bold">
                SOLICITAR REGISTRO
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* ============================================================
          SECCIÓN 3: FOOTER
          Descripción: Pie de página con versión y timestamp
       ============================================================ */}
      <footer className="flex justify-between items-center px-6 py-4 w-full border-t-2 border-black bg-surface-container">
        <div className="font-label text-[10px]">
          INCIDENSly_v1.0.4_AUTH_MODULE
        </div>
        <div className="font-label text-[10px]">
          {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
        </div>
      </footer>
    </div>
  );
}