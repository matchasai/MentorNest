import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { getMe } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if token exists before making API call
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getMe();
        setUser(profile);
      } catch {
        // If it's a 401 or 403, user is not authenticated, which is normal
        setUser(null);
        // Clear invalid token
        localStorage.removeItem('jwt_token');
      } finally {
        setLoading(false);
      }
    };
    
    // Add a small delay to ensure the backend is ready
    setTimeout(() => {
      checkAuth();
    }, 100);
  }, []);

  const login = async (token) => {
    // After login API call, re-fetch profile
    try {
      // Set the token in localStorage for persistence
      if (token) {
        localStorage.setItem('jwt_token', token);
      }
      const profile = await getMe();
      setUser(profile);
    } catch (error) {
      console.error("Failed to get user profile after login:", error);
      // Even if getMe fails, we can still set user based on login response
      // This will be handled by the login component
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  if (loading) return null; // or a loading spinner

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);