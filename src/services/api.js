/**
 * ============================================================
 * SERVICIO: API Client (Cliente HTTP)
 * ============================================================
 * Descripción: 
 *   Instancia configurada de Axios para comunicar con el backend.
 *   Incluye interceptor para añadir token de autenticación 
 *   automáticamente a todas las peticiones.
 * 
 * Ubicación: src/services/api.js
 * 
 * CONFIGURACIÓN:
 *   - Base URL: /api/v1 (redirigida por proxy de Vite)
 *   - Timeout: default de Axios
 *   - Content-Type: application/json (default)
 * 
 * INTERCEPTORES:
 *   - Request: Añade header Authorization con Bearer token
 * 
 * PROXY CONFIGURATION (vite.config.js):
 *   Las peticiones a /api se redirigen a http://127.0.0.1:8000
 *   Esto permite evitar problemas de CORS en desarrollo
 * 
 * USO EN COMPONENTES:
 *   import api from '../services/api';
 *   
 *   // GET
 *   const { data } = await api.get('/incidences');
 *   
 *   // POST
 *   const { data } = await api.post('/login', { email, password });
 * 
 *   // PUT
 *   await api.put('/incidences/1', { title: 'Nuevo título' });
 * 
 *   // DELETE
 *   await api.delete('/incidences/1');
 * 
 * FLUJO DE AUTENTICACIÓN:
 *   1. Usuario hace login → AuthContext guarda token en localStorage
 *   2. Componente hace petición (ej: api.get('/incidences'))
 *   3. Interceptor captura la petición
 *   4. Lee token de localStorage
 *   5. Añade header: Authorization: Bearer <token>
 *   6. Petición sigue al backend
 * 
 * ENDPOINTS DEL BACKEND:
 *   - POST   /api/v1/login          → Iniciar sesión
 *   - POST   /api/v1/register      → Registrar usuario
 *   - POST   /api/v1/logout        → Cerrar sesión
 *   - GET    /api/v1/me            → Obtener usuario actual
 *   - GET    /api/v1/incidences    → Listar incidencias
 *   - POST   /api/v1/incidences    → Crear incidencia
 *   - PUT    /api/v1/incidences/:id → Actualizar incidencia
 *   - DELETE /api/v1/incidences/:id → Eliminar incidencia
 * 
 * Notas técnicas:
 *   - El token se lee en cada petición (no se cachea en memoria)
 *   - Si no hay token, la petición se envía sin header de auth
 *   - El backend responderá con 401 para rutas protegidas sin token
 *   - El proxy de Vite solo funciona en desarrollo (npm run dev)
 *   - En producción, el backend debe tener CORS configurado
 * ============================================================
 */

import axios from 'axios';

/**
 * ============================================================
 * INSTANCIA: api
 * Cliente Axios preconfigurado para el backend
 * Base URL: /api/v1 (relativa - usa el proxy de Vite)
 * ============================================================
 */
const api = axios.create({
  baseURL: '/api/v1',
});

/**
 * ============================================================
 * INTERCEPTOR: Request Interceptor
 * Descripción: Se ejecuta antes de cada petición saliente
 * Función: Añade token de autenticación si existe
 * 
 * Proceso:
 *   1. Lee el token de localStorage
 *   2. Si existe, añade header Authorization
 *   3. Formato: Bearer <token>
 *   4. Retorna la config modificada
 * ============================================================
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * ============================================================
 * EXPORT
 * Exporta la instancia de Axios configurada
 * Lista para usar en toda la aplicación
 * ============================================================
 */
export default api;