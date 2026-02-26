import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { getUser, logoutUser } from "./auth.js";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 const login = async () => {

   try {

    const res = await getUser();
    setUser(res.data);
    
   } catch (error) {
    console.log("Login user fetch failed", error)
   }

  };

  // Logout

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.info("Logged out successfully")
    } catch (error) {
      toast.error("Logout failed");
      console.log("Logout Error", error);
    }

    setUser(null);
  };

  // auto login

  const getCurrentUser = async () => {
    try {
      const res = await getUser();
      setUser(res.data);
    } catch (error) {
      if(error.response?.status === 401){
        setUser(null);
        return;
      }
     
      console.error("Unexpected Error :",error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{setUser, user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


