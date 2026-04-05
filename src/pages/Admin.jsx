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
                {/* Icono de alerta animado */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4 text-red-600">
                  <title>alert-square-twotone</title>
                  <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path fill="currentColor" fillOpacity="0" strokeDasharray="66" d="M12 4h7c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.44 -1 -1v-14c0 -0.55 0.45 -1 1 -1Z">
                      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0" />
                      <animate fill="freeze" attributeName="fill-opacity" begin="1s" dur="0.15s" to=".3" />
                    </path>
                    <g fill="none">
                      <path strokeDasharray="8" strokeDashoffset="8" d="M12 7v6">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0" />
                      </path>
                      <path strokeDasharray="4" strokeDashoffset="4" d="M12 17v0.01">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0" />
                      </path>
                    </g>
                  </g>
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
