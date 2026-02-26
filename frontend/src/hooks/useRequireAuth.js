import { useState } from "react";
import { useAuth } from "../utils/AuthContext"; // apne path ke hisaab se change karo

const useRequireAuth = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const requireAuth = () => {
    if (!user) {
      setShowModal(true);
      return false;
    }
    return true;
    
  };

  return {
    requireAuth,
    showModal,
    setShowModal,
  };
};

export default useRequireAuth;
