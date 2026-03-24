// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>; // Or your loading spinner component
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/auth/sign-in" />;
};

export default ProtectedRoute;
