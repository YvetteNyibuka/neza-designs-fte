"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthUser } from "@/types";
import * as authApi from "@/lib/api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ requiresOtp: boolean; email?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restore() {
      const stored = sessionStorage.getItem("accessToken");
      if (!stored) {
        // Try to refresh via cookie
        try {
          const res = await authApi.refreshToken();
          const token: string = res.data.accessToken;
          sessionStorage.setItem("accessToken", token);
        } catch {
          setLoading(false);
          return;
        }
      }
      try {
        const res = await authApi.getMe();
        setUser(res.data as AuthUser);
      } catch {
        sessionStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    if (res.data?.requiresOtp) {
      return { requiresOtp: true, email: res.data.email };
    }
    const token: string = res.data.accessToken;
    sessionStorage.setItem("accessToken", token);
    setUser(res.data.user as AuthUser);
    return { requiresOtp: false };
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const res = await authApi.verifyOtp({ email, otp });
    const token: string = res.data.accessToken;
    sessionStorage.setItem("accessToken", token);
    setUser(res.data.user as AuthUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // best effort
    }
    sessionStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
