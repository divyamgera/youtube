import React from "react";

import { useAuth } from "../utils/AuthContext";

import { Navigate } from "react-router-dom";
import AvatarLoader from "./AvatarLoader";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AvatarLoader /> || <h2> Checking Authentication...</h2>;
  }

  if (!user) {
    toast.info("Please Login to Continue")
    return <Navigate to="/login" replace />;
    //  <Navigate to='/login' state={{from:location}}/>
  }

  return children;
};

export default ProtectedRoute;
