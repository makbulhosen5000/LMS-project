import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserAuthContext } from '../../../provider/UserAuthProvider';
import { User, ShoppingCart,KeyRound, LogOut,School,GraduationCap } from 'lucide-react'; // Icons

export default function UserSidebar() {
    const { logOut } = useContext(UserAuthContext);
    const location = useLocation();

    // Function to determine active class
    const getLinkClass = (path) => {
        return location.pathname === path
            ? "flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold"
            : "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-200 text-gray-800 font-medium";
    }

    return (
        <aside className="w-64 bg-white p-6 shadow-xl rounded-lg">
            <div className="mb-8">
                <Link to="/account/user/dashboard">
                    <h1 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                        My Account
                    </h1>
                </Link>
            </div>
            
            <nav className="space-y-3">
                <Link to="/account/user/profile" className={getLinkClass("/account/user/profile")}>
                    <User size={18} /> Profile
                </Link>
                <Link to="/account/user/profile" className={getLinkClass("/account/user/profile")}>
                    <School size={18} /> My Learning
                </Link>
                <Link to="/account/user/profile" className={getLinkClass("/account/user/profile")}>
                    <GraduationCap size={18} /> My Courses
                </Link>
                <Link to="/account/user/orders" className={getLinkClass("/account/user/orders")}>
                    <ShoppingCart size={18} /> Orders
                </Link>
                <Link to="/account/user/change-password" className={getLinkClass("/account/user/change-password")}>
                    <KeyRound size={18} /> Change Password
                </Link>
                <button
                    onClick={logOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 font-semibold w-full"
                >
                    <LogOut size={18} /> Logout
                </button>
            </nav>
        </aside>
    );
}
