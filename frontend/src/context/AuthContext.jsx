import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authService.getProfile();
      setUser(data.data);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Listen for session-expired events from the API interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    setUser(data.data.user);
    return data.data;
  }, []);

  const googleLogin = useCallback(async (credential) => {
    const decoded = decodeJwt(credential);
    if (!decoded) throw new Error('Invalid Google credential');

    const googleUserData = {
      email: decoded.email,
      firstName: decoded.given_name || decoded.name?.split(' ')[0] || '',
      lastName: decoded.family_name || decoded.name?.split(' ').slice(1).join(' ') || '',
      avatar: decoded.picture || '',
    };

    const { data } = await authService.googleAuth(googleUserData);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    setUser(data.data.user);
    return data.data;
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await authService.register(userData);
    return data.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Silent fail on logout API
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  const value = { user, loading, login, googleLogin, register, logout, loadUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
