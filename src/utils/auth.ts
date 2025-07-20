// Simple cookie-based authentication utility

const DUMMY_USERS = {
  Mahir: 'Mahir',
  recruiter: 'recruiter',
  company: 'company',
};

export type UserType = 'student' | 'recruiter';

export const getUserType = (username: string | null): UserType => {
  if (username === 'company' || username === 'recruiter') {
    return 'recruiter';
  }
  return 'student';
};

// Cookie utility functions
export const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

// Authentication functions
export const login = (username: string, password: string): boolean => {
  if (DUMMY_USERS[username as keyof typeof DUMMY_USERS] === password) {
    setCookie('username', username);
    return true;
  }
  return false;
};

export const logout = () => {
  deleteCookie('username');
};

export const isAuthenticated = (): boolean => {
  const username = getCookie('username');
  return username !== null && username in DUMMY_USERS;
};

export const getCurrentUser = (): string | null => {
  const username = getCookie('username');
  return username && username in DUMMY_USERS ? username : null;
}; 