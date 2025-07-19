import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated as checkAuthStatus, getCurrentUser } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      const authenticated = checkAuthStatus();
      const user = getCurrentUser();
      setIsAuthenticated(authenticated);
      setCurrentUser(user);
    };

    checkAuth();
  }, []);

  const login = (username: string, password: string): boolean => {
    const success = authLogin(username, password);
    if (success) {
      setIsAuthenticated(true);
      setCurrentUser(username);
    }
    return success;
  };

  const logout = () => {
    authLogout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 