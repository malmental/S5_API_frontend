import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/me')
        .then(({ data }) => setUser(data))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    console.log('Login attempt:', { email });
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response.data);
    
    const token = response.data.token || response.data.access_token;
    if (!token) {
      throw new Error('No token received');
    }
    
    localStorage.setItem('token', token);
    const { data: userData } = await api.get('/me');
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

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

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}