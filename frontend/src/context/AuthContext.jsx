import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('techstore_user');
    const token = localStorage.getItem('techstore_token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('techstore_user');
        localStorage.removeItem('techstore_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('techstore_token', token);
    localStorage.setItem('techstore_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    const response = await api.post('/api/auth/register', { fullName, email, password });
    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('techstore_token');
    localStorage.removeItem('techstore_user');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'Admin';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
