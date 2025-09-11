
import React, { useContext } from "react";
import { UserAuthContext } from "../../../provider/UserAuthProvider";

export default function UserTopbar() {
    const {user} = useContext(UserAuthContext);
  return (
    
     <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <h2 className="text-xl font-bold text-gray-800">👋 My Overview</h2>
      <div className="flex items-center gap-4">
      {user?.name ? `${user.name.toUpperCase()}'S ACCOUNT` : "MY ACCOUNT"}

      </div>
    </div>

  );
}
