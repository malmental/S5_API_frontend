/**
 * ============================================================
 * CONTEXTO: AuthContext (Gestión de Autenticación)
 * ============================================================
 * Descripción: 
 *   Proveedor de contexto React que gestiona el estado de 
 *   autenticación de la aplicación. Maneja login, logout, registro
 *   y verificación de sesión de usuario.
 * 
 * Ubicación: src/context/AuthContext.jsx
 * 
 * ARQUITECTURA:
 *   - AuthContext: Context API de React para compartir estado
 *   - AuthProvider: Componente proveedor que envuelve la app
 *   - useAuth: Hook personalizado para acceder al contexto
 * 
 * ESTADOS GESTIONADOS:
 *   - user: Objeto con datos del usuario (null si no autenticado)
 *   - loading: Booleano que indica si está verificando la sesión
 *   - login: Función para iniciar sesión
 *   - logout: Función para cerrar sesión
 *   - register: Función para registrar nuevo usuario
 * 
 * INTEGRACIÓN CON API:
 *   - Login: POST /api/v1/login → guarda token en localStorage
 *   - Register: POST /api/v1/register → guarda token en localStorage
 *   - Logout: POST /api/v1/logout → limpia localStorage
 *   - Verificación: GET /api/v1/me → obtiene datos del usuario
 * 
 * PERSISTENCIA:
 *   - Token guardado en localStorage ('token')
 *   - Al iniciar la app, se verifica el token con /me
 *   - Si el token es inválido, se limpia y user queda null
 * 
 * Notas técnicas:
 *   - Debe envolver toda la aplicación (en App.jsx)
 *   - Usa interceptores de Axiols para añadir token automáticamente
 *   - La verificación de sesión es asíncrona (estado loading)
 *   - Soporta tokens en formato 'token' o 'access_token'
 * ============================================================
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * ============================================================
 * CONTEXTO: AuthContext
 * Crea un contexto inicial con valor null
 * Se accede mediante useAuth hook
 * ============================================================
 */
const AuthContext = createContext(null);

/**
 * ============================================================
 * COMPONENTE: AuthProvider
 * Proveedor de autenticación que envuelve la aplicación
 * Maneja el ciclo de vida completo de la sesión
 * ============================================================
 */
export function AuthProvider({ children }) {
  // ============================================================
  // ESTADOS DEL PROVEEDOR
  // ============================================================
  const [user, setUser] = useState(null);           // Datos del usuario autenticado
  const [loading, setLoading] = useState(true);    // Estado de carga inicial

  // ============================================================
  // EFECTO: Verificación de sesión al iniciar
  // Descripción: Comprueba si existe token en localStorage
  // y verifica su validez con el endpoint /me
  // ============================================================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Hay token guardado - verificar con el backend
      api.get('/me')
        .then(({ data }) => setUser(data))
        .catch(() => {
          // Token inválido o expirado - limpiar
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      // No hay token - cargar sin sesión
      setLoading(false);
    }
  }, []);

  // ============================================================
  // FUNCIÓN: login
  // Descripción: Inicia sesión con email y contraseña
  // Flujo: 
  //   1. POST /login con credenciales
  //   2. Extrae token de la respuesta
  //   3. Guarda token en localStorage
  //   4. Obtiene datos del usuario con /me
  //   5. Actualiza el estado user
  // 
  // Retorna: userData del usuario autenticado
  // Lanza error si no recibe token
  // ============================================================
  const login = async (email, password) => {
    console.log('Login attempt:', { email });
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response.data);
    
    // Soporta diferentes formatos de respuesta (token o access_token)
    const token = response.data.token || response.data.access_token;
    if (!token) {
      throw new Error('No token received');
    }
    
    localStorage.setItem('token', token);
    const { data: userData } = await api.get('/me');
    setUser(userData);
    return userData;
  };

  // ============================================================
  // FUNCIÓN: logout
  // Descripción: Cierra la sesión del usuario
  // Flujo:
  //   1. POST /logout al backend (opcional - limpia token server-side)
  //   2. Elimina token de localStorage
  //   3. Actualiza estado user a null
  // ============================================================
  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  // ============================================================
  // FUNCIÓN: register
  // Descripción: Registra un nuevo usuario
  // Parámetros:
  //   - name: Nombre completo
  //   - email: Correo electrónico
  //   - password: Contraseña
  //   - passwordConfirmation: Confirmación de contraseña
  // 
  // Flujo:
  //   1. POST /register con todos los datos
  //   2. Extrae y guarda token en localStorage
  //   3. Obtiene datos del usuario
  //   4. Actualiza el estado user
  // 
  // Retorna: userData del nuevo usuario
  // ============================================================
  const register = async (name, email, password, passwordConfirmation) => {
    console.log('Register attempt:', { name, email });
    const response = await api.post('/register', { 
      name, 
      email, 
      password,
      password_confirmation: passwordConfirmation 
    });
    console.log('Register response:', response.data);
    
    const token = response.data.token || response.data.access_token;
    if (!token) {
      throw new Error('No token received');
    }
    
    localStorage.setItem('token', token);
    const { data: userData } = await api.get('/me');
    setUser(userData);
    return userData;
  };

  // ============================================================
  // RENDER: Proveedor de contexto
  // Expone: user, login, logout, register, loading
  // ============================================================
  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * ============================================================
 * HOOK: useAuth
 * Descripción: Hook personalizado para acceder al contexto
 * de autenticación desde cualquier componente.
 * 
 * Uso:
 *   const { user, login, logout } = useAuth();
 * 
 * Restricciones:
 *   - Debe usarse dentro de AuthProvider
 *   - Lanza error si se usa fuera del proveedor
 * ============================================================
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}