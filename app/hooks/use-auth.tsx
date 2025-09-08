import { useState, useEffect } from "react";
import type { User } from "shared/schema";
import { authManager } from "~/lib/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return authManager.login(email, password);
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin?: boolean;
  }) => {
    return authManager.register(userData);
  };

  const logout = () => {
    authManager.logout();
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
}
