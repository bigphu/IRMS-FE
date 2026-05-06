import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { authService, type LoginCredentials } from "@/services";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  const { user, setUser, isLoading } = context;

  const login = async (credentials: LoginCredentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return { user, isAuthenticated: !!user, isLoading, login, logout };
};
