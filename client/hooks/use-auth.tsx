import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, logout as apiLogout } from "@/lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const flag = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(flag);
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    await apiLogin(email, password);
    setIsAuthenticated(true);
  }

  async function logout() {
    await apiLogout();
    setIsAuthenticated(false);
  }

  const value = useMemo(() => ({ isAuthenticated, loading, login, logout }), [isAuthenticated, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
