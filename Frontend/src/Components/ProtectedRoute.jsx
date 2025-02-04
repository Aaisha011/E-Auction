import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token; 
  if (!token) {
    alert('Session expired. Please sign in again.');
    return <Navigate to="/" />;
  }

  // console.log(isAuthenticated,"authent")
  // console.log(token,"isAuthenticated")

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
