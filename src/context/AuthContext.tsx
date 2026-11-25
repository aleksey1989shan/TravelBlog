import axios from "axios";
import { IUser } from "../types/post";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(true);

  // проверка авторизации
  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsloading(false);
      return;
    }
    try {
      setIsloading(true);
      const response = await axios.get<IUser>("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (err) {
      setUser(null);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // выход
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get("/api/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("выход:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return <AuthContext.Provider value={{ user, isLoading, checkAuth, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth только внутри AuthProvider");
  }
  return context;
};
