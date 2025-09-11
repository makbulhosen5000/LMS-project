import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  // Load from localStorage (if exists)
  const storedAdmin = localStorage.getItem("adminInfo");
  const [admin, setAdmin] = useState(storedAdmin ? JSON.parse(storedAdmin) : null);
  const [authenticate, setAuthenticate] = useState(!!storedAdmin);

  // login function
  const login = (adminData) => {
    setAdmin(adminData);
    setAuthenticate(true);
    localStorage.setItem("adminInfo", JSON.stringify(adminData)); // persist
    toast.success("Login successful");
  };

  // logout function
  const logOut = () => {
    localStorage.removeItem("adminInfo");
    setAdmin(null);
    setAuthenticate(false);
    toast.success("Logout successful");
  };

  // auto-sync with localStorage on refresh
  useEffect(() => {
    const stored = localStorage.getItem("adminInfo");
    if (stored) {
      setAdmin(JSON.parse(stored));
      setAuthenticate(true);
    }
  }, []);

  const adminAuthInfo = {
    admin,
    login,
    logOut,
    authenticate,
  };

  return (
    <AdminAuthContext.Provider value={adminAuthInfo}>
      {children}
    </AdminAuthContext.Provider>
  );
};
