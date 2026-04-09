/**
 * ============================================================
 * CONTEXT: AuthContext (Authentication Management)
 * ============================================================
 * Description: 
 *   React context provider that manages the 
 *   authentication state of the application. Handles login,
 *   logout, registration and user session verification.
 * 
 * Location: src/context/AuthContext.jsx
 * 
 * ARCHITECTURE:
 *   - AuthContext: React Context API to share state
 *   - AuthProvider: Provider component that wraps the app
 *   - useAuth: Custom hook to access the context
 * 
 * MANAGED STATES:
 *   - user: Object with user data (null if not authenticated)
 *   - loading: Boolean indicating if verifying session
 *   - login: Function to sign in
 *   - logout: Function to sign out
 *   - register: Function to register new user
 * 
 * API INTEGRATION:
 *   - Login: POST /api/v1/login → saves token to localStorage
 *   - Register: POST /api/v1/register → saves token to localStorage
 *   - Logout: POST /api/v1/logout → clears localStorage
 *   - Verification: GET /api/v1/me → gets user data
 * 
 * PERSISTENCE:
 *   - Token saved in localStorage ('token')
 *   - On app start, token is verified with /me
 *   - If token is invalid, it's cleared and user is null
 * 
 * Technical notes:
 *   - Must wrap entire application (in App.jsx)
 *   - Uses Axios interceptors to add token automatically
 *   - Session verification is async (loading state)
 *   - Supports tokens in 'token' or 'access_token' format
 * ============================================================
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * ============================================================
 * CONTEXT: AuthContext
 * Creates a context with initial null value
 * Accessed via useAuth hook
 * ============================================================
 */
const AuthContext = createContext(null);

/**
 * ============================================================
 * COMPONENT: AuthProvider
 * Authentication provider that wraps the application
 * Handles complete session lifecycle
 * ============================================================
 */
export function AuthProvider({ children }) {
  // ============================================================
  // PROVIDER STATES
  // ============================================================
  const [user, setUser] = useState(null);           // Authenticated user data
  const [loading, setLoading] = useState(true);    // Initial loading state

  // ============================================================
  // EFFECT: Session verification on start
  // Description: Checks if token exists in localStorage
  // and verifies its validity with /me endpoint
  // ============================================================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Token saved - verify with backend
      api.get('/me')
        .then(({ data }) => setUser(data.data))
        .catch(() => {
          // Token invalid or expired - clear
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      // No token - load without session
      setLoading(false);
    }
  }, []);

  // ============================================================
  // FUNCTION: login
  // Description: Signs in with email and password
  // Flow: 
  //   1. POST /login with credentials
  //   2. Extracts token from response
  //   3. Saves token to localStorage
  //   4. Gets user data with /me
  //   5. Updates user state
  // 
  // Returns: userData of authenticated user
  // Throws error if no token received
  // ============================================================
  const login = async (email, password) => {
    console.log('Login attempt:', { email });
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response.data);
    
    // Supports different response formats (token or access_token)
    const token = response.data.token || response.data.access_token;
    if (!token) {
      throw new Error('No token received');
    }
    
    localStorage.setItem('token', token);
    const { data } = await api.get('/me');
    const userData = data.data;
    setUser(userData);
    return userData;
  };

  // ============================================================
  // FUNCTION: logout
  // Description: Signs out the user
  // Flow:
  //   1. POST /logout to backend (optional - clears token server-side)
  //   2. Removes token from localStorage
  //   3. Updates user state to null
  // ============================================================
  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    try {
      await api.post('/logout');
    } catch (e) {
      // ignore errors - we log out locally anyway
    }
  };

  // ============================================================
  // FUNCTION: register
  // Description: Registers a new user
  // Parameters:
  //   - name: Full name
  //   - email: Email address
  //   - password: Password
  //   - passwordConfirmation: Password confirmation
  // 
  // Flow:
  //   1. POST /register with all data
  //   2. Extracts and saves token to localStorage
  //   3. Gets user data
  //   4. Updates user state
  // 
  // Returns: userData of new user
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
    const { data } = await api.get('/me');
    const userData = data.data;
    setUser(userData);
    return userData;
  };

  // ============================================================
  // RENDER: Context provider
  // Exposes: user, login, logout, register, loading
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
 * Description: Custom hook to access the authentication
 * context from any component.
 * 
 * Usage:
 *   const { user, login, logout } = useAuth();
 * 
 * Restrictions:
 *   - Must be used within AuthProvider
 *   - Throws error if used outside provider
 * ============================================================
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}