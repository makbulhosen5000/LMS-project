import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  const [user,setUser] = useState(userInfo);
  
  
  const login = (user) => {
    setUser(user);
   
  };

  const logOut = () => {
    localStorage.removeItem("userInfo");
    toast.success("Logout successful");
    setUser(null);
    
  }
  const userAuthInfo = {
    user,
    login,
    logOut,
  };
  
  
  return (
    <UserAuthContext.Provider value={userAuthInfo}>
      {children}
    </UserAuthContext.Provider>
  );
};