"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { User } from "@/types";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = Cookies.get("access_token");
      const savedUser = Cookies.get("user");

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        // Validate token with backend
        await apiClient.validateToken();
      }
    } catch (error) {
      // Token is invalid, clear auth state
      Cookies.remove("access_token");
      Cookies.remove("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      const { access_token, user: userData } = response;

      Cookies.set("access_token", access_token, { expires: 7 });
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });
      setUser(userData);
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (email: string, password: string, role?: string) => {
    try {
      const response = await apiClient.register(email, password, role);
      const { access_token, user: userData } = response;

      Cookies.set("access_token", access_token, { expires: 7 });
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });
      setUser(userData);
      toast.success("Registration successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const isAdmin = user?.role === "admin";

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
