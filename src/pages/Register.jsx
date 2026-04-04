/**
 * ============================================================
 * PÁGINA: Register (Página de Registro)
 * ============================================================
 * Descripción: 
 *   Formulario para registro de nuevos usuarios.
 *   Requiere validación de coincidencia de contraseñas.
 * 
 * Ubicación: src/pages/Register.jsx
 * 
 * Routing:
 *   - Accesible desde /register
 *   - Redirige a /dashboard si ya está logueado
 *   - Link a /login para usuarios existentes
 * 
 * Campos del formulario:
 *   - name: Nombre completo del usuario
 *   - email: Correo electrónico
 *   - password: Contraseña
 *   - passwordConfirmation: Confirmación de contraseña
 * 
 * Validaciones:
 *   1. Client-side: Las contraseñas deben coincidir
 *   2. Server-side: Email único, requisitos de contraseña
 * 
 * Integración:
 *   - Usa useAuth() hook del contexto
 *   - Llama a register(name, email, password, confirmation)
 *   - Navega a /dashboard tras registro exitoso
 * 
 * Notas técnicas:
 *   - Requiere campo password_confirmation para Laravel
 *   - La validación de contraseña se hace client-side primero
 *   - Muestra errores de validación del backend si existen
 * ============================================================
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  // ============================================================
  // ESTADOS DEL COMPONENTE
  // ============================================================
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // ============================================================
  // HANDLER: handleSubmit
  // Descripción: Maneja el envío del formulario de registro
  // Validaciones: Coincidencia de contraseñas antes de enviar
  // Flujo: Valida → Llama API → Guarda token → Redirige
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación client-side de contraseñas
    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/dashboard');
    } catch (err) {
      // Extraer mensaje de error - puede venir de diferentes rutas
      const message = err.response?.data?.message || 
                      err.response?.data?.errors?.password?.[0] || 
                      'Error en el registro. Inténtelo de nuevo.';
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
          Descripción: Barra superior con logo y botón de login
       ============================================================ */}
      <header className="flex justify-between items-center px-6 h-16 w-full border-b-2 border-black bg-surface">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-mono font-bold text-xl border-2 border-black px-2 py-1">INCIDENT_LOG_v1.0</Link>
          <span className="font-label text-[10px] bg-primary text-on-primary px-1">SYSTEM_READY</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-sans uppercase tracking-tighter text-black hover:bg-gray-200 transition-colors px-4 py-1 border border-black">LOGIN</Link>
        </div>
      </header>

      {/* ============================================================
          SECCIÓN 2: FORMULARIO DE REGISTRO
          Descripción: Área central con formulario de creación de cuenta
          Layout: Centrado con max-width 512px
       ============================================================ */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          {/* Badge y título */}
          <div className="mb-6">
            <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">MÓDULO DE REGISTRO</span>
          </div>
          
          <h1 className="font-sans font-bold text-4xl mb-2">CREAR CUENTA</h1>
          <p className="font-label text-sm text-on-surface-variant mb-8">Nuevo usuario. Complete todos los campos.</p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="border-2 border-black p-6 bg-white">
            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-error-container border border-error text-error text-sm font-label">
                ERROR: {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Campo: Nombre */}
              <div>
                <label htmlFor="name" className="block font-label text-xs uppercase mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-black bg-surface focus:outline-none focus:border-4 focus:border-primary transition-all font-mono text-sm"
                  placeholder="NOMBRE APELLIDO"
                  required
                />
              </div>

              {/* Campo: Email */}
              <div>
                <label htmlFor="email" className="block font-label text-xs uppercase mb-2">
                  Email
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

              {/* Campo: Contraseña */}
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

              {/* Campo: Confirmar contraseña */}
              <div>
                <label htmlFor="passwordConfirmation" className="block font-label text-xs uppercase mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="passwordConfirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                {loading ? 'PROCESANDO...' : 'REGISTRARSE'}
              </button>
            </div>
          </form>

          {/* Link a login */}
          <div className="mt-6 text-center">
            <p className="font-label text-xs text-on-surface-variant">
              ¿Ya tiene cuenta?{' '}
              <Link to="/login" className="text-primary hover:underline font-bold">
                INICIAR SESIÓN
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
          INCIDENSly_v1.0.4_REG_MODULE
        </div>
        <div className="font-label text-[10px]">
          {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
        </div>
      </footer>
    </div>
  );
}