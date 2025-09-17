"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { login as apiLogin, getMe as apiGetMe, logout as apiLogout } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // load from localStorage on mount
  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (t) {
      setToken(t);
      apiGetMe().then(setUser).catch(() => {
        apiLogout();
        setToken(null);
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    setToken(res.access_token);
    const u = await apiGetMe();
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
