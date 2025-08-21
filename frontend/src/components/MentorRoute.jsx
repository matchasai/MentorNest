// MentorRoute for mentor-only pages
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MentorRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === "MENTOR" ? children : <Navigate to="/login" replace />;
};

export default MentorRoute;



