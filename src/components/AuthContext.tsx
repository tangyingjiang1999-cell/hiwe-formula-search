"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// 用户信息（与 /api/auth/me 返回一致）
interface AuthUser {
  id: number;
  username: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 挂载时从服务端获取当前登录用户
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // 登录成功后同步写入全局状态，避免刷新页面才显示 admin 入口
  const login = useCallback((newUser: AuthUser) => {
    setUser(newUser);
  }, []);

  // 退出登录：清除 cookie 并跳转到登录页
  const logout = useCallback(async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
