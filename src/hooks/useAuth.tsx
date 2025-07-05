// src/hooks/useAuth.ts
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';


interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
  isLoadingAuth: boolean; // Add loading state for initial auth check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true); // Initial loading state
  const navigate = useNavigate();

  // Load auth state from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      try {
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
      }
    }
    setIsLoadingAuth(false); // Auth check complete
  }, []);

  const login = useCallback((newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    navigate('/signin'); // Redirect to sign-in page after logout
  }, [navigate]);

  const value = {
    isAuthenticated,
    token,
    login,
    logout,
    isLoadingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};