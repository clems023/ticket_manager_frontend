import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../api/auth";
import { login as apiLogin, register as apiRegister } from "../api/auth";
import { AuthContext, type AuthContextValue } from "./auth-context";

const TOKEN_KEY = "token";
const USER_KEY = "user";

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getStoredToken);
  const [user, setUser] = useState<User | null>(getStoredUser);

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setTokenState(null);
      setUser(null);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiLogin({ email, password });
      setToken(res.token);
      setUser(null);
    },
    [setToken],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await apiRegister({ email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    },
    [setToken],
  );

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [token, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
