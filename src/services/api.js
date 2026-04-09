/**
 * ============================================================
 * SERVICE: API Client (HTTP Client)
 * ============================================================
 * Description:
 *   Axios instance configured to communicate with the backend.
 *   Includes interceptors for authentication and error handling.
 *
 * Location: src/services/api.js
 *
 * CONFIGURATION:
 *   - Base URL: /api/v1 (proxied by Vite)
 *   - Timeout: default Axios timeout
 *   - Content-Type: application/json (default)
 *
 * INTERCEPTORS:
 *   - Request: Adds Authorization header with Bearer token
 *   - Response: Handles 401, 403, 500 errors globally
 *
 * PROXY CONFIGURATION (vite.config.js):
 *   Requests to /api are forwarded to http://127.0.0.1:8000
 *   This avoids CORS issues during development
 *
 * USAGE IN COMPONENTS:
 *   import api from '../services/api';
 *
 *   // GET
 *   const { data } = await api.get('/incidences');
 *
 *   // POST
 *   const { data } = await api.post('/login', { email, password });
 *
 *   // PUT
 *   await api.put('/incidences/1', { title: 'New title' });
 *
 *   // DELETE
 *   await api.delete('/incidences/1');
 *
 * AUTHENTICATION FLOW:
 *   1. User logs in → AuthContext saves token to localStorage
 *   2. Component makes request (e.g., api.get('/incidences'))
 *   3. Request interceptor captures the request
 *   4. Reads token from localStorage
 *   5. Adds header: Authorization: Bearer <token>
 *   6. Request proceeds to backend
 *
 * BACKEND ENDPOINTS:
 *   - POST   /api/v1/login          → Login
 *   - POST   /api/v1/register      → Register user
 *   - POST   /api/v1/logout        → Logout
 *   - GET    /api/v1/me            → Get current user
 *   - GET    /api/v1/incidences    → List incidences
 *   - POST   /api/v1/incidences    → Create incidence
 *   - PUT    /api/v1/incidences/:id → Update incidence
 *   - DELETE /api/v1/incidences/:id → Delete incidence
 *
 * Technical notes:
 *   - Token is read on every request (not cached in memory)
 *   - If no token, request proceeds without auth header
 *   - Backend will respond with 401 for protected routes without token
 *   - Vite proxy only works in development (npm run dev)
 *   - In production, backend must have CORS configured
 * ============================================================
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
});

/**
 * ============================================================
 * INTERCEPTOR: Request Interceptor
 * ============================================================
 * Description: Executes before each outgoing request
 * Function: Adds authentication token if it exists
 *
 * Process:
 *   1. Reads token from localStorage
 *   2. If exists, adds Authorization header
 *   3. Format: Bearer <token>
 *   4. Returns modified config
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
 * INTERCEPTOR: Response Interceptor
 * ============================================================
 * Description: Executes after each server response
 * Function: Centralized error handling (401, 403, 500, network)
 *
 * Behavior:
 *   - 401 Unauthorized: Invalid/expired token → clears session, redirects to login
 *   - 403 Forbidden: No permissions → logs error (does not redirect)
 *   - 500 Server Error: Internal error → logs error
 *   - Network Error: No connection → logs error
 *   - Other errors: Passes error to calling component
 *
 * Note: This interceptor ONLY handles API-level errors.
 *       Components still receive the error for local handling if needed.
 * ============================================================
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem('token');
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
      }

      else if (status === 403) {
        console.error('Access forbidden:', error.response.data?.message || 'You do not have permission');
      }

      else if (status >= 500) {
        console.error('Server error:', error.response.data?.message || 'Internal server error');
      }
    }

    else if (error.request) {
      console.error('Network error: No response received from server');
    }

    return Promise.reject(error);
  }
);

export default api;