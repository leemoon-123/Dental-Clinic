"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// Configure axios to include credentials (cookies) in all requests
axios.defaults.withCredentials = true;

interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: "patient" | "doctor" | "admin";
  avatar?: string;
  specialty?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "patient" | "doctor";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      setError(null);
      const response = await axios.get("/api/auth/me");
      setUser(response.data.user);
    } catch (err) {
      console.error("Refresh user error:", err);
      setUser(null);
      setError(null); // Don't show error on initial load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post("/api/auth/login", { email, password });
      setUser(response.data.user);
    } catch (err: unknown) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await axios.post("/api/auth/register", data);
      setUser(response.data.user);
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Đăng ký thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await axios.post("/api/auth/logout");
      setUser(null);
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Đăng xuất thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
