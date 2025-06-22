import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const login = (id: string) => {
    setUserId(id);
    localStorage.setItem("user_id", id);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("user_id");
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
