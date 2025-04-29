import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  login as authLogin,
  register as authRegister,
  updateProfile as authUpdateProfile,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await authLogin(credentials);
      setUser(userData);
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const registeredUser = await authRegister(userData);
      setUser(registeredUser);
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = await authUpdateProfile(updatedData);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
