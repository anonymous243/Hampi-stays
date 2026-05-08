import React, { createContext, useContext, useState } from "react";

type UserRole = "TRAVELLER" | "RESORT_OWNER" | "ADMIN";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("hampi-user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      setUser(data.user);
      localStorage.setItem("hampi-user", JSON.stringify(data.user));
      localStorage.setItem("hampi-token", data.token);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setUser(data.user);
      localStorage.setItem("hampi-user", JSON.stringify(data.user));
      localStorage.setItem("hampi-token", data.token);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hampi-user");
    localStorage.removeItem("hampi-token");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
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
