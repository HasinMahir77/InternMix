import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated as checkAuthStatus, getCurrentUser } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  appliedInternships: Set<string>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  applyForInternship: (internshipTitle: string) => void;
  isApplied: (internshipTitle: string) => boolean;
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
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set());

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
    setAppliedInternships(new Set());
  };

  const applyForInternship = (internshipTitle: string) => {
    setAppliedInternships(prev => new Set([...prev, internshipTitle]));
  };

  const isApplied = (internshipTitle: string) => {
    return appliedInternships.has(internshipTitle);
  };

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    appliedInternships,
    login,
    logout,
    applyForInternship,
    isApplied,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 