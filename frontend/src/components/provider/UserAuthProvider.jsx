import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const userInfoLms = localStorage.getItem("userInfoLms");
  const [user,setUser] = useState(userInfoLms);
  
  
  const login = (user) => {
    setUser(user);
   
  };

  const logOut = () => {
    localStorage.removeItem("userInfoLms");
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