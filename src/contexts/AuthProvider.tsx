import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "@/services";
import type { User } from "@/types";

interface AuthProviderProps {
  children: ReactNode;
}

// Flag to prevent 401 redirect during initial auth check
let isInitializing = true;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Only verify if we have a token
        const token = window.localStorage.getItem("irms_access_token");
        if (token) {
          const userData = await authService.verify();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        // Silently fail - user is not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
        isInitializing = false;
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;