// API-based authentication utility using JWT Bearer tokens

export type UserType = 'student' | 'recruiter';

export interface AuthUser {
  id: string;  // Now using email as ID
  email: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
}

const API_BASE = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'internmix_token';

export const getUserType = (userTypeOrEmail: string | null): UserType => {
  if (userTypeOrEmail === 'recruiter') return 'recruiter';
  return 'student';
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const deleteToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const login = async (email: string, password: string): Promise<{ success: boolean; user?: AuthUser }> => {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return { success: false };
    const data = await res.json();
    setToken(data.access_token);
    return { success: true, user: data.user as AuthUser };
  } catch {
    return { success: false };
  }
};

export const signup = async (payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: UserType;
}): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err?.detail || 'Signup failed' };
    }
    const data = await res.json();
    return { success: true, user: data as AuthUser };
  } catch (e) {
    return { success: false, error: 'Network error' };
  }
};

export const logout = () => {
  deleteToken();
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as AuthUser;
  } catch {
    return null;
  }
};