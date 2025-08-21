// AdminRoute for admin-only pages
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === "ADMIN" ? children : <Navigate to="/login" replace />;
};

export default AdminRoute; 