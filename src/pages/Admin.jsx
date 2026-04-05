/**
 * ============================================================
 * PÁGINA: Admin (Panel de Administración)
 * ============================================================
 * Descripción: 
 *   Panel de administración para gestionar usuarios del sistema.
 *   Solo accesible para usuarios con rol de administrador.
 * 
 * Ubicación: src/pages/Admin.jsx
 * 
 * Routing:
 *   - Accesible desde /admin (requiere autenticación)
 *   - Redirige a / si el usuario no es admin
 * 
 * Funcionalidades:
 *   1. Lista de usuarios (nombre, email, rol)
 *   2. Eliminar usuarios (solo admins, no a sí mismos)
 *   3. Mensaje de acceso denegado para no-admins
 * 
 * Integración:
 *   - GET /api/v1/users → Lista de usuarios
 *   - DELETE /api/v1/users/{id} → Eliminar usuario
 *   - Manejo de error 403 para usuarios no-admin
 * 
 * Notas técnicas:
 *   - Requiere AuthProvider en App.jsx
 *   - Las rutas de usuarios están protegidas por middleware is_admin
 *   - El usuario actual no puede eliminarse a sí mismo
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TopNavBar from '../components/layout/TopNavBar';
import SideNavBar from '../components/layout/SideNavBar';

export default function Admin() {
  // ============================================================
  // ESTADOS DEL COMPONENTE
  // ============================================================
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ============================================================
  // HANDLER: handleLogout
  // Descripción: Cierra sesión y redirige a login
  // ============================================================
  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  // ============================================================
  // FUNCIÓN: fetchUsers
  // Descripción: Obtiene lista de usuarios desde API
  // ============================================================
  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data || data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('ACCESS_DENIED');
      } else {
        setError('Error al cargar los usuarios');
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // EFECTO: Cargar usuarios al iniciar
  // ============================================================
  useEffect(() => {
    fetchUsers();
  }, []);

  // ============================================================
  // HANDLER: handleDelete
  // Descripción: Elimina un usuario (solo admins)
  // ============================================================
  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    setDeleting(userId);
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar el usuario');
    } finally {
      setDeleting(null);
    }
  };

  // ============================================================
  // HELPER: formatDate
  // Descripción: Formatea fecha para mostrar
  // ============================================================
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
  };

  // ============================================================
  // RENDER: VISTA DE ACCESO DENEGADO
  // Si el usuario no es admin, mostrar mensaje
  // ============================================================
  if (error === 'ACCESS_DENIED') {
    return (
      <div className="min-h-screen relative">
        <TopNavBar user={user} onLogout={handleLogout} />
        <SideNavBar />
        
        <main className="ml-64 pt-14 min-h-screen relative">
          {/* Background pattern */}
          <div className="absolute inset-0 stippled-bg"></div>
          
          {/* Content */}
          <div className="relative p-8 max-w-6xl">
            
            {/* ============================================================
                HEADER: Título
             ============================================================ */}
            <div className="mb-8">
              <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">MÓDULO DE ADMINISTRACIÓN</span>
              <h1 className="font-sans font-bold text-4xl mt-2">ADMIN AREA</h1>
            </div>

            {/* ============================================================
                TARJETA: Acceso denegado
             ============================================================ */}
            <div className="bg-white max-w-lg mx-auto">
              {/* Header de la tarjeta */}
              <div className="px-6 py-4 border-b-2 border-black bg-surface-dim">
                <h2 className="text-lg font-semibold uppercase">ACCESO DENEGADO</h2>
              </div>
              
              {/* Contenido */}
              <div className="p-8 text-center">
                {/* Icono de configuración con animación */}
                <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24" className="mx-auto mb-4 text-red-600">
                  <title>cog-off-loop</title>
                  <defs>
                    <mask id="SVGcYw6qeeQ">
                      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <g stroke="#fff">
                          <path strokeDasharray="22" d="M12 9c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3Z">
                            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="22;0"/>
                          </path>
                          <path strokeDasharray="44" strokeDashoffset="44" d="M12 5.5c3.59 0 6.5 2.91 6.5 6.5c0 3.59 -2.91 6.5 -6.5 6.5c-3.59 0 -6.5 -2.91 -6.5 -6.5c0 -3.59 2.91 -6.5 6.5 -6.5Z">
                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.5s" to="0"/>
                            <set fill="freeze" attributeName="opacity" begin="0.8s" to="0"/>
                          </path>
                          <path d="M15.24 6.37c0.41 0.23 0.8 0.51 1.14 0.83c0 0 2.62 -1.08 2.63 -1.06c0 0 1.56 2.7 1.56 2.7c0.01 0.03 -2.22 1.75 -2.22 1.75c0.1 0.45 0.15 0.93 0.15 1.41" opacity="0">
                            <animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
                            <set fill="freeze" attributeName="opacity" begin="0.8s" to="1"/>
                            <animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M15.24 6.37c0.41 0.23 0.8 0.51 1.14 0.83c0.22 0.2 0.42 0.41 0.61 0.63c0.47 0.57 0.86 1.22 1.12 1.94c0.09 0.26 0.17 0.54 0.24 0.82c0.1 0.45 0.15 0.93 0.15 1.41;M15.24 6.37c0.41 0.23 0.8 0.51 1.14 0.83c0 0 2.62 -1.08 2.63 -1.06c0 0 1.56 2.7 1.56 2.7c0.01 0.03 -2.22 1.75 -2.22 1.75c0.1 0.45 0.15 0.93 0.15 1.41"/>
                          </path>
                          <path d="M18.5 11.99c0.01 0.47 -0.04 0.95 -0.15 1.4c0 0 2.25 1.73 2.23 1.75c0 0 -1.56 2.7 -1.56 2.7c-0.02 0.02 -2.63 -1.05 -2.63 -1.05c-0.34 0.31 -0.73 0.59 -1.15 0.83" opacity="0">
                            <animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
                            <set fill="freeze" attributeName="opacity" begin="0.8s" to="1"/>
                            <animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M18.5 11.99c0.01 0.47 -0.04 0.95 -0.15 1.4c-0.06 0.29 -0.15 0.57 -0.24 0.84c-0.26 0.69 -0.63 1.35 -1.12 1.94c-0.18 0.21 -0.38 0.42 -0.59 0.62c-0.34 0.31 -0.73 0.59 -1.15 0.83;M18.5 11.99c0.01 0.47 -0.04 0.95 -0.15 1.4c0 0 2.25 1.73 2.23 1.75c0 0 -1.56 2.7 -1.56 2.7c-0.02 0.02 -2.63 -1.05 -2.63 -1.05c-0.34 0.31 -0.73 0.59 -1.15 0.83"/>
                          </path>
                          <path d="M15.26 17.62c-0.4 0.24 -0.84 0.44 -1.29 0.57c0 0 -0.37 2.81 -0.4 2.81c0 0 -3.12 0 -3.12 0c-0.03 -0.01 -0.41 -2.8 -0.41 -2.8c-0.44 -0.14 -0.88 -0.34 -1.3 -0.58" opacity="0">
                            <animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
                            <set fill="freeze" attributeName="opacity" begin="0.8s" to="1"/>
                            <animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M15.26 17.62c-0.4 0.24 -0.84 0.44 -1.29 0.57c-0.28 0.09 -0.57 0.16 -0.85 0.21c-0.73 0.12 -1.49 0.13 -2.24 0c-0.27 -0.05 -0.55 -0.12 -0.83 -0.2c-0.44 -0.14 -0.88 -0.34 -1.3 -0.58;M15.26 17.62c-0.4 0.24 -0.84 0.44 -1.29 0.57c0 0 -0.37 2.81 -0.4 2.81c0 0 -3.12 0 -3.12 0c-0.03 -0.01 -0.41 -2.8 -0.41 -2.8c-0.44 -0.14 -0.88 -0.34 -1.3 -0.58"/>
                          </path>
                          <path d="M8.76 17.63c-0.41 -0.23 -0.8 -0.51 -1.14 -0.83c0 0 -2.62 1.08 -2.63 1.06c0 0 -1.56 -2.7 -1.56 -2.7c-0.01 -0.03 2.22 -1.75 2.22 -1.75c-0.1 -0.45 -0.15 -0.93 -0.15 -1.41" opacity="0">
                            <animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
                            <set fill="freeze" attributeName="opacity" begin="0.8s" to="1"/>
                            <animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M8.76 17.63c-0.41 -0.23 -0.8 -0.51 -1.14 -0.83c-0.22 -0.2 -0.42 -0.41 -0.61 -0.63c-0.47 -0.57 -0.86 -1.22 -1.12 -1.94c-0.09 -0.26 -0.17 -0.54 -0.24 -0.82c-0.1 -0.45 -0.15 -0.93 -0.15 -1.41;M8.76 17.63c-0.41 -0.23 -0.8 -0.51 -1.14 -0.83c0 0 -2.62 1.08 -2.63 1.06c0 0 -1.56 -2.7 -1.56 -2.7c-0.01 -0.03 2.22 -1.75 2.22 -1.75c-0.1 -0.45 -0.15 -0.93 -0.15 -1.41"/>
                          </path>
                          <path d="M5.5 12.01c-0.01 -0.47 0.04 -0.95 0.15 -1.4c0 0 -2.25 -1.73 -2.23 -1.75c0 0 1.56 -2.7 1.56 -2.7c0.02 -0.02 2.63 1.05 2.63 1.05c0.34 -0.31 0.73 -0.59 1.15 -0.83" opacity="0">
                            <animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
                            <set fill="freeze" attributeName="opacity" begin="0.8s" to="1"/>
                            <animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M5.5 12.01c-0.01 -0.47 0.04 -0.95 0.15 -1.4c0.06 -0.29 0.15 -0.57 0.24 -0.84c0.26 -0.69 0.63 -1.35 1.12 -1.94c0.18 -0.21 0.38 -0.42 0.59 -0.62c0.34 -0.31 0.73 -0.59 1.15 -0.83;M5.5 12.01c-0.01 -0.47 0.04 -0.95 0.15 -1.4c0 0 -2.25 -1.73 -2.23 -1.75c0 0 1.56 -2.7 1.56 -2.7c0.02 -0.02 2.63 1.05 2.63 1.05c0.34 -0.31 0.73 -0.59 1.15 -0.83"/>
                          </path>
                          <path d="M8.74 6.38c0.4 -0.24 0.84 -0.44 1.29 -0.57c0 0 0.37 -2.81 0.4 -2.81c0 0 3.12 0 3.12 0c0.03 0.01 0.41 2.8 0.41 2.8c0.44 0.14 0.88 0.34 1.3 0.58" opacity="0">
                            <animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
                            <set fill="freeze" attributeName="opacity" begin="0.8s" to="1"/>
                            <animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M8.74 6.38c0.4 -0.24 0.84 -0.44 1.29 -0.57c0.28 -0.09 0.57 -0.16 0.85 -0.21c0.73 -0.12 1.49 -0.13 2.24 0c0.27 0.05 0.55 0.12 0.83 0.2c0.44 0.14 0.88 0.34 1.3 0.58;M8.74 6.38c0.4 -0.24 0.84 -0.44 1.29 -0.57c0 0 0.37 -2.81 0.4 -2.81c0 0 3.12 0 3.12 0c0.03 0.01 0.41 2.8 0.41 2.8c0.44 0.14 0.88 0.34 1.3 0.58"/>
                          </path>
                        </g>
                        <path stroke="#000" strokeDasharray="26" strokeDashoffset="26" d="M0 11h24" transform="rotate(45 12 12)">
                          <animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.4s" to="0"/>
                        </path>
                      </g>
                    </mask>
                  </defs>
                  <path fill="currentColor" d="M0 0h24v24H0z" mask="url(#SVGcYw6qeeQ)"/>
                  <path fill="none" stroke="currentColor" strokeDasharray="26" strokeDashoffset="26" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M-1 13h24" transform="rotate(45 12 12)">
                    <animate attributeName="d" dur="6s" keyTimes="0;0.5;1" repeatCount="indefinite" values="M-1 13h24;M1 13h24;M-1 13h24"/>
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.4s" to="0"/>
                  </path>
                </svg>
                
                {/* Mensaje principal */}
                <p className="font-mono text-sm text-gray-700 mb-4">
                  INCIDENsly 𝒘ebApp te invita a que solicites el permiso necesario.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // RENDER: VISTA PRINCIPAL (Admin)
  // ============================================================
  return (
    <div className="min-h-screen relative">
      <TopNavBar user={user} onLogout={handleLogout} />
      <SideNavBar />
      
      <main className="ml-64 pt-14 min-h-screen relative">
        {/* Background pattern */}
        <div className="absolute inset-0 stippled-bg"></div>
        
        {/* Content */}
        <div className="relative p-8 max-w-6xl">
          
          {/* ============================================================
              HEADER: Título
           ============================================================ */}
          <div className="mb-8">
            <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">MÓDULO DE ADMINISTRACIÓN</span>
            <h1 className="font-sans font-bold text-4xl mt-2">ADMIN AREA</h1>
            <p className="font-label text-sm text-on-surface-variant mt-1">Gestión de usuarios del sistema</p>
          </div>

          {/* ============================================================
              ESTADO: Cargando
           ============================================================ */}
          {loading ? (
            <div className="border-2 border-black bg-white p-8 text-center">
              <p className="font-label text-sm">CARGANDO DATOS...</p>
            </div>
          ) : error ? (
            /* ============================================================
                ESTADO: Error general
             ============================================================ */
            <div className="border-2 border-black bg-white p-8 text-center">
              <p className="font-label text-sm text-red-600">{error}</p>
            </div>
          ) : (
            /* ============================================================
                TABLA: Lista de usuarios
             ============================================================ */
            <div className="bg-white">
              {/* Encabezado de la tabla */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-dim border-b-2 border-black text-xs uppercase tracking-wide font-semibold">
                <div className="col-span-3">NOMBRE</div>
                <div className="col-span-4">EMAIL</div>
                <div className="col-span-2 text-center">ROL</div>
                <div className="col-span-3 text-center">ACCIONES</div>
              </div>

              {/* Filas de usuarios */}
              {users.map((u, index) => (
                <div 
                  key={u.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center ${index !== users.length - 1 ? 'border-b border-gray-300' : ''} hover:bg-surface-dim transition-colors`}
                >
                  {/* Nombre */}
                  <div className="col-span-3 font-mono text-sm">
                    {u.name}
                  </div>
                  
                  {/* Email */}
                  <div className="col-span-4 font-mono text-xs text-gray-600">
                    {u.email}
                  </div>
                  
                  {/* Rol */}
                  <div className="col-span-2 text-center">
                    <span className={`px-2 py-1 text-xs uppercase ${
                      u.is_admin 
                        ? 'border-2 border-black bg-black text-white' 
                        : 'border border-gray-400 bg-white text-gray-600'
                    }`}>
                      {u.is_admin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  
                  {/* Acciones */}
                  <div className="col-span-3 text-center">
                    {u.id !== user?.id ? (
                      /* Botón eliminar (excepto para uno mismo) */
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={deleting === u.id}
                        className="px-4 py-1 border border-red-600 text-red-600 font-mono text-xs uppercase hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deleting === u.id ? 'ELIMINANDO...' : 'ELIMINAR'}
                      </button>
                    ) : (
                      /* Indicador de usuario actual */
                      <span className="font-mono text-xs text-gray-400">TÚ</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
