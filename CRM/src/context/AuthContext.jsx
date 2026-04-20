import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define logout early to avoid TDZ (Temporal Dead Zone) hoisting issues
  const logout = useCallback(() => {
    console.log('🚪 Nexus Auth: Logging out...');
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
  }, []);

  const fetchProfile = useCallback(async (tk) => {
    try {
      console.log('🔍 Nexus Auth: Validating session...');
      const response = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${tk}` }
      });
      setUser(response.data.data);
      console.log('✅ Nexus Auth: Session verified.');
    } catch (error) {
      console.warn('❌ Nexus Auth: Session invalid or expired.');
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const loginWithToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('jwt_token', newToken);
    fetchProfile(newToken);
  };

  const value = {
    user,
    token,
    loginWithToken,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
