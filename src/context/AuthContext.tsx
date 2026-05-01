import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // FIX 1: Lazy initialization. React runs this function exactly once on mount.
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('diner_user');
    const token = localStorage.getItem('access_token');
    if (storedUser && token) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null; // Failsafe in case JSON is corrupted
      }
    }
    return null;
  });

  // Because we load synchronously above, we don't need an initial loading state
  const [isLoading] = useState(false); 

  useEffect(() => {
    // Only keeping the event listener in the effect now
    const handleForcedLogout = () => { 
      setCurrentUser(null); 
      window.location.href = '/login'; 
    };
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  const login = (data: AuthResponse) => {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('diner_user', JSON.stringify(data.user));
    setCurrentUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('diner_user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// FIX 2: Suppress the Vite Fast Refresh warning for this specific hook export
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};