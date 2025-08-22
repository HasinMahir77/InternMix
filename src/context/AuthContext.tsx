import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated as tokenExists, getCurrentUser, type AuthUser } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  userType: 'student' | 'recruiter';
  appliedInternships: Set<string>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; user?: AuthUser }>;
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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set());
  const [userType, setUserType] = useState<'student' | 'recruiter'>('student');

  useEffect(() => {
    const init = async () => {
      if (!tokenExists()) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserType('student');
        return;
      }
      const user = await getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setUserType(user.user_type);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserType('student');
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; user?: AuthUser }> => {
    const result = await authLogin(email, password, rememberMe);
    if (result.success) {
      setIsAuthenticated(true);
      if (result.user) {
        setCurrentUser(result.user);
        setUserType(result.user.user_type);
      }
    }
    return result;
  };

  const logout = async () => {
    await authLogout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserType('student');
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
    userType,
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