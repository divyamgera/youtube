import React from "react";
import { useAuth } from "../utils/AuthContext";

const { user } = useAuth();
if (!user) {
  return <div>Loading...</div>;
}

export const Loader = () => {
  return <div>LOading............</div>;
};
