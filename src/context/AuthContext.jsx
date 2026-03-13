import React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import authService from "../services/authService";

export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user"
};

const AuthContext = createContext(null);

function safeParseUser(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function resolveToken(payload) {
  return payload?.token || "";
}

function resolveUser(payload) {
  return payload?.manager || payload?.user || null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN) || "");
  const [user, setUser] = useState(() => safeParseUser(localStorage.getItem(STORAGE_KEYS.USER)));

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const nextToken = resolveToken(data);
    const nextUser = resolveUser(data);

    if (!nextToken) {
      throw new Error("Invalid login response: token not found.");
    }
    if (!nextUser) {
      throw new Error("Invalid login response: manager not found.");
    }

    localStorage.setItem(STORAGE_KEYS.TOKEN, nextToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));

    setToken(nextToken);
    setUser(nextUser);

    return data;
  };

  const register = async (credentials) => authService.register(credentials);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
