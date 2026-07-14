import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, loginUser, registerUser } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setReady(true);
        return;
      }

      try {
        const { data } = await fetchCurrentUser(token);
        setUser(data);
      } catch (error) {
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setReady(true);
      }
    }

    loadUser();
  }, [token]);

  async function login(credentials) {
    const { data } = await loginUser(credentials);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function register(details) {
    const { data } = await registerUser(details);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = { token, user, ready, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
